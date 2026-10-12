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
    <section id="manifeste" class="section section--dense mf-section" sjiGlow="28 42 .14" aria-labelledby="mf-title">
      <div class="container mf">
        <header class="mf__head" sjiReveal>
          <div class="mf__heading">
            <sji-section-label num="01" text="Le concours" />
            <h2 id="mf-title" class="h2 mf__title">
              <span data-line><em>Trois missions</em>,</span><span data-line>un seul concours</span>
            </h2>
          </div>
          <div class="mf__intro">
            <span class="mf__intro-line" aria-hidden="true"></span>
            <p class="mf__lead">
              SJI INNOVA récompense les projets d'étudiants qui répondent à un besoin réel de la société camerounaise. Pas une idée sur papier&nbsp;: un problème identifié,
              une solution construite, un prototype qu'on peut montrer.
            </p>
          </div>
        </header>

        <dl class="mf__cols" sjiReveal="stagger">
          @for (v of verbes; track v.verbe; let i = $index) {
            <div class="mf__col" tabindex="0">
              <span class="mf__count num">0{{ i + 1 }}</span>
              <span class="mf__halo" aria-hidden="true"></span>
              <span class="mf__icon"><sji-icon [name]="icones[i]" [size]="24" /></span>
              <div class="mf__content">
                <dt>{{ v.verbe }}</dt>
                <dd>{{ v.texte }}</dd>
              </div>
              <span class="mf__arrow" aria-hidden="true">↗</span>
            </div>
          }
        </dl>
      </div>
    </section>
  `,
  styles: `
    .mf-section {
      position: relative;
      overflow: hidden;
    }
    .mf-section::before {
      content: '';
      position: absolute;
      width: 32rem;
      aspect-ratio: 1;
      right: -18rem;
      bottom: -18rem;
      border: 1px solid var(--blue-200);
      border-radius: 50%;
      box-shadow: 0 0 0 5rem rgb(187 208 247 / 10%), 0 0 0 10rem rgb(187 208 247 / 6%);
      pointer-events: none;
    }
    .mf {
      position: relative;
      display: grid;
      gap: clamp(3rem, 7vw, 6rem);
    }
    .mf__head {
      display: grid;
      gap: var(--sp-8);
      align-items: end;
    }
    .mf__heading {
      display: grid;
      gap: var(--sp-5, 1.25rem);
      align-content: start;
    }
    .mf__title {
      margin: 0;
      max-width: 12ch;
      font-size: clamp(1.9rem, 4vw, 3.5rem);
      line-height: .98;
      letter-spacing: -.045em;
    }
    /* Le mot coloré du titre, repris des références. */
    .mf__title em {
      font-style: normal;
      color: var(--blue-600);
    }
    .mf__intro {
      display: grid;
      grid-template-columns: 2px 1fr;
      gap: var(--sp-5);
      max-width: 39rem;
    }
    .mf__intro-line {
      width: 2px;
      background: linear-gradient(var(--gold-500), transparent);
    }
    .mf__lead {
      margin: 0;
      color: var(--text-dim);
      font-size: var(--fs-lead);
      line-height: 1.75;
    }
    .mf__cols {
      display: grid;
      gap: var(--sp-4);
      margin: 0;
    }
    .mf__col {
      --mission: var(--gold-500);
      position: relative;
      display: grid;
      min-height: 20rem;
      align-content: end;
      gap: var(--sp-5);
      padding: var(--sp-6);
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: var(--r-lg);
      background: rgb(255 255 255 / 82%);
      box-shadow: 0 .5rem 2rem rgb(10 31 77 / 5%);
      outline: none;
      isolation: isolate;
      transition: transform .45s var(--ease-out), box-shadow .45s var(--ease-out), border-color var(--d-base);
    }
    .mf__col:nth-child(2) {
      --mission: var(--blue-500);
    }
    .mf__col:nth-child(3) {
      --mission: var(--cm-green);
    }
    .mf__col:hover,
    .mf__col:focus-visible {
      border-color: color-mix(in srgb, var(--mission) 55%, transparent);
      box-shadow: 0 1.75rem 4rem rgb(10 31 77 / 14%);
      transform: translateY(-.65rem);
    }
    .mf__col:focus-visible {
      outline: 3px solid var(--mission);
      outline-offset: 4px;
    }
    .mf__count {
      position: absolute;
      top: var(--sp-8);
      right: var(--sp-8);
      z-index: 2;
      color: var(--text-dim);
      font-size: var(--fs-small);
      font-weight: 700;
    }
    .mf__halo {
      position: absolute;
      z-index: -1;
      top: -7rem;
      left: -5rem;
      width: 19rem;
      aspect-ratio: 1;
      border-radius: 50%;
      opacity: .16;
      background: var(--mission);
      filter: blur(1rem);
      transition: opacity .4s, transform .6s var(--ease-out);
    }
    .mf__col:hover .mf__halo,
    .mf__col:focus-visible .mf__halo {
      opacity: .26;
      transform: scale(1.18);
    }
    .mf__icon {
      position: absolute;
      top: var(--sp-6);
      left: var(--sp-6);
      display: grid;
      width: 4.5rem;
      aspect-ratio: 1;
      place-items: center;
      color: var(--mission);
      border: 1px solid color-mix(in srgb, var(--mission) 30%, transparent);
      border-radius: 1.4rem;
      background: rgb(255 255 255 / 74%);
      backdrop-filter: blur(10px);
      transform: rotate(-6deg);
      transition: color var(--d-base), background-color var(--d-base), transform .45s var(--ease-out);
    }
    .mf__icon sji-icon {
      transform: rotate(6deg);
    }
    .mf__col:hover .mf__icon,
    .mf__col:focus-visible .mf__icon {
      color: #fff;
      background: var(--mission);
      transform: rotate(0) scale(1.08);
    }
    .mf__content {
      position: relative;
      z-index: 2;
      display: grid;
      gap: var(--sp-3);
      padding-top: var(--sp-5);
      border-top: 1px solid var(--line);
    }
    .mf__col dt {
      margin: 0;
      color: var(--navy-900);
      font-family: var(--font-display);
      font-size: clamp(1.5rem, 2.5vw, 2rem);
      font-weight: 800;
      letter-spacing: -.03em;
    }
    .mf__col dd {
      max-width: 32ch;
      margin: 0;
      color: var(--text-dim);
      font-size: var(--fs-small);
      line-height: 1.65;
    }
    .mf__arrow {
      position: absolute;
      right: var(--sp-5);
      bottom: var(--sp-5);
      display: grid;
      width: 2.6rem;
      aspect-ratio: 1;
      place-items: center;
      color: var(--mission);
      border: 1px solid color-mix(in srgb, var(--mission) 35%, transparent);
      border-radius: 50%;
      opacity: 0;
      transform: translate(-.4rem, .4rem);
      transition: opacity var(--d-base), transform var(--d-base), color var(--d-base), background-color var(--d-base);
    }
    .mf__col:hover .mf__arrow,
    .mf__col:focus-visible .mf__arrow {
      color: #fff;
      background: var(--mission);
      opacity: 1;
      transform: translate(0, 0);
    }
    @media (min-width: 640px) {
      .mf__cols {
        grid-template-columns: repeat(3, 1fr);
        gap: var(--sp-5);
      }
      /* Filets verticaux entre les colonnes, comme dans la référence. */
      .mf__col + .mf__col {
        padding-left: var(--sp-6);
        border-left: 1px solid var(--line);
      }
    }
    @media (min-width: 1024px) {
      .mf__head {
        grid-template-columns: 1fr 1fr;
        gap: var(--sp-16);
      }
      .mf__heading {
        padding-right: var(--sp-8);
      }
      .mf__intro {
        justify-self: end;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .mf__col,
      .mf__halo,
      .mf__icon,
      .mf__arrow {
        transition: none;
      }
    }
  `,
})
export class ManifesteComponent {
  protected readonly verbes = VERBES;
  protected readonly icones = ICONES;
}
