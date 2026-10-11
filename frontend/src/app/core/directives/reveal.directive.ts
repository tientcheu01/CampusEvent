import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { MotionService } from '../services/motion.service';

/**
 * Une directive couvre 90 % des animations : révélation à l'entrée dans le viewport.
 *  - fade-up : translateY(24px) + opacité
 *  - mask    : clip-path inset(100% 0 0 0) → inset(0), par ligne ([data-line]) décalée de 60 ms
 *  - stagger : enfants directs en cascade (80 ms)
 *
 * Le déclenchement passe par un IntersectionObserver natif plutôt que par ScrollTrigger : il ne dépend
 * d'aucun recalcul de hauteur de page, donc le contenu ne peut pas rester masqué.
 * L'état initial est appliqué par GSAP, jamais par le CSS : si le script ne charge pas, tout reste lisible.
 */
@Directive({ selector: '[sjiReveal]', standalone: true })
export class RevealDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  readonly mode = input<'fade-up' | 'mask' | 'stagger' | ''>('fade-up', { alias: 'sjiReveal' });
  readonly delay = input(0);

  constructor() {
    afterNextRender(() => {
      this.motion.load().then(({ gsap }) => {
        const node = this.el.nativeElement;
        const mode = this.mode() || 'fade-up';
        const reduced = this.motion.reduced;

        const ctx = gsap.context(() => {
          const common = { delay: this.delay(), paused: true, ease: 'power3.out' as const };
          let tween: gsap.core.Tween;

          if (reduced) {
            tween = gsap.from(node, { ...common, opacity: 0, duration: 0.15 });
          } else if (mode === 'mask') {
            const lines = node.querySelectorAll('[data-line]');
            tween = gsap.from(lines.length ? lines : node, {
              ...common,
              clipPath: 'inset(100% 0 0 0)',
              yPercent: 18,
              duration: 0.7,
              stagger: 0.06,
              clearProps: 'clipPath,transform',
            });
          } else {
            tween = gsap.from(mode === 'stagger' ? Array.from(node.children) : node, {
              ...common,
              y: 24,
              opacity: 0,
              duration: 0.7,
              stagger: mode === 'stagger' ? 0.08 : 0,
              clearProps: 'transform,opacity',
            });
          }

          const io = new IntersectionObserver(
            (entries) => {
              if (!entries.some((e) => e.isIntersecting)) return;
              io.disconnect();
              tween.play();
            },
            { rootMargin: '0px 0px -12% 0px' },
          );
          io.observe(node);
          this.destroyRef.onDestroy(() => io.disconnect());
        }, node);

        this.destroyRef.onDestroy(() => ctx.revert());
      });
    });
  }
}
