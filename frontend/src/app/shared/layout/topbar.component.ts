import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTACT, SOCIAL } from '../../core/data/site-data';
import { IconComponent, IconName } from '../ui/icon.component';

/** Bandeau de contact au-dessus de la navigation : téléphone, e-mail, lieu, puis les réseaux sur un coin doré. */
@Component({
  selector: 'sji-topbar',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tb">
      <div class="container tb__in">
        <ul class="tb__list" role="list">
          <li><a [href]="'tel:' + c.phones[0].tel"><sji-icon name="phone" /><span class="tnum">{{ c.phones[0].display }}</span></a></li>
          <li><a [href]="'mailto:' + c.email"><sji-icon name="mail" /><span>{{ c.email }}</span></a></li>
          <li class="tb__place"><sji-icon name="pin" /><span>{{ c.address }}</span></li>
        </ul>
        <div class="tb__social">
          @for (s of social; track s.label) {
            <a [href]="s.url" target="_blank" rel="noopener noreferrer" [attr.aria-label]="s.label + ' SJI INNOVA'"><sji-icon [name]="icon(s.label)" /></a>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    .tb {
      background: var(--navy-900);
      color: #fff;
      font-size: var(--fs-label);
      height: 40px;
    }
    .tb__in {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--sp-6);
    }
    .tb__list {
      display: flex;
      align-items: center;
      gap: var(--sp-6);
      margin: 0;
      padding: 0;
      list-style: none;
      min-width: 0;
    }
    .tb__list li,
    .tb__list a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: inherit;
      text-decoration: none;
      white-space: nowrap;
    }
    .tb__list a:hover {
      color: var(--gold-500);
    }
    sji-icon {
      color: var(--gold-500);
    }
    .tb__place {
      display: none;
    }
    /* Le coin doré des réseaux, repris du bandeau de référence. */
    .tb__social {
      display: flex;
      align-items: center;
      align-self: stretch;
      gap: 0.25rem;
      padding-inline: var(--sp-6);
      margin-right: calc(var(--sp-6) * -1);
      background: var(--gold-500);
      clip-path: polygon(14px 0, 100% 0, 100% 100%, 0 100%);
    }
    .tb__social a {
      display: grid;
      place-items: center;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      text-decoration: none;
    }
    .tb__social sji-icon {
      color: var(--navy-900);
    }
    .tb__social a:hover {
      background: var(--navy-900);
    }
    .tb__social a:hover sji-icon {
      color: var(--gold-500);
    }
    @media (max-width: 767px) {
      .tb {
        display: none;
      }
    }
    @media (min-width: 1100px) {
      .tb__place {
        display: flex;
      }
    }
  `,
})
export class TopbarComponent {
  protected readonly c = CONTACT;
  protected readonly social = SOCIAL;
  protected icon(label: string): IconName {
    return label.toLowerCase() as IconName;
  }
}
