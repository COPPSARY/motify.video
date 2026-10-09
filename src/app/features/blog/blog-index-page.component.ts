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
      title: 'SaaS Video Marketing Blog | Motify',
      description:
        'Practical guides for SaaS launch videos, Product Hunt campaigns, explainers, storyboards, AI video workflows, and product marketing.',
      path: '/blog',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Motify Blog',
        url: 'https://motify.video/blog',
        description: 'Practical SaaS video marketing and product launch guidance from Motify.',
      },
    });
  }
}
