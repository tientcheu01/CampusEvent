import { Injectable, inject } from '@angular/core';
import type Lenis from 'lenis';
import { MotionService } from './motion.service';

/** Scroll fluide branché sur le ticker GSAP. Désactivé en mouvement réduit. */
@Injectable({ providedIn: 'root' })
export class LenisService {
  private readonly motion = inject(MotionService);
  private lenis?: Lenis;
  private tick?: (t: number) => void;

  async init(): Promise<void> {
    if (this.lenis || !this.motion.isBrowser || this.motion.reduced) return;
    const [{ default: LenisCtor }, { gsap, ScrollTrigger }] = await Promise.all([import('lenis'), this.motion.load()]);
    this.lenis = new LenisCtor({ duration: 1.1, smoothWheel: true });
    this.lenis.on('scroll', ScrollTrigger.update);
    this.tick = (t) => this.lenis?.raf(t * 1000);
    gsap.ticker.add(this.tick);
    gsap.ticker.lagSmoothing(0);
  }

  /** Menu mobile, modales : on fige le scroll. */
  stop(): void {
    this.lenis?.stop();
  }
  start(): void {
    this.lenis?.start();
  }

  scrollTo(target: number | string | HTMLElement, offset = 0): void {
    if (this.lenis) this.lenis.scrollTo(target, { offset });
    else if (typeof target === 'number') window.scrollTo({ top: target });
    else {
      const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset });
    }
  }

  scrollTop(): void {
    this.lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }

  async destroy(): Promise<void> {
    if (this.tick) (await this.motion.load()).gsap.ticker.remove(this.tick);
    this.lenis?.destroy();
    this.lenis = undefined;
  }
}
