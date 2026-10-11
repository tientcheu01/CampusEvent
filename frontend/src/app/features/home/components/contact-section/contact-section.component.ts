import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { ContactService } from '../../../../core/services/contact.service';
import { ContactPayload } from '../../../../core/models/contact.model';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RevealDirective],
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.scss'
})
export class ContactSectionComponent {
  form: FormGroup;
  status: FormStatus = 'idle';
  errorMessage = '';

  contactInfo = [
    { icon: 'fa-phone', label: 'Téléphone', value: '+237 656 03 32 52', href: 'tel:+237656033252' },
    { icon: 'fa-envelope', label: 'Email', value: 'hermann.ekotto&#64;saintjeaningenieur.org', href: 'mailto:hermann.ekotto&#64;saintjeaningenieur.org' },
    { icon: 'fa-map-marker-alt', label: 'Adresse', value: 'Campus d’Etok-Koss', href: null },
    { icon: 'fa-whatsapp', label: 'WhatsApp', value: '+237 656 03 32 52', href: 'https://wa.me/237656033252' }
  ];

  constructor(private readonly fb: FormBuilder, private readonly contactService: ContactService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.status = 'loading';
    this.errorMessage = '';
    const payload: ContactPayload = this.form.value;

    this.contactService.send(payload).subscribe({
      next: () => {
        this.status = 'success';
        this.form.reset();
      },
      error: (err: { error?: { error?: string; details?: string } }) => {
        this.status = 'error';
        this.errorMessage = err.error?.error || err.error?.details || 'Une erreur est survenue. Veuillez réessayer.';
      }
    });
  }
}
