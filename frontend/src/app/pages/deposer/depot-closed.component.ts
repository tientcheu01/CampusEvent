import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ConfettiService } from '../../core/services/confetti.service';
import { ConcoursDatesService } from '../../core/services/concours-dates.service';
import { ButtonComponent } from '../../shared/ui/button.component';
import { CountdownComponent } from '../../shared/ui/countdown.component';
import { FieldComponent } from '../../shared/ui/field.component';

/** Hors période de dépôt : avant le 16 novembre, alerte par e-mail ; après le 18 décembre, renvoi vers projets et calendrier. */
@Component({
  selector: 'sji-depot-closed',
  standalone: true,
  imports: [RouterLink, ButtonComponent, CountdownComponent, FieldComponent],
  template: `
    <section class="dc">
      <div class="container dc__in">
        <sji-countdown />
        @if (avant()) {
          <h2 class="h1">Les dépôts ouvrent le 16 novembre.</h2>
          <p class="lead">Laissez votre e-mail : nous vous prévenons le jour de l'ouverture.</p>
          @if (sent()) {
            <p class="h3" role="status">C'est noté. Rendez-vous le 16 novembre.</p>
          } @else {
            <form class="dc__form" (submit)="$event.preventDefault(); submit()" novalidate>
              <sji-field label="Votre e-mail" type="email" [control]="email" autocomplete="email" />
              @if (failed()) {
                <p class="dc__err" role="alert">L'envoi n'a pas abouti. Réessayez dans un instant.</p>
              }
              <button type="submit" sjiButton [arrow]="true">Me prévenir</button>
            </form>
          }
          <a sjiButton variant="link" routerLink="/le-concours">Lire le règlement et préparer mon dossier</a>
        } @else {
          <h2 class="h1">Les dépôts sont clos.</h2>
          <p class="lead">Découvrez les projets de la première édition et le calendrier de la présélection.</p>
          <div class="dc__actions">
            <a sjiButton [arrow]="true" routerLink="/projets">Voir les projets</a>
            <a sjiButton variant="ghost" routerLink="/le-concours" fragment="calendrier">Voir le calendrier</a>
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .dc {
      padding: calc(var(--header-total) + var(--sp-16)) 0 var(--sp-24);
    }
    .dc__in {
      display: grid;
      gap: var(--sp-6);
      justify-items: start;
      max-width: calc(720px + var(--gutter) * 2);
      margin-inline: 0;
    }
    .dc__form {
      display: grid;
      gap: var(--sp-4);
      width: min(100%, 460px);
      justify-items: start;
    }
    .dc__err {
      margin: 0;
      color: var(--cm-red);
    }
    .dc__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sp-4);
    }
  `,
})
export class DepotClosedComponent {
  private readonly api = inject(ApiService);
  private readonly confetti = inject(ConfettiService);
  private readonly dates = inject(ConcoursDatesService);
  protected readonly avant = computed(() => this.dates.phase() === 'avant');
  protected readonly sent = signal(false);
  protected readonly failed = signal(false);
  protected readonly email = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] });

  protected submit(): void {
    if (this.email.invalid) return this.email.markAllAsTouched();
    this.failed.set(false);
    this.api.alerte({ email: this.email.value }).subscribe({
      next: () => {
        this.sent.set(true);
        this.confetti.celebrate('Alerte activée !', 'Vous serez informé dès l’ouverture de la prochaine période de dépôt.');
      },
      error: () => this.failed.set(true),
    });
  }
}
