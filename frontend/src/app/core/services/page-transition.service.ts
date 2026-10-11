import { Injectable, inject } from '@angular/core';
import { MotionService } from './motion.service';
import { LenisService } from './lenis.service';

/**
 * Transition de page : un voile --navy-900 monte (450 ms), la nouvelle page apparaît dessous, le voile repart
 * (450 ms) : 900 ms en tout. Pilotée par un garde de route qui attend que le voile couvre l'écran.
 */
@Injectable({ providedIn: 'root' })
export class PageTransitionService {
  private readonly motion = inject(MotionService);
  private readonly lenis = inject(LenisService);
  private veil?: HTMLElement;
  private covered = false;
  private firstDone = false;

  register(el: HTMLElement): void {
    this.veil = el;
  }

  /** Appelé par le garde avant d'activer la nouvelle route. */
  async cover(): Promise<void> {
    if (!this.motion.isBrowser || this.motion.reduced || this.motion.lite || !this.firstDone || !this.veil) return;
    const { gsap } = await this.motion.load();
    this.covered = true;
    this.veil.style.visibility = 'visible';
    await gsap.fromTo(this.veil, { yPercent: 100 }, { yPercent: 0, duration: 0.45, ease: 'power3.inOut' });
  }

  /** Appelé à la fin (ou à l'échec) de la navigation. */
  async reveal(options: { toTop: boolean }): Promise<void> {
    if (!this.motion.isBrowser) return;
    if (options.toTop) this.lenis.scrollTop();
    if (!this.firstDone) {
      this.firstDone = true;
      return;
    }
    if (!this.covered || !this.veil) return;
    const el = this.veil;
    const { gsap } = await this.motion.load();
    this.covered = false;
    await gsap.to(el, { yPercent: -100, duration: 0.45, ease: 'power3.inOut' });
    el.style.visibility = 'hidden';
  }
}
