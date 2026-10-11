import { ChangeDetectionStrategy, Component } from '@angular/core';

/** L'ampoule du logo, en SVG : contour bleu nuit, cœur doré, filament. Posée sur un halo très doux. */
@Component({
  selector: 'sji-bulb',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="halo"></div>
    <svg viewBox="-14 -14 112 148" aria-hidden="true" focusable="false">
      <g class="rays" stroke="#f8a91b" stroke-width="2" stroke-linecap="round" vector-effect="non-scaling-stroke">
        <path d="M42 -10v-4M16 -4l-3-3M68 -4l3-3M-4 22h-6M88 22h6" />
      </g>
      <path
        class="glass"
        d="M42 4C20.5 4 4 20.5 4 41c0 13.5 7 22.5 15 30 4 3.8 6 7.5 6 12v6h34v-6c0-4.5 2-8.2 6-12 8-7.5 15-16.5 15-30C80 20.5 63.5 4 42 4Z"
        fill="#f8a91b"
        fill-opacity=".92"
      />
      <path
        d="M42 4C20.5 4 4 20.5 4 41c0 13.5 7 22.5 15 30 4 3.8 6 7.5 6 12v6h34v-6c0-4.5 2-8.2 6-12 8-7.5 15-16.5 15-30C80 20.5 63.5 4 42 4ZM28 96h28M32 106h20M36 114h12"
        fill="none"
        stroke="#0a1f4d"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />
      <path d="M30 52l12 14 12-14M42 66v18" fill="none" stroke="#0a1f4d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
    </svg>
  `,
  styles: `
    :host {
      position: relative;
      display: block;
    }
    .halo {
      position: absolute;
      inset: -30%;
      background: var(--glow-gold);
    }
    svg {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: visible;
    }
  `,
})
export class BulbComponent {}
