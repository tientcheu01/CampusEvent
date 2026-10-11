import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RECOMPENSES } from '../../../core/data/site-data';
import { GlowDirective } from '../../../core/directives/glow.directive';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { SectionLabelComponent } from '../../../shared/ui/section-label.component';
import { StatComponent } from '../../../shared/ui/stat.component';
import { WingsComponent } from '../../../shared/ui/wings.component';

/** 06 — À gagner. Trois éléments en asymétrie : le montant occupe deux tiers, les deux autres se partagent le reste. */
@Component({
  selector: 'sji-gains',
  standalone: true,
  imports: [SectionLabelComponent, StatComponent, WingsComponent, RevealDirective, GlowDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section" sjiGlow="35 55 .2" aria-labelledby="gains-label">
      <div class="container gn">
        <sji-wings class="gn__wings" [opacity]="0.08" />
        <sji-section-label id="gains-label" num="04" text="À gagner" />
        <div class="gn__grid">
          <div class="gn__main" sjiReveal>
            <sji-stat size="xl" [value]="montant" [countTo]="reward.montant" unit="FCFA" label="Pour le projet lauréat" />
          </div>
          <div class="gn__side" sjiReveal="stagger">
            <div class="gn__item">
              <sji-stat variant="blue" [value]="'3'" unit="trophées" label="Pour les meilleurs projets" />
            </div>
            <div class="gn__item">
              <h3 class="h2">Un accompagnement</h3>
              <p class="label dim">Technique et académique, pour aller plus loin</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .gn {
      position: relative;
      display: grid;
      gap: var(--sp-12);
    }
    .gn__wings {
      position: absolute;
      left: -8%;
      top: 4%;
      width: min(70vw, 760px);
      height: 100%;
      z-index: -1;
    }
    .gn__grid {
      display: grid;
      gap: var(--sp-12);
    }
    .gn__item {
      padding-top: var(--sp-6);
      border-top: var(--border);
    }
    .gn__item + .gn__item {
      margin-top: var(--sp-8);
    }
    .gn__item h3 {
      margin: 0 0 var(--sp-3);
    }
    @media (min-width: 1024px) {
      .gn__grid {
        grid-template-columns: 2fr 1fr;
        align-items: end;
        gap: var(--sp-16);
      }
    }
  `,
})
export class GainsComponent {
  protected readonly reward = RECOMPENSES;
  protected readonly montant = '100 000';
}
