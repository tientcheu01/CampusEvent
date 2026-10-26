import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CALENDRIER, CRITERES, DOCS, FAQ_CONCOURS, fr } from '../../core/data/site-data';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { AnalyticsService } from '../../core/services/analytics.service';
import { ConcoursDatesService } from '../../core/services/concours-dates.service';
import { AccordionComponent, AccordionItemComponent } from '../../shared/ui/accordion.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';
import { SectionLabelComponent } from '../../shared/ui/section-label.component';
import { TimelineComponent } from '../../shared/ui/timeline.component';
import { WingsComponent } from '../../shared/ui/wings.component';

const OBJECTIFS = [
  'Encourager les étudiants à développer des solutions technologiques innovantes qui répondent à des besoins réels.',
  "Encourager l'entrepreneuriat.",
  'Valoriser la recherche et la créativité dans un cadre académique.',
  'Favoriser le travail en équipe et la mise en pratique des compétences acquises.',
  "Récompenser l'excellence et l'esprit d'initiative.",
];

/** /le-concours : présentation, critères du jury, calendrier détaillé, FAQ, règlement téléchargeable. */
@Component({
  selector: 'sji-concours',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent, SectionLabelComponent, TimelineComponent, AccordionComponent, AccordionItemComponent, ButtonComponent, IconComponent, WingsComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sji-page-header num="01" label="Le concours" lead="Qui peut participer, ce qu'il faut déposer, comment le jury décide et à quelles dates. Tout est ici."
      >Le règlement, le jury, les dates.</sji-page-header
    >

    <section class="cc__presentation section section--dense tint-3">
      <div class="container grid">
        <div class="cc__intro" sjiReveal>
          <sji-section-label num="01" text="Présentation" />
          <p class="h3 cc__lead">
            Le Prix SJI INNOVA est une initiative du Directeur du campus d’Etok-Koss de l'Université Saint Jean Ingénieur.
          </p>
          <p class="cc__intro-text">
            Ce concours est destiné à valoriser l'innovation, l'entrepreneuriat et l'esprit créatif des étudiants de cycle Licence Professionnelle. C'est une plateforme unique où vos idées peuvent se transformer en projets réels et impactants.
          </p>
          <ul class="cc__obj" role="list">
            @for (o of objectifs; track o) {
              <li><sji-icon name="check" /><span>{{ fr(o) }}</span></li>
            }
          </ul>
        </div>
        <aside class="cc__dl" aria-label="Règlement">
          <div class="cc__dlbox">
            <p class="label dim">Règlement du concours</p>
            <a sjiButton [arrow]="true" [href]="docs.reglement" download (click)="track()"><span>Télécharger le règlement</span></a>
            <p class="dim cc__dlnote">Document PDF. Toute participation implique l'acceptation du règlement.</p>
          </div>
        </aside>
      </div>
    </section>

    <section class="cc__evaluation section section--dense tint-navy dots-light on-navy" aria-labelledby="crit-title">
      <sji-wings class="cc__wings" [opacity]="0.1" />
      <div class="container grid">
        <div class="cc__col" sjiReveal>
          <sji-section-label num="02" text="Évaluation" />
          <h2 id="crit-title" class="h2">Les critères du jury</h2>
          <p class="dim">Le jury est composé de quatre membres&nbsp;: des enseignants, un professionnel du secteur technologique et la Responsable pédagogique du cycle Licence.</p>
        </div>
        <div class="cc__table" sjiReveal [delay]="0.1">
          <table class="bar">
            <caption class="visually-hidden">Critères d'évaluation du jury</caption>
            <thead><tr><th scope="col">Critère</th></tr></thead>
            <tbody>
              @for (c of criteres; track c; let i = $index) {
                <tr><th scope="row"><span class="num">0{{ i + 1 }}</span> {{ c }}</th></tr>
              }
            </tbody>
          </table>
          <p class="label dim bar__note">Barème détaillé publié avec le règlement.</p>
        </div>
      </div>
    </section>

    <section id="calendrier" class="section section--dense tint-2" aria-labelledby="cal-title">
      <div class="container">
        <header class="cc__head" sjiReveal>
          <sji-section-label num="03" text="Le calendrier" />
          <h2 id="cal-title" class="h2">Trois temps forts, un seul objectif&nbsp;: la finale.</h2>
        </header>
        <sji-timeline [items]="calendrier" />
      </div>
    </section>

    <section class="cc__faq-section section section--dense tint-3" aria-labelledby="faq-title">
      <div class="container grid">
        <header class="cc__col" sjiReveal>
          <sji-section-label num="04" text="Questions" />
          <h2 id="faq-title" class="h2">La FAQ</h2>
        </header>
        <sji-accordion class="cc__faq">
          @for (item of faq; track item.titre) {
            <sji-accordion-item [title]="fr(item.titre)">
              @for (p of item.paragraphes; track p) {<p>{{ fr(p) }}</p>}
              @if (item.liste) {
                <ul class="cc__list">@for (li of item.liste; track li) {<li>{{ fr(li) }}</li>}</ul>
              }
            </sji-accordion-item>
          }
        </sji-accordion>
      </div>
    </section>

    <section class="section section--band">
      <div class="container cc__end">
        <p class="h3">{{ dates.countdownLabel() }}</p>
        <a sjiButton [arrow]="true" [routerLink]="dates.cta().link" [fragment]="dates.cta().fragment">{{ dates.cta().label }}</a>
      </div>
    </section>
  `,
  styleUrl: './concours.component.scss',
})
export class ConcoursComponent {
  protected readonly objectifs = OBJECTIFS;
  protected readonly criteres = CRITERES;
  protected readonly calendrier = CALENDRIER;
  protected readonly faq = FAQ_CONCOURS;
  protected readonly docs = DOCS;
  protected readonly dates = inject(ConcoursDatesService);
  protected readonly fr = fr;
  private readonly analytics = inject(AnalyticsService);

  protected track(): void {
    this.analytics.track('Telechargement reglement', { section: 'le-concours' });
  }
}
