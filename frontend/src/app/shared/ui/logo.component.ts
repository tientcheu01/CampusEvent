import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Logo SJI INNOVA, version horizontale.
 * La marque utilise le visuel officiel de l'évènement ; le wordmark reste en texte HTML
 * pour conserver une excellente lisibilité dans l'en-tête et le pied de page.
 */
@Component({
  selector: 'sji-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.logo--light]': 'tone() === "light"' },
  template: `
    <span class="mark"><img src="/logosjiinnova-removebg-preview.png" alt="" width="532" height="434" /></span>
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
      display: grid;
      width: 48px;
      height: 40px;
      place-items: center;
    }
    .mark img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    :host(.logo--light) .mark img {
      filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.9));
    }
    .word {
      position: relative;
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 1.25rem;
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
