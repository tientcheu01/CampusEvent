import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GlowDirective } from '../../../core/directives/glow.directive';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { ButtonComponent } from '../../../shared/ui/button.component';
import { IconComponent, IconName } from '../../../shared/ui/icon.component';
import { SectionLabelComponent } from '../../../shared/ui/section-label.component';

interface Palier {
  mot: string;
  texte: string;
  detail: string;
  icone: IconName;
}

const PALIERS: Palier[] = [
  { mot: 'Idée', texte: "Vous repérez un problème que personne autour de vous n'a résolu.", detail: 'Un besoin réel, pas une idée en l’air', icone: 'chip' },
  { mot: 'Projet', texte: 'Vous le structurez, seul ou en équipe de cinq au maximum, et vous le déposez.', detail: 'Dossier PDF et vidéo de 2 à 3 minutes', icone: 'file' },
  { mot: 'Solution', texte: 'Le jury évalue, présélectionne, et vous accompagne jusqu’à la finale.', detail: 'Quatre critères, quatre membres du jury', icone: 'users' },
  { mot: 'Impact', texte: 'Votre projet quitte le campus et sert.', detail: 'Trophée, dotation et accompagnement', icone: 'trend' },
];

/** 03 — Le parcours : quatre paliers qui montent, reliés par un trait, chacun avec son repère concret. */
@Component({
  selector: 'sji-trajectoire',
  standalone: true,
  imports: [RouterLink, SectionLabelComponent, IconComponent, ButtonComponent, RevealDirective, GlowDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="tj section section--dense" sjiGlow="50 46 .16" aria-labelledby="tj-title">
      <div class="container">
        <header class="tj__head" sjiReveal>
          <div>
            <sji-section-label num="03" text="Le parcours" />
            <h2 id="tj-title" class="h2 tj__title">D'une idée<br />à un <em>impact</em>.</h2>
          </div>
          <p class="tj__lead">
            Quatre étapes entre le moment où vous repérez un problème et celui où votre projet sert vraiment.
            Chacune a ses attendus&nbsp;: rien n'est laissé au hasard.
          </p>
        </header>

        <ol class="tj__list" role="list" sjiReveal="stagger">
          @for (p of paliers; track p.mot; let i = $index) {
            <li class="tj__step" tabindex="0">
              <span class="tj__glow" aria-hidden="true"></span>
              <p class="tj__num num">00{{ i + 1 }}</p>
              <div class="tj__symbol" aria-hidden="true">
                <span class="tj__orbit"></span>
                <span class="tj__icon"><sji-icon [name]="p.icone" [size]="24" /></span>
              </div>
              <div class="tj__content">
                <p class="tj__tag label">{{ p.mot }}</p>
                <h3 class="tj__mot">{{ p.texte }}</h3>
                <p class="tj__detail">{{ p.detail }}</p>
              </div>
            </li>
          }
        </ol>

        <div class="tj__foot" sjiReveal>
          <a sjiButton variant="link" routerLink="/le-concours">Voir le détail de chaque étape</a>
        </div>
      </div>
    </section>
  `,
  styleUrl: './trajectoire.component.scss',
})
export class TrajectoireComponent {
  protected readonly paliers = PALIERS;
}
