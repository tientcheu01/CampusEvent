import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ConcoursDatesService } from '../../core/services/concours-dates.service';

/** Compte à rebours narratif : une phrase qui change de ton selon la phase (5 états pilotés par les dates). */
@Component({
  selector: 'sji-countdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (dates.countdown(); as c) {
      <p class="cd" [class.cd--large]="size() === 'large'" role="timer" [attr.aria-label]="dates.countdownLabel()">
        {{ c.before }}
        @if (c.n !== null) {
          <strong class="tnum">{{ c.n }}&nbsp;{{ c.unit }}</strong>
        }
        @if (c.after) {
          {{ c.after }}
        }
      </p>
    }
  `,
  styles: `
    .cd {
      margin: 0;
      font-family: var(--font-mono);
      font-size: var(--fs-label);
      letter-spacing: 0.04em;
      color: var(--text-dim);
      line-height: 1.5;
    }
    .cd strong {
      color: var(--navy-900);
      font-weight: 700;
    }
    .cd--large {
      font-family: var(--font-display);
      font-size: var(--fs-h3);
      letter-spacing: -0.02em;
      color: var(--blue-200);
    }
    .cd--large strong {
      color: var(--gold-500); /* bloc nuit : l'or redevient utilisable en texte */
    }
    :host-context(.compact) .cd {
      font-size: 0.6875rem;
    }
  `,
})
export class CountdownComponent {
  protected readonly dates = inject(ConcoursDatesService);
  readonly size = input<'base' | 'large'>('base');
}
