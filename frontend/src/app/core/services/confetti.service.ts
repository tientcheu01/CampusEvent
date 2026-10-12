import { DOCUMENT } from '@angular/common';
import { Injectable, NgZone, inject } from '@angular/core';
import { MotionService } from './motion.service';

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vrot: number;
  color: string;
  shape: 0 | 1 | 2; // rectangle, losange, ruban
  life: number;
}

// Couleurs de la charte : or, bleu de marque, bleu pâle, et le tricolore camerounais.
const COLORS = ['#f8a91b', '#ffc24a', '#2e6be6', '#bbd0f7', '#13a04a', '#d4262c', '#0a1f4d'];
const GRAVITY = 0.42;
const DRAG = 0.986;

/**
 * Explosion de confettis à la validation d'un formulaire : deux gerbes latérales plus
 * une salve centrale, puis retombée. Canvas plein écran retiré dès la fin de l'animation.
 */
@Injectable({ providedIn: 'root' })
export class ConfettiService {
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly motion = inject(MotionService);
  private canvas?: HTMLCanvasElement;
  private overlay?: HTMLElement;
  private overlayTimer = 0;
  private raf = 0;

  /** `origin` en fraction de l'écran (0–1) ; par défaut le centre haut. */
  celebrate(title = 'Félicitations !', message = 'Votre demande a bien été prise en compte.', origin = { x: 0.5, y: 0.42 }): void {
    if (!this.motion.isBrowser) return;
    this.showMessage(title, message);
    if (this.motion.reduced) return;
    const canvas = this.ensureCanvas();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const pieces: Piece[] = [
      ...this.burst(origin.x * w, origin.y * h, 90, -Math.PI / 2, Math.PI * 0.9, 17),
      ...this.burst(0, h * 0.78, 45, -Math.PI / 3.4, Math.PI / 3.6, 21),
      ...this.burst(w, h * 0.78, 45, (-Math.PI * 2) / 3, Math.PI / 3.6, 21),
    ];

    this.zone.runOutsideAngular(() => {
      cancelAnimationFrame(this.raf);
      const frame = () => {
        ctx.clearRect(0, 0, w, h);
        let alive = 0;
        for (const p of pieces) {
          if (p.life <= 0) continue;
          alive++;
          p.vx *= DRAG;
          p.vy = p.vy * DRAG + GRAVITY;
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vrot;
          p.life -= 1;
          if (p.y > h + 40) p.life = 0;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.globalAlpha = Math.min(1, p.life / 40);
          ctx.fillStyle = p.color;
          if (p.shape === 1) {
            ctx.beginPath();
            ctx.moveTo(0, -p.size / 2);
            ctx.lineTo(p.size / 2, 0);
            ctx.lineTo(0, p.size / 2);
            ctx.lineTo(-p.size / 2, 0);
            ctx.fill();
          } else {
            // Le ruban s'aplatit en tournant : il donne l'impression de voltiger.
            const hh = p.shape === 2 ? p.size * 0.35 * Math.abs(Math.cos(p.rot)) : p.size * 0.5;
            ctx.fillRect(-p.size / 2, -hh / 2, p.size, hh);
          }
          ctx.restore();
        }
        if (alive) this.raf = requestAnimationFrame(frame);
        else this.cleanup();
      };
      this.raf = requestAnimationFrame(frame);
    });
  }

