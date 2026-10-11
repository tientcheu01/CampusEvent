import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GlowDirective } from '../../../core/directives/glow.directive';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { ConcoursDatesService } from '../../../core/services/concours-dates.service';
import { ButtonComponent } from '../../../shared/ui/button.component';
import { CountdownComponent } from '../../../shared/ui/countdown.component';
import { WingsComponent } from '../../../shared/ui/wings.component';

/**
 * 10 — Appel final : le seul grand aplat bleu nuit de la page, et le seul titre centré.
 * La diagonale dorée arrive ici (repère data-arrow-end) et s'y plante.
 */
@Component({
  selector: 'sji-cta-final',
  standalone: true,
  imports: [RouterLink, ButtonComponent, CountdownComponent, WingsComponent, RevealDirective, GlowDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cta tint-navy dots-light on-navy" data-arrow-end aria-labelledby="cta-title" sjiGlow="50 52 .2">
      <sji-wings class="cta__wings" [opacity]="0.22" />
      <div class="container cta__inner">
        <h2 id="cta-title" class="display cta__title" sjiReveal="mask">
          <span data-line>Ensemble, donnons</span>
          <span data-line>des ailes à</span>
          <span data-line>l'innovation.</span>
        </h2>
        <p class="lead cta__lead" sjiReveal [delay]="0.2">{{ lead() }}</p>
        <sji-countdown size="large" />
        <a sjiButton [arrow]="true" [routerLink]="dates.cta().link" [fragment]="dates.cta().fragment" (click)="track()">{{ dates.cta().label }}</a>
      </div>
    </section>
  `,
  styles: `
    .cta {
      position: relative;
      overflow: hidden;
      min-height: 100vh;
      min-height: 100svh;
      display: grid;
      place-items: center;
      padding-block: var(--sp-24);
      color: #fff;
    }
    .cta__wings {
      position: absolute;
      left: 0;
      bottom: 0;
      width: min(80vw, 900px);
      height: 100%;
    }
    .cta__inner {
      display: grid;
      justify-items: center;
      gap: var(--sp-8);
      text-align: center;
    }
    .cta__title {
      color: #fff;
      font-size: clamp(2.5rem, 0.8rem + 7vw, 7rem);
      text-align: center;
    }
    .cta__lead {
      color: var(--blue-200);
      max-width: 44ch;
    }
  `,
})
export class CtaFinalComponent {
  protected readonly dates = inject(ConcoursDatesService);
  private readonly analytics = inject(AnalyticsService);

  protected readonly lead = computed(() => {
    switch (this.dates.phase()) {
      case 'avant':
      case 'depots':
        return 'Les dépôts ferment le 18 décembre 2026. Après, il faudra attendre l’édition suivante.';
      case 'evaluation':
      case 'vers-finale':
        return 'Les dépôts sont clos. Rendez-vous à la grande finale, le 10 février 2027.';
      default:
        return 'Merci à toutes les équipes. Rendez-vous pour la prochaine édition.';
    }
  });

  protected track(): void {
    this.analytics.track('CTA Deposer', { section: 'appel-final' });
  }
}
