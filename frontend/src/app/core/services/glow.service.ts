import { Injectable, inject } from '@angular/core';
import { MotionService } from './motion.service';

export interface GlowTarget {
  x: number; // 0-100 (vw)
  y: number; // 0-100 (vh)
  intensity: number; // 0-.22
}

/**
 * La lueur dorée suit la section active. Un seul rAF met à jour trois variables CSS ;
 * la boucle s'arrête dès que la lueur est arrivée (pas de rAF permanent).
 * Sur fond blanc, au-delà de .22 d'intensité l'or vire au jaune sale : on plafonne.
 */
@Injectable({ providedIn: 'root' })
export class GlowService {
  private readonly motion = inject(MotionService);
  private readonly target: GlowTarget = { x: 50, y: 0, intensity: 0.22 };
  private readonly current: GlowTarget = { ...this.target };
  private raf = 0;

  setTarget(t: Partial<GlowTarget>): void {
    if (!this.motion.isBrowser) return;
    Object.assign(this.target, t, { intensity: Math.min(0.22, t.intensity ?? this.target.intensity) });
    if (!this.motion.rich) return this.apply(this.target); // pas de halo animé : position directe
    if (!this.raf) this.raf = requestAnimationFrame(this.frame);
  }

  private readonly frame = (): void => {
    const c = this.current;
    const t = this.target;
    c.x += (t.x - c.x) * 0.08;
    c.y += (t.y - c.y) * 0.08;
    c.intensity += (t.intensity - c.intensity) * 0.08;
    this.apply(c);
    const settled = Math.abs(t.x - c.x) < 0.05 && Math.abs(t.y - c.y) < 0.05 && Math.abs(t.intensity - c.intensity) < 0.001;
    this.raf = settled ? 0 : requestAnimationFrame(this.frame);
  };

  private apply(v: GlowTarget): void {
    Object.assign(this.current, v);
    const s = document.documentElement.style;
    s.setProperty('--glow-x', v.x.toFixed(2));
    s.setProperty('--glow-y', v.y.toFixed(2));
    s.setProperty('--glow-i', v.intensity.toFixed(3));
  }
}
