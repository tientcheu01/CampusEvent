import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Lueur dorée fixe, très discrète. Position et intensité viennent de GlowService (--glow-x/y/i). */
@Component({
  selector: 'sji-glow-layer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="glow" aria-hidden="true"></div>`,
  styles: `
    :host {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
    }
    .glow {
      position: absolute;
      top: 0;
      left: 0;
      width: min(90vw, 900px);
      aspect-ratio: 1;
      background: var(--glow-gold);
      opacity: calc(var(--glow-i) / 0.22);
      transform: translate3d(calc(var(--glow-x) * 1vw - 50%), calc(var(--glow-y) * 1vh - 50%), 0);
      will-change: transform;
    }
  `,
})
export class GlowLayerComponent {}
