import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FAQ_ACCUEIL, fr } from '../../../core/data/site-data';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { ConcoursDatesService } from '../../../core/services/concours-dates.service';
import { AccordionComponent, AccordionItemComponent } from '../../../shared/ui/accordion.component';
import { ButtonComponent } from '../../../shared/ui/button.component';
import { CountdownComponent } from '../../../shared/ui/countdown.component';
import { SectionLabelComponent } from '../../../shared/ui/section-label.component';

/** 08 — Qui peut participer. Lever les doutes avant le formulaire. Accordéon sobre + carte collante. */
@Component({
  selector: 'sji-faq-home',
  standalone: true,
  imports: [RouterLink, AccordionComponent, AccordionItemComponent, ButtonComponent, CountdownComponent, SectionLabelComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section section--dense" aria-labelledby="faq-title">
      <div class="container grid">
        <header class="fq__head" sjiReveal>
          <sji-section-label text="Qui peut participer" />
          <h2 id="faq-title" class="h2">Avant de déposer, tout ce qu'il faut savoir.</h2>
        </header>

        <sji-accordion class="fq__acc" sjiReveal [delay]="0.1">
          @for (item of faq; track item.titre) {
            <sji-accordion-item [title]="fr(item.titre)">
              @for (p of item.paragraphes; track p) {
                <p>{{ fr(p) }}</p>
              }
              @if (item.liste) {
                <ul class="fq__list">
                  @for (li of item.liste; track li) {
                    <li>{{ fr(li) }}</li>
                  }
                </ul>
              }
            </sji-accordion-item>
          }
        </sji-accordion>

        <aside class="fq__card" aria-label="Déposer mon projet">
          <div class="fq__sticky">
            <sji-countdown />
            <a sjiButton [arrow]="true" [routerLink]="dates.cta().link" [fragment]="dates.cta().fragment" (click)="track()">{{ dates.cta().label }}</a>
          </div>
        </aside>
      </div>
    </section>
  `,
  styles: `
    .fq__head {
      grid-column: 1 / -1;
      display: grid;
      gap: var(--sp-6);
      margin-bottom: var(--sp-12);
    }
    /* La mesure est posée sur le titre : « ch » suit la police de l'élément, pas celle du conteneur. */
    .fq__head h2 {
      max-width: 16ch;
    }
    .fq__acc {
      grid-column: 1 / -1;
    }
    .fq__acc p + p,
    .fq__list {
      margin-top: var(--sp-3);
    }
    .fq__list {
      padding-left: 1.1em;
    }
    .fq__card {
      grid-column: 1 / -1;
      margin-top: var(--sp-8);
    }
    .fq__sticky {
      display: grid;
      gap: var(--sp-6);
      padding: var(--sp-8);
      border: var(--border-strong);
      border-radius: var(--r-lg);
      background: var(--paper);
    }
    @media (min-width: 1024px) {
      .fq__head {
        grid-column: 1 / span 8;
      }
      .fq__acc {
        grid-column: 1 / span 8;
      }
      .fq__card {
        grid-column: 9 / span 4;
        grid-row: 1 / span 2;
        margin: 0;
      }
      .fq__sticky {
        position: sticky;
        top: 96px;
        margin-top: var(--sp-16);
      }
    }
  `,
})
export class FaqHomeComponent {
  protected readonly faq = FAQ_ACCUEIL;
  protected readonly dates = inject(ConcoursDatesService);
  private readonly analytics = inject(AnalyticsService);
  protected readonly fr = fr;

  protected track(): void {
    this.analytics.track('CTA Deposer', { section: 'faq' });
  }
}
