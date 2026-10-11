import { ChangeDetectionStrategy, Component, DestroyRef, NgZone, afterNextRender, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { NAV } from '../../core/data/site-data';
import { AnalyticsService } from '../../core/services/analytics.service';
import { ConcoursDatesService } from '../../core/services/concours-dates.service';
import { LenisService } from '../../core/services/lenis.service';
import { ButtonComponent } from '../ui/button.component';
import { CountdownComponent } from '../ui/countdown.component';
import { LogoComponent } from '../ui/logo.component';
import { MobileNavComponent } from './mobile-nav.component';

/**
 * Barre supérieure : transparente sur le héro, condensée au scroll (88 → 64 px, blanc à 85 % + flou + filet).
 * Un seul bouton primaire par écran : sur l'accueil, celui du header n'apparaît qu'une fois le héro dépassé.
 */
@Component({
  selector: 'sji-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonComponent, CountdownComponent, LogoComponent, MobileNavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="hd" [class.hd--scrolled]="scrolled()" [class.hd--open]="menuOpen()">
      <div class="hd__bar container">
        <a class="hd__logo" routerLink="/" aria-label="SJI INNOVA 2027, accueil" (click)="closeMenu()">
          <sji-logo [tone]="'dark'" />
        </a>
        <nav class="hd__nav" aria-label="Navigation principale">
          @for (item of nav; track item.path) {
            <a class="hd__link" [routerLink]="item.path" routerLinkActive="hd__link--active" [attr.aria-current]="null">{{ item.label }}</a>
          }
        </nav>
        <div class="hd__right">
          <sji-countdown class="hd__count" />
          <a
            sjiButton
            class="hd__cta"
            [class.hd__cta--hidden]="!ctaVisible()"
            [routerLink]="dates.cta().link"
            [fragment]="dates.cta().fragment"
            [attr.tabindex]="ctaVisible() ? null : -1"
            (click)="track()"
            >{{ ctaLabel() }}</a
          >
          <button class="hd__menu mono" type="button" [attr.aria-expanded]="menuOpen()" aria-controls="menu-mobile" (click)="toggleMenu()">
            {{ menuOpen() ? 'FERMER' : 'MENU' }}
          </button>
        </div>
      </div>
    </header>
    <!-- Hors du <header> : un backdrop-filter sur l'ancêtre piégerait le position: fixed du panneau -->
    <sji-mobile-nav [open]="menuOpen()" (closed)="closeMenu()" />
  `,
  styles: `
    :host {
      position: fixed;
      inset: 0 0 auto 0;
      z-index: 800;
    }
    .hd {
      position: relative;
      z-index: 2;
      height: var(--header-h);
      transition: height var(--d-base) var(--ease-out), background-color var(--d-base), box-shadow var(--d-base);
      border-bottom: 1px solid transparent;
    }
    .hd--scrolled,
    .hd--open {
      height: 64px;
      background: #fff; /* repli opaque pour les navigateurs sans backdrop-filter */
      border-bottom-color: var(--line);
    }
    @supports (backdrop-filter: blur(1px)) {
      .hd--scrolled {
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
    }
    .hd--open {
      background: var(--paper);
      border-bottom-color: transparent;
    }
    .hd__bar {
      height: 100%;
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: var(--sp-8);
    }
    .hd__logo {
      text-decoration: none;
      z-index: 2;
    }
    .hd__nav {
      display: none;
      justify-content: center;
      gap: clamp(1rem, 2.4vw, 2.5rem);
    }
    .hd__link {
      position: relative;
      padding: 0.5rem 0;
      font-weight: 500;
      text-decoration: none;
      color: var(--navy-900);
    }
    .hd__link::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 2px;
      height: 2px;
      background: var(--gold-500);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform var(--d-base) var(--ease-out);
    }
    .hd__link:hover::after,
    .hd__link--active::after {
      transform: scaleX(1);
    }
    .hd__right {
      grid-column: 3;
      display: flex;
      align-items: center;
      gap: var(--sp-6);
      justify-self: end;
    }
    .hd__count {
      display: none;
      max-width: 22ch;
      text-align: right;
    }
    .hd__cta {
      display: none;
      padding: 0.75rem 1.5rem;
      transition: opacity var(--d-base) var(--ease-soft), transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .hd__cta--hidden {
      opacity: 0;
      pointer-events: none;
    }
    .hd__menu {
      z-index: 2;
      padding: 0.5rem 0;
      background: none;
      border: 0;
      font-size: var(--fs-label);
      letter-spacing: var(--ls-label);
      font-weight: 700;
      color: var(--navy-900);
    }
    @media (min-width: 1024px) {
      .hd__nav {
        display: flex;
      }
      .hd__cta {
        display: inline-flex;
      }
      .hd__menu {
        display: none;
      }
      .hd__bar {
        grid-template-columns: auto 1fr auto;
      }
    }
    @media (min-width: 1280px) {
      .hd__count {
        display: block;
      }
    }
  `,
})
export class HeaderComponent {
  protected readonly nav = NAV;
  protected readonly dates = inject(ConcoursDatesService);
  private readonly analytics = inject(AnalyticsService);
  private readonly lenis = inject(LenisService);
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly scrolled = signal(false);
  protected readonly pastHero = signal(false);
  protected readonly menuOpen = signal(false);
  private readonly isHome = signal(true);

  constructor() {
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e) => {
      this.isHome.set(e.urlAfterRedirects.split(/[?#]/)[0] === '/');
      this.closeMenu();
    });
    afterNextRender(() => {
      const update = () => {
        const y = window.scrollY;
        const s = y > 24;
        const p = y > window.innerHeight * 0.6;
        if (s !== this.scrolled() || p !== this.pastHero()) {
          this.zone.run(() => {
            this.scrolled.set(s);
            this.pastHero.set(p);
          });
        }
      };
      update();
      window.addEventListener('scroll', update, { passive: true });
      this.destroyRef.onDestroy(() => window.removeEventListener('scroll', update));
    });
  }

  protected ctaVisible = () => !this.isHome() || this.pastHero();
  protected ctaLabel = () => (this.dates.phase() === 'depots' ? 'Déposer un projet' : this.dates.cta().label);

  protected toggleMenu(): void {
    this.menuOpen.update((v) => !v);
    this.menuOpen() ? this.lenis.stop() : this.lenis.start();
  }
  protected closeMenu(): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    this.lenis.start();
  }
  protected track(): void {
    this.analytics.track('CTA Deposer', { section: 'header' });
  }
}
