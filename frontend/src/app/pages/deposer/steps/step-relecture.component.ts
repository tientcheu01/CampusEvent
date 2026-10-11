import { Component, inject } from '@angular/core';
import { AVANCEMENTS, DOCS } from '../../../core/data/site-data';
import { FieldComponent } from '../../../shared/ui/field.component';
import { formatBytes, toFiles } from '../../../shared/ui/file-validators';
import { DepotFormService } from '../depot-form.service';

/** Étape 4 — Relecture : récapitulatif complet, chaque bloc modifiable, acceptation du règlement. */
@Component({
  selector: 'sji-step-relecture',
  standalone: true,
  imports: [FieldComponent],
  template: `
    <div class="rv">
      <section class="rv__block" aria-labelledby="rv1">
        <h3 id="rv1" class="h3">L'équipe <button type="button" class="rv__edit" (click)="f.go(0)">Modifier</button></h3>
        <dl>
          <div><dt>Projet</dt><dd>{{ e.projet }}</dd></div>
          <div><dt>Porteur</dt><dd>{{ e.porteur }}</dd></div>
          <div><dt>Filière et niveau</dt><dd>{{ e.filiere }} · {{ e.niveau }}</dd></div>
          <div><dt>Contact</dt><dd>{{ e.telephone }} · {{ e.email }}</dd></div>
          @if (membres.length) {
            <div><dt>Membres</dt><dd>{{ membres.join(', ') }}</dd></div>
          }
        </dl>
      </section>
      <section class="rv__block" aria-labelledby="rv2">
        <h3 id="rv2" class="h3">Le projet <button type="button" class="rv__edit" (click)="f.go(1)">Modifier</button></h3>
        <dl>
          <div><dt>Problème traité</dt><dd>{{ p.probleme }}</dd></div>
          <div><dt>Solution proposée</dt><dd>{{ p.solution }}</dd></div>
          <div><dt>Avancement et domaine</dt><dd>{{ avancement }} · {{ p.domaine }}</dd></div>
        </dl>
      </section>
      <section class="rv__block" aria-labelledby="rv3">
        <h3 id="rv3" class="h3">Les pièces <button type="button" class="rv__edit" (click)="f.go(2)">Modifier</button></h3>
        <dl>
          <div><dt>Dossier</dt><dd>{{ file(pc.dossier) }}</dd></div>
          <div><dt>Vidéo</dt><dd>{{ pc.videoMode === 'fichier' ? file(pc.videoFile) : pc.videoLien }}</dd></div>
          <div><dt>Images</dt><dd>{{ pc.images.length ? pc.images.length + ' fichier(s)' : 'Aucune' }}</dd></div>
        </dl>
      </section>
      <p><a [href]="docs.reglement" target="_blank" rel="noopener">Lire le règlement du concours (PDF)</a></p>
      <sji-field type="checkbox" label="J'ai lu et j'accepte le règlement du concours." [control]="f.accord" [messages]="{ required: 'Vous devez accepter le règlement pour envoyer votre dossier.' }" />
    </div>
  `,
  styleUrl: './steps.scss',
})
export class StepRelectureComponent {
  protected readonly f = inject(DepotFormService);
  protected readonly docs = DOCS;
  protected get e() {
    return this.f.equipe.getRawValue();
  }
  protected get membres() {
    return this.e.membres.filter(Boolean);
  }
  protected get p() {
    return this.f.projet.getRawValue();
  }
  protected get pc() {
    return this.f.pieces.getRawValue();
  }
  protected get avancement() {
    return AVANCEMENTS.find((a) => a.value === this.p.avancement)?.label ?? '';
  }
  protected file(v: unknown): string {
    const f = toFiles(v)[0];
    return f ? `${f.name} (${formatBytes(f.size)})` : '—';
  }
}
