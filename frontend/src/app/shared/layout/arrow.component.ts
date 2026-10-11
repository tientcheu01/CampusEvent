import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { MotionService } from '../../core/services/motion.service';

/**
 * L'effet signature : la diagonale dorée. Un seul <path> SVG fixe qui monte de gauche à droite et se dessine
 * au rythme de la lecture (stroke-dashoffset lié au scroll). Elle arrive au bout quand le lecteur atteint
 * l'élément [data-arrow-end] (le bloc d'appel final), ou le bas de page à défaut.
 * Le tracé est en coordonnées pixels, recalculé au redimensionnement : un viewBox étiré déformerait le trait.
 */
@Component({
  selector: 'sji-arrow',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg [attr.viewBox]="'0 0 ' + size().w + ' ' + size().h" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="sji-arrow-grad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stop-color="#f8a91b" />
          <stop offset="1" stop-color="#ffc24a" />
        </linearGradient>
      </defs>
      <path #path [attr.d]="d()" />
    </svg>
    <i #tip class="tip"></i>
  `,
  styles: `
    :host {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
    }
    svg {
      width: 100%;
      height: 100%;
    }
    path {
      fill: none;
      stroke: url(#sji-arrow-grad);
      stroke-width: 3;
      stroke-linecap: round;
      /* Masqué tant que le scroll ne l'a pas dessiné (valeur au-delà de toute longueur possible) */
      stroke-dasharray: 4000;
      stroke-dashoffset: 4000;
    }
    .tip {
      position: absolute;
      top: 0;
      left: 0;
      width: 360px;
      height: 360px;
      margin: -180px 0 0 -180px;
      background: var(--glow-gold);
      opacity: 0;
    }
    @media (max-width: 639px) {
      path {
        opacity: 0.5;
      }
    }
    /* Mouvement réduit : le trait est posé une fois pour toutes, en retrait. */
    @media (prefers-reduced-motion: reduce) {
      path {
        stroke-dashoffset: 0;
        opacity: 0.3;
      }
    }
  `,
})
export class ArrowComponent {
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly path = viewChild.required<ElementRef<SVGPathElement>>('path');
  private readonly tip = viewChild.required<ElementRef<HTMLElement>>('tip');

  // Valeurs de départ pour le rendu serveur ; remplacées par les dimensions réelles au premier rendu.
  protected readonly size = signal({ w: 1440, h: 900 });
  protected readonly d = () => {
    const { w, h } = this.size();
    // Part du bord gauche sous le pli, monte en diagonale et ressort en haut à droite.
    return `M${-0.04 * w} ${1.06 * h}C${0.22 * w} ${0.82 * h} ${0.48 * w} ${0.58 * h} ${0.68 * w} ${0.3 * h}S${0.95 * w} ${-0.04 * h} ${1.04 * w} ${-0.08 * h}`;
  };

  constructor() {
    afterNextRender(() => {
      const apply = () => this.size.set({ w: window.innerWidth, h: window.innerHeight });
      apply();
      window.addEventListener('resize', apply, { passive: true });
      this.destroyRef.onDestroy(() => window.removeEventListener('resize', apply));

      if (this.motion.reduced) return;
      this.motion.load().then(({ ScrollTrigger }) => {
        const path = this.path().nativeElement;
        const tip = this.tip().nativeElement;
        const st = ScrollTrigger.create({
          start: 0,
          invalidateOnRefresh: true,
          end: () => {
            const target = document.querySelector('[data-arrow-end]');
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const stop = target ? target.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.45 : max;
            return Math.max(200, Math.min(max, stop));
          },
          onRefresh: () => {
            const len = path.getTotalLength();
            path.style.strokeDasharray = String(len);
          },
          onUpdate: (self) => {
            const len = path.getTotalLength();
            path.style.strokeDashoffset = String(len * (1 - self.progress));
            const pt = path.getPointAtLength(self.progress * len);
            tip.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0)`;
            tip.style.opacity = String(Math.min(1, self.progress * 4) * 0.9);
          },
        });
        this.destroyRef.onDestroy(() => st.kill());
      });
    });
  }
}
