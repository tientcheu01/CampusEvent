import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { A_PROPOS, A_PROPOS_STATS } from '../../../core/data/site-data';
import { GlowDirective } from '../../../core/directives/glow.directive';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { ButtonComponent } from '../../../shared/ui/button.component';
import { IconComponent } from '../../../shared/ui/icon.component';

/** Section À propos : présentation du concours avec collage d’images et liens sociaux. */
@Component({
  selector: 'sji-a-propos-home',
  standalone: true,
  imports: [RouterLink, ButtonComponent, IconComponent, RevealDirective, GlowDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section about-section" aria-labelledby="about-title" sjiGlow="35 45 .12">
      <div class="container about">
        <!-- Texte -->
        <div class="about__copy" sjiReveal>
          <span class="about__eyebrow">Présentation</span>
          <h2 id="about-title" class="h2 about__title">{{ a.titre }}</h2>
          <p class="about__text">{{ a.texte }}</p>

          <div class="about__stats" sjiReveal="stagger" [delay]="0.1">
            @for (s of stats; track s.label) {
              <div class="about__stat">
                <span class="about__stat-icon"><sji-icon [name]="s.icone" [size]="24" /></span>
                <div class="about__stat-body">
                  <strong class="about__stat-value">{{ s.valeur }}</strong>
                  <span class="about__stat-label">{{ s.label }}</span>
                </div>
              </div>
            }
          </div>

          <a sjiButton class="about__cta" [arrow]="true" [routerLink]="a.cta.lien">{{ a.cta.label }}</a>
        </div>

        <!-- Collage -->
        <div class="about__media" sjiReveal [delay]="0.2">
          <div class="about__collage" aria-label="Visuels du concours et de l’organisateur">
            <!-- Formes décoratives flottantes -->
            <span class="about__shape about__shape--1" aria-hidden="true"></span>
            <span class="about__shape about__shape--2" aria-hidden="true"></span>
            <span class="about__shape about__shape--3" aria-hidden="true"></span>

            <!-- Logo événement -->
            <figure class="about__card about__card--event">
              <img [src]="a.evenement.photo" [alt]="'Logo ' + a.evenement.nom" draggable="false" />
            </figure>

            <!-- Responsable -->
            <figure class="about__card about__card--resp">
              <img [src]="a.responsable.photo" [alt]="'Portrait de ' + a.responsable.nom" draggable="false" />
              <figcaption class="about__caption">
                <strong>{{ a.responsable.nom }}</strong>
                <span>{{ a.responsable.role }}</span>
              </figcaption>
              <div class="about__links">
                <a
                  class="about__social"
                  [href]="a.responsable.linkedin"
                  target="_blank"
                  rel="noopener"
                  aria-label="LinkedIn du responsable"
                >
                  <sji-icon name="linkedin" [size]="20" />
                </a>
                <a
                  class="about__social"
                  [href]="'tel:' + a.responsable.phone"
                  aria-label="Appeler le responsable"
                >
                  <sji-icon name="phone" [size]="20" />
                </a>
              </div>
            </figure>

            <!-- Université -->
            <figure class="about__card about__card--school">
              <img [src]="a.universite.logo" [alt]="'Logo ' + a.universite.nom" draggable="false" />
              <a
                class="about__site-link"
                [href]="a.universite.site"
                target="_blank"
                rel="noopener"
              >
                <sji-icon name="external-link" [size]="20" />
                <span>Visiter le site</span>
              </a>
            </figure>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    .about-section {
      position: relative;
      overflow: hidden;
      background: var(--paper);
      color: var(--navy-900);
      padding-block: var(--section-y);
    }
    .about {
      display: grid;
      grid-template-columns: 1fr;
      gap: clamp(2.5rem, 5vw, 4rem);
      align-items: center;
    }
    @media (min-width: 900px) {
      .about {
        grid-template-columns: 1fr minmax(340px, 520px);
      }
    }

    /* Texte */
    .about__copy {
      display: grid;
      gap: 1.25rem;
      max-width: 64ch;
    }
    .about__eyebrow {
      font-family: var(--font-mono);
      font-size: var(--fs-label);
      letter-spacing: var(--ls-label);
      text-transform: uppercase;
      color: var(--blue-600);
    }
    .about__title {
      font-size: var(--fs-h2);
      line-height: var(--lh-title);
      letter-spacing: var(--ls-display);
    }
    .about__text {
      font-size: var(--fs-lead);
      line-height: 1.65;
      color: var(--text-dim);
    }
    .about__stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1rem;
      margin-top: 0.5rem;
    }
    .about__stat {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 1rem;
      border-radius: var(--r-md);
      background: var(--paper-2);
      border: var(--border);
    }
    .about__stat-icon {
      display: inline-flex;
      flex: none;
      color: var(--gold-700);
    }
    .about__stat-body {
      display: grid;
      gap: 0.125rem;
    }
    .about__stat-value {
      font-family: var(--font-display);
      font-size: var(--fs-h3);
      color: var(--navy-900);
    }
    .about__stat-label {
      font-size: var(--fs-small);
      color: var(--text-dim);
    }
    .about__cta {
      justify-self: start;
      margin-top: 0.5rem;
    }

    /* Collage */
    .about__media {
      display: flex;
      justify-content: center;
    }
    .about__collage {
      position: relative;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
      gap: 1rem;
      width: min(100%, 480px);
    }
    .about__card {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      margin: 0;
      padding: 0.625rem;
      border-radius: var(--r-lg);
      background: var(--paper);
      border: var(--border);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
      transition:
        transform 0.35s var(--ease-soft),
        box-shadow 0.35s var(--ease-soft);
    }
    .about__card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }
    .about__card img {
      width: 100%;
      height: auto;
      aspect-ratio: 1 / 1;
      object-fit: contain;
      border-radius: calc(var(--r-lg) - 6px);
      background: var(--paper-2);
    }
    .about__card--event {
      grid-column: 1 / -1;
    }
    .about__card--event img {
      aspect-ratio: 16 / 9;
      object-fit: cover;
    }
    .about__card--resp img,
    .about__card--school img {
      aspect-ratio: 1 / 1;
      object-fit: cover;
    }
    .about__caption {
      display: grid;
      gap: 0.125rem;
      padding-inline: 0.25rem;
    }
    .about__caption strong {
      font-size: var(--fs-body);
      color: var(--navy-900);
    }
    .about__caption span {
      font-size: var(--fs-small);
      color: var(--text-dim);
    }
    .about__links {
      display: flex;
      gap: 0.5rem;
      padding-inline: 0.25rem;
    }
    .about__social {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border-radius: 999px;
      background: var(--paper-2);
      color: var(--navy-900);
      border: var(--border);
      transition: background 0.2s var(--ease-soft);
    }
    .about__social:hover {
      background: var(--paper-3);
      color: var(--blue-600);
    }
    .about__site-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: auto;
      padding: 0.5rem 0.75rem;
      border-radius: var(--r-full);
      background: var(--paper-2);
      color: var(--navy-900);
      font-size: var(--fs-small);
      font-weight: 600;
      border: var(--border);
      transition: background 0.2s var(--ease-soft);
    }
    .about__site-link:hover {
      background: var(--paper-3);
      color: var(--blue-600);
    }

    /* Formes décoratives */
    .about__shape {
      position: absolute;
      z-index: -1;
      border-radius: 999px;
      pointer-events: none;
    }
    .about__shape--1 {
      top: -12px;
      left: 12%;
      width: 48px;
      height: 48px;
      background: rgba(46, 107, 230, 0.18);
      animation: about-float 5s ease-in-out infinite;
    }
    .about__shape--2 {
      bottom: 18%;
      right: -8px;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(248, 169, 27, 0.22);
      animation: about-float 4.5s ease-in-out infinite reverse;
    }
    .about__shape--3 {
      bottom: -8px;
      left: 22%;
      width: 20px;
      height: 20px;
      background: rgba(19, 160, 74, 0.18);
      animation: about-float 6s ease-in-out infinite;
    }
    @keyframes about-float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .about__card,
      .about__social,
      .about__site-link {
        transition: none;
      }
      .about__card:hover {
        transform: none;
      }
      .about__shape {
        animation: none;
      }
    }
  `,
})
export class AProposHomeComponent {
  protected readonly a = A_PROPOS;
  protected readonly stats = A_PROPOS_STATS;
}