  private showMessage(title: string, message: string): void {
    this.overlay?.remove();
    window.clearTimeout(this.overlayTimer);

    const overlay = this.doc.createElement('div');
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:940;display:grid;place-items:center;padding:1.25rem;pointer-events:none;overflow:hidden;background:rgba(10,31,77,.2);backdrop-filter:blur(3px)';

    const style = this.doc.createElement('style');
    style.textContent = `
      @keyframes sji-success-in{from{opacity:0;transform:translateY(24px) scale(.94)}to{opacity:1;transform:none}}
      @keyframes sji-eagle-fly{0%{opacity:0;transform:translate3d(0,18vh,0) scale(.45) rotate(var(--r))}18%{opacity:1}100%{opacity:0;transform:translate3d(var(--x),-72vh,0) scale(1.35) rotate(calc(var(--r) * -1))}}
      @keyframes sji-wing{50%{transform:scaleY(.55)}}
      .sji-success-card{position:relative;z-index:2;width:min(92vw,560px);padding:2.2rem 2rem;text-align:center;color:#0a1f4d;border:1px solid rgba(255,255,255,.7);border-radius:24px;background:rgba(255,255,255,.94);box-shadow:0 32px 90px rgba(10,31,77,.3);animation:sji-success-in .55s cubic-bezier(.2,.8,.2,1) both}
      .sji-success-mark{display:grid;width:64px;aspect-ratio:1;margin:0 auto 1rem;place-items:center;color:#0a1f4d;border-radius:50%;background:#f8a91b;font:800 28px 'Bricolage Grotesque',sans-serif}
      .sji-success-card h2{margin:0;font:800 clamp(1.7rem,5vw,2.5rem)/1.05 'Bricolage Grotesque',sans-serif}
      .sji-success-card p{max-width:42ch;margin:.8rem auto 0;color:#4a5e8a;font:400 1rem/1.65 'Satoshi',sans-serif}
      .sji-eagle{position:absolute;z-index:1;bottom:-8rem;left:var(--l);width:clamp(44px,7vw,90px);color:#f8a91b;filter:drop-shadow(0 8px 16px rgba(10,31,77,.18));animation:sji-eagle-fly 2.8s var(--d) cubic-bezier(.2,.6,.2,1) both}
      .sji-eagle svg{display:block;width:100%;overflow:visible;animation:sji-wing .38s ease-in-out infinite}
      @media(prefers-reduced-motion:reduce){.sji-success-card{animation:none}.sji-eagle{display:none}}
    `;
    overlay.appendChild(style);

    const eagle = '<svg viewBox="0 0 120 70" aria-hidden="true"><path fill="currentColor" d="M60 32C44 13 24 5 2 8c17 7 26 17 31 30C20 33 9 36 0 45c20-2 36 3 49 15l11 10 11-10c13-12 29-17 49-15-9-9-20-12-33-7 5-13 14-23 31-30-22-3-42 5-58 24Z"/><path fill="#0a1f4d" d="m55 35 5-11 5 11-5 7Z"/></svg>';
    for (let i = 0; i < 8; i++) {
      const bird = this.doc.createElement('span');
      bird.className = 'sji-eagle';
      bird.style.setProperty('--l', `${4 + i * 13}%`);
      bird.style.setProperty('--x', `${(i % 2 ? 1 : -1) * (30 + i * 7)}px`);
      bird.style.setProperty('--r', `${i % 2 ? 8 : -8}deg`);
      bird.style.setProperty('--d', `${i * 0.11}s`);
      bird.innerHTML = eagle;
      overlay.appendChild(bird);
    }

    const card = this.doc.createElement('div');
    card.className = 'sji-success-card';
    const mark = this.doc.createElement('span');
    mark.className = 'sji-success-mark';
    mark.textContent = '✓';
    const heading = this.doc.createElement('h2');
    heading.textContent = title;
    const copy = this.doc.createElement('p');
    copy.textContent = message;
    card.append(mark, heading, copy);
    overlay.appendChild(card);
    this.doc.body.appendChild(overlay);
    this.overlay = overlay;
    this.overlayTimer = window.setTimeout(() => {
      overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, fill: 'forwards' }).finished.then(() => overlay.remove());
      if (this.overlay === overlay) this.overlay = undefined;
    }, 3600);
  }

  private burst(x: number, y: number, count: number, angle: number, spread: number, power: number): Piece[] {
    return Array.from({ length: count }, () => {
      const a = angle + (Math.random() - 0.5) * spread;
      const speed = power * (0.45 + Math.random() * 0.75);
      return {
        x,
        y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        size: 7 + Math.random() * 9,
        rot: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 0.34,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        shape: ((Math.random() * 3) | 0) as 0 | 1 | 2,
        life: 150 + Math.random() * 90,
      };
    });
  }

  private ensureCanvas(): HTMLCanvasElement {
    if (!this.canvas) {
      const c = this.doc.createElement('canvas');
      c.setAttribute('aria-hidden', 'true');
      c.style.cssText = 'position:fixed;inset:0;z-index:950;pointer-events:none';
      this.doc.body.appendChild(c);
      this.canvas = c;
    }
    this.canvas.width = this.doc.documentElement.clientWidth;
    this.canvas.height = this.doc.documentElement.clientHeight;
    return this.canvas;
  }

  private cleanup(): void {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.canvas?.remove();
    this.canvas = undefined;
  }
}
