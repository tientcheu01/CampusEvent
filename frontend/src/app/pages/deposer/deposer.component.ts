import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, computed, effect, inject, viewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AnalyticsService } from '../../core/services/analytics.service';
import { ConcoursDatesService } from '../../core/services/concours-dates.service';
import { ButtonComponent } from '../../shared/ui/button.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';
import { formatBytes } from '../../shared/ui/file-validators';
import { DepotClosedComponent } from './depot-closed.component';
import { DepotConfirmationComponent } from './depot-confirmation.component';
import { DepotFormService, STEPS } from './depot-form.service';
import { StepEquipeComponent } from './steps/step-equipe.component';
import { StepPiecesComponent } from './steps/step-pieces.component';
import { StepProjetComponent } from './steps/step-projet.component';
import { StepRelectureComponent } from './steps/step-relecture.component';

/**
 * /deposer — quatre étapes, barre de progression permanente, brouillon automatique en localStorage.
 * Rendu côté client uniquement : cette page n'a aucun intérêt pour l'indexation.
 */
@Component({
  selector: 'sji-deposer',
  standalone: true,
  imports: [
    ButtonComponent,
    IconComponent,
    PageHeaderComponent,
    DepotClosedComponent,
    DepotConfirmationComponent,
    StepEquipeComponent,
    StepProjetComponent,
    StepPiecesComponent,
    StepRelectureComponent,
  ],
  providers: [DepotFormService],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    @if (!open()) {
      <sji-depot-closed />
    } @else if (f.numero()) {
      <sji-depot-confirmation [numero]="f.numero()!" [email]="f.equipe.controls.email.value" />
    } @else {
      <sji-page-header label="Déposer un projet" lead="Votre brouillon est enregistré sur cet appareil à chaque champ rempli : vous pouvez fermer et revenir."
        >Dossier et vidéo, en quatre étapes.</sji-page-header
      >

      <div class="dp__progress" role="group" aria-label="Progression">
        <ol class="container dp__steps" role="list">
          @for (s of steps; track s; let i = $index) {
            <li class="dp__step" [class.is-done]="i < f.step()" [class.is-now]="i === f.step()" [attr.aria-current]="i === f.step() ? 'step' : null">
              <span class="dp__pastille">
                @if (i < f.step()) {
                  <sji-icon name="check" [size]="20" />
                } @else {
                  <span class="num">{{ i + 1 }}</span>
                }
              </span>
              <span class="dp__name">{{ s }}</span>
            </li>
          }
        </ol>
        <div class="dp__bar" aria-hidden="true"><i [style.transform]="'scaleX(' + (f.step() + 1) / 4 + ')'"></i></div>
      </div>

      <section class="section section--dense">
        <div class="container dp__wrap">
          <p class="visually-hidden" aria-live="polite">Étape {{ f.step() + 1 }} sur 4 : {{ steps[f.step()] }}</p>

          @if (f.restored(); as r) {
            <p class="dp__banner">Votre brouillon a été restauré.@if (r.files) { Les fichiers sont à sélectionner à nouveau.}</p>
          }

          <h2 #title class="h2 dp__title" tabindex="-1">{{ f.step() + 1 }}. {{ steps[f.step()] }}</h2>

          <form (submit)="$event.preventDefault()" novalidate>
            @switch (f.step()) {
              @case (0) { <sji-step-equipe /> }
              @case (1) { <sji-step-projet /> }
              @case (2) { <sji-step-pieces /> }
              @default { <sji-step-relecture /> }
            }

            @if (f.showSummary() && !f.valid(f.step())) {
              <p class="dp__summary" role="alert">{{ f.reason(f.step()) }}.</p>
            }
            @if (f.error()) {
              <p class="dp__summary" role="alert">L'envoi n'a pas abouti. Votre dossier est enregistré sur cet appareil — réessayez.</p>
            }

            @if (f.submitting()) {
              <ul class="dp__uploads" role="list" aria-live="polite">
                @for (u of f.uploads(); track $index) {
                  <li>
                    <span>{{ u.label }} · {{ u.name }} <span class="mono tnum dim">{{ size(u.size) }}</span></span>
                    <progress max="100" [value]="u.progress" [attr.aria-label]="u.label + ' : ' + u.progress + ' %'"></progress>
                    <span class="mono tnum">{{ u.progress }} %</span>
                  </li>
                }
              </ul>
            }

            <div class="dp__nav">
              @if (f.step() > 0) {
                <button type="button" sjiButton variant="ghost" [disabled]="f.submitting()" (click)="back()">Précédent</button>
              }
              @if (f.step() < 3) {
                <button type="button" sjiButton [arrow]="true" [attr.aria-disabled]="!f.valid(f.step())" [attr.title]="f.valid(f.step()) ? null : f.reason(f.step())" (click)="forward()">Continuer</button>
              } @else {
                <button type="button" sjiButton [arrow]="true" [attr.aria-disabled]="!f.valid(3) || null" [disabled]="f.submitting()" [attr.title]="f.valid(3) ? null : f.reason(3)" (click)="send()">
                  {{ f.submitting() ? 'Envoi en cours…' : 'Envoyer mon dossier' }}
                </button>
              }
            </div>
            @if (!f.valid(f.step())) {
              <p class="dp__why dim" aria-hidden="true">{{ f.reason(f.step()) }}</p>
            }
          </form>
        </div>
      </section>
    }
  `,
  styleUrl: './deposer.component.scss',
})
export class DeposerComponent {
  protected readonly f = inject(DepotFormService);
  private readonly dates = inject(ConcoursDatesService);
  private readonly analytics = inject(AnalyticsService);
  protected readonly steps = STEPS;
  protected readonly size = formatBytes;
  protected readonly open = computed(() => this.dates.depotsOuverts() || environment.devForceOpen);
  private readonly title = viewChild<ElementRef<HTMLElement>>('title');
  private ready = false;

  constructor() {
    afterNextRender(() => {
      this.ready = true;
      if (this.open()) this.analytics.track('Formulaire ouvert');
    });
    // À chaque changement d'étape, le focus passe au titre (lecteurs d'écran) et la page remonte.
    effect(() => {
      this.f.step();
      if (this.ready) queueMicrotask(() => this.title()?.nativeElement.focus({ preventScroll: false }));
    });
  }

  protected forward(): void {
    this.f.next();
  }
  protected back(): void {
    this.f.prev();
  }
  protected send(): void {
    void this.f.submit();
  }
}
