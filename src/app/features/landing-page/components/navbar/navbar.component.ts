import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideArrowUpRight,
  LucideHome,
  LucideMenu,
  LucideLogIn,
  LucideX,
} from '@lucide/angular';
import { GithubStarBadgeComponent } from '../../../../shared/components/github-star-badge/github-star-badge.component';
import { ProductHuntBadgeComponent } from '../../../../shared/components/product-hunt-badge/product-hunt-badge.component';
import { EDITOR_AUTH_PATH } from '../../../../shared/config/runtime-config';

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    GithubStarBadgeComponent,
    ProductHuntBadgeComponent,
    LucideArrowUpRight,
    LucideHome,
    LucideMenu,
    LucideLogIn,
    LucideX,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  readonly logoSrc = 'logo.svg';
  readonly editorAuthPath = EDITOR_AUTH_PATH;

  /** Whether the page has been scrolled past the "condense" threshold. Drives the scrolled background/border. */
  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  constructor() {
    // SSR-safe: afterNextRender runs only in the browser, after the first render — never on the server.
    afterNextRender(() => {
      const onScroll = () => this.scrolled.set(window.scrollY > 8);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    });
  }
}
