import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

interface ShowcaseVideo {
  readonly src: string;
  readonly poster: string;
  readonly label: string;
}

@Component({
  selector: 'app-spatial-showcase-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollRevealDirective],
  templateUrl: './spatial-showcase-section.component.html',
  styleUrl: './spatial-showcase-section.component.css',
})
export class SpatialShowcaseSectionComponent {
  readonly rows: readonly (readonly ShowcaseVideo[])[] = [
    [
      { src: 'assets/claude.mp4', poster: 'assets/showcase/posters/claude.jpg', label: 'Claude workflow' },
      { src: 'assets/showcase/recoup.mp4', poster: 'assets/showcase/posters/recoup.jpg', label: 'Recoup' },
      { src: 'assets/showcase/kiritts.mp4', poster: 'assets/showcase/posters/kiritts.jpg', label: 'KiriTTS voiceover' },
    ],
    [
      { src: 'assets/showcase/relay.mp4', poster: 'assets/showcase/posters/relay.jpg', label: 'Relay' },
      { src: 'assets/showcase/tessera.mp4', poster: 'assets/showcase/posters/tessera.jpg', label: 'Tessera' },
      { src: 'assets/motify-web.mp4', poster: 'assets/showcase/posters/motify-web.jpg', label: 'Motify web' },
    ],
  ];

  /**
   * Each row repeats its set this many times and slides by one set per loop.
   * The seam never shows while (copies - 1) sets span the tilted row, and three keeps that true at wide screens.
   */
  readonly copies = [0, 1, 2] as const;
}
