import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button.component';
import { WingsComponent } from '../../shared/ui/wings.component';

/** 404 : le motif d'ailes et un lien de retour. */
@Component({
  selector: 'sji-not-found',
  standalone: true,
  imports: [RouterLink, ButtonComponent, WingsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="nf dots">
      <sji-wings class="nf__wings" [opacity]="0.09" />
      <div class="container nf__inner">
        <p class="label dim">Erreur 404</p>
        <h1 class="display nf__title">Cette page n'existe pas.<br />Mais le concours, si.</h1>
        <a sjiButton [arrow]="true" routerLink="/">Retour à l'accueil</a>
      </div>
    </section>
  `,
  styles: `
    .nf {
      position: relative;
      overflow: hidden;
      min-height: 100svh;
      display: flex;
      align-items: center;
      padding-top: var(--header-h);
    }
    .nf__wings {
      position: absolute;
      right: 0;
      bottom: 0;
      width: min(80vw, 800px);
      height: 100%;
      transform: scaleX(-1);
    }
    .nf__inner {
      display: grid;
      gap: var(--sp-8);
      justify-items: start;
    }
    .nf__title {
      font-size: clamp(2.5rem, 1rem + 6vw, 6rem);
    }
  `,
})
export class NotFoundComponent {}
