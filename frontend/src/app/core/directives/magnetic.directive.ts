import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';
import { MotionService } from '../services/motion.service';

/** Bouton principal uniquement : suit le curseur de 6 px maximum dans un rayon de 80 px. */
@Directive({ selector: '[sjiMagnetic]', standalone: true })
export class MagneticDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (!this.motion.rich || !matchMedia('(pointer: fine)').matches) return;
      this.motion.load().then(({ gsap }) => {
        const node = this.el.nativeElement;
        const qx = gsap.quickTo(node, 'x', { duration: 0.4, ease: 'power3.out' });
        const qy = gsap.quickTo(node, 'y', { duration: 0.4, ease: 'power3.out' });
        const move = (e: PointerEvent) => {
          const r = node.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const inside = Math.hypot(dx, dy) < 80 + Math.max(r.width, r.height) / 2;
          qx(inside ? Math.max(-6, Math.min(6, dx * 0.12)) : 0);
          qy(inside ? Math.max(-6, Math.min(6, dy * 0.12)) : 0);
        };
        window.addEventListener('pointermove', move, { passive: true });
        this.destroyRef.onDestroy(() => window.removeEventListener('pointermove', move));
      });
    });
  }
}
