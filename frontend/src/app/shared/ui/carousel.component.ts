import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { IconComponent } from './icon.component';

/**
 * Carrousel à défilement natif : scroll-snap pour le geste, deux boutons pour la souris,
 * et des points de position. Pas de bibliothèque — le navigateur fait le travail.
 */
@Component({
  selector: 'sji-carousel',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cr">
      <div #track class="cr__track" tabindex="0" role="group" [attr.aria-label]="label()" data-lenis-prevent>
        <ng-content />
      </div>

      <div class="cr__bar">
        <div class="cr__dots" aria-hidden="true">
          @for (d of dots(); track $index) {
            <span class="cr__dot" [class.is-on]="$index === active()"></span>
          }
        </div>
        <div class="cr__nav">
          <button type="button" class="cr__btn" aria-label="Voir les éléments précédents" [disabled]="atStart()" (click)="scrollBy(-1)">
            <sji-icon name="arrow-right" [size]="20" class="cr__prev" />
          </button>
          <button type="button" class="cr__btn" aria-label="Voir les éléments suivants" [disabled]="atEnd()" (click)="scrollBy(1)">
            <sji-icon name="arrow-right" [size]="20" />
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .cr__track {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: minmax(260px, 86%);
      gap: var(--sp-4);
      overflow-x: auto;
      overscroll-behavior-x: contain;
      scroll-snap-type: x mandatory;
      scroll-padding-inline: 0;
      padding-bottom: var(--sp-2);
      scrollbar-width: none;
    }
    .cr__track::-webkit-scrollbar {
      display: none;
    }
    .cr__track > * {
      scroll-snap-align: start;
    }
    .cr__track:focus-visible {
      outline: 2px solid var(--gold-700);
      outline-offset: 4px;
    }
    .cr__bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--sp-6);
      margin-top: var(--sp-6);
    }
    .cr__dots {
      display: flex;
      gap: 0.4rem;
    }
    .cr__dot {
      width: 22px;
      height: 4px;
      border-radius: var(--r-full);
      background: var(--line);
      transition: background-color var(--d-fast);
    }
    .cr__dot.is-on {
      background: var(--gold-500);
    }
    .cr__nav {
      display: flex;
      gap: 0.5rem;
    }
    .cr__btn {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border: var(--border-strong);
      border-radius: 50%;
      background: transparent;
      color: var(--navy-900);
    }
    .cr__btn:hover:not(:disabled) {
      background: var(--gold-500);
      border-color: var(--gold-500);
    }
    .cr__btn:disabled {
      opacity: 0.35;
      cursor: default;
    }
    .cr__prev {
      transform: rotate(180deg);
    }
    :host-context(.on-navy) .cr__btn {
      color: #fff;
      border-color: rgba(255, 255, 255, 0.3);
    }
    :host-context(.on-navy) .cr__btn:hover:not(:disabled) {
      color: var(--navy-900);
    }
    :host-context(.on-navy) .cr__dot {
      background: rgba(255, 255, 255, 0.25);
    }
    @media (min-width: 640px) {
      .cr__track {
        grid-auto-columns: minmax(260px, 46%);
      }
    }
    @media (min-width: 1024px) {
      .cr__track {
        grid-auto-columns: minmax(260px, 31.5%);
      }
    }
  `,
})
export class CarouselComponent {
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly destroyRef = inject(DestroyRef);

  readonly label = () => 'Carrousel';
  protected readonly active = signal(0);
  protected readonly dots = signal<number[]>([]);
  protected readonly atStart = signal(true);
  protected readonly atEnd = signal(false);

  constructor() {
    afterNextRender(() => {
      const el = this.track().nativeElement;
      const update = () => {
        const page = this.pageWidth(el);
        const pages = Math.max(1, Math.round(el.scrollWidth / page));
        this.dots.set(Array.from({ length: Math.min(pages, 8) }, (_, i) => i));
        this.active.set(Math.round(el.scrollLeft / page));
        this.atStart.set(el.scrollLeft < 8);
        this.atEnd.set(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
      };
      update();
      el.addEventListener('scroll', update, { passive: true });
      const ro = new ResizeObserver(update);
      ro.observe(el);
      this.destroyRef.onDestroy(() => {
        el.removeEventListener('scroll', update);
        ro.disconnect();
      });
    });
  }

  protected scrollBy(dir: 1 | -1): void {
    const el = this.track().nativeElement;
    el.scrollBy({ left: dir * this.pageWidth(el), behavior: 'smooth' });
  }

  /** Largeur d'une carte plus l'écart : un clic avance d'exactement un élément. */
  private pageWidth(el: HTMLElement): number {
    const first = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap || '0') || 0;
    return (first?.offsetWidth ?? el.clientWidth) + gap;
  }
}
