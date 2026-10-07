import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { getHelpTopic, HELP_TOPICS, type HelpTopic } from '../../shared/data/help-topics.data';
import { SeoService } from '../../shared/services/seo.service';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';

@Component({
  selector: 'app-help-topic-page',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './help-topic-page.component.html',
  styleUrl: './help-topic-page.component.css',
})
export class HelpTopicPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  readonly allTopics = HELP_TOPICS;

  readonly topic = computed<HelpTopic>(() => {
    const param = this.route.snapshot.paramMap.get('topic')
      ?? this.route.snapshot.data['topic'] as string | undefined
      ?? 'account';

    const found = getHelpTopic(param);
    if (!found) {
      void this.router.navigate(['/help']);
      return HELP_TOPICS[0];
    }

    this.seo.apply({
      title: `${found.title} | Motify Help`,
      description: found.overview,
      path: `/help/${found.slug}`,
    });

    return found;
  });

  readonly otherTopics = computed(() => {
    const currentId = this.topic().id;
    return this.allTopics.filter((t) => t.id !== currentId);
  });
}
