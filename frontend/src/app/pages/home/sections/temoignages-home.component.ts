import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { TEMOIGNAGES, type Temoignage } from '../../../core/data/site-data';
import { GlowDirective } from '../../../core/directives/glow.directive';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { IconComponent } from '../../../shared/ui/icon.component';
import { SectionLabelComponent } from '../../../shared/ui/section-label.component';

/** 07 — Témoignages : trois rangées de capsules défilantes, modale de détail au clic. */
@Component({
  selector: 'sji-temoignages-home',
  standalone: true,
  imports: [SectionLabelComponent, IconComponent, RevealDirective, GlowDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section tm-section" aria-labelledby="tm-title" sjiGlow="50 40 .08">
      <div class="container tm">
        <header class="tm__head" sjiReveal>
          <sji-section-label num="07" text="Témoignages" />
          <h2 id="tm-title" class="h2 tm__title">Ils ont vécu l'aventure</h2>
          <p class="tm__lead">Cliquez sur un portrait pour lire le témoignage complet.</p>
        </header>
      </div>

      <div class="tm__stage" sjiReveal [delay]="0.1">
        <div class="tm__pattern" aria-hidden="true"></div>
        <div class="tm__fade tm__fade--left" aria-hidden="true"></div>
        <div class="tm__fade tm__fade--right" aria-hidden="true"></div>

        <div class="tm__rows" role="list" aria-label="Témoignages des participants">
          @for (row of rows; track $index; let i = $index) {
            <div
              class="tm__row"
              [class.tm__row--reverse]="i % 2 === 1"
              role="group"
              [attr.aria-label]="'Rangée ' + (i + 1)"
            >
              <div class="tm__track">
                @for (copy of [0, 1, 2, 3]; track copy) {
                  <div class="tm__copy" [attr.aria-hidden]="copy > 0 ? 'true' : null">
                    @for (t of row; track t.initials + '-' + $index) {
                      <button
                        type="button"
                        class="tm__capsule"
                        role="listitem"
                        (click)="open(t)"
                      >
                        <span class="tm__avatar">
                          @if (t.src) {
                            <img [src]="t.src" [alt]="t.name" loading="lazy" />
                          } @else {
                            <span class="tm__initials">{{ t.initials }}</span>
                          }
                        </span>
                        <span class="tm__meta">
                          <span class="tm__name">{{ t.name }}</span>
                          <span class="tm__role">{{ t.designation }}</span>
                        </span>
                      </button>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Modale -->
      @if (selected(); as s) {
        <div
          class="tm__modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tm-modal-quote"
          (click)="onBackdropClick($event)"
          #modal
        >
          <div class="tm__backdrop" aria-hidden="true"></div>
          <div class="tm__card">
            <button
              type="button"
              class="tm__close"
              (click)="close()"
              aria-label="Fermer le témoignage"
            >
              <sji-icon name="x" [size]="24" />
            </button>

            <blockquote id="tm-modal-quote" class="tm__quote">“{{ s.quote }}”</blockquote>

            <div class="tm__author">
              <span class="tm__author-avatar">
                @if (s.src) {
                  <img [src]="s.src" [alt]="s.name" />
                } @else {
                  <span class="tm__author-initials">{{ s.initials }}</span>
                }
              </span>
              <div class="tm__author-meta">
                <strong class="tm__author-name">{{ s.name }}</strong>
                <span class="tm__author-role">{{ s.designation }}</span>
              </div>
            </div>
          </div>
        </div>
      }
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
      padding-top: var(--section-y);
      padding-bottom: clamp(3rem, 5vw, 5rem);
    }
    .tm {
      display: grid;
      gap: 0.75rem;
      text-align: center;
      margin-bottom: clamp(2rem, 4vw, 3rem);
    }
    .tm__head {
      display: grid;
      gap: 0.75rem;
      justify-items: center;
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

    /* Scène */
    .tm__stage {
      position: relative;
      width: 100%;
      padding-block: clamp(2rem, 4vw, 3rem);
    }
    .tm__pattern {
      position: absolute;
      inset: 0;
      opacity: 0.06;
      pointer-events: none;
      background-image: repeating-linear-gradient(
        315deg,
        var(--navy-900) 0,
        var(--navy-900) 1px,
        transparent 0,
        transparent 10px
      );
      background-size: 10px 10px;
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
    }
    .tm__fade {
      position: absolute;
      top: 0;
      bottom: 0;
      width: clamp(60px, 12vw, 140px);
      z-index: 2;
      pointer-events: none;
    }
    .tm__fade--left {
      left: 0;
      background: linear-gradient(to right, var(--paper), transparent);
    }
    .tm__fade--right {
      right: 0;
      background: linear-gradient(to left, var(--paper), transparent);
    }

    /* Rangées */
    .tm__rows {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: clamp(0.875rem, 2vw, 1.25rem);
      overflow: hidden;
    }
    .tm__row {
      width: 100%;
      overflow: hidden;
      mask-image: linear-gradient(
        to right,
        transparent 0,
        black 8%,
        black 92%,
        transparent 100%
      );
    }
    .tm__track {
      display: flex;
      width: max-content;
      animation: marquee-left 40s linear infinite;
      will-change: transform;
    }
    .tm__row--reverse .tm__track {
      animation-name: marquee-right;
      transform: translateX(-25%);
    }
    .tm__copy {
      display: flex;
      align-items: center;
      gap: clamp(0.75rem, 2vw, 1.25rem);
      flex: none;
    }
    @keyframes marquee-left {
      from { transform: translateX(0); }
      to { transform: translateX(-25%); }
    }
    @keyframes marquee-right {
      from { transform: translateX(-25%); }
      to { transform: translateX(0); }
    }
    @media (prefers-reduced-motion: reduce) {
      .tm__track {
        animation: none;
      }
      .tm__row--reverse .tm__track {
        transform: none;
      }
    }

    /* Capsule */
    .tm__capsule {
      display: inline-flex;
      align-items: center;
      gap: 0.875rem;
      flex: none;
      padding: 0.375rem;
      padding-right: 1.5rem;
      border-radius: 999px;
      background: var(--paper);
      border: 1px solid var(--line);
      box-shadow: var(--shadow-sm);
      cursor: pointer;
      transition:
        transform 0.25s var(--ease-soft),
        border-color 0.25s var(--ease-soft),
        box-shadow 0.25s var(--ease-soft);
      text-align: left;
    }
    .tm__capsule:hover {
      transform: scale(1.04);
      border-color: var(--gold-500);
      border-style: dashed;
      box-shadow: var(--shadow-lg);
    }
    .tm__avatar {
      position: relative;
      width: 52px;
      height: 52px;
      border-radius: 999px;
      overflow: hidden;
      flex: none;
      border: 1px solid var(--line);
      background: var(--paper-2);
      transition: border-color 0.25s var(--ease-soft);
    }
    .tm__capsule:hover .tm__avatar {
      border-color: var(--gold-500);
    }
    .tm__avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
    }
    .tm__initials {
      display: grid;
      place-items: center;
      width: 100%;
      height: 100%;
      font-family: var(--font-display);
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--navy-900);
    }
    .tm__meta {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      min-width: 0;
    }
    .tm__name {
      font-size: var(--fs-body);
      font-weight: 700;
      color: var(--navy-900);
      white-space: nowrap;
    }
    .tm__role {
      font-size: var(--fs-small);
      color: var(--text-dim);
      white-space: nowrap;
    }

    /* Modale */
    .tm__modal {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      animation: tm-fade-in 0.2s var(--ease-soft);
    }
    .tm__backdrop {
      position: absolute;
      inset: 0;
      background: rgba(10, 31, 77, 0.35);
      backdrop-filter: blur(8px);
    }
    .tm__card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 520px;
      background: var(--paper);
      color: var(--navy-900);
      border: 2px solid var(--gold-500);
      border-radius: var(--r-lg);
      padding: clamp(1.75rem, 4vw, 2.5rem);
      box-shadow: var(--shadow-lg);
      animation: tm-scale-in 0.25s var(--ease-soft);
    }
    .tm__close {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 999px;
      background: var(--paper-2);
      color: var(--text-dim);
      border: var(--border);
      transition:
        color 0.2s var(--ease-soft),
        background 0.2s var(--ease-soft);
    }
    .tm__close:hover {
      color: var(--navy-900);
      background: var(--paper-3);
    }
    .tm__quote {
      font-family: var(--font-display);
      font-size: clamp(1.15rem, 3vw, 1.5rem);
      line-height: 1.45;
      letter-spacing: -0.01em;
      margin: 0 0 1.75rem;
      padding-right: 1.5rem;
    }
    .tm__author {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .tm__author-avatar {
      width: 56px;
      height: 56px;
      border-radius: 999px;
      overflow: hidden;
      border: 2px solid var(--gold-500);
      background: var(--paper-2);
      flex: none;
    }
    .tm__author-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
    }
    .tm__author-initials {
      display: grid;
      place-items: center;
      width: 100%;
      height: 100%;
      font-family: var(--font-display);
      font-weight: 700;
      color: var(--navy-900);
    }
    .tm__author-meta {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }
    .tm__author-name {
      font-size: var(--fs-h3);
      color: var(--navy-900);
    }
    .tm__author-role {
      font-size: var(--fs-small);
      color: var(--text-dim);
    }
    @keyframes tm-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes tm-scale-in {
      from {
        opacity: 0;
        transform: translateY(16px) scale(0.97);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .tm__modal,
      .tm__card {
        animation: none;
      }
    }
  `,
})
export class TemoignagesHomeComponent {
  protected readonly rows = this.buildRows();
  protected readonly selected = signal<Temoignage | null>(null);
  private readonly modalRef = viewChild<ElementRef<HTMLElement>>('modal');
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    // Rien à lancer côté serveur ; les animations sont CSS-only.
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.selected()) {
      this.close();
    }
  }

  protected open(t: Temoignage): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.selected.set(t);
    document.body.style.overflow = 'hidden';
  }

  protected close(): void {
    this.selected.set(null);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  protected onBackdropClick(event: MouseEvent): void {
    const modal = this.modalRef()?.nativeElement;
    if (modal && event.target === modal) {
      this.close();
    }
  }

  private buildRows(): Temoignage[][] {
    const t = TEMOIGNAGES;
    // Répartition en 3 rangées avec retour au début pour combler si nécessaire.
    return [
      [t[0], t[1]],
      [t[2], t[3]],
      [t[4], t[0]],
    ];
  }
}
