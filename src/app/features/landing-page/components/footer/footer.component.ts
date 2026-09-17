import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideBookOpen,
  LucideGitBranch,
  LucideInfo,
  LucideMail,
  LucidePackage,
  LucideRocket,
} from '@lucide/angular';
import { EXTERNAL_LINKS, RESOURCE_LINKS } from '../../../../shared/constants/external-links';
import { ResourceLink } from '../../../../shared/models/landing.models';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    RouterLink,
    ScrollRevealDirective,
    LucideBookOpen,
    LucideGitBranch,
    LucideInfo,
    LucideMail,
    LucidePackage,
    LucideRocket,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  readonly logoSrc = 'logo.svg';
  readonly links: readonly ResourceLink[] = RESOURCE_LINKS;
  readonly contactProfileUrl = EXTERNAL_LINKS.contactProfile;
  readonly contactEmailUrl = EXTERNAL_LINKS.contactEmail;
  readonly businessInquiryUrl =
    'https://mail.google.com/mail/?view=cm&fs=1&to=prumsereyreaksa%40gmail.com&su=Motify%20partnership%20or%20business%20inquiry';
  readonly year = new Date().getFullYear();
}
