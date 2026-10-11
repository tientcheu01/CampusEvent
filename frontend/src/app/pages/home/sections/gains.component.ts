import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRIX } from '../../../core/data/site-data';
import { GlowDirective } from '../../../core/directives/glow.directive';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { ConcoursDatesService } from '../../../core/services/concours-dates.service';
import { ButtonComponent } from '../../../shared/ui/button.component';
import { IconComponent } from '../../../shared/ui/icon.component';
import { SectionLabelComponent } from '../../../shared/ui/section-label.component';
import { WingsComponent } from '../../../shared/ui/wings.component';

/** 05 — À gagner : les trois prix du règlement, sur le seul fond nuit avant l'appel final. */
@Component({
  selector: 'sji-gains',
  standalone: true,
  imports: [RouterLink, SectionLabelComponent, ButtonComponent, IconComponent, WingsComponent, RevealDirective, GlowDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="gn section section--dense tint-navy dots-light on-navy" sjiGlow="45 50 .18" aria-labelledby="gn-title">
      <sji-wings class="gn__wings" [opacity]="0.1" />
      <div class="container">
        <header class="gn__head" sjiReveal>
          <div>
            <sji-section-label num="05" text="À gagner" />
            <h2 id="gn-title" class="h2 gn__title">Les lauréats repartent<br />avec de quoi continuer</h2>
          </div>
          <a sjiButton variant="ghost" class="gn__cta" [arrow]="true" [routerLink]="dates.cta().link" [fragment]="dates.cta().fragment">{{ dates.cta().label }}</a>
        </header>

        <ol class="gn__prix" role="list" sjiReveal="stagger">
          @for (p of prix; track p.rang) {
            <li class="gn__card" [class.gn__card--phare]="p.phare">
              <p class="gn__rang label">{{ p.rang }}</p>
              <p class="gn__montant">{{ p.montant }}<span>FCFA</span></p>
              <ul class="gn__lots" role="list">
                @for (lot of p.lots; track lot) {
                  <li><sji-icon name="check" /><span>{{ lot }}</span></li>
                }
              </ul>
            </li>
          }
        </ol>

        <p class="gn__note label">Les récompenses peuvent être complétées selon les partenaires de l'édition.</p>
      </div>
    </section>
  `,
  styleUrl: './gains.component.scss',
})
export class GainsComponent {
  protected readonly prix = PRIX;
  protected readonly dates = inject(ConcoursDatesService);
}
