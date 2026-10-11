import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Logo SJI INNOVA, version horizontale.
 * À REMPLACER par le fichier vectoriel officiel (la marque ci-dessous en est une reconstitution
 * simplifiée : ampoule + flèche dorée). Le wordmark est du texte HTML, pas une image.
 */
@Component({
  selector: 'sji-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.logo--light]': 'tone() === "light"' },
  template: `
    <svg class="mark" viewBox="0 0 84 120" aria-hidden="true" focusable="false">
      <path
        d="M42 4C20.5 4 4 20.5 4 41c0 13.5 7 22.5 15 30 4 3.8 6 7.5 6 12v6h34v-6c0-4.5 2-8.2 6-12 8-7.5 15-16.5 15-30C80 20.5 63.5 4 42 4Z"
        fill="#f8a91b"
      />
      <path d="M28 96h28M32 106h20M36 114h12M30 52l12 14 12-14M42 66v18" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <span class="word"><span>SJI</span>&nbsp;<span class="innova">INNOVA</span></span>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.625rem;
      color: var(--navy-900);
      line-height: 1;
    }
    :host(.logo--light) {
      color: #fff;
    }
    .mark {
      width: 26px;
      height: 37px;
    }
    .word {
      position: relative;
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 1.5rem;
      letter-spacing: -0.02em;
      padding-bottom: 6px;
    }
    .innova {
      position: relative;
    }
    .innova::after {
      content: '';
      position: absolute;
      left: -2%;
      right: -4%;
      bottom: -6px;
      height: 3px;
      background: var(--gold-500);
      transform: skewX(-24deg);
      transform-origin: left;
    }
  `,
})
export class LogoComponent {
  readonly tone = input<'dark' | 'light'>('dark');
}
