import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { IconComponent } from './icon.component';

let uid = 0;

/** Accordéon sobre : déroulé de 400 ms en grid-template-rows, le « + » pivote en « × ». */
@Component({
  selector: 'sji-accordion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styles: `
    :host {
      display: block;
      border-top: var(--border);
    }
  `,
})
export class AccordionComponent {}

@Component({
  selector: 'sji-accordion-item',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3 class="acc__head">
      <button type="button" class="acc__btn" [attr.aria-expanded]="open()" [attr.aria-controls]="id + '-p'" [id]="id + '-b'" (click)="open.set(!open())">
        <span class="h3">{{ title() }}</span>
        <sji-icon class="acc__plus" name="plus" [size]="24" />
      </button>
    </h3>
    <div class="acc__panel" [id]="id + '-p'" role="region" [attr.aria-labelledby]="id + '-b'" [class.acc__panel--open]="open()">
      <div class="acc__inner"><div class="acc__body"><ng-content /></div></div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      border-bottom: var(--border);
    }
    .acc__head {
      margin: 0;
    }
    .acc__btn {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      gap: var(--sp-6);
      padding: var(--sp-6) 0;
      background: none;
      border: 0;
      text-align: left;
      cursor: pointer;
    }
    .acc__btn:hover .h3 {
      color: var(--blue-600);
    }
    .acc__plus {
      transition: transform var(--d-base) var(--ease-out);
      color: var(--navy-900);
    }
    .acc__btn[aria-expanded='true'] .acc__plus {
      transform: rotate(45deg);
    }
    .acc__panel {
      display: grid;
      grid-template-rows: 0fr;
      visibility: hidden;
      transition:
        grid-template-rows 400ms var(--ease-out),
        visibility 0s linear 400ms;
    }
    .acc__panel--open {
      grid-template-rows: 1fr;
      visibility: visible;
      transition-delay: 0s;
    }
    .acc__inner {
      overflow: hidden;
    }
    .acc__body {
      padding-bottom: var(--sp-8);
      max-width: 62ch;
      color: var(--text-dim);
    }
  `,
})
export class AccordionItemComponent {
  readonly title = input.required<string>();
  protected readonly id = `acc-${uid++}`;
  protected readonly open = signal(false);
}
