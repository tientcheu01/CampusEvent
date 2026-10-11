import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { gsap as Gsap } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';

export interface MotionLibs {
  gsap: typeof Gsap;
  ScrollTrigger: typeof ScrollTriggerType;
}

/**
 * Point d'entrée unique du mouvement : charge GSAP à la demande (modules séparés, jamais le bundle
 * complet), expose `prefers-reduced-motion` et le « mode économie » (saveData, 2g/3g).
 * Rien n'est exécuté côté serveur.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly reduced = this.isBrowser && matchMedia('(prefers-reduced-motion: reduce)').matches;
  readonly lite = this.isBrowser && this.detectLite();
  /** Parallaxe, magnétisme, halo animé et épinglage ne tournent que dans ce cas. */
  readonly rich = this.isBrowser && !this.reduced && !this.lite;

  private libs?: Promise<MotionLibs>;

  load(): Promise<MotionLibs> {
    this.libs ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, s]) => {
      g.gsap.registerPlugin(s.ScrollTrigger);
      return { gsap: g.gsap, ScrollTrigger: s.ScrollTrigger };
    });
    return this.libs;
  }

  private detectLite(): boolean {
    const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    return !!c && (c.saveData === true || /^(slow-2g|2g|3g)$/.test(c.effectiveType ?? ''));
  }
}
