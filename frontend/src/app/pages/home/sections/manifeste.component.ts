import { ChangeDetectionStrategy, Component } from '@angular/core';
import { VERBES } from '../../../core/data/site-data';
import { GlowDirective } from '../../../core/directives/glow.directive';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { IconComponent, IconName } from '../../../shared/ui/icon.component';
import { SectionLabelComponent } from '../../../shared/ui/section-label.component';

const ICONES: IconName[] = ['grad', 'trophy', 'trend'];

/** 03 — Le manifeste : ce qu'est le concours, et les trois missions en colonnes séparées par un filet. */
@Component({
  selector: 'sji-manifeste',
  standalone: true,
  imports: [SectionLabelComponent, IconComponent, RevealDirective, GlowDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="manifeste" class="section section--dense" sjiGlow="28 42 .14" aria-labelledby="mf-title">
      <div class="container mf">
        <header class="mf__head" sjiReveal>
          <sji-section-label num="01" text="Le concours" />
          <h2 id="mf-title" class="h2 mf__title">
            <span data-line><em>Trois missions</em>,</span><span data-line>un seul concours</span>
          </h2>
          <p class="mf__lead">
            SJI INNOVA récompense les projets d'étudiants qui répondent à un besoin réel de la société camerounaise. Pas une idée sur papier&nbsp;: un problème identifié,
            une solution construite, un prototype qu'on peut montrer.
          </p>
        </header>

        <dl class="mf__cols" sjiReveal="stagger">
          @for (v of verbes; track v.verbe; let i = $index) {
            <div class="mf__col">
              <span class="mf__icon"><sji-icon [name]="icones[i]" [size]="24" /></span>
              <dt class="h3">{{ v.verbe }}</dt>
              <dd>{{ v.texte }}</dd>
            </div>
          }
        </dl>
      </div>
    </section>
  `,
  styles: `
    .mf {
      display: grid;
      gap: var(--sp-12);
    }
    .mf__head {
      display: grid;
      gap: var(--sp-5, 1.25rem);
      align-content: start;
    }
    .mf__title {
      margin: 0;
      max-width: 12ch;
    }
    /* Le mot coloré du titre, repris des références. */
    .mf__title em {
      font-style: normal;
      color: var(--blue-600);
    }
    .mf__lead {
      margin: 0;
      max-width: 46ch;
      color: var(--text-dim);
    }
    .mf__cols {
      display: grid;
      gap: var(--sp-8);
      margin: 0;
    }
    .mf__col {
      display: grid;
      gap: 0.6rem;
      align-content: start;
    }
    .mf__icon {
      display: grid;
      place-items: center;
      width: 52px;
      height: 52px;
      margin-bottom: var(--sp-2);
      border: var(--border-strong);
      border-radius: var(--r-md);
      background: var(--paper-2);
    }
    .mf__col dt {
      margin: 0;
    }
    .mf__col dd {
      margin: 0;
      color: var(--text-dim);
      font-size: var(--fs-small);
      line-height: 1.6;
      max-width: 32ch;
    }
    @media (min-width: 640px) {
      .mf__cols {
        grid-template-columns: repeat(3, 1fr);
        gap: var(--sp-6);
      }
      /* Filets verticaux entre les colonnes, comme dans la référence. */
      .mf__col + .mf__col {
        padding-left: var(--sp-6);
        border-left: var(--border);
      }
    }
    @media (min-width: 1024px) {
      .mf {
        grid-template-columns: 1fr 1.35fr;
        gap: var(--sp-16);
        align-items: start;
      }
      .mf__head {
        padding-right: var(--sp-8);
        border-right: var(--border);
      }
    }
  `,
})
export class ManifesteComponent {
  protected readonly verbes = VERBES;
  protected readonly icones = ICONES;
}
