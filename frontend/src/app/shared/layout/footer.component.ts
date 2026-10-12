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
        <span class="ft__credit">Website by Tientcheu Siani Joel Marvin</span>
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
      color: var(--gold-500);
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
