import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArcComponent } from './arc.component';
import { IconComponent } from './icon.component';
import { SectionLabelComponent } from './section-label.component';
import { WingsComponent } from './wings.component';

/**
 * Ouverture commune aux pages secondaires : fil d'Ariane, étiquette, titre, accroche,
 * motifs d'aile et arc, filet tricolore. Seul le contenu change d'une page à l'autre.
 */
@Component({
  selector: 'sji-page-header',
  standalone: true,
  imports: [RouterLink, ArcComponent, WingsComponent, IconComponent, SectionLabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="ph dots">
      <sji-arc class="ph__arc" />
      <sji-wings class="ph__wings" [opacity]="0.07" />
      <div class="container ph__inner">
        <nav class="ph__fil" aria-label="Fil d'Ariane">
          <a routerLink="/">Accueil</a>
          <sji-icon name="chevron" [size]="20" />
          <span aria-current="page">{{ label() }}</span>
        </nav>
        <sji-section-label [num]="num()" [text]="label()" />
        <h1 class="h1 ph__title"><ng-content /></h1>
        @if (lead()) {
          <p class="lead ph__lead">{{ lead() }}</p>
        }
      </div>
      <span class="tricolor" aria-hidden="true"></span>
    </header>
  `,
  styles: `
    .ph {
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: flex-end;
      padding: calc(var(--header-total) + var(--sp-10, 2.5rem)) 0 var(--sp-12);
      background-color: var(--paper-2);
    }
    .ph__arc {
      position: absolute;
      right: -12%;
      top: -70%;
      width: min(60vw, 560px);
      aspect-ratio: 1;
    }
    .ph__wings {
      position: absolute;
      right: -4%;
      bottom: -30%;
      width: min(55vw, 620px);
      height: 180%;
      transform: scaleX(-1);
    }
    .ph__inner {
      display: grid;
      gap: var(--sp-4);
    }
    .ph__fil {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      margin-bottom: var(--sp-2);
      font-size: var(--fs-small);
      color: var(--text-dim);
      a {
        color: var(--blue-600);
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
        text-underline-offset: 3px;
      }
      sji-icon {
        color: var(--blue-200);
        transform: rotate(-90deg);
      }
    }
    .ph__title {
      margin: 0;
      max-width: 18ch;
    }
    .ph__lead {
      margin: 0;
      max-width: 54ch;
    }
    .tricolor {
      position: absolute;
      inset: auto 0 0 0;
    }
  `,
})
export class PageHeaderComponent {
  readonly num = input('');
  readonly label = input.required<string>();
  readonly lead = input('');
}
