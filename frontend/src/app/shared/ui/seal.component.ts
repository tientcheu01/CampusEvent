import { ChangeDetectionStrategy, Component, input } from '@angular/core';

let uid = 0;

/** Pastille circulaire à texte tournant, posée à cheval sur les images. */
@Component({
  selector: 'sji-seal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <circle cx="60" cy="60" r="59" class="seal__disc" />
      <defs><path [attr.id]="id" fill="none" d="M60 16a44 44 0 1 1 0 88 44 44 0 1 1 0-88" /></defs>
      <text class="seal__text"><textPath [attr.href]="'#' + id" startOffset="0">{{ text() }}</textPath></text>
      <path class="seal__arrow" d="M51 69 69 51M56 51h13v13" />
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
      animation: spin 22s linear infinite;
    }
    .seal__disc {
      fill: var(--navy-900);
    }
    .seal__text {
      fill: var(--gold-500);
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
    }
    .seal__arrow {
      fill: none;
      stroke: var(--gold-500);
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-linejoin: round;
      transform-origin: 60px 60px;
      animation: spin 22s linear infinite reverse;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      svg,
      .seal__arrow {
        animation: none;
      }
    }
  `,
})
export class SealComponent {
  readonly text = input('SJI INNOVA · 2ᵉ ÉDITION · YAOUNDÉ · ');
  protected readonly id = `seal-${uid++}`;
}
