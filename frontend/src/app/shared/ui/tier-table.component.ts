import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTREPARTIES, NIVEAUX } from '../../core/data/site-data';

/**
 * Comparatif Platine / Or / Argent / Bronze. Angles droits + filet (bloc « technique »).
 * Mobile : quatre cartes empilées, jamais un tableau à défilement horizontal.
 */
@Component({
  selector: 'sji-tier-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table class="tt">
      <caption class="visually-hidden">Contreparties par niveau de partenariat</caption>
      <thead>
        <tr>
          <th scope="col"><span class="visually-hidden">Contrepartie</span></th>
          @for (n of niveaux; track n) {
            <th scope="col" class="tt__niveau">{{ n }}</th>
          }
        </tr>
      </thead>
      <tbody>
        @for (row of rows; track row.ligne) {
          <tr>
            <th scope="row">{{ row.ligne }}</th>
            @for (v of row.valeurs; track $index) {
              <td [class.tt__no]="v === '—'">{{ v }}</td>
            }
          </tr>
        }
      </tbody>
    </table>

    <div class="tc">
      @for (n of niveaux; track n; let i = $index) {
        <section class="tc__card" [attr.aria-label]="'Niveau ' + n">
          <h3 class="tc__title">{{ n }}</h3>
          <dl class="tc__list">
            @for (row of rows; track row.ligne) {
              <div class="tc__row" [class.tc__row--no]="row.valeurs[i] === '—'">
                <dt>{{ row.ligne }}</dt>
                <dd>{{ row.valeurs[i] }}</dd>
              </div>
            }
          </dl>
        </section>
      }
    </div>
    <p class="tt__note label">Contreparties indicatives, ajustables avec le comité d'organisation.</p>
  `,
  styles: `
    :host {
      display: block;
    }
    .tt {
      display: none;
      width: 100%;
      border-collapse: collapse;
      color: var(--navy-900);
      background: var(--paper);
      border: var(--border);
    }
    .tt th,
    .tt td {
      padding: var(--sp-4) var(--sp-6);
      text-align: left;
      border-bottom: var(--border);
      border-left: var(--border);
    }
    .tt tbody th {
      font-weight: 500;
      border-left: 0;
    }
    .tt__niveau {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: var(--fs-h3);
      letter-spacing: -0.02em;
      background: var(--paper-3);
    }
    .tt__no {
      color: var(--blue-200);
    }
    .tc {
      display: grid;
      gap: var(--sp-4);
    }
    .tc__card {
      color: var(--navy-900);
      border: var(--border);
      background: var(--paper);
      padding: var(--sp-6);
    }
    .tc__title {
      margin: 0 0 var(--sp-4);
      font-family: var(--font-display);
      font-weight: 800;
      font-size: var(--fs-h2);
      letter-spacing: -0.03em;
    }
    .tc__list {
      margin: 0;
    }
    .tc__row {
      display: flex;
      justify-content: space-between;
      gap: var(--sp-4);
      padding: var(--sp-3) 0;
      border-top: var(--border);
    }
    .tc__row dt {
      color: var(--text-dim);
    }
    .tc__row dd {
      margin: 0;
      text-align: right;
      font-weight: 700;
    }
    .tc__row--no dd {
      color: var(--blue-200);
    }
    .tt__note {
      margin: var(--sp-4) 0 0;
      color: var(--text-dim);
    }
    :host-context(.on-navy) .tt__note {
      color: rgba(255, 255, 255, 0.68);
    }
    @media (min-width: 900px) {
      .tt {
        display: table;
      }
      .tc {
        display: none;
      }
    }
  `,
})
export class TierTableComponent {
  protected readonly niveaux = NIVEAUX;
  protected readonly rows = CONTREPARTIES;
}
