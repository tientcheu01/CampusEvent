import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PUBLICS } from '../../core/data/site-data';

/** Le schéma des quatre publics réunis autour du concours, repris du dossier de partenariat (SVG animé). */
@Component({
  selector: 'sji-publics-schema',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="ps">
      <svg viewBox="-40 -10 600 390" role="img" aria-labelledby="ps-t">
        <title id="ps-t">Quatre publics réunis autour de SJI INNOVA : {{ publics.join(', ') }}</title>
        @for (n of nodes; track n.label; let i = $index) {
          <line class="ps__ln" [style.animation-delay]="0.2 + i * 0.15 + 's'" pathLength="1" [attr.x1]="260" [attr.y1]="180" [attr.x2]="n.x" [attr.y2]="n.y" />
        }
        <circle class="ps__core" cx="260" cy="180" r="54" />
        <text class="ps__brand" x="260" y="176" text-anchor="middle">SJI</text>
        <text class="ps__brand" x="260" y="198" text-anchor="middle">INNOVA</text>
        @for (n of nodes; track n.label; let i = $index) {
          <g class="ps__node" [style.animation-delay]="0.5 + i * 0.15 + 's'">
            <circle [attr.cx]="n.x" [attr.cy]="n.y" r="9" />
            <text [attr.x]="n.x" [attr.y]="n.y + n.dy" [attr.text-anchor]="n.anchor">{{ n.label }}</text>
          </g>
        }
      </svg>
    </figure>
  `,
  styles: `
    .ps {
      margin: 0;
    }
    svg {
      width: 100%;
      max-width: 560px;
      height: auto;
      overflow: visible;
    }
    .ps__ln {
      stroke: var(--blue-200);
      stroke-width: 1.5;
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      animation: ln 0.9s var(--ease-out) forwards;
    }
    .ps__core {
      fill: var(--paper-3);
      stroke: var(--navy-900);
      stroke-width: 1.5;
    }
    .ps__brand {
      font: 800 17px var(--font-display);
      fill: var(--navy-900);
      letter-spacing: -0.02em;
    }
    .ps__node circle {
      fill: var(--gold-500);
    }
    .ps__node text {
      font: 500 15px var(--font-body);
      fill: var(--navy-900);
    }
    .ps__node {
      animation: pop 0.6s var(--ease-out) both;
    }
    @keyframes ln {
      to {
        stroke-dashoffset: 0;
      }
    }
    @keyframes pop {
      from {
        opacity: 0;
      }
    }
  `,
})
export class PublicsSchemaComponent {
  protected readonly publics = PUBLICS;
  protected readonly nodes = [
    { label: PUBLICS[0], x: 70, y: 70, dy: -18, anchor: 'start' },
    { label: PUBLICS[1], x: 450, y: 70, dy: -18, anchor: 'end' },
    { label: PUBLICS[2], x: 40, y: 300, dy: 32, anchor: 'start' },
    { label: PUBLICS[3], x: 480, y: 300, dy: 32, anchor: 'end' },
  ];
}
