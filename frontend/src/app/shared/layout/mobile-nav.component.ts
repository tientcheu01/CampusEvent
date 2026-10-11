import { ChangeDetectionStrategy, Component, ElementRef, HostListener, effect, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NAV } from '../../core/data/site-data';
import { ConcoursDatesService } from '../../core/services/concours-dates.service';
import { ButtonComponent } from '../ui/button.component';

/**
 * Menu mobile : panneau plein écran BLANC qui glisse depuis la droite, rubriques en display 32 px
 * numérotées 01–05, filet tricolore en haut, bouton or fixé en bas. Pas de hamburger en croix.
 */
@Component({
  selector: 'sji-mobile-nav',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mn dots" id="menu-mobile" role="dialog" aria-modal="true" aria-label="Menu" [class.mn--open]="open()" [attr.inert]="open() ? null : ''" data-lenis-prevent>
      <span class="tricolor" aria-hidden="true"></span>
      <nav class="mn__nav" aria-label="Navigation mobile">
        <ol class="mn__list" role="list">
          @for (item of nav; track item.path; let i = $index) {
            <li>
              <a class="mn__link" [routerLink]="item.path" (click)="closed.emit()">
                <span class="mn__num num">0{{ i + 1 }}</span>
                <span class="mn__label">{{ item.label }}</span>
              </a>
            </li>
          }
        </ol>
      </nav>
      <div class="mn__foot">
        <a sjiButton [arrow]="true" [routerLink]="dates.cta().link" [fragment]="dates.cta().fragment" (click)="closed.emit()">{{ dates.cta().label }}</a>
      </div>
    </div>
  `,
  styles: `
    .mn {
      position: fixed;
      inset: 0;
      z-index: 1;
      display: flex;
      flex-direction: column;
      padding: 96px var(--gutter) var(--sp-8);
      background-color: var(--paper);
      overflow-y: auto;
      overscroll-behavior: contain;
      transform: translateX(100%);
      visibility: hidden;
      transition:
        transform var(--d-slow) var(--ease-in-out),
        visibility 0s linear var(--d-slow);
    }
    .mn--open {
      transform: none;
      visibility: visible;
      transition-delay: 0s;
    }
    /* Sous la barre : le filet tricolore ferme l'en-tête au lieu de passer dessous. */
    .tricolor {
      position: absolute;
      top: 64px;
      left: 0;
      right: 0;
    }
    .mn__nav {
      flex: 1;
    }
    .mn__list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .mn__link {
      display: flex;
      align-items: baseline;
      gap: var(--sp-4);
      padding: var(--sp-3) 0;
      text-decoration: none;
      color: var(--navy-900);
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 1.625rem;
      letter-spacing: -0.03em;
      border-bottom: var(--border);
    }
    .mn__num {
      font-size: var(--fs-label);
      color: var(--blue-600);
    }
    .mn__foot {
      position: sticky;
      bottom: 0;
      padding-top: var(--sp-6);
      background: linear-gradient(to top, var(--paper) 70%, transparent);
    }
    .mn__foot a {
      width: 100%;
    }
    @media (min-width: 1024px) {
      .mn {
        display: none;
      }
    }
  `,
})
export class MobileNavComponent {
  readonly open = input(false);
  readonly closed = output<void>();
  protected readonly nav = NAV;
  protected readonly dates = inject(ConcoursDatesService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    // À l'ouverture, le focus entre dans le panneau.
    effect(() => {
      if (this.open()) queueMicrotask(() => this.host.nativeElement.querySelector<HTMLElement>('.mn__link')?.focus());
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) this.closed.emit();
  }
}
