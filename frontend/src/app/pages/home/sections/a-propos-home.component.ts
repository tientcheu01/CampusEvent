import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { A_PROPOS } from '../../../core/data/site-data';
import { GlowDirective } from '../../../core/directives/glow.directive';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { ButtonComponent } from '../../../shared/ui/button.component';

/** Section À propos : disposition du collage inspirée de hero-section-9. */
@Component({
  selector: 'sji-a-propos-home',
  standalone: true,
  imports: [RouterLink, ButtonComponent, RevealDirective, GlowDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section about-section" aria-labelledby="about-title" sjiGlow="35 45 .12">
      <div class="container about">
        <!-- Texte -->
        <div class="about__copy" sjiReveal>
          <span class="about__eyebrow">Présentation</span>
          <h2 id="about-title" class="h2 about__title">{{ a.titre }}</h2>
          <p class="about__text">{{ a.texte }}</p>
          <a sjiButton class="about__cta" [arrow]="true" [routerLink]="a.cta.lien">{{ a.cta.label }}</a>
        </div>

        <!-- Collage -->
        <div class="about__media" sjiReveal [delay]="0.15">
          <div class="about__collage" aria-label="Visuels du concours et de l’organisateur">
            <!-- Formes décoratives flottantes -->
            <span class="about__shape about__shape--1" aria-hidden="true"></span>
            <span class="about__shape about__shape--2" aria-hidden="true"></span>
            <span class="about__shape about__shape--3" aria-hidden="true"></span>

            <!-- Image 1 : logo université, en haut au centre -->
            <figure class="about__frame about__frame--1">
              <img [src]="a.universite.logo" [alt]="'Logo ' + a.universite.nom" draggable="false" />
            </figure>

            <!-- Image 2 : responsable, à droite -->
            <figure class="about__frame about__frame--2">
              <img [src]="a.responsable.photo" [alt]="'Portrait de ' + a.responsable.nom" draggable="false" />
            </figure>

            <!-- Image 3 : logo événement, en bas à gauche -->
            <figure class="about__frame about__frame--3">
              <img [src]="a.evenement.photo" [alt]="'Logo ' + a.evenement.nom" draggable="false" />
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
      padding-top: clamp(3rem, 4vw, 5rem);
      padding-bottom: clamp(1.25rem, 2vw, 2rem);
    }
    .about {
      display: grid;
      grid-template-columns: 1fr;
      gap: clamp(2rem, 4vw, 3.5rem);
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
    .about__cta {
      justify-self: start;
      margin-top: 0.25rem;
    }

    /* Collage */
    .about__media {
      display: flex;
      justify-content: center;
    }
    .about__collage {
      position: relative;
      width: 100%;
      max-width: 380px;
      height: 340px;
      margin-inline: auto;
    }
    @media (min-width: 640px) {
      .about__collage {
        max-width: 460px;
        height: 420px;
      }
    }
    .about__frame {
      position: absolute;
      margin: 0;
      padding: 0.5rem;
      border-radius: var(--r-lg);
      background: var(--paper-2);
      border: var(--border);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
      transition:
        transform 0.45s var(--ease-soft),
        box-shadow 0.45s var(--ease-soft);
    }
    .about__frame:hover {
      transform: translateY(-6px) scale(1.02);
      box-shadow: var(--shadow-lg);
      z-index: 10;
    }
    .about__frame img {
      width: 100%;
      height: 100%;
      border-radius: calc(var(--r-lg) - 6px);
      object-fit: cover;
      display: block;
    }

    /* Image 1 : en haut, centrée horizontalement */
    .about__frame--1 {
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 192px;
      height: 192px;
    }
    @media (min-width: 640px) {
      .about__frame--1 {
        width: 256px;
        height: 256px;
      }
    }
    .about__frame--1 img {
      object-fit: contain;
      background: var(--paper);
    }

    /* Image 2 : à droite, légèrement au-dessus du milieu */
    .about__frame--2 {
      top: 38%;
      right: 0;
      width: 150px;
      height: 150px;
    }
    @media (min-width: 640px) {
      .about__frame--2 {
        top: 40%;
        width: 200px;
        height: 200px;
      }
    }

    /* Image 3 : en bas à gauche, rapprochée du groupe */
    .about__frame--3 {
      bottom: 20px;
      left: 20px;
      width: 120px;
      height: 120px;
    }
    @media (min-width: 640px) {
      .about__frame--3 {
        bottom: 30px;
        left: 30px;
        width: 170px;
        height: 170px;
      }
    }
    .about__frame--3 img {
      object-fit: contain;
      background: var(--paper);
    }

    /* Formes décoratives */
    .about__shape {
      position: absolute;
      z-index: -1;
      border-radius: 999px;
      pointer-events: none;
    }
    .about__shape--1 {
      top: -16px;
      left: 20%;
      width: 48px;
      height: 48px;
      background: rgba(46, 107, 230, 0.2);
      animation: about-float 5s ease-in-out infinite;
    }
    .about__shape--2 {
      bottom: 15%;
      right: 8%;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(248, 169, 27, 0.24);
      animation: about-float 4.5s ease-in-out infinite reverse;
    }
    .about__shape--3 {
      bottom: 5%;
      left: 25%;
      width: 20px;
      height: 20px;
      background: rgba(19, 160, 74, 0.2);
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
      .about__frame {
        transition: none;
      }
      .about__frame:hover {
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
}
