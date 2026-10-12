import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { ButtonComponent } from '../../../shared/ui/button.component';
import { SectionLabelComponent } from '../../../shared/ui/section-label.component';

/** 06 — Les trois premiers projets de l'édition passée : la preuve, juste avant le pied de page. */
@Component({
  selector: 'sji-projets-home',
  standalone: true,
  imports: [RouterLink, SectionLabelComponent, ButtonComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pj section section--dense tint-3" aria-labelledby="pj-title">
      <div class="container">
        <header class="pj__head" sjiReveal>
          <div>
            <sji-section-label num="06" text="Les projets" />
            <h2 id="pj-title" class="h2 pj__title">Le podium de <em>l'édition passée</em>.</h2>
            <p class="pj__lead">Trois projets étudiants distingués pour leur créativité, leur faisabilité et leur potentiel d'impact.</p>
          </div>
          <a sjiButton variant="ghost" routerLink="/projets" [arrow]="true">Découvrir le podium</a>
        </header>

        <div class="pj__grid" sjiReveal="stagger">
          @for (projet of projets; track projet.rang) {
            <a class="project-card" routerLink="/projets" [attr.aria-label]="'Découvrir ' + projet.titre">
              <div class="project-card__cover">
                <img [src]="projet.image" [alt]="'Portrait associé au ' + projet.titre.toLowerCase()" loading="lazy" />
                <span class="project-card__wash" aria-hidden="true"></span>
                <span class="project-card__badge label">{{ projet.edition }}</span>
                <span class="project-card__rank"><b>{{ projet.rang }}</b><small>{{ projet.prix }}</small></span>
                <span class="project-card__notch" aria-hidden="true"></span>
                <span class="project-card__fillet project-card__fillet--right" aria-hidden="true"></span>
                <span class="project-card__fillet project-card__fillet--bottom" aria-hidden="true"></span>
                <span class="project-card__arrow" aria-hidden="true">↗</span>
              </div>

              <div class="project-card__body">
                <h3>{{ projet.titre }}</h3>
                <p>{{ projet.texte }}</p>
                <ul aria-label="Caractéristiques du projet">
                  @for (tag of projet.tags; track tag) { <li>{{ tag }}</li> }
                </ul>
              </div>
            </a>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './projets-home.component.scss',
})
export class ProjetsHomeComponent {
  protected readonly projets = [
    { rang: '01', prix: 'Premier prix', edition: 'Édition précédente', titre: 'Projet lauréat', texte: 'Le projet arrivé en tête de la précédente édition, distingué pour la cohérence de sa proposition.', tags: ['LearnMap'], image: '/assets/images/Projet Lauréat.jpg' },
    { rang: '02', prix: 'Deuxième prix', edition: 'Édition précédente', titre: 'Projet finaliste', texte: 'Une solution remarquée par le jury pour sa faisabilité et la qualité de son exécution.', tags: ['Beyond Silence'], image: '/assets/images/photo_2026-10-12_04-28-32.jpg' },
    { rang: '03', prix: 'Troisième prix', edition: 'Édition précédente', titre: 'Projet finaliste', texte: 'Une idée audacieuse sélectionnée pour sa créativité et son potentiel de transformation.', tags: ['Clean Collect'], image: '/assets/images/Troisième prix.jpg' },
  ];
}
