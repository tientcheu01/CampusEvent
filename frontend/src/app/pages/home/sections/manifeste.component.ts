import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { VERBES } from '../../../core/data/site-data';
import { GlowDirective } from '../../../core/directives/glow.directive';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { MotionService } from '../../../core/services/motion.service';
import { SectionLabelComponent } from '../../../shared/ui/section-label.component';

interface Word {
  t: string;
  key?: boolean;
  flag?: boolean; // « camerounaise » : souligné du filet tricolore
}

// Les mots-clés sont en --navy-900 plein ; le reste en --text-dim. L'encrage anime les mots-clés au scroll.
// P : mots ordinaires (espace insécable avant : ; ! ?) — K : mots-clés.
const P = (s: string): Word[] =>
  s
    .replace(/ ([:;!?])/g, ' $1')
    .split(' ')
    .map((t) => ({ t }));
const K = (s: string): Word[] => s.split(' ').map((t) => ({ t, key: true }));

const TEXT: Word[] = [
  ...K('SJI INNOVA récompense'),
  ...P('les projets d’étudiants qui répondent à un'),
  ...K('besoin réel'),
  ...P('de la société'),
  { t: 'camerounaise.', key: true, flag: true },
  ...P('Pas une idée sur papier : un'),
  ...K('problème identifié,'),
  ...P('une'),
  ...K('solution construite,'),
  ...P('un'),
  ...K('prototype'),
  ...P('qu’on peut montrer. La première édition a fait émerger plusieurs projets portés par des étudiants ; la deuxième en fait un'),
  ...K('rendez-vous annuel.'),
];

/** 03 — Le manifeste. Un seul paragraphe, composé en gros, qui s'encre mot à mot. */
@Component({
  selector: 'sji-manifeste',
  standalone: true,
  imports: [SectionLabelComponent, RevealDirective, GlowDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="manifeste" class="section grid-wrap" sjiGlow="30 40 .16" aria-labelledby="manifeste-label">
      <div class="container grid">
        <div class="mf__main">
          <sji-section-label id="manifeste-label" num="01" text="Le concours" />
          <p #para class="mf__text" sjiReveal>
            @for (w of words; track $index) {
              <span class="w" [class.w--key]="w.key" [class.w--flag]="w.flag">{{ w.t }}</span>{{ ' ' }}
            }
          </p>
        </div>
        <aside class="mf__aside" aria-label="Nos trois missions">
          <dl sjiReveal="stagger">
            @for (v of verbes; track v.verbe) {
              <div class="mf__verb">
                <dt class="h3">{{ v.verbe }}</dt>
                <dd class="dim">{{ v.texte }}</dd>
              </div>
            }
          </dl>
        </aside>
      </div>
    </section>
  `,
  styles: `
    .mf__main {
      grid-column: 1 / -1;
      display: grid;
      gap: var(--sp-8);
      align-content: start;
    }
    .mf__text {
      font-family: var(--font-display);
      font-weight: 600;
      font-size: var(--fs-h3);
      line-height: 1.28;
      letter-spacing: -0.015em;
      color: var(--text-dim);
      max-width: 38ch;
    }
    .w--key {
      color: var(--navy-900);
    }
    .w--flag {
      position: relative;
    }
    .w--flag::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -0.1em;
      height: 4px;
      background: linear-gradient(90deg, var(--cm-green) 0 33.3%, var(--cm-red) 33.3% 66.6%, var(--gold-500) 66.6%);
    }
    .mf__aside {
      grid-column: 1 / -1;
      margin-top: var(--sp-16);
    }
    .mf__verb {
      padding: var(--sp-6) 0;
      border-top: var(--border);
    }
    .mf__verb:last-child {
      border-bottom: var(--border);
    }
    .mf__verb dd {
      margin: var(--sp-2) 0 0;
    }
    @media (min-width: 1024px) {
      .mf__main {
        grid-column: 1 / span 8;
      }
      .mf__text {
        font-size: clamp(1.75rem, 1rem + 1.8vw, 2.5rem);
      }
      .mf__aside {
        grid-column: 10 / span 3;
        margin-top: var(--sp-16);
        align-self: end;
      }
    }
  `,
})
export class ManifesteComponent {
  protected readonly words = TEXT;
  protected readonly verbes = VERBES;

  private readonly para = viewChild.required<ElementRef<HTMLElement>>('para');
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (!this.motion.rich) return;
      this.motion.load().then(({ gsap }) => {
        const node = this.para().nativeElement;
        const ctx = gsap.context(() => {
          // Encrage : chaque mot-clé passe du gris bleuté au bleu nuit en entrant dans le viewport.
          gsap.fromTo(
            node.querySelectorAll('.w--key'),
            { color: '#4a5e8a' },
            {
              color: '#0a1f4d',
              stagger: 0.12,
              ease: 'none',
              scrollTrigger: { trigger: node, start: 'top 82%', end: 'bottom 48%', scrub: true },
            },
          );
        }, node);
        this.destroyRef.onDestroy(() => ctx.revert());
      });
    });
  }
}
