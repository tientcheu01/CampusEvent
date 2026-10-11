import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { MotionService } from '../services/motion.service';

/** Parallaxe liée au scroll : translateY de ±N % maximum. Coupée en mouvement réduit et en mode économie. */
@Directive({ selector: '[sjiParallax]', standalone: true })
export class ParallaxDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  readonly amount = input(8, { alias: 'sjiParallax' });

  constructor() {
    afterNextRender(() => {
      if (!this.motion.rich || matchMedia('(max-width: 639px)').matches) return;
      this.motion.load().then(({ gsap }) => {
        const node = this.el.nativeElement;
        const ctx = gsap.context(() => {
          gsap.fromTo(
            node,
            { yPercent: -this.amount() },
            {
              yPercent: this.amount(),
              ease: 'none',
              scrollTrigger: { trigger: node, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        }, node);
        this.destroyRef.onDestroy(() => ctx.revert());
      });
    });
  }
}
