import { afterNextRender, DestroyRef, ElementRef, inject } from '@angular/core';
import type { gsap as GsapCore } from 'gsap';
import type { ScrollTrigger as ScrollTriggerPlugin } from 'gsap/ScrollTrigger';

export type Gsap = typeof GsapCore;
export type ScrollTriggerStatic = typeof ScrollTriggerPlugin;

export interface MotionApi {
  readonly gsap: Gsap;
  readonly ScrollTrigger: ScrollTriggerStatic;
  /** The visitor asked for reduced motion: show final states, no pinning, no scrubbing. */
  readonly reduced: boolean;
  /** Viewport is at least 900px wide (pinned scenes run only here). */
  readonly desktop: boolean;
}

let loading: Promise<{ gsap: Gsap; ScrollTrigger: ScrollTriggerStatic }> | undefined;

/** Loads GSAP and ScrollTrigger once, in the browser only, after first paint. */
export function loadGsap(): Promise<{ gsap: Gsap; ScrollTrigger: ScrollTriggerStatic }> {
  return (loading ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([core, plugin]) => {
    core.gsap.registerPlugin(plugin.ScrollTrigger);
    // Late-loading media and fonts can move sections; measure again once everything is in.
    if (document.readyState !== 'complete') {
      window.addEventListener('load', () => plugin.ScrollTrigger.refresh(), { once: true });
    }
    return { gsap: core.gsap, ScrollTrigger: plugin.ScrollTrigger };
  }));
}

/**
 * Runs a GSAP setup for the calling component, in the browser only. Call it from a
 * constructor (it needs the injection context).
 *
 * The setup runs inside `gsap.matchMedia()` scoped to the host element, so selector
 * strings resolve inside the component, and every tween, ScrollTrigger and pin it
 * makes is reverted when the viewport or motion preference changes and when the
 * component is destroyed. Content is never hidden in server-rendered HTML: any
 * initial "from" state is applied here, on the client.
 */
export function useMotion(setup: (motion: MotionApi, host: HTMLElement) => void | (() => void)): void {
  const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  let revert: (() => void) | undefined;
  let destroyed = false;

  inject(DestroyRef).onDestroy(() => {
    destroyed = true;
    revert?.();
  });

  afterNextRender(() => {
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (destroyed) return;
      const mm = gsap.matchMedia(host);
      mm.add(
        {
          reduced: '(prefers-reduced-motion: reduce)',
          desktop: '(min-width: 900px)',
        },
        (context) => {
          const conditions = context.conditions ?? {};
          return setup(
            { gsap, ScrollTrigger, reduced: !!conditions['reduced'], desktop: !!conditions['desktop'] },
            host,
          );
        },
      );
      revert = () => mm.revert();
    });
  });
}
