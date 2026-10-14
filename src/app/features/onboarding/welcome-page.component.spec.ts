import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { editorReturnPath } from '../../shared/config/runtime-config';
import { BrandService, type BrandBasics } from '../../shared/services/brand.service';
import { normalizeWebsite, WelcomePageComponent } from './welcome-page.component';

describe('WelcomePageComponent', () => {
  let left: string[];
  let brand: jasmine.SpyObj<BrandService>;

  function create(returnUrl: string | null) {
    TestBed.configureTestingModule({
      imports: [WelcomePageComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: BrandService, useValue: brand },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap(returnUrl ? { returnUrl } : {}) } },
        },
      ],
    });
    const component = TestBed.createComponent(WelcomePageComponent).componentInstance;
    spyOn(component as unknown as { leaveFor(url: string): void }, 'leaveFor').and.callFake((url: string) => {
      left.push(url);
    });
    return component;
  }

  async function reachReady(component: WelcomePageComponent, level: 'beginner' | 'experienced' | 'expert') {
    component.chooseLevel(level);
    component.chooseGoal('launch');
    component.name.set('Acme');
    component.description.set('Launch videos from release notes');
    await component.continueFromProduct();
    component.goTo('ready');
  }

  beforeEach(() => {
    left = [];
    brand = jasmine.createSpyObj<BrandService>('BrandService', ['saveBasics', 'extractFromWebsite', 'canExtract']);
    brand.saveBasics.and.resolveTo();
    brand.canExtract.and.resolveTo(true);
    window.__MOTIFY_CONFIG__ = { motifyEditorUrl: 'https://app.example.test/' };
  });

  afterEach(() => {
    delete window.__MOTIFY_CONFIG__;
  });

  it('skips straight to the app with only the homepage prompt and no tour', () => {
    const component = create(editorReturnPath('Launch video for Acme'));
    component.chooseLevel('beginner');

    component.skip();

    const target = new URL(left[0]);
    expect(target.searchParams.get('prompt')).toBe('Launch video for Acme');
    expect(target.searchParams.has('tour')).toBeFalse();
  });

  it('requires a product name, saves the answers to Brand DNA, then shows the plan', async () => {
    const component = create('/editor');
    component.chooseLevel('beginner');
    component.chooseGoal('launch');
    await component.continueFromProduct();
    expect(component.step()).toBe('product');
    expect(brand.saveBasics).not.toHaveBeenCalled();

    component.name.set('Acme');
    component.website.set('acme.com');
    await component.continueFromProduct();

    expect(brand.saveBasics).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'Acme', website: 'https://acme.com/' }));
    expect(component.step()).toBe('library');
  });

  it('shows the prompt library before the first video, with its own template marked', async () => {
    const component = create('/editor');
    component.chooseLevel('beginner');
    component.chooseGoal('explainer');
    component.name.set('Acme');
    await component.continueFromProduct();

    expect(component.step()).toBe('library');
    expect(component.template().id).toBe('how-it-works');
    expect(component.libraryPath).toBe('/resources/prompt-templates');
  });

  it('slides back to an answered step from the rail, never ahead', () => {
    const component = create('/editor');
    component.chooseLevel('beginner');
    component.chooseGoal('launch');

    expect(component.canRevisit('level')).toBeTrue();
    expect(component.canRevisit('ready')).toBeFalse();
    component.goTo('level');
    expect(component.step()).toBe('level');
    expect(component.direction()).toBe('back');
  });

  it('still continues when saving the brand fails, and says so', async () => {
    brand.saveBasics.and.rejectWith(new Error('offline'));
    const component = create('/editor');
    await reachReady(component, 'beginner');

    expect(component.step()).toBe('ready');
    expect(component.brandSaveFailed()).toBeTrue();
  });

  it('builds the beginner prompt from the goal template and starts the tour', async () => {
    const component = create('/editor');
    await reachReady(component, 'beginner');

    component.create();

    const target = new URL(left[0]);
    expect(target.searchParams.get('prompt')).toContain('launch video for Acme');
    expect(target.searchParams.get('tour')).toBe('1');
    expect(target.searchParams.get('level')).toBe('beginner');
    expect(target.searchParams.get('goal')).toBe('launch');
  });

  it('lets an experienced prompter fill key blanks', async () => {
    const component = create('/editor');
    await reachReady(component, 'experienced');
    component.setExtra('HOOK LINE', 'Stop editing, start shipping');

    expect(component.finalPrompt()).toContain('Stop editing, start shipping');
  });

  it('gives an expert the editable prompt and template choice, without a tour', async () => {
    const component = create(editorReturnPath('Make it moody'));
    await reachReady(component, 'expert');
    expect(component.finalPrompt()).toContain('Also from me: Make it moody');

    component.chooseExpertTemplate('how-it-works');
    component.expertPrompt.set(`${component.expertPrompt()} Extra direction.`);
    component.create();

    const target = new URL(left[0]);
    expect(target.searchParams.get('prompt')).toContain('Extra direction.');
    expect(target.searchParams.has('tour')).toBeFalse();
  });

  it('fills the product fields from the website without overwriting what was typed', async () => {
    const found: BrandBasics = { name: 'Acme Inc', description: 'Launch videos', audience: 'Marketers', color: '#ff5a1f', website: 'https://acme.com' };
    brand.extractFromWebsite.and.resolveTo(found);
    const component = create('/editor');
    component.name.set('Acme');
    component.website.set('acme.com');

    await component.fillFromWebsite();

    expect(brand.extractFromWebsite).toHaveBeenCalledWith('https://acme.com/');
    expect(component.name()).toBe('Acme');
    expect(component.description()).toBe('Launch videos');
    expect(component.color()).toBe('#ff5a1f');
    expect(component.filledFrom()).toBe('acme.com');
  });

  it('shows the API reason when a website cannot be read', async () => {
    brand.extractFromWebsite.and.rejectWith({ error: { error: { message: 'That address is not a public website.' } } });
    const component = create('/editor');
    component.website.set('intranet.example.com');

    await component.fillFromWebsite();

    expect(component.extractError()).toBe('That address is not a public website.');
    expect(component.extracting()).toBeFalse();
  });

  it('ignores return paths that do not point at the app', () => {
    expect(create('https://evil.example/editor').returnUrl).toBe('/editor');
  });

  it('normalizes bare domains and rejects junk', () => {
    expect(normalizeWebsite('acme.com')).toBe('https://acme.com/');
    expect(normalizeWebsite('localhost')).toBe('');
    expect(normalizeWebsite('')).toBe('');
  });
});
