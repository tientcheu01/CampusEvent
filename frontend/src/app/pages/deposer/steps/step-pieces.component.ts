import { Component, inject } from '@angular/core';
import { DOCS, LIMITS } from '../../../core/data/site-data';
import { FieldComponent } from '../../../shared/ui/field.component';
import { FileFieldComponent } from '../../../shared/ui/file-field.component';
import { DepotFormService } from '../depot-form.service';

/** Étape 3 — Les pièces. Formats et limites annoncés AVANT la sélection ; les pièces lourdes en avant-dernier. */
@Component({
  selector: 'sji-step-pieces',
  standalone: true,
  imports: [FieldComponent, FileFieldComponent],
  template: `
    <div class="st">
      <sji-file-field label="Dossier du projet" [control]="f.pieces.controls.dossier" accept=".pdf,application/pdf" [hint]="dossierHint" />
      @if (docs.modeleDossier) {
        <p class="dim"><a [href]="docs.modeleDossier" download>Modèle de dossier à télécharger ici.</a></p>
      }

      <div class="st__video-block">
        <p class="label st__vlabel">Vidéo de présentation</p>
        <div class="st__video" role="group" aria-label="Type de vidéo">
          <button type="button" class="st__seg" [attr.aria-pressed]="mode === 'fichier'" (click)="f.pieces.controls.videoMode.setValue('fichier')">Fichier MP4</button>
          <button type="button" class="st__seg" [attr.aria-pressed]="mode === 'lien'" (click)="f.pieces.controls.videoMode.setValue('lien')">Lien YouTube ou Drive</button>
        </div>
        @if (mode === 'fichier') {
          <sji-file-field label="Fichier vidéo" icon="video" [control]="f.pieces.controls.videoFile" accept=".mp4,video/mp4" [hint]="limits.hardLimitText.video" />
        } @else {
          <sji-field label="Lien de la vidéo" type="url" [control]="f.pieces.controls.videoLien" [hint]="limits.hardLimitText.video" [messages]="{ pattern: 'Collez un lien YouTube (youtube.com, youtu.be) ou Google Drive (drive.google.com).' }" />
        }
      </div>

      <sji-file-field label="Images du projet" icon="image" [multiple]="true" [optional]="true" [control]="f.pieces.controls.images" accept=".jpg,.jpeg,.png,.webp,image/*" hint="Photos du prototype ou schémas. JPG, PNG ou WebP, 5 Mo maximum par image." />
    </div>
  `,
  styleUrl: './steps.scss',
})
export class StepPiecesComponent {
  protected readonly f = inject(DepotFormService);
  protected readonly docs = DOCS;
  protected readonly limits = LIMITS;
  protected readonly dossierHint = LIMITS.hardLimitText.dossier;
  protected get mode() {
    return this.f.pieces.controls.videoMode.value;
  }
}
