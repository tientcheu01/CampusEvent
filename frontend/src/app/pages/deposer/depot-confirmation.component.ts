import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_URL } from '../../core/services/seo.service';
import { ButtonComponent } from '../../shared/ui/button.component';
import { WingsComponent } from '../../shared/ui/wings.component';

/** Succès d'envoi : confirmation plein écran (pas un toast), numéro de dossier en display, partage pré-rempli. */
@Component({
  selector: 'sji-depot-confirmation',
  standalone: true,
  imports: [RouterLink, ButtonComponent, WingsComponent],
  template: `
    <section class="ok dots" role="status" aria-live="polite">
      <sji-wings class="ok__wings" [opacity]="0.09" />
      <div class="container ok__in">
        <p class="label">Dossier reçu</p>
        <p class="lead">Votre numéro est</p>
        <p class="display ok__num tnum">{{ numero() }}</p>
        <p class="ok__note">Notez-le, il vous sera demandé. Un e-mail de confirmation part à <strong>{{ email() }}</strong>.</p>
        <p class="dim">Le jury évalue les dossiers du 21 décembre au 22 janvier. Les résultats de la présélection sont annoncés le 22 janvier 2027.</p>
        <div class="ok__actions">
          <button type="button" sjiButton [arrow]="true" (click)="share()">Partager sur les réseaux</button>
          <a sjiButton variant="ghost" routerLink="/">Retour à l'accueil</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .ok {
      position: relative;
      overflow: hidden;
      min-height: 100svh;
      display: flex;
      align-items: center;
      padding: calc(var(--header-h) + var(--sp-8)) 0 var(--sp-16);
    }
    .ok__wings {
      position: absolute;
      right: 0;
      bottom: 0;
      width: min(80vw, 800px);
      height: 100%;
      transform: scaleX(-1);
    }
    .ok__in {
      display: grid;
      gap: var(--sp-4);
      justify-items: start;
    }
    .ok__num {
      font-size: clamp(2.5rem, 1rem + 8vw, 7rem);
      margin-block: var(--sp-2) var(--sp-4);
      overflow-wrap: anywhere;
    }
    .ok__note {
      max-width: 48ch;
    }
    .ok__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sp-4);
      margin-top: var(--sp-6);
    }
  `,
})
export class DepotConfirmationComponent {
  readonly numero = input.required<string>();
  readonly email = input('');

  protected async share(): Promise<void> {
    const text = "J'ai déposé mon projet pour SJI INNOVA 2027, le concours d'innovation étudiante de Saint Jean Ingénieur. #SJIINNOVA2027";
    if (navigator.share) {
      try {
        await navigator.share({ title: 'SJI INNOVA 2027', text, url: SITE_URL });
      } catch {
        /* partage annulé */
      }
      return;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${SITE_URL}`)}`, '_blank', 'noopener');
  }
}
