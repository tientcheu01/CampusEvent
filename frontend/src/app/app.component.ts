import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AnalyticsService } from './core/services/analytics.service';
import { LenisService } from './core/services/lenis.service';
import { MotionService } from './core/services/motion.service';
import { PageTransitionService } from './core/services/page-transition.service';
import { SeoService } from './core/services/seo.service';
import { FooterComponent } from './shared/layout/footer.component';
import { HeaderComponent } from './shared/layout/header.component';
import { PageVeilComponent } from './shared/layout/page-veil.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, PageVeilComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sji-header />
    <main id="contenu" tabindex="-1"><router-outlet /></main>
    <sji-footer />
    <sji-page-veil />
  `,
  styles: `
    main {
      position: relative;
      display: block;
      outline: none;
    }
  `,
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly motion = inject(MotionService);
  private readonly lenis = inject(LenisService);
  private readonly transition = inject(PageTransitionService);

  constructor() {
    this.seo.init();
    const analytics = inject(AnalyticsService);

    this.router.events.pipe(filter((e) => e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError)).subscribe((e) => {
      const hasFragment = e instanceof NavigationEnd && e.urlAfterRedirects.includes('#');
      this.transition.reveal({ toTop: e instanceof NavigationEnd && !hasFragment });
      this.refreshScrollTriggers();
    });

    afterNextRender(() => {
      analytics.init();
      this.lenis.init();
      // Les polices et les images changent la hauteur de page : on recalcule les repères de scroll.
      window.addEventListener('load', () => this.refreshScrollTriggers());
      document.fonts?.ready.then(() => this.refreshScrollTriggers());
    });
  }

  private refreshScrollTriggers(): void {
    if (!this.motion.isBrowser) return;
    setTimeout(() => this.motion.load().then(({ ScrollTrigger }) => ScrollTrigger.refresh()), 120);
  }
}
