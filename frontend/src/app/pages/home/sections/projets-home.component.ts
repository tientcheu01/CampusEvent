import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { ProjetsService } from '../../../core/services/projets.service';
import { ButtonComponent } from '../../../shared/ui/button.component';
import { ProjectCardComponent } from '../../../shared/ui/project-card.component';
import { SectionLabelComponent } from '../../../shared/ui/section-label.component';

/**
 * 07 — Les projets de la 1ʳᵉ édition : la section la plus importante du site (la preuve).
 * Grille asymétrique : la première carte occupe deux colonnes et deux rangées.
 */
@Component({
  selector: 'sji-projets-home',
  standalone: true,
  imports: [RouterLink, SectionLabelComponent, ButtonComponent, ProjectCardComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section tint-3" aria-labelledby="pj-title">
      <div class="container">
        <header class="pj__head" sjiReveal>
          <sji-section-label num="05" text="Les projets" />
          <h2 id="pj-title" class="h1">Ils l'ont déjà fait.</h2>
          <p class="lead">Les projets de la première édition, portés par des étudiants de Saint Jean Ingénieur.</p>
        </header>

        @if (items().length) {
          <div class="pj__grid" sjiReveal="stagger">
            @for (p of items(); track p.slug; let i = $index) {
              <sji-project-card [projet]="p" [featured]="i === 0" [class.pj__first]="i === 0" />
            }
          </div>
          <a sjiButton variant="ghost" class="pj__all" routerLink="/projets" [arrow]="true">Tous les projets</a>
        } @else if (projets.state() === 'error') {
          <p class="pj__empty">Les projets n'ont pas pu être chargés. <button type="button" sjiButton variant="link" (click)="projets.load(true)">Réessayer</button></p>
        } @else if (projets.state() === 'ready') {
          <p class="pj__empty h3">Les projets de l'édition 2027 seront publiés après la présélection, en janvier.</p>
        } @else {
          <div class="pj__grid" aria-busy="true" aria-label="Chargement des projets de la première édition…">
            @for (s of [0, 1, 2]; track s) {
              <div class="pj__skeleton" [class.pj__first]="s === 0"></div>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .pj__head {
      display: grid;
      gap: var(--sp-6);
      margin-bottom: var(--sp-12);
    }
    .pj__grid {
      display: grid;
      gap: var(--sp-4);
      grid-template-columns: 1fr;
    }
    .pj__grid > * {
      min-height: 280px;
    }
    .pj__skeleton {
      min-height: 280px;
      border-radius: var(--r-md);
      background: var(--paper-2);
      border: var(--border);
      animation: pulse 1.4s var(--ease-soft) infinite alternate;
    }
    @keyframes pulse {
      to {
        opacity: 0.5;
      }
    }
    .pj__empty {
      max-width: 30ch;
      color: var(--navy-900);
    }
    .pj__all {
      margin-top: var(--sp-8);
    }
    @media (min-width: 640px) {
      .pj__grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (min-width: 1024px) {
      .pj__grid {
        grid-template-columns: repeat(4, 1fr);
        grid-auto-rows: minmax(260px, auto);
      }
      .pj__first {
        grid-column: span 2;
        grid-row: span 2;
      }
    }
  `,
})
export class ProjetsHomeComponent implements OnInit {
  protected readonly projets = inject(ProjetsService);
  protected readonly items = computed(() => this.projets.projets().slice(0, 5));

  ngOnInit(): void {
    this.projets.load();
  }
}
