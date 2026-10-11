import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { PALIERS } from '../../../core/data/site-data';
import { GlowService } from '../../../core/services/glow.service';
import { MotionService } from '../../../core/services/motion.service';
import { SectionLabelComponent } from '../../../shared/ui/section-label.component';

// Centre de chaque palier, en % du cadre (même repère que le tracé SVG) : la montée du dossier de partenariat.
const POINTS = [
  { x: 7, y: 72 },
  { x: 31, y: 52 },
  { x: 55, y: 32 },
  { x: 79, y: 12 },
];

/**
 * 04 — La trajectoire. Idée → projet → solution → impact.
 * Desktop : section épinglée sur 300 % de la hauteur d'écran, la ligne pointillée se dessine, chaque palier s'allume.
 * Mobile, mouvement réduit, mode économie : pas de pin, liste verticale lisible (tout est dans le DOM).
 */
@Component({
  selector: 'sji-trajectoire',
  standalone: true,
  imports: [SectionLabelComponent],
  host: { '[class.tj-pin]': 'pinned()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section #section class="tj" aria-labelledby="tj-title">
      <div class="tj__pin" #pin>
        <div class="container tj__inner">
          <header class="tj__head">
            <sji-section-label num="02" text="Le parcours" />
            <h2 id="tj-title" class="h1">D'une idée<br />à un impact.</h2>
          </header>
          <div class="tj__stage">
            <svg class="tj__line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <defs>
                <mask id="tj-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
                  <path #reveal pathLength="1" class="tj__reveal" d="M7 72 L31 52 L55 32 L79 12" />
                </mask>
              </defs>
              <path class="tj__dots" d="M7 72 L31 52 L55 32 L79 12" mask="url(#tj-mask)" />
            </svg>
            <ol class="tj__list" role="list">
              @for (p of paliers; track p.mot; let i = $index) {
                <li class="tj__step" [class.is-on]="active() >= i" [style.--x]="points[i].x + '%'" [style.--y]="points[i].y + '%'">
                  <span class="tj__node" aria-hidden="true"></span>
                  <span class="tj__num num">0{{ i + 1 }}</span>
                  <h3 class="tj__mot">{{ p.mot }}</h3>
                  <p class="tj__txt">{{ p.texte }}</p>
                </li>
              }
            </ol>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .tj {
      position: relative;
      padding-block: var(--sp-24);
    }
    .tj__head {
      display: grid;
      gap: var(--sp-6);
      margin-bottom: var(--sp-12);
    }
    .tj__line {
      display: none;
    }
    .tj__list {
      list-style: none;
      margin: 0;
      padding: 0 0 0 var(--sp-6);
      border-left: 2px dotted var(--blue-200);
      display: grid;
      gap: var(--sp-8);
    }
    .tj__step {
      position: relative;
    }
    .tj__node {
      position: absolute;
      left: calc(var(--sp-6) * -1 - 7px);
      top: 0.4rem;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--paper);
      border: 2px solid var(--blue-600);
    }
    .tj__num {
      color: var(--blue-200);
      font-size: 2.5rem;
      line-height: 1;
    }
    .tj__mot {
      margin: var(--sp-2) 0;
      font-family: var(--font-display);
      font-weight: 800;
      font-size: var(--fs-h2);
      letter-spacing: -0.03em;
      line-height: 1;
    }
    .tj__txt {
      margin: 0;
      color: var(--text-dim);
      max-width: 28ch;
    }

    /* Mode pin : desktop riche uniquement (classe posée par le composant). */
    .tj--pinned .tj__pin {
      min-height: 100vh;
      min-height: 100svh;
      display: flex;
      align-items: center;
    }
    :host(.tj-pin) .tj {
      padding-block: 0;
    }
    :host(.tj-pin) .tj__stage {
      position: relative;
      height: clamp(340px, 54svh, 520px);
    }
    :host(.tj-pin) .tj__line {
      display: block;
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
    :host(.tj-pin) .tj__dots {
      fill: none;
      stroke: var(--blue-600);
      stroke-width: 2px;
      stroke-dasharray: 2 9;
      stroke-linecap: round;
      vector-effect: non-scaling-stroke;
    }
    :host(.tj-pin) .tj__reveal {
      fill: none;
      stroke: #fff;
      stroke-width: 6;
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
    }
    :host(.tj-pin) .tj__list {
      display: block;
      border: 0;
      padding: 0;
      position: absolute;
      inset: 0;
    }
    :host(.tj-pin) .tj__step {
      position: absolute;
      left: calc(var(--x) - 1.5%);
      top: calc(var(--y) - 1%);
      width: 20%;
      opacity: 0.35;
      transform: translateY(12px);
      transition:
        opacity var(--d-base) var(--ease-out),
        transform var(--d-base) var(--ease-out);
    }
    :host(.tj-pin) .tj__step.is-on {
      opacity: 1;
      transform: none;
    }
    :host(.tj-pin) .tj__node {
      left: 0;
      top: -22px;
      width: 18px;
      height: 18px;
      transition: background-color var(--d-base), border-color var(--d-base);
    }
    :host(.tj-pin) .tj__step.is-on .tj__node {
      background: var(--gold-500);
      border-color: var(--gold-500);
    }
    :host(.tj-pin) .tj__step.is-on .tj__num {
      color: var(--gold-700);
    }
  `,
})
export class TrajectoireComponent {
  protected readonly paliers = PALIERS;
  protected readonly points = POINTS;
  protected readonly active = signal(3); // tout allumé par défaut (rendu serveur, sans JS, mobile)
  protected readonly pinned = signal(false);

  private readonly section = viewChild.required<ElementRef<HTMLElement>>('section');
  private readonly reveal = viewChild.required<ElementRef<SVGPathElement>>('reveal');
  private readonly motion = inject(MotionService);
  private readonly glow = inject(GlowService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (!this.motion.rich || !matchMedia('(min-width: 1024px)').matches) return;
      this.motion.load().then(({ gsap, ScrollTrigger }) => {
        const section = this.section().nativeElement;
        this.pinned.set(true);
        this.active.set(0);
        let ctx: ReturnType<typeof gsap.context> | undefined;
        // On attend que la classe `tj-pin` soit appliquée : la mise en page change avant le calcul du pin.
        const raf = requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            ctx = gsap.context(() => {
              const tl = gsap.timeline({
                scrollTrigger: {
                  trigger: section,
                  start: 'top top',
                  end: '+=300%',
                  pin: true,
                  scrub: 0.6,
                  anticipatePin: 1,
                  onUpdate: (self) => {
                    const i = Math.min(3, Math.floor(self.progress * 4));
                    if (i !== this.active()) {
                      this.active.set(i);
                      this.glow.setTarget({ x: POINTS[i].x + 10, y: POINTS[i].y, intensity: 0.2 });
                    }
                  },
                },
              });
              tl.to(this.reveal().nativeElement, { strokeDashoffset: 0, ease: 'none', duration: 1 });
            }, section);
            ScrollTrigger.refresh();
          }),
        );
        this.destroyRef.onDestroy(() => {
          cancelAnimationFrame(raf);
          ctx?.revert();
        });
      });
    });
  }
}
