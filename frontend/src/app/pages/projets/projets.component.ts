import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { ProjetsService } from '../../core/services/projets.service';
import { ButtonComponent } from '../../shared/ui/button.component';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';

/** /projets : le podium de l'édition précédente, présenté comme une preuve concrète de l'innovation étudiante. */
@Component({
  selector: 'sji-projets',
  standalone: true,
  imports: [RouterLink, ButtonComponent, PageHeaderComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sji-page-header num="02" label="Les projets" lead="Trois projets, trois trajectoires, une même ambition : transformer une idée étudiante en solution concrète."
      >Le podium de<br />l'édition passée.</sji-page-header
    >

    <section class="section projects" aria-label="Les trois premiers projets de l'édition passée">
      <div class="container projects__list">
        @for (projet of svc.projets(); track projet.slug; let i = $index) {
          <article class="project" [class.project--media]="projet.images?.length" sjiReveal [delay]="i * 0.08">
            <div class="project__number" aria-hidden="true">{{ rang(i) }}</div>
            @if (projet.images?.[0]; as img) {
              <figure class="project__visual">
                <img [src]="img.src" [alt]="img.alt" loading="lazy" />
                <span class="project__rank label">{{ projet.prix }}</span>
              </figure>
            }
            <div class="project__content">
              <p class="label dim">Édition {{ projet.edition }} · {{ projet.prix }}</p>
              <h2 class="h2">{{ projet.titre }}</h2>
              <p class="project__accroche">{{ projet.accroche }}</p>
              <p class="lead">{{ projet.resume }}</p>
              <a sjiButton variant="link" [routerLink]="['/projets', projet.slug]">Découvrir {{ projet.titre }}</a>
            </div>
          </article>
        } @empty {
          <p class="label dim" aria-live="polite">
            {{ svc.state() === 'error' ? 'Les projets n’ont pas pu être chargés. Réessayez dans un instant.' : 'Chargement des projets…' }}
          </p>
        }
      </div>
    </section>
  `,
  styleUrl: './projets.component.scss',
})
export class ProjetsComponent implements OnInit {
  protected readonly svc = inject(ProjetsService);

  protected rang(i: number): string {
    return String(i + 1).padStart(2, '0');
  }

  ngOnInit(): void {
    this.svc.load();
  }
}
