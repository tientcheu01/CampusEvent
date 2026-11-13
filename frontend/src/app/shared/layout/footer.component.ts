import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTACT, NAV, SOCIAL } from '../../core/data/site-data';
import { LogoComponent } from '../ui/logo.component';
import { WingsComponent } from '../ui/wings.component';

/** Pied de page : le second des deux seuls blocs bleu nuit. Texte blanc, l'or redevient utilisable en texte. */
@Component({
  selector: 'sji-footer',
  standalone: true,
  imports: [RouterLink, LogoComponent, WingsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="ft tint-navy dots-light on-navy">
      <sji-wings class="ft__wings" [opacity]="0.2" />
      <div class="container ft__grid">
        <div class="ft__brand">
          <a routerLink="/" aria-label="SJI INNOVA 2027, accueil"><sji-logo tone="light" /></a>
          <p class="ft__baseline">Le concours d'innovation étudiante de Saint Jean Ingénieur.</p>
          <p class="ft__addr">{{ contact.address }}</p>
        </div>

        <nav class="ft__col" aria-label="Pied de page">
          <h2 class="ft__title label">Navigation</h2>
          <ul role="list">
            @for (item of nav; track item.path) {
              <li><a [routerLink]="item.path">{{ item.label }}</a></li>
            }
            <li><a routerLink="/deposer">Déposer un projet</a></li>
          </ul>
        </nav>

        <div class="ft__col">
          <h2 class="ft__title label">Contacts</h2>
          <ul role="list">
            @for (p of contact.phones; track p.tel) {
              <li><a [href]="'tel:' + p.tel">{{ p.display }}</a></li>
            }
            <li><a [href]="'mailto:' + contact.email">{{ contact.email }}</a></li>
          </ul>
        </div>

        <div class="ft__col">
          <h2 class="ft__title label">Réseaux</h2>
          <ul role="list">
            @for (s of social; track s.label) {
              <li><a [href]="s.url" target="_blank" rel="noopener noreferrer">{{ s.label }} <span class="ft__handle">{{ s.handle }}</span></a></li>
            }
          </ul>
          <p class="ft__tag num">{{ contact.hashtag }}</p>
        </div>
      </div>
      <div class="ft__legal container">
        <span>© 2027 SJI INNOVA · Saint Jean Ingénieur, Yaoundé</span>
        <span class="ft__credit">
          Website by Tientcheu Siani Joel Marvin
          <a
            class="ft__credit-icon"
            href="https://www.linkedin.com/in/jo%C3%ABl-marvin-tientcheu-siani-8911992ba/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Profil LinkedIn de Tientcheu Siani Joel Marvin"
            title="LinkedIn — Tientcheu Siani Joel Marvin"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          </a>
          <a
            class="ft__credit-icon"
            href="mailto:tientcheu.joel@saintjeaningenieur.org"
            aria-label="Envoyer un e-mail à Tientcheu Siani Joel Marvin"
            title="tientcheu.joel@saintjeaningenieur.org"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </a>
          <a
            class="ft__credit-icon"
            href="https://wa.me/237621377523"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contacter Tientcheu Siani Joel Marvin sur WhatsApp"
            title="WhatsApp — +237 621 377 523"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2m5.81 14.08c-.24.68-1.42 1.3-1.95 1.38-.51.08-1.15.11-1.85-.11-.43-.14-.98-.32-1.69-.63-2.98-1.29-4.92-4.29-5.07-4.49-.15-.2-1.21-1.61-1.21-3.07 0-1.46.76-2.18 1.03-2.48.27-.3.59-.38.79-.38.2 0 .4 0 .57.01.18.01.43-.07.67.51.25.6.84 2.06.92 2.21.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.18-.31.4-.45.54-.15.15-.31.31-.13.62.18.31.79 1.3 1.7 2.11 1.17 1.04 2.15 1.37 2.46 1.52.31.15.49.13.67-.08.18-.2.77-.9.98-1.21.21-.31.41-.26.69-.15.28.1 1.78.84 2.09.99.31.15.51.23.59.35.07.13.07.74-.17 1.42z" />
            </svg>
          </a>
        </span>
      </div>
      <span class="tricolor" aria-hidden="true"></span>
    </footer>
  `,
  styles: `
    .ft {
      position: relative;
      overflow: hidden;
      padding-top: var(--sp-24);
      color: #fff;
    }
    .ft__wings {
      position: absolute;
      right: -6%;
      top: -10%;
      width: min(60vw, 720px);
      transform: scaleX(-1);
      z-index: 0;
    }
    .ft__grid {
      display: grid;
      gap: var(--sp-12) var(--sp-8);
      grid-template-columns: 1fr;
    }
    .ft__baseline {
      margin-top: var(--sp-6);
      max-width: 28ch;
      color: var(--blue-200);
    }
    .ft__addr {
      margin-top: var(--sp-3);
      color: var(--blue-200);
      font-size: var(--fs-small);
    }
    .ft__title {
      margin: 0 0 var(--sp-6);
      color: var(--gold-500);
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: var(--sp-3);
    }
    a {
      color: #fff;
      overflow-wrap: anywhere;
      text-decoration: none;
      text-underline-offset: 4px;
    }
    a:hover {
      text-decoration: underline;
      text-decoration-color: var(--gold-500);
    }
    .ft__handle {
      color: var(--blue-200);
      font-size: var(--fs-small);
    }
    .ft__tag {
      margin-top: var(--sp-6);
      color: var(--gold-500);
    }
    .ft__legal {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: var(--sp-3) var(--sp-6);
      margin-top: var(--sp-16);
      padding-block: var(--sp-6);
      border-top: 1px solid rgba(255, 255, 255, 0.16);
      font-size: var(--fs-small);
      color: var(--blue-200);
    }
    .ft__credit {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--gold-500);
    }
    .ft__credit-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--gold-500);
      transition: opacity 0.2s ease, transform 0.2s ease;
    }
    .ft__credit-icon:hover {
      opacity: 0.85;
      transform: translateY(-1px);
      text-decoration: none;
    }
    .tricolor {
      display: block;
    }
    @media (min-width: 640px) {
      .ft__grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    @media (min-width: 1024px) {
      .ft__grid {
        grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
      }
    }
  `,
})
export class FooterComponent {
  protected readonly contact = CONTACT;
  protected readonly nav = NAV;
  protected readonly social = SOCIAL;
}
