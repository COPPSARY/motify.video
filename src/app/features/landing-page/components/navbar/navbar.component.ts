import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideArrowUpRight,
  LucideChevronDown,
  LucideHome,
  LucideMenu,
  LucideLogIn,
  LucideLogOut,
  LucideX,
} from '@lucide/angular';
import { GithubStarBadgeComponent } from '../../../../shared/components/github-star-badge/github-star-badge.component';
import { ProductHuntBadgeComponent } from '../../../../shared/components/product-hunt-badge/product-hunt-badge.component';
import { EDITOR_AUTH_PATH, editorUrlForReturnPath } from '../../../../shared/config/runtime-config';
import { AuthService, type MotifyUser } from '../../../../shared/services/auth.service';
import { BillingService } from '../../../../shared/services/billing.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    GithubStarBadgeComponent,
    ProductHuntBadgeComponent,
    LucideArrowUpRight,
    LucideChevronDown,
    LucideHome,
    LucideMenu,
    LucideLogIn,
    LucideLogOut,
    LucideX,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  protected readonly auth = inject(AuthService);
  private readonly billing = inject(BillingService);
  readonly logoSrc = 'logo.svg';
  readonly editorAuthPath = EDITOR_AUTH_PATH;
  protected readonly editorHref = computed(() =>
    this.auth.user() ? editorUrlForReturnPath('/editor') : EDITOR_AUTH_PATH,
  );

  /** Whether the page has been scrolled past the "condense" threshold. Drives the scrolled background/border. */
  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly accountMenuOpen = signal(false);
  protected readonly loggingOut = signal(false);
  protected readonly activePlan = computed(() => {
    const subscription = this.billing.subscription();
    if (subscription?.status !== 'active' || !subscription.plan) return null;
    return subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1);
  });

  protected closeMenu(): void {
    this.menuOpen.set(false);
    this.accountMenuOpen.set(false);
  }

  protected toggleMenu(): void {
    this.accountMenuOpen.set(false);
    this.menuOpen.update((open) => !open);
  }

  protected toggleAccountMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.accountMenuOpen.update((open) => !open);
  }

  protected userInitials(user: MotifyUser): string {
    const name = user.displayName.trim() || user.email.split('@')[0];
    return name.split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase();
  }

  protected async logoutAccount(): Promise<void> {
    if (this.loggingOut()) return;
    this.loggingOut.set(true);
    try {
      await this.auth.logout();
      this.billing.clearSubscription();
      this.closeMenu();
    } finally {
      this.loggingOut.set(false);
    }
  }

  @HostListener('document:click')
  protected closeAccountMenu(): void {
    this.accountMenuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  protected closeMenusOnEscape(): void {
    this.closeMenu();
  }

  constructor() {
    // SSR-safe: afterNextRender runs only in the browser, after the first render — never on the server.
    afterNextRender(() => {
      void this.loadAccount();
      const onScroll = () => this.scrolled.set(window.scrollY > 8);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    });
  }

  private async loadAccount(): Promise<void> {
    const user = await this.auth.currentUser();
    if (!user) {
      this.billing.clearSubscription();
      return;
    }

    try {
      const workspaces = await this.billing.listWorkspaces();
      const workspace = workspaces.find((candidate) => candidate.kind === 'personal' && candidate.role === 'owner')
        ?? workspaces.find((candidate) => candidate.role === 'owner');
      if (workspace) await this.billing.getSubscription(workspace.id);
    } catch {
      // The account control remains useful when billing is unavailable.
    }
  }
}
