import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TempsFort } from '../../core/data/site-data';
import { ConcoursDatesService } from '../../core/services/concours-dates.service';
import { fr } from '../../core/data/site-data';

/**
 * Calendrier du concours : trois temps forts à angles droits, séparés par des filets.
 * Horizontal en desktop, vertical en mobile. Une barre fine montre où l'on en est aujourd'hui,
 * calculée depuis la date courante : le site est vivant.
 */
@Component({
  selector: 'sji-timeline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tl" [class.tl--vertical]="orientation() === 'vertical'">
      <div class="tl__bar" aria-hidden="true"><i [style.transform]="'scale(' + progress() + ',1)'"></i></div>
      <div class="tl__bar tl__bar--v" aria-hidden="true"><i [style.transform]="'scale(1,' + progress() + ')'"></i></div>
      <ol class="tl__list" role="list">
        @for (item of items(); track item.titre; let i = $index) {
          <li class="tl__item" [class.tl__item--now]="current() === i" [class.tl__item--finale]="i === items().length - 1">
            <span class="tl__num num">0{{ i + 1 }}</span>
            <h3 class="tl__title">{{ item.titre }}</h3>
            <p class="tl__dates label">{{ fr(item.dates) }}</p>
            <p class="tl__text">{{ item.texte }}</p>
          </li>
        }
      </ol>
    </div>
  `,
  styles: `
    .tl {
      position: relative;
      padding-top: var(--sp-6);
    }
    .tl__bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--line);
    }
    .tl__bar i {
      display: block;
      height: 100%;
      background: var(--gold-500);
      transform-origin: 0 0;
    }
    .tl__bar--v {
      display: none;
    }
    .tl__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      border: var(--border);
      background: var(--paper);
    }
    .tl__item {
      position: relative;
      padding: var(--sp-8);
      border-top: var(--border);
    }
    .tl__item:first-child {
      border-top: 0;
    }
    .tl__num {
      display: block;
      font-size: 2.5rem;
      line-height: 1;
      color: var(--blue-200);
    }
    .tl__item--now {
      box-shadow: inset 0 3px 0 var(--gold-500);
    }
    .tl__item--now .tl__num {
      color: var(--gold-700);
    }
    .tl__title {
      margin: var(--sp-6) 0 var(--sp-3);
      font-family: var(--font-display);
      font-weight: 800;
      font-size: var(--fs-h3);
      line-height: 1.1;
      letter-spacing: -0.02em;
    }
    .tl__dates {
      margin: 0 0 var(--sp-4);
      color: var(--blue-600);
    }
    .tl__text {
      margin: 0;
      color: var(--text-dim);
    }
    .tl__item--finale {
      background: var(--paper-3);
    }
    .tl__item--finale .tl__title {
      font-size: var(--fs-h2);
    }

    @media (max-width: 1023px) {
      .tl {
        padding: 0 0 0 var(--sp-6);
      }
      .tl__bar {
        display: none;
      }
      .tl__bar--v {
        display: block;
        top: 0;
        bottom: 0;
        left: 0;
        right: auto;
        width: 3px;
        height: auto;
      }
      .tl__bar--v i {
        width: 100%;
        height: 100%;
      }
    }
    @media (min-width: 1024px) {
      .tl:not(.tl--vertical) .tl__list {
        grid-template-columns: 1fr 1fr 1.4fr;
      }
      .tl:not(.tl--vertical) .tl__item {
        border-top: 0;
        border-left: var(--border);
      }
      .tl:not(.tl--vertical) .tl__item:first-child {
        border-left: 0;
      }
    }
  `,
})
export class TimelineComponent {
  readonly items = input.required<TempsFort[]>();
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  private readonly dates = inject(ConcoursDatesService);
  protected readonly fr = fr;
  protected readonly progress = computed(() => this.dates.progress());
  protected readonly current = computed(() => {
    switch (this.dates.phase()) {
      case 'depots':
        return 0;
      case 'evaluation':
        return 1;
      case 'vers-finale':
      case 'apres':
        return 2;
      default:
        return -1;
    }
  });
}
