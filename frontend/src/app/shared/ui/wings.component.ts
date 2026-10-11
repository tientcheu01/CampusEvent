import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Les lames d'aile : motif signature tiré du logo. Trois à cinq formes allongées, légèrement courbes,
 * en --blue-500 à 6–10 % d'opacité. Toujours en arrière-plan, jamais dorées, jamais de texte dessus.
 */
@Component({
  selector: 'sji-wings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 640 640" aria-hidden="true" focusable="false" preserveAspectRatio="xMinYMax meet">
      <g [attr.fill-opacity]="opacity()" fill="#2e6be6">
        <path d="M30 620C110 430 300 200 620 40 500 220 320 430 30 620Z" />
        <path d="M30 620C150 470 330 300 600 190 480 330 300 480 30 620Z" />
        <path d="M30 620C190 520 360 410 610 350 470 450 290 550 30 620Z" />
        <path d="M30 620C90 400 230 190 440 10 400 210 270 420 30 620Z" />
        <path d="M30 620C60 430 140 250 260 70 270 250 190 450 30 620Z" />
      </g>
    </svg>
  `,
  styles: `
    :host {
      display: block;
      pointer-events: none;
      user-select: none;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `,
})
export class WingsComponent {
  readonly opacity = input(0.08);
}
