import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { ProjetsService } from '../../core/services/projets.service';
import { SeoService } from '../../core/services/seo.service';
import { ButtonComponent } from '../../shared/ui/button.component';
import { SectionLabelComponent } from '../../shared/ui/section-label.component';

/** /projets/:slug — fiche à la manière du James Dyson Award : image plein cadre, puis les blocs du dossier. */
@Component({
  selector: 'sji-projet-fiche',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, ButtonComponent, SectionLabelComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (projet(); as p) {
      <article>
        <header class="pf__hero" [class.pf__hero--img]="p.images?.length">
          @if (p.images?.[0]; as img) {
            <span class="pf__duo"><img [ngSrc]="img.src" [alt]="img.alt" fill priority /></span>
          }
          <div class="container pf__hero-in">
            <p class="label">{{ p.domaine }}@if (p.filiere) { · {{ p.filiere }} } · Édition {{ p.edition }}</p>
            <h1 class="h1">{{ p.titre }}</h1>
            <p class="pf__accroche">{{ p.accroche }}</p>
            <p class="pf__prix label">{{ p.prix }}</p>
          </div>
        </header>

        <section class="section section--dense">
          <div class="container">
            <blockquote class="pf__citation" sjiReveal>{{ p.citation }}</blockquote>
          </div>
          <div class="container pf__blocks">
            @for (bloc of p.blocs; track bloc.titre; let i = $index) {
              <div class="pf__bloc" sjiReveal>
                <sji-section-label [num]="num(i)" [text]="bloc.titre" />
                <div class="pf__bloc-body">
                  @for (para of bloc.paragraphes; track para) {
                    <p class="pf__para">{{ para }}</p>
                  }
                  @if (bloc.intro) {
                    <p class="pf__para">{{ bloc.intro }}</p>
                  }
                  @if (bloc.items?.length) {
                    <ul class="pf__items" role="list">
                      @for (item of bloc.items; track item.titre) {
                        <li>
                          <span class="pf__item-titre">{{ item.titre }}</span>
                          <span class="pf__item-texte">{{ item.texte }}</span>
                        </li>
                      }
                    </ul>
                  }
                </div>
              </div>
            }

            @if (p.images?.length) {
              <div class="pf__bloc" sjiReveal>
                <sji-section-label [num]="num(p.blocs.length)" text="En images" />
                <div class="pf__bloc-body">
                  @for (img of p.images!.slice(1); track img.src) {
                    <img class="pf__img" [ngSrc]="img.src" [alt]="img.alt" width="1200" height="800" />
                  }
                </div>
              </div>
            }

            @if (p.porteurs?.length) {
              <div class="pf__bloc" sjiReveal>
                <sji-section-label [num]="num(p.blocs.length + (p.images?.length ? 1 : 0))" text="L'équipe" />
                <div class="pf__bloc-body">
                  <ul class="pf__team" role="list">
                    @for (n of p.porteurs; track n) {
                      <li class="h3">{{ n }}</li>
                    }
                  </ul>
                </div>
              </div>
            }
          </div>
        </section>

        <section class="section section--dense">
          <div class="container">
            <p class="pf__ambition" sjiReveal><span class="label">Notre ambition</span>{{ p.ambition }}</p>
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

  protected num(i: number): string {
    return String(i + 1).padStart(2, '0');
  }

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
