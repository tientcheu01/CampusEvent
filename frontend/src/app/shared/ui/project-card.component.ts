import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Projet } from '../../core/models/api.model';

/**
 * Carte projet : image plein cadre en duotone bleu nuit / or (ratio 4:3), titre en display, un seul mot-clé mono.
 * Le texte descriptif monte depuis le bas au survol. Sans photo : carte typographique honnête, jamais d'image de banque.
 */
@Component({
  selector: 'sji-project-card',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="pc" [routerLink]="['/projets', projet().slug]" [class.pc--type]="!image()" [class.pc--big]="featured()">
      @if (image(); as img) {
        <span class="pc__duo"><img [ngSrc]="img.src" [alt]="img.alt" width="800" height="600" /></span>
      }
      <span class="pc__meta label">{{ projet().domaine }} · {{ projet().edition }}</span>
      <h3 class="pc__title">{{ projet().titre }}</h3>
      <span class="pc__more"
        ><span class="label">{{ projet().filiere }}</span
        ><span class="pc__resume">{{ projet().resume }}</span></span
      >
    </a>
  `,
  styles: `
    :host {
      display: block;
    }
    .pc {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      height: 100%;
      min-height: 280px;
      overflow: hidden;
      isolation: isolate;
      padding: var(--sp-6);
      color: #fff;
      text-decoration: none;
      border-radius: var(--r-md);
      background: var(--navy-900);
    }
    .pc--type {
      background: var(--paper-3);
      color: var(--navy-900);
      border: var(--border);
      border-radius: var(--r-lg);
      transition: border-color var(--d-fast), transform var(--d-base) var(--ease-out);
    }
    .pc--type:hover {
      border-color: var(--blue-500);
      transform: translateY(-4px);
    }
    .pc__duo {
      position: absolute;
      inset: 0;
      z-index: -1;
      background: linear-gradient(0deg, #0a1f4d, #f8a91b);
    }
    .pc__duo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: grayscale(1) contrast(1.06);
      mix-blend-mode: multiply;
      transition: filter var(--d-slow) var(--ease-soft);
    }
    .pc:hover .pc__duo img {
      filter: grayscale(0.6) contrast(1.06);
    }
    .pc__meta {
      display: block;
      margin-bottom: var(--sp-2);
      color: var(--gold-500);
    }
    .pc--type .pc__meta {
      color: var(--blue-600);
    }
    .pc__title {
      margin: 0;
      font-family: var(--font-display);
      font-weight: 800;
      font-size: var(--fs-h3);
      line-height: 1;
      letter-spacing: -0.03em;
      text-wrap: balance;
    }
    .pc--big .pc__title {
      font-size: var(--fs-h2);
    }
    .pc__more {
      display: block;
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transform: translateY(12px);
      transition:
        opacity var(--d-base) var(--ease-out),
        transform var(--d-base) var(--ease-out),
        max-height var(--d-base) var(--ease-out);
    }
    .pc__resume {
      display: block;
      margin-top: var(--sp-2);
      font-size: var(--fs-small);
      line-height: 1.45;
    }
    .pc:hover .pc__more,
    .pc:focus-visible .pc__more {
      max-height: 12rem;
      opacity: 1;
      transform: none;
    }
    @media (hover: none) {
      .pc__more {
        max-height: 12rem;
        opacity: 1;
        transform: none;
      }
    }
  `,
})
export class ProjectCardComponent {
  readonly projet = input.required<Projet>();
  readonly featured = input(false);
  protected image = () => this.projet().images[0] ?? null;
}
