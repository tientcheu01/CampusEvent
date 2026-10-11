import { ChangeDetectionStrategy, Component } from '@angular/core';

/** L'arc : cercle ouvert de 1,5 px en --blue-200, qui sort toujours du cadre (repris de l'arc du logo). */
@Component({
  selector: 'sji-arc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <circle cx="200" cy="200" r="198" fill="none" stroke="#bbd0f7" stroke-width="1.5" stroke-dasharray="1050 200" stroke-linecap="round" vector-effect="non-scaling-stroke" />
    </svg>
  `,
  styles: `
    :host {
      display: block;
      pointer-events: none;
    }
    svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }
  `,
})
export class ArcComponent {}
