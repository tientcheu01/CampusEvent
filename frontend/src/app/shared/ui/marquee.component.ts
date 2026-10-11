import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { MotionService } from '../../core/services/motion.service';

/**
 * Bande défilante en CSS pur (transform: translate3d). Décorative : aria-hidden.
 * Seule JS : au changement de sens du scroll, la vitesse s'inverse (Web Animations API, sans saut).
 */
@Component({
  selector: 'sji-marquee',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="track" [class.track--fast]="speed() === 'fast'" aria-hidden="true">
      @for (copy of [0, 1]; track copy) {
        <ul class="group" role="presentation">
          @for (item of items(); track item) {
            <li>{{ item }}</li>
          }
        </ul>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      overflow: hidden;
      border-block: var(--border);
      height: 72px;
      background: var(--paper);
    }
    .track {
      display: flex;
      width: max-content;
      height: 100%;
      animation: marquee 48s linear infinite;
    }
    .track--fast {
      animation-duration: 26s;
    }
    .group {
      display: flex;
      align-items: center;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    li {
      display: flex;
      align-items: center;
      white-space: nowrap;
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 1.75rem;
      letter-spacing: -0.01em;
      text-transform: uppercase;
      color: var(--navy-900);
    }
    li::after {
      content: '';
      width: 8px;
      height: 8px;
      margin-inline: 2rem;
      background: var(--gold-500);
      transform: rotate(45deg);
    }
    @keyframes marquee {
      to {
        transform: translate3d(-50%, 0, 0);
      }
    }
  `,
})
export class MarqueeComponent {
  readonly items = input.required<string[]>();
  readonly speed = input<'slow' | 'fast'>('slow');

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (!this.motion.rich) return;
      let last = window.scrollY;
      let dir = 1;
      const onScroll = () => {
        const y = window.scrollY;
        const next = y > last ? 1 : y < last ? -1 : dir;
        last = y;
        if (next === dir) return;
        dir = next;
        this.el.nativeElement.getAnimations({ subtree: true }).forEach((a) => a.updatePlaybackRate(dir));
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      this.destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
    });
  }
}
