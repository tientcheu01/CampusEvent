import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { LIMITS } from '../../core/data/site-data';
import { Avancement, DepotPayload } from '../../core/models/api.model';
import { AnalyticsService } from '../../core/services/analytics.service';
import { ConfettiService } from '../../core/services/confetti.service';
import { ApiService } from '../../core/services/api.service';
import { UploadService } from '../../core/services/upload.service';
import { fileExtensions, maxFileSize } from '../../shared/ui/file-validators';

export const STEPS = ["L'équipe", 'Le projet', 'Les pièces', 'Relecture'] as const;
const KEY = 'sji-innova-2027-depot';
const MAX_MEMBRES = 4; // le porteur + 4 = équipe de 5 au maximum

export interface UploadItem {
  label: string;
  name: string;
  size: number;
  progress: number;
}

const LABELS: Record<string, string> = {
  projet: 'le nom du projet',
  porteur: 'le nom du porteur',
  filiere: 'votre filière',
  niveau: 'votre niveau',
  telephone: 'votre téléphone',
  email: 'votre e-mail',
  probleme: 'le problème traité',
  solution: 'la solution proposée',
  avancement: "l'état d'avancement",
  domaine: 'le domaine',
  dossier: 'le dossier PDF',
  videoFile: 'la vidéo',
  videoLien: 'le lien de la vidéo',
  accord: "l'acceptation du règlement",
};
const joinFr = (l: string[]) => (l.length < 2 ? l.join('') : `${l.slice(0, -1).join(', ')} et ${l[l.length - 1]}`);

/** État du dépôt en quatre étapes : formulaire, brouillon localStorage, téléversements, envoi. Un par page. */
@Injectable()
export class DepotFormService {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly api = inject(ApiService);
  private readonly uploader = inject(UploadService);
  private readonly analytics = inject(AnalyticsService);
  private readonly confetti = inject(ConfettiService);

  readonly step = signal(0);
  readonly submitting = signal(false);
  readonly error = signal(false);
  readonly numero = signal<string | null>(null);
  readonly uploads = signal<UploadItem[]>([]);
  readonly restored = signal<{ files: boolean } | null>(null);
  readonly showSummary = signal(false);

