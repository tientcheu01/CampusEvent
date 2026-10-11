import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, inject } from '@angular/core';
import { PageTransitionService } from '../../core/services/page-transition.service';

/** Le voile de transition entre les routes. Invisible (et hors tabulation) tant qu'aucune transition n'a lieu. */
@Component({
  selector: 'sji-page-veil',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  styles: `
    :host {
      position: fixed;
      inset: 0;
      z-index: 900;
      background: var(--navy-900);
      pointer-events: none;
      visibility: hidden;
      transform: translateY(100%);
    }
  `,
})
export class PageVeilComponent {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef);
    const transition = inject(PageTransitionService);
    afterNextRender(() => transition.register(el.nativeElement));
  }
}
