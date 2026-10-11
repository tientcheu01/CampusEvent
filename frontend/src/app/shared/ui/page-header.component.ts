import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ArcComponent } from './arc.component';
import { SectionLabelComponent } from './section-label.component';

/**
 * Ouverture commune à toutes les pages secondaires : 320 px, fond --paper-2 + trame de points, arc bleu pâle
 * qui sort du cadre, étiquette mono, titre display, filet tricolore en bas. Seul le contenu change.
 */
@Component({
  selector: 'sji-page-header',
  standalone: true,
  imports: [ArcComponent, SectionLabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="ph dots">
      <sji-arc class="ph__arc" />
      <div class="container ph__inner">
        <sji-section-label [num]="num()" [text]="label()" />
        <h1 class="h1 ph__title"><ng-content /></h1>
      </div>
      <span class="tricolor" aria-hidden="true"></span>
    </header>
  `,
  styles: `
    .ph {
      position: relative;
      overflow: hidden;
      min-height: 320px;
      display: flex;
      align-items: flex-end;
      padding: calc(var(--header-h) + var(--sp-8)) 0 var(--sp-12);
      background-color: var(--paper-2);
    }
    .ph__arc {
      position: absolute;
      right: -14%;
      top: -60%;
      width: min(70vw, 620px);
      aspect-ratio: 1;
    }
    .ph__inner {
      display: grid;
      gap: var(--sp-6);
    }
    .ph__title {
      max-width: 18ch;
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
}
