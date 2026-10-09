import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { blogPostBySlug } from '../../shared/data/blog-posts.data';
import { SeoService } from '../../shared/services/seo.service';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';

@Component({
  selector: 'app-blog-article-page',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blog-article-page.component.html',
  styleUrl: './blog-article-page.component.css',
})
export class BlogArticlePageComponent {
  readonly post = blogPostBySlug(inject(ActivatedRoute).snapshot.data['slug'] as string);

  constructor() {
    if (!this.post) return;

    inject(SeoService).apply({
      title: `${this.post.seoTitle} | Motify`,
      description: this.post.description,
      path: `/blog/${this.post.slug}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: this.post.title,
        description: this.post.description,
        datePublished: this.post.date,
        dateModified: this.post.date,
        mainEntityOfPage: `https://motify.video/blog/${this.post.slug}`,
        author: { '@type': 'Organization', name: 'Motify' },
        publisher: { '@type': 'Organization', name: 'Motify', url: 'https://motify.video' },
      },
    });
  }
}
