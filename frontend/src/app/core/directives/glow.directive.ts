import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { GlowService } from '../services/glow.service';
import { MotionService } from '../services/motion.service';

/**
 * Déclare la cible de la lueur pour une section : [sjiGlow]="'50 20 .18'" (x vw, y vh, intensité).
 * Un ScrollTrigger par section met la cible à jour quand elle devient active.
 */
@Directive({ selector: '[sjiGlow]', standalone: true })
export class GlowDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private readonly glow = inject(GlowService);
  private readonly destroyRef = inject(DestroyRef);

  readonly spec = input<string>('50 20 .18', { alias: 'sjiGlow' });

  constructor() {
    afterNextRender(() => {
      this.motion.load().then(({ ScrollTrigger }) => {
        const [x, y, intensity] = this.spec().split(/\s+/).map(Number);
        const st = ScrollTrigger.create({
          trigger: this.el.nativeElement,
          start: 'top 60%',
          end: 'bottom 40%',
          onToggle: (self) => self.isActive && this.glow.setTarget({ x, y, intensity }),
        });
        this.destroyRef.onDestroy(() => st.kill());
      });
    });
  }
}
