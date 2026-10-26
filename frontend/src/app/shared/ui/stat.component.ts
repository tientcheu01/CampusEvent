import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, input, signal } from '@angular/core';
import { MotionService } from '../../core/services/motion.service';

const fmt = new Intl.NumberFormat('fr-FR');

/**
 * Un chiffre traité comme un objet : composé en très grand, jamais noyé dans une phrase.
 * `countTo` : le chiffre s'incrémente de 0 à sa valeur en 1,2 s à l'entrée dans le viewport.
 * Le texte final est dans le DOM dès le rendu serveur ; GSAP prend la main ensuite.
 */
@Component({
  selector: 'sji-stat',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="stat" [class.stat--blue]="variant() === 'blue'" [class.stat--xl]="size() === 'xl'">
      <span class="stat__value tnum">{{ shown() }}</span>
      @if (unit()) {
        <span class="stat__unit">{{ unit() }}</span>
      }
    </p>
    <p class="stat__label label">{{ label() }}</p>
  `,
  styles: `
    :host {
      display: block;
    }
    .stat {
      margin: 0;
      display: flex;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 0.25em 0.4em;
      font-family: var(--font-display);
      font-weight: 800;
      font-size: var(--fs-stat);
      line-height: 0.92;
      letter-spacing: var(--ls-display);
      color: var(--gold-500); /* l'or est une couleur de surface : seulement en très gros corps */
    }
    .stat--xl {
      font-size: var(--fs-display);
    }
    .stat--blue {
      color: var(--blue-800);
    }
    .stat__unit {
      font-size: 0.32em;
      letter-spacing: 0;
      color: var(--navy-900);
    }
    .stat__label {
      margin: 1rem 0 0;
      color: var(--text-dim);
    }
  `,
})
export class StatComponent {
  readonly value = input.required<string>();
  readonly countTo = input<number | null>(null);
  readonly unit = input('');
  readonly label = input('');
  readonly variant = input<'gold' | 'blue'>('gold');
  readonly size = input<'base' | 'xl'>('base');

  private readonly override = signal<string | null>(null);
  protected readonly shown = computed(() => this.override() ?? this.value());

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const target = this.countTo();
      if (target === null || this.motion.reduced) return;
      this.override.set(fmt.format(0));
      this.motion.load().then(({ gsap, ScrollTrigger }) => {
        const counter = { v: 0 };
        const st = ScrollTrigger.create({
          trigger: this.el.nativeElement,
          start: 'top 88%',
          once: true,
          onEnter: () =>
            gsap.to(counter, {
              v: target,
              duration: 1.2,
              ease: 'power2.out',
              onUpdate: () => this.override.set(fmt.format(Math.round(counter.v))),
              onComplete: () => this.override.set(null),
            }),
        });
        this.destroyRef.onDestroy(() => st.kill());
      });
    });
  }
}
