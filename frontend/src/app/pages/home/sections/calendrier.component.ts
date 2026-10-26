import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CALENDRIER } from '../../../core/data/site-data';
import { GlowDirective } from '../../../core/directives/glow.directive';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { SectionLabelComponent } from '../../../shared/ui/section-label.component';
import { TimelineComponent } from '../../../shared/ui/timeline.component';

/** 05 — Le calendrier. Que le 18 décembre 2026 reste en mémoire. Section dense, sur --paper-2. */
@Component({
  selector: 'sji-calendrier',
  standalone: true,
  imports: [SectionLabelComponent, TimelineComponent, RevealDirective, GlowDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="calendrier" class="section section--dense tint-2" sjiGlow="30 50 .16" aria-labelledby="cal-title">
      <div class="container">
        <header class="cal__head" sjiReveal>
          <sji-section-label num="04" text="Le calendrier" />
          <h2 id="cal-title" class="h2">Trois temps forts, un seul objectif&nbsp;: la finale.</h2>
        </header>
        <sji-timeline sjiReveal [delay]="0.1" [items]="items" />
      </div>
    </section>
  `,
  styles: `
    .cal__head {
      display: grid;
      gap: var(--sp-6);
      margin-bottom: var(--sp-12);
    }
    .cal__head h2 {
      max-width: 18ch;
    }
  `,
})
export class CalendrierComponent {
  protected readonly items = CALENDRIER;
}
