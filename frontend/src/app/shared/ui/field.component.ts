import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from './icon.component';

export interface FieldOption {
  value: string;
  label: string;
}

let uid = 0;

const DEFAULT_MESSAGES: Record<string, string> = {
  required: 'Ce champ est obligatoire.',
  email: 'Saisissez une adresse e-mail valide, par exemple nom@domaine.cm.',
  pattern: 'Le format de ce champ n’est pas valide.',
  minlength: 'Ce texte est un peu court.',
  maxlength: 'Ce texte dépasse la longueur autorisée.',
};

/**
 * Champ de formulaire : label toujours visible (jamais un placeholder), bordure basse seule qui passe
 * à l'or au focus, erreur en rouge sous le champ liée par aria-describedby.
 * Détection de changement par défaut : l'état touched/invalid est lu directement sur le contrôle.
 */
@Component({
  selector: 'sji-field',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent],
  template: `
    @if (type() === 'checkbox') {
      <div class="f f--check" [class.f--error]="showError()">
        <label class="f__checkrow">
          <input type="checkbox" [formControl]="control()" [id]="id" [attr.aria-describedby]="describedBy()" [attr.aria-invalid]="showError()" />
          <span class="f__box" aria-hidden="true"><sji-icon name="check" /></span>
          <span class="f__checktext">{{ label() }}</span>
        </label>
        @if (showError()) {
          <p class="f__error" [id]="id + '-e'">{{ errorText() }}</p>
        }
      </div>
    } @else {
      <div class="f" [class.f--error]="showError()">
        <label class="f__label label" [for]="id">
          {{ label() }}@if (optional()) {<span class="f__opt"> · facultatif</span>}
        </label>
        <div class="f__wrap">
          @switch (type()) {
            @case ('textarea') {
              <textarea
                class="f__input f__input--area"
                [id]="id"
                [formControl]="control()"
                [rows]="rows()"
                [attr.maxlength]="max()"
                [attr.aria-describedby]="describedBy()"
                [attr.aria-invalid]="showError()"
              ></textarea>
            }
            @case ('select') {
              <select class="f__input f__input--select" [id]="id" [formControl]="control()" [attr.aria-describedby]="describedBy()" [attr.aria-invalid]="showError()">
                <option value="" disabled>Choisir…</option>
                @for (o of options(); track o.value) {
                  <option [value]="o.value">{{ o.label }}</option>
                }
              </select>
              <sji-icon class="f__chev" name="chevron" />
            }
            @default {
              <input
                class="f__input"
                [id]="id"
                [type]="type()"
                [formControl]="control()"
                [attr.autocomplete]="autocomplete() || null"
                [attr.inputmode]="type() === 'tel' ? 'tel' : null"
                [attr.aria-describedby]="describedBy()"
                [attr.aria-invalid]="showError()"
              />
            }
          }
        </div>
        <div class="f__foot">
          @if (showError()) {
            <p class="f__error" [id]="id + '-e'">{{ errorText() }}</p>
          } @else if (hint()) {
            <p class="f__hint" [id]="id + '-h'">{{ hint() }}</p>
          }
          @if (max()) {
            <p class="f__count mono tnum" aria-hidden="true">{{ length() }} / {{ max() }}</p>
          }
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .f__label {
      display: block;
      margin-bottom: 0.45rem;
      color: var(--blue-600);
    }
    .f__opt {
      color: var(--text-dim);
    }
    .f__wrap {
      position: relative;
    }
    .f__input {
      display: block;
      width: 100%;
      height: 56px;
      padding: 0 1rem;
      font-size: var(--fs-body);
      background: var(--paper-2);
      border: 1px solid var(--line);
      border-radius: var(--r-md);
      color: var(--navy-900);
      transition:
        box-shadow var(--d-fast) var(--ease-soft),
        border-color var(--d-fast) var(--ease-soft),
        background-color var(--d-fast);
      appearance: none;
    }
    .f__input::placeholder {
      color: var(--text-dim);
    }
    .f__input:hover:not(:focus) {
      border-color: var(--blue-200);
    }
    .f__input--area {
      height: auto;
      padding: 0.875rem 1rem;
      resize: vertical;
      min-height: 150px;
      line-height: 1.6;
    }
    .f__input--select {
      padding-right: 2.75rem;
      cursor: pointer;
    }
    .f__chev {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      color: var(--navy-900);
    }
    .f__input:focus {
      outline: none;
      background: var(--paper);
      border-color: var(--gold-500);
      box-shadow: var(--ring-gold);
    }
    .f__input:focus-visible {
      outline: none;
    }
    .f--error .f__input {
      border-color: var(--cm-red);
      background: rgba(212, 38, 44, 0.04);
    }
    .f__foot {
      display: flex;
      justify-content: space-between;
      gap: var(--sp-4);
      min-height: 1.5rem;
      margin-top: 0.375rem;
    }
    .f__hint,
    .f__error {
      margin: 0;
      font-size: var(--fs-small);
      line-height: 1.4;
    }
    .f__hint {
      color: var(--text-dim);
    }
    .f__error {
      color: var(--cm-red);
    }
    .f__count {
      margin: 0 0 0 auto;
      font-size: var(--fs-label);
      color: var(--text-dim);
      white-space: nowrap;
    }
    .f__checkrow {
      display: flex;
      gap: var(--sp-4);
      align-items: flex-start;
      cursor: pointer;
    }
    .f__checkrow input {
      position: absolute;
      opacity: 0;
    }
    .f__box {
      flex: none;
      display: grid;
      place-items: center;
      width: 28px;
      height: 28px;
      border: 1px solid var(--navy-900);
      color: transparent;
      transition: background-color var(--d-fast), color var(--d-fast);
    }
    .f__box sji-icon {
      color: inherit;
    }
    .f__checkrow input:checked + .f__box {
      background: var(--gold-500);
      color: var(--navy-900);
    }
    .f__checkrow input:focus-visible + .f__box {
      outline: 2px solid var(--gold-700);
      outline-offset: 3px;
    }
    .f--error .f__box {
      border-color: var(--cm-red);
    }
    .f__checktext {
      padding-top: 0.2rem;
    }
  `,
})
export class FieldComponent {
  readonly label = input.required<string>();
  readonly control = input.required<FormControl<any>>(); // eslint-disable-line @typescript-eslint/no-explicit-any
  readonly type = input<'text' | 'email' | 'tel' | 'url' | 'select' | 'textarea' | 'checkbox'>('text');
  readonly options = input<FieldOption[]>([]);
  readonly hint = input('');
  readonly max = input<number | null>(null);
  readonly rows = input(5);
  readonly optional = input(false);
  readonly autocomplete = input('');
  readonly messages = input<Record<string, string>>({});

  protected readonly id = `f-${uid++}`;

  protected showError(): boolean {
    const c = this.control();
    return c.invalid && (c.touched || c.dirty);
  }
  protected length(): number {
    return String(this.control().value ?? '').length;
  }
  protected describedBy(): string | null {
    if (this.showError()) return `${this.id}-e`;
    return this.hint() ? `${this.id}-h` : null;
  }
  protected errorText(): string {
    const errors = this.control().errors ?? {};
    const key = Object.keys(errors)[0];
    return this.messages()[key] ?? DEFAULT_MESSAGES[key] ?? 'Valeur invalide.';
  }
}
