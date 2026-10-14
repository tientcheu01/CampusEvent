import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PLATFORM_ID } from '@angular/core';
import { interval } from 'rxjs';
import { TEMOIGNAGES } from '../../../core/data/site-data';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { IconComponent } from '../../../shared/ui/icon.component';
import { SectionLabelComponent } from '../../../shared/ui/section-label.component';

/** 07 — Témoignages : retours d'expérience des participants, présentés comme un carrousel de cartes empilées. */
@Component({
  selector: 'sji-temoignages-home',
  standalone: true,
  imports: [SectionLabelComponent, IconComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section tm-section" aria-labelledby="tm-title">
      <div class="container tm">
        <header class="tm__head" sjiReveal>
          <sji-section-label num="07" text="Témoignages" />
          <h2 id="tm-title" class="h2 tm__title">Ils ont vécu l'aventure</h2>
          <p class="tm__lead">Des étudiants engagés partagent ce que SJI INNOVA a changé pour eux.</p>
        </header>

        <div class="tm__grid" sjiReveal [delay]="0.15">
          <!-- Visuels empilés -->
          <div
            class="tm__visual"
            (mouseenter)="pause()"
            (mouseleave)="resume()"
            (focusin)="pause()"
            (focusout)="resume()"
            aria-roledescription="carrousel"
          >
            <div class="tm__stack" role="list" aria-live="polite" aria-atomic="true">
              @for (t of temoignages; track t.initials; let i = $index) {
                <div
                  class="tm__card"
                  role="listitem"
                  [class.is-active]="i === active()"
                  [style.transform]="cardTransform(i)"
                  [style.z-index]="cardZ(i)"
                  [style.opacity]="cardOpacity(i)"
                >
                  @if (t.src) {
                    <img [src]="t.src" [alt]="t.name" draggable="false" />
                  } @else {
                    <div class="tm__avatar" [style.--avatar-color]="t.color">
                      <span class="tm__initials">{{ t.initials }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Texte et contrôles -->
          <div class="tm__copy">
            <div
              class="tm__quote-wrap"
              [style.opacity]="fading() ? 0 : 1"
              [style.transform]="fading() ? 'translateY(12px)' : 'translateY(0)'"
            >
              <blockquote class="tm__quote">“{{ current().quote }}”</blockquote>
              <div class="tm__author">
                <strong class="tm__name">{{ current().name }}</strong>
                <span class="tm__role">{{ current().designation }}</span>
              </div>
            </div>

            <div class="tm__controls">
              <button
                type="button"
                class="tm__btn"
                (click)="prev()"
                aria-label="Témoignage précédent"
              >
                <sji-icon name="arrow-left" [size]="20" />
              </button>
              <button
                type="button"
                class="tm__btn"
                (click)="next()"
                aria-label="Témoignage suivant"
              >
                <sji-icon name="arrow-right" [size]="20" />
              </button>
            </div>

            <div class="tm__dots" role="tablist" aria-label="Témoignages">
              @for (t of temoignages; track t.initials; let i = $index) {
                <button
                  type="button"
                  class="tm__dot"
                  role="tab"
                  [attr.aria-selected]="i === active()"
                  [attr.aria-label]="'Témoignage de ' + t.name"
                  [class.is-active]="i === active()"
                  (click)="goTo(i)"
                ></button>
              }
            </div>
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
      background: var(--paper);
      color: var(--navy-900);
      padding-block: var(--section-y);
      overflow: hidden;
    }
    .tm {
      display: grid;
      gap: clamp(2rem, 4vw, 3.5rem);
    }
    .tm__head {
      display: grid;
      gap: 0.75rem;
      max-width: 48ch;
    }
    .tm__title {
      font-size: var(--fs-h2);
      line-height: var(--lh-title);
      letter-spacing: var(--ls-display);
    }
    .tm__lead {
      color: var(--text-dim);
      font-size: var(--fs-lead);
    }
    .tm__grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: clamp(2rem, 5vw, 4rem);
      align-items: center;
    }
    @media (min-width: 768px) {
      .tm__grid {
        grid-template-columns: minmax(280px, 420px) 1fr;
      }
    }
    .tm__visual {
      display: flex;
      justify-content: center;
    }
    .tm__stack {
      position: relative;
      width: min(100%, 320px);
      aspect-ratio: 1 / 1;
    }
    .tm__card {
      position: absolute;
      inset: 0;
      border-radius: var(--r-xl);
      overflow: hidden;
      background: var(--paper-2);
      box-shadow: var(--shadow-lg);
      transition:
        transform 0.55s var(--ease-in-out),
        opacity 0.55s var(--ease-in-out);
      will-change: transform, opacity;
    }
    .tm__card img,
    .tm__card .tm__avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .tm__avatar {
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, var(--avatar-color) 0%, var(--navy-900) 100%);
    }
    .tm__initials {
      font-family: var(--font-display);
      font-size: clamp(3rem, 10vw, 5rem);
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.03em;
    }
    .tm__copy {
      display: grid;
      gap: clamp(1.5rem, 3vw, 2.25rem);
    }
    .tm__quote-wrap {
      display: grid;
      gap: 1.5rem;
      transition:
        opacity 0.3s var(--ease-soft),
        transform 0.3s var(--ease-soft);
    }
    .tm__quote {
      font-family: var(--font-display);
      font-size: clamp(1.15rem, 1.8vw, 1.45rem);
      line-height: 1.45;
      letter-spacing: -0.01em;
      margin: 0;
    }
    .tm__author {
      display: grid;
      gap: 0.25rem;
    }
    .tm__name {
      font-size: var(--fs-h3);
      color: var(--navy-900);
    }
    .tm__role {
      font-size: var(--fs-small);
      color: var(--text-dim);
    }
    .tm__controls {
      display: flex;
      gap: 0.75rem;
    }
    .tm__btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 999px;
      border: 1px solid var(--line);
      background: var(--paper);
      color: var(--navy-900);
      transition:
        background 0.2s var(--ease-soft),
        border-color 0.2s var(--ease-soft),
        transform 0.2s var(--ease-soft);
    }
    .tm__btn:hover {
      background: var(--paper-2);
      border-color: var(--blue-200);
      transform: translateY(-2px);
    }
    .tm__btn:active {
      transform: translateY(0);
    }
    .tm__dots {
      display: flex;
      gap: 0.5rem;
    }
    .tm__dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      border: 0;
      padding: 0;
      background: var(--line);
      transition: background 0.2s var(--ease-soft);
    }
    .tm__dot.is-active {
      background: var(--gold-500);
      width: 28px;
    }
    .tm__dot:hover:not(.is-active) {
      background: var(--blue-200);
    }
    @media (prefers-reduced-motion: reduce) {
      .tm__card,
      .tm__quote-wrap,
      .tm__btn,
      .tm__dot {
        transition: none;
      }
      .tm__btn:hover {
        transform: none;
      }
    }
  `,
})
export class TemoignagesHomeComponent {
  protected readonly temoignages = TEMOIGNAGES;
  protected readonly active = signal(0);
  protected readonly fading = signal(false);

  protected readonly current = computed(() => this.temoignages[this.active()]);

  // Rotations fixes pour éviter toute incohérence SSR/hydratation.
  private readonly rotations = [-5, 7, -3, 6, -4];

  private readonly platformId = inject(PLATFORM_ID);
  private autoplayOn = true;

  constructor() {
    // L'autoplay démarre uniquement dans le navigateur pour ne pas bloquer le SSR/prerendering.
    if (isPlatformBrowser(this.platformId)) {
      interval(5000)
        .pipe(takeUntilDestroyed())
        .subscribe(() => {
          if (this.autoplayOn) {
            this.next();
          }
        });
    }
  }

  protected cardTransform(index: number): string {
    const diff = index - this.active();
    const distance = Math.abs(diff);
    const isActive = diff === 0;

    if (isActive) {
      return 'translateY(0) scale(1) rotate(0deg)';
    }

    const direction = diff > 0 ? 1 : -1;
    const rotate = this.rotations[index % this.rotations.length] * direction;
    const translateY = `${(distance + 0.5) * 18}px`;
    const scale = Math.max(0.82, 0.95 - distance * 0.04);

    return `translateY(${translateY}) scale(${scale}) rotate(${rotate}deg)`;
  }

  protected cardZ(index: number): number {
    const distance = Math.abs(index - this.active());
    return this.temoignages.length - distance;
  }

  protected cardOpacity(index: number): number {
    return index === this.active() ? 1 : Math.max(0.25, 0.55 - Math.abs(index - this.active()) * 0.12);
  }

  protected next(): void {
    this.setActive((this.active() + 1) % this.temoignages.length);
  }

  protected prev(): void {
    this.setActive((this.active() - 1 + this.temoignages.length) % this.temoignages.length);
  }

  protected goTo(index: number): void {
    this.setActive(index);
  }

  protected pause(): void {
    this.autoplayOn = false;
  }

  protected resume(): void {
    this.autoplayOn = true;
  }

  private setActive(index: number): void {
    if (index === this.active()) return;
    this.fading.set(true);
    setTimeout(() => {
      this.active.set(index);
      this.fading.set(false);
    }, 180);
  }
}
