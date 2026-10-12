import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CONTACT } from '../../core/data/site-data';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { ApiService } from '../../core/services/api.service';
import { ConfettiService } from '../../core/services/confetti.service';
import { ButtonComponent } from '../../shared/ui/button.component';
import { FieldComponent } from '../../shared/ui/field.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';
import { WingsComponent } from '../../shared/ui/wings.component';

/** /contact : trois numéros cliquables, WhatsApp (le canal réel au Cameroun), formulaire court, accès au campus. */
@Component({
  selector: 'sji-contact',
  standalone: true,
  imports: [ReactiveFormsModule, PageHeaderComponent, ButtonComponent, FieldComponent, IconComponent, WingsComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  protected readonly c = CONTACT;
  private readonly api = inject(ApiService);
  private readonly confetti = inject(ConfettiService);
  protected readonly status = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');

  protected readonly form = new FormGroup({
    nom: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    qualite: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10), Validators.maxLength(1000)] }),
  });

  protected submit(): void {
    if (this.form.invalid) return this.form.markAllAsTouched();
    this.status.set('sending');
    this.api.contact(this.form.getRawValue()).subscribe({
      next: () => {
        this.status.set('sent');
        this.confetti.celebrate('Message envoyé !', 'Merci de nous avoir écrit. Notre équipe vous répondra dans les meilleurs délais.');
      },
      error: () => this.status.set('error'),
    });
  }

  protected reset(): void {
    this.form.reset();
    this.status.set('idle');
  }
}
