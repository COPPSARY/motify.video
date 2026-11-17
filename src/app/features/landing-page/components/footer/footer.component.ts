import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { EXTERNAL_LINKS } from '../../../../shared/constants/external-links';

const SIGNOFF_VIDEO = 'assets/motify-logo-video/motify-logo-white.webm';

/** Safari cannot draw the alpha channel of a VP9 WebM, so it keeps the still logo. */
function canPlayAlphaWebm(video: HTMLVideoElement): boolean {
  const ua = navigator.userAgent;
  const safari = /safari/i.test(ua) && !/chrome|chromium|crios|fxios|edg|android/i.test(ua);
  return !safari && video.canPlayType('video/webm; codecs="vp9"') !== '';
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  readonly logoSrc = 'logo.svg';
  readonly githubUrl = EXTERNAL_LINKS.github;
  readonly editorUrl = EXTERNAL_LINKS.editor;
  readonly facebookUrl = 'https://facebook.com/motify.video/';
  readonly tiktokUrl = 'https://www.tiktok.com/@motify855';
  readonly year = new Date().getFullYear();

  /** True once the logo animation has started; the still logo fades out beneath it. */
  protected readonly signoffPlaying = signal(false);
  private readonly signoffVideo = viewChild<ElementRef<HTMLVideoElement>>('signoff');

  constructor() {
    const destroyRef = inject(DestroyRef);

    // The sign-off plays once, the first time the footer comes into view. The server
    // HTML, reduced-motion visitors and Safari keep the still logo.
    afterNextRender(() => {
      const video = this.signoffVideo()?.nativeElement;
      if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !canPlayAlphaWebm(video)) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          observer.disconnect();
          video.src = SIGNOFF_VIDEO;
          video.muted = true;
          video.addEventListener('playing', () => this.signoffPlaying.set(true), { once: true });
          video.play().catch(() => undefined);
        },
        { threshold: 0.6 },
      );
      observer.observe(video);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
