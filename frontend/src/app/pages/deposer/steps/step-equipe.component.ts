import { Component, inject } from '@angular/core';
import { FieldComponent } from '../../../shared/ui/field.component';
import { IconComponent } from '../../../shared/ui/icon.component';
import { DepotFormService } from '../depot-form.service';

/** Étape 1 — L'équipe : les informations faciles d'abord, pour créer l'engagement. */
@Component({
  selector: 'sji-step-equipe',
  standalone: true,
  imports: [FieldComponent, IconComponent],
  template: `
    <div class="st">
      <sji-field label="Nom du projet" [control]="f.equipe.controls.projet" />
      <sji-field label="Nom du porteur" [control]="f.equipe.controls.porteur" autocomplete="name" />
      <div class="st__row">
        <sji-field label="Filière" [control]="f.equipe.controls.filiere" />
        <sji-field label="Niveau" [control]="f.equipe.controls.niveau" hint="Par exemple : Licence 2" />
      </div>
      <div class="st__row">
        <sji-field label="Téléphone" type="tel" [control]="f.equipe.controls.telephone" autocomplete="tel" [messages]="{ pattern: 'Saisissez un numéro valide, par exemple 694 88 23 94.' }" />
        <sji-field label="E-mail" type="email" [control]="f.equipe.controls.email" autocomplete="email" hint="Le numéro de dossier vous sera envoyé à cette adresse." />
      </div>

      <fieldset class="st__team">
        <legend class="label">Membres de l'équipe <span class="dim">· facultatif, 5 au total au maximum</span></legend>
        @for (m of f.membres.controls; track $index; let i = $index) {
          <div class="st__member">
            <sji-field [label]="'Membre ' + (i + 1)" [control]="m" />
            <button type="button" class="st__rm" (click)="f.removeMembre(i)" [attr.aria-label]="'Retirer le membre ' + (i + 1)"><sji-icon name="trash" /></button>
          </div>
        }
        @if (f.canAddMembre()) {
          <button type="button" class="st__add" (click)="f.addMembre()"><sji-icon name="plus" /> Ajouter un membre</button>
        }
      </fieldset>
    </div>
  `,
  styleUrl: './steps.scss',
})
export class StepEquipeComponent {
  protected readonly f = inject(DepotFormService);
}
