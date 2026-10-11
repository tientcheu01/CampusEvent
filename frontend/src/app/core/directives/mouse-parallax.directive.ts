import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { MotionService } from '../services/motion.service';

/** Décalage doux au mouvement de la souris (12 px maximum), calculé depuis le centre de la fenêtre. */
@Directive({ selector: '[sjiMouseParallax]', standalone: true })
export class MouseParallaxDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  readonly amplitude = input(12, { alias: 'sjiMouseParallax' });

  constructor() {
    afterNextRender(() => {
      if (!this.motion.rich || !matchMedia('(pointer: fine)').matches) return;
      this.motion.load().then(({ gsap }) => {
        const node = this.el.nativeElement;
        const max = Math.min(12, this.amplitude());
        const qx = gsap.quickTo(node, 'x', { duration: 0.8, ease: 'power3.out' });
        const qy = gsap.quickTo(node, 'y', { duration: 0.8, ease: 'power3.out' });
        const move = (e: PointerEvent) => {
          qx((e.clientX / window.innerWidth - 0.5) * 2 * max);
          qy((e.clientY / window.innerHeight - 0.5) * 2 * max);
        };
        window.addEventListener('pointermove', move, { passive: true });
        this.destroyRef.onDestroy(() => window.removeEventListener('pointermove', move));
      });
    });
  }
}
