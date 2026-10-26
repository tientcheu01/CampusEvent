import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from './icon.component';

/**
 * Un seul bouton primaire visible par écran. S'applique à <a> ou <button> :
 *   <a sjiButton routerLink="/deposer">Déposer mon projet</a>
 * La flèche se décale de 4 px au survol : seul micro-mouvement interne autorisé.
 */
@Component({
  selector: 'a[sjiButton], button[sjiButton]',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '"btn btn--" + variant()' },
  template: `<span class="btn__label"><ng-content /></span>
    @if (arrow()) {
      <sji-icon class="btn__arrow" name="arrow-right" />
    }`,
  styles: `
    :host {
      font: 700 1rem/1 var(--font-body);
      padding: 1.0625rem 2rem;
      border-radius: var(--r-full);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.625rem;
      text-decoration: none;
      border: 1px solid transparent;
      cursor: pointer;
      transition:
        transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
        box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
        background-color 0.25s,
        border-color 0.25s;
    }
    :host(.btn--primary) {
      background: var(--gold-500);
      color: var(--navy-900);
      box-shadow: var(--shadow-sm);
    }
    :host(.btn--primary:hover) {
      background: color-mix(in srgb, var(--gold-500) 88%, white);
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
    :host(.btn--ghost) {
      background: transparent;
      color: var(--navy-900);
      border-color: var(--blue-200);
    }
    :host(.btn--ghost:hover) {
      border-color: var(--blue-500);
      background: rgba(46, 107, 230, 0.06);
    }
    :host(.btn--link) {
      padding: 0.25rem 0;
      border-radius: 0;
      color: var(--navy-900);
      background: linear-gradient(currentColor, currentColor) 0 100% / 100% 1px no-repeat;
      transition: background-size 0.35s var(--ease-out);
    }
    :host(.btn--link:hover) {
      background-size: 0 1px;
      background-position: 100% 100%;
    }
    :host([disabled]) {
      opacity: 0.45;
      pointer-events: none;
      box-shadow: none;
    }
    /* aria-disabled : reste survolable (l'infobulle explique ce qui manque) mais ne se soulève plus */
    :host([aria-disabled='true']) {
      opacity: 0.45;
      cursor: not-allowed;
      box-shadow: none;
      transform: none !important;
    }
    :host(:focus-visible) {
      outline: 2px solid var(--gold-700);
      outline-offset: 3px;
    }
    .btn__arrow {
      color: inherit;
      transition: transform 0.25s var(--ease-soft);
    }
    :host(:hover) .btn__arrow {
      transform: translateX(4px);
    }
  `,
})
export class ButtonComponent {
  readonly variant = input<'primary' | 'ghost' | 'link'>('primary');
  readonly arrow = input(false);
}
