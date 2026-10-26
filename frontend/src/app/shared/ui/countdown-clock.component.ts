import { ChangeDetectionStrategy, Component, NgZone, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ConcoursDatesService, DATES } from '../../core/services/concours-dates.service';

interface Unit {
  value: number;
  label: string;
}

/** Compte à rebours chiffré (jours / heures / minutes / secondes) posé en carte flottante sous le héro. */
@Component({
  selector: 'sji-countdown-clock',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cc">
      <p class="cc__intro">
        <span class="label">{{ title() }}</span>
        <strong>{{ target() }}</strong>
      </p>
      <ul class="cc__units" role="list" [attr.aria-label]="aria()">
        @for (u of units(); track u.label) {
          <li>
            <span class="cc__val tnum">{{ pad(u.value) }}</span>
            <span class="cc__lab label">{{ u.label }}</span>
          </li>
        }
      </ul>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .cc {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--sp-3) var(--sp-5, 1.25rem);
      padding: var(--sp-4) var(--sp-5, 1.25rem);
      color: #fff;
      background: var(--blue-600);
      border: 1px solid var(--blue-600);
      border-radius: var(--r-lg);
      box-shadow: var(--shadow-lg);
    }
    .cc__intro {
      display: grid;
      gap: 0.35rem;
      margin: 0;
      padding-right: var(--sp-5, 1.25rem);
      border-right: 1px solid rgba(255, 255, 255, 0.28);
    }
    .cc__intro .label {
      color: rgba(255, 255, 255, 0.72);
    }
    .cc__intro strong {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 0.95rem;
      letter-spacing: -0.02em;
      white-space: nowrap;
    }
    .cc__units {
      display: flex;
      flex: 1;
      justify-content: space-between;
      gap: var(--sp-3);
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .cc__units li {
      display: grid;
      gap: 0.25rem;
      justify-items: center;
      min-width: 2.65rem;
    }
    .cc__val {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: clamp(1.45rem, 2.5vw, 2rem);
      line-height: 1;
      letter-spacing: -0.03em;
      color: #fff;
    }
    .cc__lab {
      color: rgba(255, 255, 255, 0.72);
    }
    @media (max-width: 639px) {
      .cc {
        flex-wrap: wrap;
      }
      .cc__intro {
        width: 100%;
        border-right: 0;
        padding-right: 0;
      }
      .cc__units {
        width: 100%;
        gap: var(--sp-2);
      }
      .cc__units li {
        min-width: 2.75rem;
      }
    }
  `,
})
export class CountdownClockComponent {
  private readonly dates = inject(ConcoursDatesService);
  private readonly now = signal(Date.now());

  protected readonly pad = (n: number) => String(Math.max(0, n)).padStart(2, '0');

  /** La date visée dépend de la phase : ouverture, clôture, puis finale. */
  private readonly deadline = computed(() => {
    switch (this.dates.phase()) {
      case 'avant':
        return DATES.ouverture;
      case 'depots':
        return DATES.cloture;
      case 'evaluation':
        return DATES.evalFin;
      default:
        return DATES.finale;
    }
  });

  protected readonly title = computed(() => {
    switch (this.dates.phase()) {
      case 'avant':
        return 'Ouverture des dépôts';
      case 'depots':
        return 'Clôture des dépôts';
      case 'evaluation':
        return 'Résultats de la présélection';
      case 'vers-finale':
        return 'Grande finale';
      default:
        return 'Édition terminée';
    }
  });

  protected readonly target = computed(() => {
    const d = this.deadline();
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Douala' });
  });

  protected readonly units = computed<Unit[]>(() => {
    const ms = Math.max(0, this.deadline().getTime() - this.now());
    const s = Math.floor(ms / 1000);
    return [
      { value: Math.floor(s / 86400), label: 'Jours' },
      { value: Math.floor(s / 3600) % 24, label: 'Heures' },
      { value: Math.floor(s / 60) % 60, label: 'Min' },
      { value: s % 60, label: 'Sec' },
    ];
  });

  protected readonly aria = computed(() => `${this.title()} : ${this.units().map((u) => `${u.value} ${u.label}`).join(', ')}`);

  constructor() {
    const zone = inject(NgZone);
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      zone.runOutsideAngular(() => setInterval(() => zone.run(() => this.now.set(Date.now())), 1000));
    }
  }
}
