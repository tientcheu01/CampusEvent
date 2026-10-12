import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CRITERES_PONDERES } from '../../../core/data/site-data';
import { GlowDirective } from '../../../core/directives/glow.directive';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { ButtonComponent } from '../../../shared/ui/button.component';
import { MeterComponent } from '../../../shared/ui/meter.component';
import { SectionLabelComponent } from '../../../shared/ui/section-label.component';
import { WingsComponent } from '../../../shared/ui/wings.component';

/** 04 — Comment le jury évalue : présentation et barème pondéré. */
@Component({
  selector: 'sji-apropos',
  standalone: true,
  imports: [RouterLink, SectionLabelComponent, MeterComponent, WingsComponent, ButtonComponent, RevealDirective, GlowDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="ap-section section section--dense tint-navy dots-light on-navy" sjiGlow="45 50 .18" aria-labelledby="ap-title">
      <sji-wings class="ap__wings" [opacity]="0.1" />
      <div class="container ap">
        <div class="ap__copy" sjiReveal>
          <sji-section-label num="02" text="L'évaluation" />
          <h2 id="ap-title" class="h2">Ce que le jury regarde</h2>
          <p class="ap__lead">
            Quatre membres — des enseignants, un professionnel du secteur technologique et la Responsable pédagogique du cycle Licence — notent chaque dossier
            selon le même barème. Les décisions du jury sont souveraines et sans appel.
          </p>
        </div>

        <div class="ap__score" sjiReveal [delay]="0.1">
          <div class="ap__meters">
            @for (c of criteres; track c.nom) {
              <sji-meter [label]="c.nom" [value]="c.poids" />
            }
          </div>
          <a sjiButton class="ap__cta" variant="ghost" [arrow]="true" routerLink="/le-concours">Lire le règlement complet</a>
        </div>
      </div>
    </section>
  `,
  styleUrl: './apropos.component.scss',
})
export class AproposComponent {
  protected readonly criteres = CRITERES_PONDERES;
}
