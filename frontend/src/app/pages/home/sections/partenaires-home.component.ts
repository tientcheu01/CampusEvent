import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NIVEAUX } from '../../../core/data/site-data';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { ButtonComponent } from '../../../shared/ui/button.component';
import { SectionLabelComponent } from '../../../shared/ui/section-label.component';

/** Emplacements temporaires à remplacer par les logos des partenaires confirmés de l'édition 2027. */
export const PARTENAIRES_CONFIRMES = [{ src: '/assets/images/partners/Partner FNE.png', alt: 'Logo du partenaire FNE' }];

/** 09 — Partenaires. Capter les entreprises de passage et rassurer les candidats. */
@Component({
  selector: 'sji-partenaires-home',
  standalone: true,
  imports: [RouterLink, ButtonComponent, SectionLabelComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-labelledby="pt-title">
      <div class="section section--dense tint-2">
        <div class="container pt__call">
          <div sjiReveal>
            <sji-section-label num="07" text="Partenariat" />
            <h2 id="pt-title" class="h1 pt__title">Faites rayonner le génie étudiant.</h2>
            <div class="pt__logos" aria-label="Logos des partenaires de l'évènement">
              @for (logo of logos; track logo.src) {
                <div class="pt__logo"><img [src]="logo.src" [alt]="logo.alt" loading="lazy" /></div>
              }
            </div>
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
    .pt__logos {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(8rem, 10rem));
      gap: var(--sp-3);
      max-width: 36rem;
      margin-top: var(--sp-8);
    }
    .pt__logo {
      display: grid;
      min-height: 5.5rem;
      place-items: center;
      color: var(--blue-600);
      border: 1px dashed var(--blue-200);
      border-radius: var(--r-md);
      background: rgba(255, 255, 255, 0.62);
      transition: border-color var(--d-fast), background-color var(--d-fast), transform var(--d-fast);
    }
    .pt__logo img {
      display: block;
      width: min(78%, 128px);
      height: 48px;
      object-fit: contain;
    }
    .pt__logo:hover {
      border-color: var(--gold-500);
      background: var(--paper);
      transform: translateY(-2px);
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
  protected readonly logos = PARTENAIRES_CONFIRMES;
  protected readonly tiers = NIVEAUX.join(' · ');
  private readonly analytics = inject(AnalyticsService);

  protected track(): void {
    this.analytics.track('Dossier partenariat', { section: 'accueil' });
  }
}
