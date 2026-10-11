import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, input, signal } from '@angular/core';
import { MotionService } from '../../core/services/motion.service';

/** Barre de pondération : le trait se remplit à l'entrée dans le viewport, la pastille suit. */
@Component({
  selector: 'sji-meter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="mt__head">
      <span class="mt__label">{{ label() }}</span>
      <span class="mt__pct mono tnum">{{ value() }}&nbsp;%</span>
    </p>
    <div class="mt__rail" role="meter" [attr.aria-valuenow]="value()" aria-valuemin="0" aria-valuemax="100" [attr.aria-label]="label()">
      <span class="mt__fill" [style.width.%]="shown()"></span>
      <span class="mt__knob" [style.left.%]="shown()"></span>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .mt__head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: var(--sp-4);
      margin: 0 0 0.6rem;
      font-size: var(--fs-small);
    }
    .mt__label {
      font-weight: 700;
    }
    .mt__pct {
      color: var(--blue-600);
    }
    .mt__rail {
      position: relative;
      height: 4px;
      border-radius: var(--r-full);
      background: var(--paper-3);
    }
    .mt__fill {
      display: block;
      height: 100%;
      border-radius: var(--r-full);
      background: var(--navy-900);
      transition: width 1.1s var(--ease-out);
    }
    .mt__knob {
      position: absolute;
      top: 50%;
      width: 16px;
      height: 16px;
      margin: -8px 0 0 -8px;
      border-radius: 50%;
      background: var(--gold-500);
      border: 3px solid var(--paper);
      box-shadow: var(--shadow-sm);
      transition: left 1.1s var(--ease-out);
    }
  `,
})
export class MeterComponent {
  readonly label = input.required<string>();
  readonly value = input.required<number>();

  /** Rendu serveur et sans JS : la barre est déjà pleine, donc lisible. */
  protected readonly shown = signal(100);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef);
    const motion = inject(MotionService);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const fill = () => this.shown.set(this.value());
      if (motion.reduced) return fill();
      this.shown.set(0);
      const io = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        fill();
      });
      io.observe(el.nativeElement);
      destroyRef.onDestroy(() => io.disconnect());
    });
  }
}
