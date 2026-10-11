import { Component, DestroyRef, OnDestroy, OnInit, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { IconComponent } from './icon.component';
import { formatBytes, toFiles } from './file-validators';

let uid = 0;

/**
 * Zone de dépôt en pointillés : accessible au clavier (l'input natif reste focusable), annonce les formats
 * et la limite AVANT la sélection, affiche nom, poids et aperçu dès le choix.
 */
@Component({
  selector: 'sji-file-field',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="ff" [class.ff--error]="showError()" [class.ff--drag]="drag()">
      <label class="ff__label label" [for]="id">{{ label() }}@if (optional()) {<span class="ff__opt"> · facultatif</span>}</label>
      <p class="ff__hint" [id]="id + '-h'">{{ hint() }}</p>
      <label
        class="ff__zone"
        [for]="id"
        (dragover)="onDrag($event, true)"
        (dragleave)="onDrag($event, false)"
        (drop)="onDrop($event)"
      >
        <input
          class="ff__input"
          type="file"
          [id]="id"
          [accept]="accept()"
          [multiple]="multiple()"
          [attr.aria-describedby]="showError() ? id + '-e' : id + '-h'"
          [attr.aria-invalid]="showError()"
          (change)="onChange($event)"
          (blur)="control().markAsTouched()"
        />
        <sji-icon [name]="icon()" [size]="24" />
        <span class="ff__cta"><strong>Parcourir</strong> ou déposer {{ multiple() ? 'les fichiers' : 'le fichier' }} ici</span>
      </label>
      @if (files().length) {
        <ul class="ff__list" role="list">
          @for (f of files(); track f.name + f.size; let i = $index) {
            <li class="ff__item">
              @if (previews()[i]) {
                <img class="ff__thumb" [src]="previews()[i]" alt="" width="48" height="48" />
              } @else {
                <sji-icon name="file" [size]="24" />
              }
              <span class="ff__name">{{ f.name }}</span>
              <span class="ff__size mono tnum">{{ size(f.size) }}</span>
            </li>
          }
        </ul>
      }
      @if (showError()) {
        <p class="ff__error" [id]="id + '-e'" role="alert">{{ errorText() }}</p>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .ff__label {
      display: block;
      color: var(--blue-600);
    }
    .ff__opt {
      color: var(--text-dim);
    }
    .ff__hint {
      margin: 0.25rem 0 0.75rem;
      font-size: var(--fs-small);
      color: var(--text-dim);
    }
    .ff__zone {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--sp-4);
      padding: var(--sp-6);
      min-height: 96px;
      border: 1.5px dashed var(--blue-200);
      border-radius: var(--r-md);
      background: var(--paper-2);
      cursor: pointer;
      transition: border-color var(--d-fast), background-color var(--d-fast);
    }
    .ff__zone:hover,
    .ff--drag .ff__zone {
      border-color: var(--blue-500);
      background: var(--paper-3);
    }
    .ff__zone:has(.ff__input:focus-visible) {
      outline: 2px solid var(--gold-700);
      outline-offset: 3px;
    }
    .ff__input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }
    .ff__cta strong {
      color: var(--blue-600);
    }
    .ff--error .ff__zone {
      border-color: var(--cm-red);
    }
    .ff__list {
      list-style: none;
      margin: var(--sp-4) 0 0;
      padding: 0;
      display: grid;
      gap: var(--sp-2);
    }
    .ff__item {
      display: flex;
      align-items: center;
      gap: var(--sp-3);
      padding: var(--sp-3) var(--sp-4);
      border: var(--border);
      border-radius: var(--r-md);
    }
    .ff__thumb {
      object-fit: cover;
      border-radius: var(--r-sm);
    }
    .ff__name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .ff__size {
      color: var(--text-dim);
      font-size: var(--fs-small);
    }
    .ff__error {
      margin: var(--sp-3) 0 0;
      font-size: var(--fs-small);
      color: var(--cm-red);
    }
  `,
})
export class FileFieldComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  readonly label = input.required<string>();
  readonly control = input.required<FormControl<File | File[] | null>>();
  readonly accept = input('');
  readonly hint = input('');
  readonly multiple = input(false);
  readonly optional = input(false);
  readonly icon = input<'file' | 'video' | 'image'>('file');
  readonly messages = input<Record<string, string>>({});

  protected readonly id = `ff-${uid++}`;
  protected readonly drag = signal(false);
  protected readonly files = signal<File[]>([]);
  protected readonly previews = signal<(string | null)[]>([]);
  protected readonly size = formatBytes;
  private readonly doc = inject(DOCUMENT);
  private urls: string[] = [];

  protected readonly firstError = computed(() => Object.keys(this.control().errors ?? {})[0]);

  ngOnInit(): void {
    // Le contrôle peut être réinitialisé de l'extérieur (restauration, nouvelle saisie).
    const c = this.control();
    this.sync(toFiles(c.value));
    c.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((v) => this.sync(toFiles(v)));
  }

  protected showError(): boolean {
    const c = this.control();
    return c.invalid && (c.touched || c.dirty);
  }

  protected errorText(): string {
    const c = this.control();
    const key = Object.keys(c.errors ?? {})[0];
    const err = c.errors?.[key];
    const custom = this.messages()[key];
    if (custom) return custom;
    if (key === 'required') return 'Ce fichier est obligatoire.';
    if (key === 'fileSize') return `Ce fichier est trop lourd : ${err.mb} Mo maximum.`;
    if (key === 'fileType') return `Format non accepté. Formats acceptés : ${(err.extensions as string[]).join(', ').toUpperCase()}.`;
    return 'Fichier invalide.';
  }

  protected onChange(e: Event): void {
    const list = Array.from((e.target as HTMLInputElement).files ?? []);
    this.commit(list);
  }
  protected onDrag(e: DragEvent, on: boolean): void {
    e.preventDefault();
    this.drag.set(on);
  }
  protected onDrop(e: DragEvent): void {
    e.preventDefault();
    this.drag.set(false);
    this.commit(Array.from(e.dataTransfer?.files ?? []));
  }

  private commit(list: File[]): void {
    if (!list.length) return;
    const c = this.control();
    c.setValue(this.multiple() ? [...toFiles(c.value), ...list] : list[0]);
    c.markAsTouched();
    c.markAsDirty();
  }

  private sync(list: File[]): void {
    this.urls.forEach((u) => URL.revokeObjectURL(u));
    this.urls = [];
    const win = this.doc.defaultView;
    this.previews.set(
      list.map((f) => {
        if (!win || !f.type.startsWith('image/')) return null;
        const u = URL.createObjectURL(f);
        this.urls.push(u);
        return u;
      }),
    );
    this.files.set(list);
  }

  ngOnDestroy(): void {
    this.urls.forEach((u) => URL.revokeObjectURL(u));
  }
}
