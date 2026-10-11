import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CONTACT } from '../../core/data/site-data';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { ApiService } from '../../core/services/api.service';
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
  template: `
    <sji-page-header num="" label="Contact">Une question&nbsp;? Posez-la.</sji-page-header>

    <section class="section section--dense">
      <div class="container grid">
        <div class="ct__direct" sjiReveal>
          <h2 class="h3">Le plus rapide</h2>
          <a sjiButton [arrow]="true" [href]="c.whatsapp" target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp</a>
          <ul class="ct__phones" role="list">
            @for (p of c.phones; track p.tel) {
              <li>
                <a class="ct__tel" [href]="'tel:' + p.tel"><sji-icon name="phone" [size]="24" /><span class="mono tnum">{{ p.display }}</span></a>
              </li>
            }
            <li>
              <a class="ct__tel" [href]="'mailto:' + c.email"><sji-icon name="mail" [size]="24" /><span>{{ c.email }}</span></a>
            </li>
          </ul>

          <div class="ct__map">
            <sji-wings class="ct__wings" [opacity]="0.1" />
            <sji-icon name="pin" [size]="24" />
            <p class="h3">Campus d'Etok-Koss</p>
            <p class="dim">{{ c.address }}</p>
            <a sjiButton variant="link" [href]="c.itineraire" target="_blank" rel="noopener noreferrer">Voir l'itinéraire</a>
          </div>
        </div>

        <div class="ct__form" sjiReveal [delay]="0.1">
          @if (status() === 'sent') {
            <div class="ct__done" role="status">
              <h2 class="h2">Message reçu.</h2>
              <p class="lead">Nous vous répondons dès que possible, par téléphone ou par e-mail.</p>
              <button type="button" sjiButton variant="ghost" (click)="reset()">Envoyer un autre message</button>
            </div>
          } @else {
            <h2 class="h3">Ou laissez-nous un message</h2>
            <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
              <sji-field label="Nom" [control]="form.controls.nom" autocomplete="name" />
              <sji-field label="Qualité" [control]="form.controls.qualite" hint="Étudiant, enseignant, parent, entreprise, presse…" />
              <sji-field label="E-mail ou téléphone pour vous répondre" [control]="form.controls.email" type="text" autocomplete="email" />
              <sji-field label="Message" type="textarea" [control]="form.controls.message" [max]="1000" />
              @if (status() === 'error') {
                <p class="ct__err" role="alert">L'envoi n'a pas abouti. Réessayez, ou appelez l'un des numéros ci-contre.</p>
              }
              <button type="submit" sjiButton [arrow]="true" [disabled]="status() === 'sending'">{{ status() === 'sending' ? 'Envoi en cours…' : 'Envoyer' }}</button>
            </form>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .ct__direct,
    .ct__form {
      grid-column: 1 / -1;
      display: grid;
      gap: var(--sp-6);
      align-content: start;
    }
    .ct__form {
      margin-top: var(--sp-16);
    }
    .ct__direct > a[sjiButton] {
      justify-self: start;
    }
    .ct__phones {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .ct__phones li {
      border-top: var(--border);
    }
    .ct__phones li:last-child {
      border-bottom: var(--border);
    }
    .ct__tel {
      display: flex;
      align-items: center;
      gap: var(--sp-4);
      padding: var(--sp-4) 0;
      text-decoration: none;
      font-size: var(--fs-lead);
    }
    .ct__tel:hover span {
      text-decoration: underline;
      text-decoration-color: var(--gold-500);
      text-underline-offset: 4px;
    }
    .ct__map {
      position: relative;
      overflow: hidden;
      display: grid;
      gap: var(--sp-2);
      justify-items: start;
      padding: var(--sp-8);
      min-height: 220px;
      background: var(--paper-3);
      border: var(--border);
      background-image: radial-gradient(rgba(10, 31, 77, 0.09) 1px, transparent 1px);
      background-size: 24px 24px;
    }
    .ct__wings {
      position: absolute;
      right: -10%;
      bottom: -20%;
      width: 70%;
      height: 120%;
      transform: scaleX(-1);
    }
    .ct__map > *:not(.ct__wings) {
      position: relative;
    }
    form {
      display: grid;
      gap: var(--sp-6);
    }
    form button {
      justify-self: start;
    }
    .ct__err {
      color: var(--cm-red);
      margin: 0;
    }
    .ct__done {
      display: grid;
      gap: var(--sp-6);
      justify-items: start;
      padding: var(--sp-12) 0;
    }
    @media (min-width: 1024px) {
      .ct__direct {
        grid-column: 1 / span 5;
      }
      .ct__form {
        grid-column: 7 / span 6;
        margin-top: 0;
      }
    }
  `,
})
export class ContactComponent {
  protected readonly c = CONTACT;
  private readonly api = inject(ApiService);
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
      next: () => this.status.set('sent'),
      error: () => this.status.set('error'),
    });
  }

  protected reset(): void {
    this.form.reset();
    this.status.set('idle');
  }
}
