import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';

const PROJETS = [
  { rang: '01', distinction: 'Premier prix', titre: 'Projet lauréat', texte: 'Le projet arrivé en tête de l’édition précédente. Son identité et sa présentation détaillée seront dévoilées ici.', image: '/assets/images/Projet Lauréat.jpg' },
  { rang: '02', distinction: 'Deuxième prix', titre: 'Projet finaliste', texte: 'Une solution distinguée par le jury pour la force de son idée, sa faisabilité et son potentiel d’impact.', image: '/assets/images/photo_2026-10-12_04-28-32.jpg' },
  { rang: '03', distinction: 'Troisième prix', titre: 'Projet finaliste', texte: 'Un projet étudiant remarqué pour sa créativité et sa capacité à répondre à un besoin concret.', image: '/assets/images/Troisième prix.jpg' },
];

/** /projets : le podium de l'édition précédente, présenté comme une preuve concrète de l'innovation étudiante. */
@Component({
  selector: 'sji-projets',
  standalone: true,
  imports: [PageHeaderComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sji-page-header num="02" label="Les projets" lead="Trois projets, trois trajectoires, une même ambition : transformer une idée étudiante en solution concrète."
      >Le podium de<br />l'édition passée.</sji-page-header
    >

    <section class="section projects" aria-label="Les trois premiers projets de l'édition passée">
      <div class="container projects__list">
        @for (projet of projets; track projet.rang; let i = $index) {
          <article class="project" sjiReveal [delay]="i * 0.08">
            <div class="project__number" aria-hidden="true">{{ projet.rang }}</div>
            <figure class="project__visual">
              <img [src]="projet.image" [alt]="'Équipe du ' + projet.titre.toLowerCase()" loading="lazy" />
              <span class="project__rank label">{{ projet.distinction }}</span>
            </figure>
            <div class="project__content">
              <p class="label dim">Édition précédente · {{ projet.distinction }}</p>
              <h2 class="h2">{{ projet.titre }}</h2>
              <p class="lead">{{ projet.texte }}</p>
              <span class="project__status label">Présentation complète à venir</span>
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styleUrl: './projets.component.scss',
})
export class ProjetsComponent {
  protected readonly projets = PROJETS;
}
