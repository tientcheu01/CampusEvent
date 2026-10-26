import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CONTACT, CONTRIBUTIONS, DOCS, NIVEAUX, RAISONS_PARTENAIRE, fr } from '../../core/data/site-data';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { PartenariatPayload } from '../../core/models/api.model';
import { AnalyticsService } from '../../core/services/analytics.service';
import { ApiService } from '../../core/services/api.service';
import { ConfettiService } from '../../core/services/confetti.service';
import { ButtonComponent } from '../../shared/ui/button.component';
import { FieldComponent, FieldOption } from '../../shared/ui/field.component';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';
import { SectionLabelComponent } from '../../shared/ui/section-label.component';
import { TierTableComponent } from '../../shared/ui/tier-table.component';
import { WingsComponent } from '../../shared/ui/wings.component';
import { openBulletin } from './bulletin-print';
import { PublicsSchemaComponent } from './publics-schema.component';

const opt = (list: readonly string[]): FieldOption[] => list.map((v) => ({ value: v, label: v }));

/** /partenaires : la traduction web du dossier de partenariat. Cinq blocs, dans cet ordre exact. */
@Component({
  selector: 'sji-partenaires',
  standalone: true,
  imports: [ReactiveFormsModule, PageHeaderComponent, SectionLabelComponent, PublicsSchemaComponent, TierTableComponent, FieldComponent, ButtonComponent, WingsComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sji-page-header num="07" label="Partenariat" lead="Quatre niveaux d'engagement, et un format sur mesure si aucun ne vous correspond. Le bulletin se remplit en deux minutes."
      >Faites rayonner le génie étudiant.</sji-page-header
    >

    <section class="pp__reasons-section section section--dense tint-navy dots-light on-navy" aria-labelledby="raisons">
      <sji-wings class="pp__wings" [opacity]="0.1" />
      <div class="container grid">
        <header class="pp__head" sjiReveal>
          <sji-section-label num="01" text="Pourquoi" />
          <h2 id="raisons" class="h2">Cinq raisons de devenir partenaire</h2>
          <p class="lead">Associez votre marque à la créativité de la jeunesse camerounaise.</p>
        </header>
        <ol class="pp__reasons" sjiReveal="stagger" role="list">
          @for (r of raisons; track r; let i = $index) {
            <li><span class="num">0{{ i + 1 }}</span><span class="h3">{{ fr(r) }}</span></li>
          }
        </ol>
      </div>
    </section>

    <section class="section section--dense tint-2" aria-labelledby="publics">
      <div class="container grid">
        <header class="pp__head" sjiReveal>
          <sji-section-label num="02" text="Les publics" />
          <h2 id="publics" class="h2">Quatre publics réunis</h2>
        </header>
        <div class="pp__schema" sjiReveal [delay]="0.1"><sji-publics-schema /></div>
      </div>
    </section>

    <section class="section section--dense tint-3" aria-labelledby="contrib">
      <div class="container">
        <header class="pp__head" sjiReveal>
          <sji-section-label num="03" text="Les contributions" />
          <h2 id="contrib" class="h2">Quatre formes de contribution</h2>
        </header>
        <dl class="pp__contrib" sjiReveal="stagger">
          @for (c of contributions; track c.nom; let i = $index) {
            <div><dt class="h3">{{ c.nom }}</dt><dd class="dim">{{ c.texte }}</dd></div>
          }
        </dl>
      </div>
    </section>

    <section class="pp__levels section section--dense tint-navy dots-light on-navy" aria-labelledby="niveaux">
      <sji-wings class="pp__wings pp__wings--right" [opacity]="0.1" />
      <div class="container">
        <header class="pp__head" sjiReveal>
          <sji-section-label num="04" text="Les niveaux" />
          <h2 id="niveaux" class="h2">Platine, Or, Argent, Bronze</h2>
        </header>
        <sji-tier-table sjiReveal [delay]="0.1" />
        <div class="pp__dossier">
          @if (docs.dossierPartenariat) {
            <a sjiButton variant="ghost" [href]="docs.dossierPartenariat" download (click)="trackDossier()">Télécharger le dossier complet</a>
          } @else {
            <a sjiButton variant="ghost" [href]="'mailto:' + contact.email + '?subject=Dossier de partenariat SJI INNOVA 2027'" (click)="trackDossier()">Demander le dossier complet par e-mail</a>
          }
        </div>
      </div>
    </section>

    <section id="bulletin" class="section tint-2" aria-labelledby="bulletin-title">
      <div class="container grid">
        <header class="pp__head" sjiReveal>
          <sji-section-label num="05" text="Bulletin d'engagement" />
          <h2 id="bulletin-title" class="h2">Dites-nous comment vous souhaitez contribuer</h2>
          <p class="dim">L'envoi génère un bulletin pré-rempli, à signer et à retourner. Le comité d'organisation vous rappelle pour ajuster les contreparties.</p>
        </header>
        <div class="pp__form">
          @if (status() === 'sent') {
            <div class="pp__done" role="status">
              <h3 class="h2">Bulletin reçu.</h3>
              <p class="lead">Le comité d'organisation vous recontacte très vite. Vous pouvez dès maintenant obtenir le bulletin pré-rempli, à signer.</p>
              <button type="button" sjiButton [arrow]="true" (click)="bulletin()">Ouvrir le bulletin (PDF)</button>
            </div>
          } @else {
            <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
              <sji-field label="Structure" [control]="form.controls.structure" autocomplete="organization" />
              <sji-field label="Représentant" [control]="form.controls.representant" autocomplete="name" />
              <sji-field label="Fonction" [control]="form.controls.fonction" autocomplete="organization-title" />
              <sji-field label="Téléphone" type="tel" [control]="form.controls.telephone" autocomplete="tel" [messages]="{ pattern: 'Saisissez un numéro valide, par exemple 694 88 23 94.' }" />
              <sji-field label="E-mail" type="email" [control]="form.controls.email" autocomplete="email" />
              <sji-field label="Formule souhaitée" type="select" [control]="form.controls.formule" [options]="formules" />
              <sji-field label="Nature de la contribution" type="select" [control]="form.controls.contribution" [options]="natures" />
              @if (status() === 'error') {
                <p class="pp__err" role="alert">L'envoi n'a pas abouti. Réessayez, ou écrivez-nous à {{ contact.email }}.</p>
              }
              <button type="submit" sjiButton [arrow]="true" [disabled]="status() === 'sending'">{{ status() === 'sending' ? 'Envoi en cours…' : "Envoyer l'engagement" }}</button>
            </form>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './partenaires.component.scss',
})
export class PartenairesComponent {
  protected readonly raisons = RAISONS_PARTENAIRE;
  protected readonly contributions = CONTRIBUTIONS;
  protected readonly docs = DOCS;
  protected readonly contact = CONTACT;
  protected readonly fr = fr;
  protected readonly formules = opt([...NIVEAUX, 'Format sur mesure']);
  protected readonly natures = opt(CONTRIBUTIONS.map((c) => c.nom));
  protected readonly status = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');

  private readonly api = inject(ApiService);
  private readonly analytics = inject(AnalyticsService);
  private readonly confetti = inject(ConfettiService);

  protected readonly form = new FormGroup({
    structure: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    representant: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    fonction: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    telephone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[+\d][\d\s().-]{7,}$/)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    formule: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    contribution: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected submit(): void {
    if (this.form.invalid) return this.form.markAllAsTouched();
    this.status.set('sending');
    this.api.partenariat(this.form.getRawValue() as PartenariatPayload).subscribe({
      next: () => {
        this.analytics.track('Dossier partenariat', { section: 'bulletin' });
        this.status.set('sent');
        this.confetti.celebrate('Bienvenue dans l’aventure !', 'Votre demande de partenariat est enregistrée. Nous vous contacterons pour construire la suite ensemble.');
      },
      error: () => this.status.set('error'),
    });
  }

  protected bulletin(): void {
    openBulletin(this.form.getRawValue());
  }

  protected trackDossier(): void {
    this.analytics.track('Dossier partenariat', { section: 'partenaires' });
  }
}
