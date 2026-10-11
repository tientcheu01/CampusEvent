import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DOCS } from '../../../core/data/site-data';
import { GlowDirective } from '../../../core/directives/glow.directive';
import { MagneticDirective } from '../../../core/directives/magnetic.directive';
import { MouseParallaxDirective } from '../../../core/directives/mouse-parallax.directive';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { ConcoursDatesService } from '../../../core/services/concours-dates.service';
import { ArcComponent } from '../../../shared/ui/arc.component';
import { BulbComponent } from '../../../shared/ui/bulb.component';
import { ButtonComponent } from '../../../shared/ui/button.component';
import { CountdownComponent } from '../../../shared/ui/countdown.component';
import { WingsComponent } from '../../../shared/ui/wings.component';

/** 01 — Héro. Dire ce que c'est, quand, et quoi faire, en moins de 10 secondes. Rien n'est centré. */
@Component({
  selector: 'sji-hero',
  standalone: true,
  imports: [RouterLink, ButtonComponent, CountdownComponent, WingsComponent, ArcComponent, BulbComponent, RevealDirective, MouseParallaxDirective, MagneticDirective, GlowDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero dots" aria-labelledby="hero-title" sjiGlow="70 38 .2">
      <div class="hero__visual" aria-hidden="true" [sjiMouseParallax]="12">
        <sji-arc class="hero__arc" />
        <sji-wings class="hero__wings" [opacity]="0.09" />
        <sji-bulb class="hero__bulb" />
      </div>

      <div class="container hero__inner">
        <p class="label hero__label">2ᵉ édition · Saint Jean Ingénieur · Yaoundé</p>

        <h1 id="hero-title" class="display hero__title" sjiReveal="mask">
          <span data-line>Imaginez.</span><span data-line
            ><span class="uline">Innover.<svg viewBox="0 0 320 18" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 11C70 3 150 16 316 6" /></svg></span></span
          ><span data-line>Construire demain.</span>
        </h1>

        <div class="hero__body">
          <p class="lead hero__lead" sjiReveal [delay]="0.25">{{ lead() }}</p>
          <div class="hero__actions" sjiReveal [delay]="0.35">
            <a sjiButton sjiMagnetic [arrow]="true" [routerLink]="dates.cta().link" [fragment]="dates.cta().fragment" (click)="track()">{{ dates.cta().label }}</a>
            <a sjiButton variant="ghost" [href]="docs.reglement" target="_blank" rel="noopener" (click)="trackReglement()">Voir le règlement</a>
          </div>
          <sji-countdown class="hero__count" />
        </div>
      </div>

      <a class="hero__scroll" href="#manifeste" aria-label="Défiler vers le contenu">
        <span class="hero__rail"><i></i></span>
        <span class="hero__word label">Défiler</span>
      </a>
    </section>
  `,
  styles: `
    .hero {
      position: relative;
      min-height: 100vh;
      min-height: 100svh;
      display: flex;
      align-items: center;
      padding-top: calc(var(--header-h) + var(--sp-8));
      padding-bottom: calc(var(--sp-24));
      overflow: hidden;
    }
    .hero__inner {
      position: relative;
    }
    .hero__label {
      margin-bottom: var(--sp-8);
      color: var(--blue-600);
    }
    .hero__title {
      /* Plafonné à 44 px sous 640 px, comme le demande le point de rupture sm */
      font-size: clamp(2.5rem, 1rem + 7.5vw, 7.5rem);
      margin-bottom: var(--sp-8);
      max-width: 14ch;
    }
    /* Les ruptures de ligne volontaires ne tiennent qu'à partir de 640 px ; en deçà le texte se replie. */
    @media (min-width: 640px) {
      .hero__title {
        text-wrap: nowrap;
      }
    }
    .uline {
      position: relative;
      display: inline-block;
    }
    .uline svg {
      position: absolute;
      left: 0;
      bottom: -0.04em;
      width: 100%;
      height: 0.1em;
      overflow: visible;
    }
    .uline path {
      fill: none;
      stroke: var(--gold-500);
      stroke-width: 6px;
      stroke-linecap: round;
      vector-effect: non-scaling-stroke;
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      animation: draw 700ms var(--ease-out) 1.1s forwards;
    }
    @keyframes draw {
      to {
        stroke-dashoffset: 0;
      }
    }
    .hero__body {
      max-width: 40rem;
      display: grid;
      gap: var(--sp-8);
    }
    .hero__lead {
      max-width: 36ch;
    }
    .hero__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sp-4);
    }
    .hero__visual {
      position: absolute;
      inset: 0 0 0 auto;
      width: 100%;
      opacity: 0.08; /* mobile : le visuel passe derrière le texte */
      pointer-events: none;
    }
    .hero__wings {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 92%;
      transform: scaleX(-1);
    }
    .hero__arc {
      position: absolute;
      right: -26%;
      top: 6%;
      width: 72%;
      aspect-ratio: 1;
    }
    .hero__bulb {
      position: absolute;
      right: 10%;
      top: 26%;
      width: 36%;
      aspect-ratio: 112 / 148;
    }
    .hero__scroll {
      position: absolute;
      left: var(--gutter);
      bottom: var(--sp-8);
      display: none;
      align-items: flex-end;
      gap: var(--sp-3);
      text-decoration: none;
      color: var(--text-dim);
    }
    .hero__rail {
      position: relative;
      width: 1px;
      height: 48px;
      background: var(--line);
      overflow: hidden;
    }
    .hero__rail i {
      position: absolute;
      left: -1px;
      top: 0;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: var(--gold-500);
      animation: drop 2.2s var(--ease-soft) infinite;
    }
    @keyframes drop {
      to {
        transform: translateY(48px);
      }
    }
    .hero__word {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
    }
    @media (min-width: 640px) {
      .hero__visual {
        opacity: 1;
        width: 58%;
      }
      .hero__bulb {
        right: 12%;
        top: 20%;
        width: 46%;
      }
      .hero__arc {
        right: -40%;
        width: 110%;
      }
    }
    /* Desktop : le visuel tient dans les colonnes 8 à 12, le texte garde les colonnes 1 à 7 */
    @media (min-width: 1024px) {
      .hero__visual {
        width: 42%;
      }
      .hero__bulb {
        right: 18%;
        top: 16%;
        width: 40%;
      }
      .hero__arc {
        right: -45%;
        top: 2%;
        width: 120%;
      }
      .hero__wings {
        width: 130%;
        right: -14%;
      }
      .hero__scroll {
        display: flex;
      }
    }
  `,
})
export class HeroComponent {
  protected readonly dates = inject(ConcoursDatesService);
  protected readonly docs = DOCS;
  private readonly analytics = inject(AnalyticsService);

  protected readonly lead = computed(() => {
    const base = "Le concours d'innovation étudiante de Saint Jean Ingénieur revient pour sa deuxième édition.";
    switch (this.dates.phase()) {
      case 'avant':
      case 'depots':
        return `${base} Déposez votre projet avant le 18 décembre 2026.`;
      case 'evaluation':
        return `${base} Les dépôts sont clos : le jury évalue les projets.`;
      case 'vers-finale':
        return `${base} La grande finale a lieu le 10 février 2027, à Yaoundé.`;
      default:
        return "L'édition 2027 est terminée. Retrouvez les projets et les lauréats.";
    }
  });

  protected track(): void {
    this.analytics.track('CTA Deposer', { section: 'hero' });
  }
  protected trackReglement(): void {
    this.analytics.track('Telechargement reglement', { section: 'hero' });
  }
}
