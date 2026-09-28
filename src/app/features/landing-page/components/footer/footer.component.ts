import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EXTERNAL_LINKS } from '../../../../shared/constants/external-links';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  readonly logoSrc = 'logo.svg';
  readonly docsUrl = EXTERNAL_LINKS.docs;
  readonly githubUrl = EXTERNAL_LINKS.github;
  readonly npmUrl = EXTERNAL_LINKS.npm;
  readonly productHuntUrl = EXTERNAL_LINKS.productHunt;
  readonly editorUrl = EXTERNAL_LINKS.editor;
  readonly facebookUrl = 'https://facebook.com/motify.video/';
  readonly tiktokUrl = 'https://www.tiktok.com/@motify855';
  readonly year = new Date().getFullYear();
}
