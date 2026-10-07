import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  resourceCategory,
  type ResourceCategoryId,
} from '../../shared/data/resource-content.data';
import { SeoService } from '../../shared/services/seo.service';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';

@Component({
  selector: 'app-resource-category-page',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './resource-category-page.component.html',
  styleUrl: './resource-category-page.component.css',
})
export class ResourceCategoryPageComponent {
  readonly category = resourceCategory(
    inject(ActivatedRoute).snapshot.data['category'] as ResourceCategoryId,
  );

  constructor() {
    inject(SeoService).apply({
      title: `${this.category.title} Guides | Motify Resources`,
      description: this.category.description,
      path: `/resources/${this.category.id}`,
    });
  }
}
