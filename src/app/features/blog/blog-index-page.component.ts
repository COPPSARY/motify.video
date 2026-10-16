import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOG_POSTS } from '../../shared/data/blog-posts.data';
import { SeoService } from '../../shared/services/seo.service';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';

@Component({
  selector: 'app-blog-index-page',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blog-index-page.component.html',
  styleUrl: './blog-index-page.component.css',
})
export class BlogIndexPageComponent {
  readonly posts = BLOG_POSTS;

  constructor() {
    inject(SeoService).apply({
      title: 'Motion Graphics & Video Marketing Blog | Motify',
      description:
        'Practical guides for animated ads, launch videos, explainers, Product Hunt campaigns, and making motion graphics with AI.',
      path: '/blog',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Motify Blog',
        url: 'https://motify.video/blog',
        description: 'Practical motion graphics, video marketing, and launch guidance from Motify.',
      },
    });
  }
}
