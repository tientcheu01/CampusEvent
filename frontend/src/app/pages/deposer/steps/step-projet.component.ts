import { Component, inject } from '@angular/core';
import { AVANCEMENTS, DOMAINES } from '../../../core/data/site-data';
import { FieldComponent } from '../../../shared/ui/field.component';
import { DepotFormService } from '../depot-form.service';

/** Étape 2 — Le projet : le cœur du dossier. Compteurs visibles sous les champs longs. */
@Component({
  selector: 'sji-step-projet',
  standalone: true,
  imports: [FieldComponent],
  template: `
    <div class="st">
      <sji-field
        label="Problème traité"
        type="textarea"
        [control]="f.projet.controls.probleme"
        [max]="800"
        [rows]="6"
        hint="Quel besoin réel ? Pour qui ? Soyez concret."
        [messages]="{ minlength: 'Développez un peu : 30 caractères au minimum.' }"
      />
      <sji-field
        label="Solution proposée"
        type="textarea"
        [control]="f.projet.controls.solution"
        [max]="1200"
        [rows]="8"
        hint="Comment ça fonctionne, et ce qui est nouveau."
        [messages]="{ minlength: 'Développez un peu : 30 caractères au minimum.' }"
      />
      <div class="st__row">
        <sji-field label="État d'avancement" type="select" [control]="f.projet.controls.avancement" [options]="avancements" />
        <sji-field label="Domaine" type="select" [control]="f.projet.controls.domaine" [options]="domaines" />
      </div>
    </div>
  `,
  styleUrl: './steps.scss',
})
export class StepProjetComponent {
  protected readonly f = inject(DepotFormService);
  protected readonly avancements = AVANCEMENTS;
  protected readonly domaines = DOMAINES.map((d) => ({ value: d, label: d }));
}
