import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NIVEAUX } from '../../../core/data/site-data';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { ButtonComponent } from '../../../shared/ui/button.component';
import { MarqueeComponent } from '../../../shared/ui/marquee.component';
import { SectionLabelComponent } from '../../../shared/ui/section-label.component';

/** Partenaires confirmés de l'édition 2027. Tant qu'il n'y en a pas : une phrase, jamais de logos fictifs. */
export const PARTENAIRES_CONFIRMES: string[] = [];

/** 09 — Partenaires. Capter les entreprises de passage et rassurer les candidats. */
@Component({
  selector: 'sji-partenaires-home',
  standalone: true,
  imports: [RouterLink, ButtonComponent, MarqueeComponent, SectionLabelComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-labelledby="pt-title">
      <div class="pt__logos">
        @if (partenaires.length) {
          <sji-marquee [items]="partenaires" speed="slow" />
        } @else {
          <p class="container pt__none label">Les partenaires de l'édition 2027 seront annoncés ici.</p>
        }
      </div>
      <div class="section section--dense tint-2">
        <div class="container pt__call">
          <div sjiReveal>
            <sji-section-label num="07" text="Partenariat" />
            <h2 id="pt-title" class="h1 pt__title">Faites rayonner le génie étudiant.</h2>
          </div>
          <div class="pt__side" sjiReveal [delay]="0.1">
            <p class="lead">Associez votre marque à la créativité de la jeunesse camerounaise. Quatre niveaux d'engagement, et un format sur mesure si aucun ne vous correspond.</p>
            <p class="pt__tiers h3">{{ tiers }}</p>
            <a sjiButton variant="ghost" [arrow]="true" routerLink="/partenaires" (click)="track()">Voir le dossier de partenariat</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .pt__none {
      margin: 0;
      padding-block: var(--sp-8);
      color: var(--text-dim);
    }
    .pt__call {
      display: grid;
      gap: var(--sp-12);
    }
    .pt__title {
      margin-top: var(--sp-6);
    }
    .pt__side {
      display: grid;
      gap: var(--sp-6);
      justify-items: start;
      align-content: end;
    }
    .pt__tiers {
      color: var(--blue-600);
    }
    @media (min-width: 1024px) {
      .pt__call {
        grid-template-columns: 7fr 5fr;
        align-items: end;
      }
    }
  `,
})
export class PartenairesHomeComponent {
  protected readonly partenaires = PARTENAIRES_CONFIRMES;
  protected readonly tiers = NIVEAUX.join(' · ');
  private readonly analytics = inject(AnalyticsService);

  protected track(): void {
    this.analytics.track('Dossier partenariat', { section: 'accueil' });
  }
}