  readonly equipe = new FormGroup({
    projet: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    porteur: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    filiere: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    niveau: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    telephone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[+\d][\d\s().-]{7,}$/)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    membres: new FormArray<FormControl<string>>([]),
  });
  readonly projet = new FormGroup({
    probleme: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(30), Validators.maxLength(800)] }),
    solution: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(30), Validators.maxLength(1200)] }),
    avancement: new FormControl<Avancement | ''>('', { nonNullable: true, validators: [Validators.required] }),
    domaine: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  readonly pieces = new FormGroup({
    dossier: new FormControl<File | null>(null, [Validators.required, fileExtensions(['pdf']), maxFileSize(LIMITS.dossierMo)]),
    videoMode: new FormControl<'fichier' | 'lien'>('fichier', { nonNullable: true }),
    videoFile: new FormControl<File | null>(null),
    videoLien: new FormControl('', { nonNullable: true }),
    images: new FormControl<File[]>([], { nonNullable: true, validators: [fileExtensions(['jpg', 'jpeg', 'png', 'webp']), maxFileSize(LIMITS.imageMo)] }),
  });
  readonly accord = new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] });
  readonly form = new FormGroup({ equipe: this.equipe, projet: this.projet, pieces: this.pieces, accord: this.accord });

  private readonly groups = [this.equipe, this.projet, this.pieces, this.form.controls.accord] as AbstractControl[];

  readonly canAddMembre = computed(() => this.membres.length < MAX_MEMBRES);
  get membres(): FormArray<FormControl<string>> {
    return this.equipe.controls.membres;
  }

  constructor() {
    this.applyVideoMode('fichier');
    this.pieces.controls.videoMode.valueChanges.pipe(takeUntilDestroyed()).subscribe((m) => this.applyVideoMode(m));
    if (this.browser) {
      this.restore();
      this.form.valueChanges.pipe(debounceTime(300), takeUntilDestroyed()).subscribe(() => this.save());
    }
  }

  addMembre(value = ''): void {
    if (this.canAddMembre()) this.membres.push(new FormControl(value, { nonNullable: true, validators: [Validators.required] }));
  }
  removeMembre(i: number): void {
    this.membres.removeAt(i);
  }

  /** Les champs invalides de l'étape, formulés pour le message « Complétez … pour continuer ». */
  missing(step: number): string[] {
    const out: string[] = [];
    const walk = (c: AbstractControl, name: string) => {
      if (c instanceof FormGroup) Object.entries(c.controls).forEach(([k, v]) => walk(v, k));
      else if (c instanceof FormArray) c.controls.forEach((v) => walk(v, 'membre'));
      else if (c.invalid) out.push(LABELS[name] ?? 'ce champ');
    };
    walk(this.groups[step], step === 3 ? 'accord' : '');
    return [...new Set(out)];
  }
  valid(step: number): boolean {
    return this.groups[step].valid;
  }
  reason(step: number): string {
    const m = this.missing(step);
    return m.length ? `Complétez ${joinFr(m)} pour continuer` : '';
  }

  go(step: number): void {
    this.step.set(step);
    this.showSummary.set(false);
    this.analytics.track('Etape depot', { etape: step + 1 });
    this.save();
  }
  next(): void {
    const s = this.step();
    if (!this.valid(s)) {
      this.groups[s].markAllAsTouched();
      this.showSummary.set(true);
      return;
    }
    this.go(Math.min(3, s + 1));
  }
  prev(): void {
    this.go(Math.max(0, this.step() - 1));
  }

  async submit(): Promise<void> {
    if (this.submitting()) return;
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.showSummary.set(true);
      return;
    }
    this.submitting.set(true);
    this.error.set(false);
    this.uploads.set([]);
    try {
      const p = this.pieces.getRawValue();
      const dossierUrl = await this.uploadOne('Dossier', p.dossier!);
      const videoUrl = p.videoMode === 'fichier' ? await this.uploadOne('Vidéo', p.videoFile!) : p.videoLien.trim();
      const imagesUrls: string[] = [];
      for (const img of p.images) imagesUrls.push(await this.uploadOne('Image', img));

      const e = this.equipe.getRawValue();
      const pr = this.projet.getRawValue();
      const payload: DepotPayload = {
        projet: e.projet,
        porteur: e.porteur,
        filiere: e.filiere,
        niveau: e.niveau,
        telephone: e.telephone,
        email: e.email,
        membres: e.membres.filter(Boolean),
        probleme: pr.probleme,
        solution: pr.solution,
        avancement: pr.avancement as Avancement,
        domaine: pr.domaine,
        dossierUrl,
        videoUrl,
        imagesUrls,
      };
      const res = await new Promise<{ numero: string }>((ok, ko) => this.api.depot(payload).subscribe({ next: ok, error: ko }));
      this.numero.set(res.numero);
      this.clearDraft();
      this.analytics.track('Depot termine');
      this.confetti.celebrate('Votre projet prend son envol !', `Félicitations, votre candidature ${res.numero} a bien été déposée. Conservez ce numéro pour le suivi.`);
    } catch {
      // Le brouillon reste sur l'appareil : « Votre dossier est enregistré sur cet appareil — réessayez. »
      this.error.set(true);
      this.save();
    } finally {
      this.submitting.set(false);
    }
  }

  private uploadOne(label: string, file: File): Promise<string> {
    const idx = this.uploads().length;
    this.uploads.update((l) => [...l, { label, name: file.name, size: file.size, progress: 0 }]);
    return new Promise((ok, ko) =>
      this.uploader.upload(file).subscribe({
        next: (ev) => {
          this.uploads.update((l) => l.map((u, i) => (i === idx ? { ...u, progress: ev.progress } : u)));
          if (ev.url) ok(ev.url);
        },
        error: ko,
      }),
    );
  }

  private applyVideoMode(mode: 'fichier' | 'lien'): void {
    const { videoFile, videoLien } = this.pieces.controls;
    if (mode === 'fichier') {
      videoFile.setValidators([Validators.required, fileExtensions(['mp4']), maxFileSize(LIMITS.videoMo)]);
      videoLien.clearValidators();
      videoLien.setValue('', { emitEvent: false });
    } else {
      videoLien.setValidators([Validators.required, Validators.pattern(/^https?:\/\/(www\.)?(youtube\.com|youtu\.be|drive\.google\.com)\/\S+$/i)]);
      videoFile.clearValidators();
      videoFile.setValue(null, { emitEvent: false });
    }
    videoFile.updateValueAndValidity({ emitEvent: false });
    videoLien.updateValueAndValidity({ emitEvent: false });
  }

  // ─── Brouillon ──────────────────────────────────────────────────────────────

  private save(): void {
    if (!this.browser || this.numero()) return;
    try {
      const e = this.equipe.getRawValue();
      const p = this.pieces.getRawValue();
      const hadFiles = !!(p.dossier || p.videoFile || p.images.length);
      localStorage.setItem(KEY, JSON.stringify({ step: this.step(), equipe: e, projet: this.projet.getRawValue(), videoMode: p.videoMode, videoLien: p.videoLien, hadFiles }));
    } catch {
      /* stockage indisponible : le formulaire fonctionne sans brouillon */
    }
  }

  private restore(): void {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      const { membres = [], ...equipe } = d.equipe ?? {};
      membres.forEach((m: string) => this.addMembre(m));
      this.equipe.patchValue(equipe, { emitEvent: false });
      this.projet.patchValue(d.projet ?? {}, { emitEvent: false });
      this.pieces.controls.videoMode.setValue(d.videoMode ?? 'fichier', { emitEvent: false });
      this.applyVideoMode(d.videoMode ?? 'fichier');
      this.pieces.controls.videoLien.setValue(d.videoLien ?? '', { emitEvent: false });
      this.step.set(Math.min(Number(d.step) || 0, 3));
      this.restored.set({ files: !!d.hadFiles });
    } catch {
      /* brouillon illisible : on repart de zéro */
    }
  }

  private clearDraft(): void {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* rien à faire */
    }
  }
}
