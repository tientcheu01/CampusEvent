import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { ProjetsService } from '../../core/services/projets.service';
import { SeoService } from '../../core/services/seo.service';
import { ButtonComponent } from '../../shared/ui/button.component';
import { SectionLabelComponent } from '../../shared/ui/section-label.component';

/** /projets/:slug — fiche à la manière du James Dyson Award : image plein cadre, problème, solution, prototype, équipe. */
@Component({
  selector: 'sji-projet-fiche',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, ButtonComponent, SectionLabelComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (projet(); as p) {
      <article>
        <header class="pf__hero" [class.pf__hero--img]="p.images.length">
          @if (p.images[0]; as img) {
            <span class="pf__duo"><img [ngSrc]="img.src" [alt]="img.alt" fill priority /></span>
          }
          <div class="container pf__hero-in">
            <p class="label">{{ p.domaine }} · {{ p.filiere }} · Édition {{ p.edition }}</p>
            <h1 class="h1">{{ p.titre }}</h1>
            @if (p.prix) {
              <p class="pf__prix label">{{ p.prix }}</p>
            }
          </div>
        </header>

        <section class="section section--dense">
          <div class="container pf__blocks">
            <div sjiReveal>
              <sji-section-label num="01" text="Le problème" />
              <p class="h3">{{ p.probleme }}</p>
            </div>
            <div sjiReveal>
              <sji-section-label num="02" text="La solution" />
              <p class="h3">{{ p.solution }}</p>
            </div>
            <div sjiReveal>
              <sji-section-label num="03" text="Le prototype" />
              <p class="h3">{{ p.prototype }}</p>
              @for (img of p.images.slice(1); track img.src) {
                <img class="pf__img" [ngSrc]="img.src" [alt]="img.alt" width="1200" height="800" />
              }
            </div>
            <div sjiReveal>
              <sji-section-label num="04" text="L'équipe" />
              <ul class="pf__team" role="list">
                @for (n of p.porteurs; track n) {
                  <li class="h3">{{ n }}</li>
                }
              </ul>
            </div>
          </div>
        </section>
        <div class="container pf__back"><a sjiButton variant="link" routerLink="/projets">← Retour aux projets</a></div>
      </article>
    } @else if (svc.state() === 'ready' || svc.state() === 'error') {
      <section class="section">
        <div class="container pf__missing">
          <h1 class="h1">Ce projet est introuvable.</h1>
          <a sjiButton routerLink="/projets" [arrow]="true">Voir tous les projets</a>
        </div>
      </section>
    } @else {
      <section class="section"><div class="container"><p class="label dim" aria-live="polite">Chargement du projet…</p></div></section>
    }
  `,
  styleUrl: './projet-fiche.component.scss',
})
export class ProjetFicheComponent implements OnInit {
  readonly slug = input.required<string>();
  protected readonly svc = inject(ProjetsService);
  private readonly seo = inject(SeoService);
  protected readonly projet = computed(() => this.svc.bySlug(this.slug()));

  constructor() {
    effect(() => {
      const p = this.projet();
      if (p) {
        this.seo.set({
          title: `${p.titre} · Projet SJI INNOVA ${p.edition}`,
          description: p.resume,
          image: 'og-projets.png',
        });
      }
    });
  }

  ngOnInit(): void {
    this.svc.load();
  }
}
