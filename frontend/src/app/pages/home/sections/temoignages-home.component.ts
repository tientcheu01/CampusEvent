import { ChangeDetectionStrategy, Component, DestroyRef, NgZone, afterNextRender, inject, signal } from '@angular/core';
import { TEMOIGNAGES } from '../../../core/data/site-data';
import { GlowDirective } from '../../../core/directives/glow.directive';
import { MotionService } from '../../../core/services/motion.service';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { SectionLabelComponent } from '../../../shared/ui/section-label.component';

/** Durée d'affichage d'un témoignage avant le passage au suivant. */
const DELAI_MS = 7000;

/** 07 — Témoignages : défilement horizontal automatique, un témoignage à la fois. */
@Component({
  selector: 'sji-temoignages-home',
  standalone: true,
  imports: [SectionLabelComponent, RevealDirective, GlowDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section tm-section" aria-labelledby="tm-title" sjiGlow="50 40 .08">
      <div class="container">
        <header class="tm__head" sjiReveal>
          <sji-section-label num="07" text="Témoignages" />
          <h2 id="tm-title" class="h2 tm__title">Ils ont vécu l'aventure</h2>
        </header>

        <div
          class="tm__carousel"
          (mouseenter)="paused.set(true)"
          (mouseleave)="paused.set(false)"
          (focusin)="paused.set(true)"
          (focusout)="paused.set(false)"
        >
          <div class="tm__viewport">
            <div class="tm__track" [style.transform]="'translateX(-' + index() * 100 + '%)'">
              @for (t of temoignages; track t.name; let i = $index) {
                <figure class="tm__item" [attr.aria-hidden]="i === index() ? null : 'true'" [attr.inert]="i === index() ? null : ''">
                  <div class="tm__inner">
                    <blockquote class="tm__quote">
                      <span class="tm__mark" aria-hidden="true">“</span>
                      <p class="tm__text">{{ t.quote }}<span class="tm__mark tm__mark--end" aria-hidden="true">”</span></p>
                    </blockquote>
                    <figcaption class="tm__caption">
                      <span class="tm__rule" aria-hidden="true"></span>
                      <span class="tm__who">
                        <span class="tm__name">{{ t.name }}</span>
                        <span class="tm__role">{{ t.designation }}</span>
                      </span>
                    </figcaption>
                  </div>
                </figure>
              }
            </div>
          </div>

          <div class="tm__dots" role="group" aria-label="Choisir un témoignage">
            @for (t of temoignages; track t.name; let i = $index) {
              <button
                type="button"
                class="tm__dot"
                [class.is-on]="i === index()"
                [attr.aria-current]="i === index() ? 'true' : null"
                [attr.aria-label]="'Témoignage de ' + t.name"
                (click)="goTo(i)"
              ></button>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    .tm-section {
      position: relative;
      overflow: hidden;
      background: var(--paper);
      color: var(--navy-900);
    }
    .tm__head {
      display: grid;
      gap: var(--sp-3);
      justify-items: center;
      text-align: center;
      margin-bottom: clamp(2.5rem, 5vw, 4rem);
    }
    .tm__title {
      font-size: var(--fs-h2);
      line-height: var(--lh-title);
      letter-spacing: var(--ls-display);
    }

    .tm__viewport {
      overflow: hidden;
    }
    .tm__track {
      display: flex;
      width: 100%;
      transition: transform 0.7s var(--ease-soft);
      will-change: transform;
    }
    /* La diapo fait exactement la largeur du cadre : le pas de défilement vaut 100 %.
       La mesure de lecture est contrainte à l'intérieur, jamais sur la diapo elle-même. */
    .tm__item {
      flex: 0 0 100%;
      /* min-width:0 neutralise la taille minimale automatique des éléments flex,
         sans quoi la diapo peut dépasser 100 % et se désaligner du pas de défilement. */
      width: 100%;
      min-width: 0;
      display: flex;
      margin: 0;
    }
    .tm__inner {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: var(--sp-8);
      /* Presque toute la largeur de la section, centré. */
      max-width: 62rem;
      margin-inline: auto;
      /* Le guillemet ouvrant déborde dans cette marge au lieu de décaler le texte. */
      padding-left: 0.75rem;
    }

    /* La typo porte sur le blockquote pour que les guillemets suspendus
       soient à la même échelle que le texte. */
    .tm__quote {
      position: relative;
      margin: 0;
      font-family: var(--font-display);
      font-size: clamp(1.125rem, 1.4vw + 0.8rem, 1.625rem);
      line-height: 1.45;
      letter-spacing: -0.01em;
    }
    .tm__text {
      margin: 0;
      text-wrap: pretty;
    }
    .tm__mark {
      position: absolute;
      left: -0.75rem;
      color: var(--text-dim);
      user-select: none;
    }
    .tm__mark--end {
      position: static;
      margin-left: 0.125rem;
    }

    .tm__caption {
      display: flex;
      align-items: center;
      gap: var(--sp-3);
    }
    .tm__rule {
      display: none;
      flex: 1 1 auto;
      height: 1px;
      background: var(--line);
    }
    .tm__who {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }
    .tm__name {
      font-size: var(--fs-body);
      font-weight: 700;
      line-height: 1.2;
    }
    .tm__role {
      font-size: var(--fs-small);
      color: var(--text-dim);
    }

    .tm__dots {
      display: flex;
      justify-content: center;
      gap: 0.4rem;
      margin-top: clamp(2rem, 4vw, 3rem);
    }
    .tm__dot {
      width: 28px;
      height: 4px;
      border: 0;
      padding: 0;
      border-radius: var(--r-full);
      background: var(--line);
      cursor: pointer;
      transition: background-color var(--d-fast);
    }
    .tm__dot.is-on {
      background: var(--gold-500);
    }
    .tm__dot:focus-visible {
      outline: 2px solid var(--gold-700);
      outline-offset: 4px;
    }

    @media (min-width: 768px) {
      .tm__caption {
        /* Filet puis attribution calée à droite, comme une signature. */
        margin-left: auto;
        width: 60%;
      }
      .tm__rule {
        display: block;
      }
      .tm__who {
        margin-left: auto;
        text-align: right;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .tm__track {
        transition: none;
      }
    }
  `,
})
export class TemoignagesHomeComponent {
  protected readonly temoignages = TEMOIGNAGES;
  protected readonly index = signal(0);
  protected readonly paused = signal(false);

  constructor() {
    const zone = inject(NgZone);
    const destroyRef = inject(DestroyRef);
    const motion = inject(MotionService);

    afterNextRender(() => {
      // Pas de rotation automatique si l'utilisateur a demandé moins de mouvement :
      // les points restent le seul moyen de naviguer.
      if (motion.reduced) return;
      // Hors zone : un setInterval permanent empêcherait l'application d'être « stable ».
      zone.runOutsideAngular(() => {
        const id = setInterval(() => {
          if (this.paused()) return;
          zone.run(() => this.index.update((i) => (i + 1) % this.temoignages.length));
        }, DELAI_MS);
        destroyRef.onDestroy(() => clearInterval(id));
      });
    });
  }

  protected goTo(i: number): void {
    this.index.set(i);
  }
}
