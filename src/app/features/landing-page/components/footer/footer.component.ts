import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EXTERNAL_LINKS } from '../../../../shared/constants/external-links';

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
  readonly linkedinUrl = EXTERNAL_LINKS.linkedin;
  readonly editorUrl = EXTERNAL_LINKS.editor;
  readonly facebookUrl = 'https://facebook.com/motify.video/';
  readonly tiktokUrl = 'https://www.tiktok.com/@motify855';
  readonly year = new Date().getFullYear();
}
