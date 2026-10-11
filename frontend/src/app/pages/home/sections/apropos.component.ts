import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CRITERES_PONDERES } from '../../../core/data/site-data';
import { GlowDirective } from '../../../core/directives/glow.directive';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { ButtonComponent } from '../../../shared/ui/button.component';
import { MeterComponent } from '../../../shared/ui/meter.component';
import { SealComponent } from '../../../shared/ui/seal.component';
import { SectionLabelComponent } from '../../../shared/ui/section-label.component';

// Les récompenses ont leur propre section : ici, les repères du concours.
const CHIFFRES = [
  { valeur: '2ᵉ', unite: '', texte: 'Édition du concours' },
  { valeur: '5', unite: 'max', texte: 'Étudiants par équipe' },
  { valeur: '4', unite: '', texte: 'Membres du jury' },
  { valeur: '3', unite: '', texte: 'Phases, de novembre à février' },
];

/** 04 — Comment le jury évalue : photo, barème pondéré, puis les chiffres clés en bande. */
@Component({
  selector: 'sji-apropos',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, SectionLabelComponent, MeterComponent, SealComponent, ButtonComponent, RevealDirective, GlowDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section section--dense tint-2" sjiGlow="62 44 .16" aria-labelledby="ap-title">
      <div class="container ap">
        <div class="ap__media" sjiReveal>
          <figure class="ap__shot ap__shot--wide">
            <img ngSrc="/assets/images/equipe.webp" alt="Les étudiants de Saint Jean Ingénieur réunis sur le campus" width="1100" height="756" />
          </figure>
          <figure class="ap__shot ap__shot--tall">
            <img ngSrc="/assets/images/etudiant-1.webp" alt="Un étudiant participant au concours SJI INNOVA" width="540" height="720" />
          </figure>
          <sji-seal class="ap__seal" text="DÉPOSEZ · VOTRE · PROJET · " />
        </div>

        <div class="ap__text" sjiReveal [delay]="0.1">
          <sji-section-label num="02" text="L'évaluation" />
          <h2 id="ap-title" class="h2">Ce que le jury regarde</h2>
          <p class="ap__lead">
            Quatre membres — des enseignants, un professionnel du secteur technologique et la Responsable pédagogique du cycle Licence — notent chaque dossier
            selon le même barème. Les décisions du jury sont souveraines et sans appel.
          </p>

          <div class="ap__meters">
            @for (c of criteres; track c.nom) {
              <sji-meter [label]="c.nom" [value]="c.poids" />
            }
          </div>

          <a sjiButton variant="ghost" [arrow]="true" routerLink="/le-concours">Lire le règlement complet</a>
        </div>
      </div>

      <div class="container ap__chiffres" sjiReveal="stagger">
        @for (c of chiffres; track c.texte) {
          <div class="ap__chiffre">
            <p class="ap__val">
              {{ c.valeur }}@if (c.unite) {<span class="ap__unit">{{ c.unite }}</span>}
            </p>
            <p class="ap__txt label">{{ c.texte }}</p>
          </div>
        }
      </div>
    </section>
  `,
  styleUrl: './apropos.component.scss',
})
export class AproposComponent {
  protected readonly criteres = CRITERES_PONDERES;
  protected readonly chiffres = CHIFFRES;
}
