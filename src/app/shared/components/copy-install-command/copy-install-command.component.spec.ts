import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import * as fc from 'fast-check';
import { CopyInstallCommandComponent, CopyState } from './copy-install-command.component';

type ClipboardOutcome = 'resolve' | 'reject' | 'unavailable';

describe('CopyInstallCommandComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopyInstallCommandComponent],
    }).compileComponents();
  });

  /**
   * Property 4: Clipboard outcome safety
   * Validates: Requirements 8.2, 8.4, 8.5
   *
   * For any clipboard outcome (resolve, reject, or clipboard unavailable),
   * after `onCopyClick()` settles, `copyState()` is always one of the three
   * valid states and no exception escapes the call.
   */
  it('never throws and always settles into a valid copy state for every clipboard outcome (Property 4)', async () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    const validStates: readonly CopyState[] = ['idle', 'copied', 'unavailable'];

    try {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom<ClipboardOutcome>('resolve', 'reject', 'unavailable'),
          async (outcome) => {
            applyClipboardOutcome(outcome);

            const fixture = TestBed.createComponent(CopyInstallCommandComponent);
            fixture.componentInstance.command = 'npm install @coppsary/motify';
            fixture.detectChanges();

            let thrown: unknown;
            try {
              await (fixture.componentInstance as any).onCopyClick();
            } catch (error) {
              thrown = error;
            }

            const state = (fixture.componentInstance as any).copyState() as CopyState;

            expect(thrown).withContext('onCopyClick() must not throw').toBeUndefined();
            expect(validStates).withContext('copyState() must be a valid state').toContain(state);

            fixture.destroy();
            restoreClipboard(originalDescriptor);
          },
        ),
      );
    } finally {
      restoreClipboard(originalDescriptor);
    }
  });

  /**
   * Property 5: Revert timing and single-timer semantics
   * Validates: Requirements 8.3, 8.6
   *
   * On a successful copy, `copyState()` reverts to 'idle' after exactly
   * 2000ms. Rapid repeated clicks reset the timer rather than stacking
   * multiple pending reverts, so only one revert timer is ever active.
   */
  it('reverts to idle after exactly 2000ms following a successful copy (Property 5)', fakeAsync(() => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

    try {
      applyClipboardOutcome('resolve');

      const fixture = TestBed.createComponent(CopyInstallCommandComponent);
      fixture.componentInstance.command = 'npm install @coppsary/motify';
      fixture.detectChanges();

      (fixture.componentInstance as any).onCopyClick();
      tick();

      expect((fixture.componentInstance as any).copyState() as CopyState).toBe('copied');

      tick(1999);
      expect((fixture.componentInstance as any).copyState() as CopyState)
        .withContext('must still be copied just before 2000ms')
        .toBe('copied');

      tick(1);
      expect((fixture.componentInstance as any).copyState() as CopyState)
        .withContext('must revert to idle at 2000ms')
        .toBe('idle');

      fixture.destroy();
    } finally {
      restoreClipboard(originalDescriptor);
    }
  }));

  it('leaves only one pending revert timer active after rapid repeated clicks (Property 5)', fakeAsync(() => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

    try {
      applyClipboardOutcome('resolve');

      const fixture = TestBed.createComponent(CopyInstallCommandComponent);
      fixture.componentInstance.command = 'npm install @coppsary/motify';
      fixture.detectChanges();

      const instance = fixture.componentInstance as any;

      // First click.
      instance.onCopyClick();
      tick();
      expect(instance.copyState() as CopyState).toBe('copied');

      // Second click shortly after, well within the first click's 2000ms window.
      tick(500);
      instance.onCopyClick();
      tick();
      expect(instance.copyState() as CopyState).toBe('copied');

      // Third click shortly after, still within the window.
      tick(500);
      instance.onCopyClick();
      tick();
      expect(instance.copyState() as CopyState).toBe('copied');

      // 1900ms after the last click: if an earlier click's timer were still
      // active independently, state could have reverted prematurely. It must not have.
      tick(1900);
      expect(instance.copyState() as CopyState)
        .withContext('must not revert before 2000ms from the LAST click')
        .toBe('copied');

      // Cross the 2000ms threshold from the last click.
      tick(100);
      expect(instance.copyState() as CopyState)
        .withContext('must revert to idle exactly 2000ms after the last click')
        .toBe('idle');

      // No stray timers should remain; flush to catch any leftover pending timers.
      flush();

      fixture.destroy();
    } finally {
      restoreClipboard(originalDescriptor);
    }
  }));
});

/**
 * Applies a mocked `navigator.clipboard` matching the given outcome.
 * - 'resolve': writeText resolves successfully.
 * - 'reject': writeText rejects with an error.
 * - 'unavailable': navigator.clipboard is deleted entirely.
 */
function applyClipboardOutcome(outcome: ClipboardOutcome): void {
  if (outcome === 'unavailable') {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
    });
    return;
  }

  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: (): Promise<void> =>
        outcome === 'resolve' ? Promise.resolve() : Promise.reject(new Error('clipboard write denied')),
    },
    configurable: true,
  });
}

/** Restores the original `navigator.clipboard` descriptor after a test run. */
function restoreClipboard(originalDescriptor: PropertyDescriptor | undefined): void {
  if (originalDescriptor) {
    Object.defineProperty(navigator, 'clipboard', originalDescriptor);
  } else {
    delete (navigator as any).clipboard;
  }
}
