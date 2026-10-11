import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { ProjetsService } from '../../core/services/projets.service';
import { ButtonComponent } from '../../shared/ui/button.component';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';
import { ProjectCardComponent } from '../../shared/ui/project-card.component';

type Filters = { edition: number | null; domaine: string | null; filiere: string | null };

/** /projets : la preuve. Filtres en chips mono (édition, domaine, filière), grille asymétrique, états de chargement. */
@Component({
  selector: 'sji-projets',
  standalone: true,
  imports: [PageHeaderComponent, ProjectCardComponent, ButtonComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sji-page-header num="05" label="Les projets">Ils l'ont déjà fait.</sji-page-header>

    <section class="section section--dense">
      <div class="container">
        @if (svc.state() === 'ready' && svc.projets().length) {
          <div class="pl__filters" role="group" aria-label="Filtrer les projets">
            @for (g of groups(); track g.key) {
              <div class="pl__group">
                <span class="label dim">{{ g.label }}</span>
                <button type="button" class="chip label" [class.chip--on]="filters()[g.key] === null" (click)="set(g.key, null)">Tous</button>
                @for (v of g.values; track v) {
                  <button type="button" class="chip label" [class.chip--on]="filters()[g.key] === v" [attr.aria-pressed]="filters()[g.key] === v" (click)="set(g.key, v)">{{ v }}</button>
                }
              </div>
            }
          </div>
          <p class="label dim pl__count" aria-live="polite">{{ list().length }} projet{{ list().length > 1 ? 's' : '' }}</p>
          <div class="pl__grid">
            @for (p of list(); track p.slug; let i = $index) {
              <sji-project-card [projet]="p" [featured]="i === 0" [class.pl__first]="i === 0" />
            }
          </div>
        } @else if (svc.state() === 'error') {
          <div class="pl__state" role="alert">
            <p class="h3">Les projets n'ont pas pu être chargés.</p>
            <button type="button" sjiButton (click)="svc.load(true)">Réessayer</button>
          </div>
        } @else if (svc.state() === 'ready') {
          <div class="pl__state">
            <p class="h2">Les projets de l'édition 2027 seront publiés après la présélection, en janvier.</p>
          </div>
        } @else {
          <p class="visually-hidden" aria-live="polite">Chargement des projets de la première édition…</p>
          <div class="pl__grid" aria-busy="true">
            @for (s of [0, 1, 2, 3]; track s) {
              <div class="pl__skel" [class.pl__first]="s === 0"></div>
            }
          </div>
        }
      </div>
    </section>
  `,
  styleUrl: './projets.component.scss',
})
export class ProjetsComponent implements OnInit {
  protected readonly svc = inject(ProjetsService);
  protected readonly filters = signal<Filters>({ edition: null, domaine: null, filiere: null });

  protected readonly groups = computed(() => [
    { key: 'edition' as const, label: 'Édition', values: this.svc.editions() },
    { key: 'domaine' as const, label: 'Domaine', values: this.svc.domaines() },
    { key: 'filiere' as const, label: 'Filière', values: this.svc.filieres() },
  ]);

  protected readonly list = computed(() => {
    const f = this.filters();
    return this.svc.projets().filter((p) => (f.edition === null || p.edition === f.edition) && (f.domaine === null || p.domaine === f.domaine) && (f.filiere === null || p.filiere === f.filiere));
  });

  ngOnInit(): void {
    this.svc.load();
  }

  protected set(key: keyof Filters, value: string | number | null): void {
    this.filters.update((f) => ({ ...f, [key]: value }));
  }
}
