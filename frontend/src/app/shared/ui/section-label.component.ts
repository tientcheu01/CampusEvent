import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Étiquette mono en tête de section : « — 01 LE CONCOURS ». Reprise du dossier de partenariat. */
@Component({
  selector: 'sji-section-label',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="rule" aria-hidden="true"></span><span class="num">{{ num() }}</span> {{ text() }}`,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      font-family: var(--font-mono);
      font-size: var(--fs-label);
      letter-spacing: var(--ls-label);
      text-transform: uppercase;
      color: var(--blue-600);
    }
    .rule {
      width: 32px;
      height: 1px;
      background: var(--blue-600);
    }
    :host-context(.on-navy) {
      color: var(--blue-200);
    }
    :host-context(.on-navy) .rule {
      background: var(--blue-200);
    }
  `,
})
export class SectionLabelComponent {
  readonly num = input('');
  readonly text = input.required<string>();
}
