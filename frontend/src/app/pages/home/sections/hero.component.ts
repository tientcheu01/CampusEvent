import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DOCS } from '../../../core/data/site-data';
import { GlowDirective } from '../../../core/directives/glow.directive';
import { MagneticDirective } from '../../../core/directives/magnetic.directive';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { ConcoursDatesService } from '../../../core/services/concours-dates.service';
import { ButtonComponent } from '../../../shared/ui/button.component';
import { CountdownClockComponent } from '../../../shared/ui/countdown-clock.component';
import { IconComponent } from '../../../shared/ui/icon.component';
import { SealComponent } from '../../../shared/ui/seal.component';
import { WingsComponent } from '../../../shared/ui/wings.component';

/** 01 — Héro : dire ce que c'est, quand, et quoi faire. Texte à gauche, mosaïque de portraits à droite. */
@Component({
  selector: 'sji-hero',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, ButtonComponent, CountdownClockComponent, SealComponent, WingsComponent, IconComponent, RevealDirective, MagneticDirective, GlowDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero dots" aria-labelledby="hero-title" sjiGlow="68 40 .18">
      <sji-wings class="hero__wings" [opacity]="0.07" />

      <div class="container hero__grid">
        <div class="hero__text">
          <p class="hero__eyebrow label"><span class="dot" aria-hidden="true"></span>2ᵉ édition · Saint Jean Ingénieur · Yaoundé</p>

          <h1 id="hero-title" class="hero__title" sjiReveal="mask">
            <span data-line>Imaginez.</span><span data-line
              ><span class="uline">Innover.<svg viewBox="0 0 320 18" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 11C70 3 150 16 316 6" /></svg></span></span
            ><span data-line>Construire demain.</span>
          </h1>

          <p class="lead hero__lead" sjiReveal [delay]="0.15">{{ lead() }}</p>

          <div class="hero__actions" sjiReveal [delay]="0.25">
            <a sjiButton sjiMagnetic [arrow]="true" [routerLink]="dates.cta().link" [fragment]="dates.cta().fragment" (click)="track()">{{ dates.cta().label }}</a>
            <a sjiButton variant="ghost" [href]="docs.reglement" target="_blank" rel="noopener" (click)="trackReglement()">Voir le règlement</a>
          </div>
        </div>

        <div class="hero__media" sjiReveal [delay]="0.1">
          <figure class="hero__shot hero__shot--a">
            <img ngSrc="/assets/images/etudiant-3.webp" alt="Un étudiant de Saint Jean Ingénieur portant le t-shirt SJI INNOVA" width="540" height="720" priority />
          </figure>
          <figure class="hero__shot hero__shot--b">
            <img ngSrc="/assets/images/etudiant-2.webp" alt="Une étudiante de Saint Jean Ingénieur sur le campus d'Etok-Koss" width="540" height="720" priority />
          </figure>
          <figure class="hero__shot hero__shot--c">
            <img ngSrc="/assets/images/etudiant-4.webp" alt="Une étudiante de Saint Jean Ingénieur, dossier à la main" width="540" height="720" />
          </figure>

          <p class="chip chip--prize"><sji-icon name="trophy" /><span><strong>100&#8239;000&nbsp;FCFA</strong> au lauréat</span></p>
          <p class="chip chip--place"><sji-icon name="pin" /><span>Campus d'Etok-Koss</span></p>
          <sji-seal class="hero__seal" />
        </div>
      </div>

      <div class="container hero__bottom">
        <sji-countdown-clock sjiReveal [delay]="0.3" />
      </div>
    </section>
  `,
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  protected readonly dates = inject(ConcoursDatesService);
  protected readonly docs = DOCS;
  private readonly analytics = inject(AnalyticsService);

  protected readonly lead = computed(() => {
    const base = "Le concours d'innovation étudiante de Saint Jean Ingénieur revient pour sa deuxième édition.";
    switch (this.dates.phase()) {
      case 'avant':
      case 'depots':
        return `${base} Déposez votre projet avant le 18 décembre 2026.`;
      case 'evaluation':
        return `${base} Les dépôts sont clos : le jury évalue les projets.`;
      case 'vers-finale':
        return `${base} La grande finale a lieu le 10 février 2027, à Yaoundé.`;
      default:
        return "L'édition 2027 est terminée. Retrouvez les projets et les lauréats.";
    }
  });

  protected track(): void {
    this.analytics.track('CTA Deposer', { section: 'hero' });
  }
  protected trackReglement(): void {
    this.analytics.track('Telechargement reglement', { section: 'hero' });
  }
}
