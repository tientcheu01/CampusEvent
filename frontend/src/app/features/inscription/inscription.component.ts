import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { Subject, finalize, forkJoin, of, switchMap } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { FileNamesPipe } from '../../shared/pipes/file-names.pipe';
import { TotalSizePipe } from '../../shared/pipes/file-size.pipe';
import { InscriptionService } from '../../core/services/inscription.service';
import { UploadService } from '../../core/services/upload.service';
import { environment } from '../../../environments/environment';
import { HeaderLink } from '../../shared/components/header/header.component';
import { InscriptionPayload } from '../../core/models/inscription.model';

interface Toast {
  title: string;
  message: string;
  fields: string[];
  type: 'error' | 'success';
}

interface StepValidation {
  fields: string[];
}

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent, FooterComponent, FileNamesPipe, TotalSizePipe],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.scss'
})
export class InscriptionComponent implements OnInit, OnDestroy {
  headerLinks: HeaderLink[] = [
    { label: 'Accueil', route: ['/'] },
    { label: 'Règlement', route: ['/'], fragment: 'about' },
    { label: 'Contact', route: ['/'], fragment: 'contact' },
    { label: 'S\'inscrire', route: ['/inscription'], isButton: true }
  ];

  form: FormGroup;
  currentStep = 0;
  readonly totalSteps = 5;

  selectedFiles: File[] = [];
  fileError = '';
  isSubmitting = false;

  overlayVisible = false;
  overlayTitle = '';
  overlayMessage = '';
  overlayProgress = 0;
  overlayStep = '';

  toast: Toast | null = null;
  private toastTimeout?: ReturnType<typeof setTimeout>;
  private destroy$ = new Subject<void>();

  private readonly stepValidation: StepValidation[] = [
    { fields: ['titre_projet', 'porteurs', 'participation'] },
    { fields: ['problematique', 'objectif_general', 'objectif_spec1'] },
    { fields: ['principe_fonctionnement', 'caractere_innovant'] },
    { fields: [] },
    { fields: ['date_signature', 'certify'] }
  ];

  private readonly fieldLabels: Record<string, string> = {
    titre_projet: 'Titre du projet',
    porteurs: 'Nom(s) et prénom(s) du porteur',
    participation: 'Type de participation',
    nombre_membres: 'Nombre de membres',
    problematique: 'Problématique',
    objectif_general: 'Objectif général',
    objectif_spec1: 'Objectif spécifique 1',
    principe_fonctionnement: 'Principe de fonctionnement',
    caractere_innovant: 'Caractère innovant',
    date_signature: 'Date de signature',
    certify: 'Certification / Engagement',
  };

  private readonly encouragements = [
    'Votre dossier est entre de bonnes mains...',
    'Chaque grande innovation commence par un premier pas 🚀',
    'Nous préparons votre candidature avec soin...',
    'Bientôt terminé, restez avec nous !',
    'Votre projet mérite toute notre attention ✨',
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly inscriptionService: InscriptionService,
    private readonly uploadService: UploadService
  ) {
    this.form = this.buildForm();
  }

  ngOnInit(): void {
    if (environment.inscriptionClosed) {
      this.router.navigate(['/fin']);
      return;
    }
    this.updateNombreMembresValidators();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      titre_projet: ['', Validators.required],
      porteurs: ['', Validators.required],
      participation: ['', Validators.required],
      nombre_membres: [null],
      encadreur: [''],
      problematique: ['', Validators.required],
      objectif_general: ['', Validators.required],
      objectif_spec1: ['', Validators.required],
      objectif_spec2: [''],
      objectif_spec3: [''],
      principe_fonctionnement: ['', Validators.required],
      innovation_apportee: [''],
      caractere_innovant: ['', Validators.required],
      faisabilite_technique: [''],
      faisabilite_operationnelle: [''],
      impact_social: [false],
      impact_economique: [false],
      impact_environnemental: [false],
      impact_academique: [false],
      impact_technologique: [false],
      description_impacts: [''],
      joint_ppt: [false],
      joint_video: [false],
      joint_maquette: [false],
      joint_plan_tech: [false],
      joint_plan_financier: [false],
      joint_plan_admin: [false],
      joint_autres: [''],
      date_signature: ['', Validators.required],
      certify: [false, Validators.requiredTrue],
    });
  }

  onParticipationChange(): void {
    this.updateNombreMembresValidators();
  }

  private updateNombreMembresValidators(): void {
    const control = this.form.get('nombre_membres');
    if (!control) return;

    if (this.form.value.participation === 'En équipe') {
      control.setValidators([Validators.required, Validators.min(1)]);
    } else {
      control.clearValidators();
      control.setValue(null);
    }
    control.updateValueAndValidity();
  }

  get progressPercentage(): number {
    return Math.round(((this.currentStep + 1) / this.totalSteps) * 100);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.handleFiles(Array.from(input.files ?? []));
    input.value = '';
  }

  private handleFiles(files: File[]): void {
    this.selectedFiles = files;
    this.validateFiles();
  }

  private validateFiles(): void {
    this.fileError = '';
    const maxBytes = environment.maxFileSizeBytes;
    const totalBytes = this.selectedFiles.reduce((sum, f) => sum + f.size, 0);
    const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
    const oversized = this.selectedFiles.filter(f => f.size > maxBytes);

    if (this.selectedFiles.length === 0) {
      return;
    }

    if (oversized.length > 0 || totalBytes > maxBytes) {
      let msg = '';
      if (oversized.length > 0) {
        msg += 'Fichier(s) trop volumineux (>48 Mo) : ' + oversized.map(f => f.name).join(', ') + '. ';
      }
      if (totalBytes > maxBytes) {
        msg += 'Taille totale dépassée (' + totalMB + ' Mo > 48 Mo). ';
      }
      msg += 'Le bouton "Valider ma candidature" est désactivé.';
      this.fileError = msg;
    }
  }

  clearFiles(): void {
    this.selectedFiles = [];
    this.fileError = '';
  }

  nextStep(): void {
    if (this.validateCurrentStep()) {
      this.currentStep = Math.min(this.currentStep + 1, this.totalSteps - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.shakeForm();
      this.showToast(
        'Champs obligatoires manquants',
        'Veuillez compléter les champs suivants avant de continuer :',
        this.getMissingFields(),
        'error'
      );
    }
  }

  previousStep(): void {
    this.currentStep = Math.max(this.currentStep - 1, 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private validateCurrentStep(): boolean {
    const fields = this.stepValidation[this.currentStep].fields;
    let valid = true;
    fields.forEach(fieldName => {
      const control = this.form.get(fieldName);
      if (control) {
        control.markAsTouched();
        control.markAsDirty();
        if (control.invalid) {
          valid = false;
        }
      }
    });

    if (this.currentStep === 4 && this.selectedFiles.length === 0) {
      this.fileError = 'Veuillez joindre votre dossier descriptif.';
      valid = false;
    } else if (this.currentStep !== 4) {
      this.fileError = '';
    }

    return valid;
  }

  private getMissingFields(): string[] {
    const fields = this.stepValidation[this.currentStep].fields;
    const missing: string[] = [];
    fields.forEach(fieldName => {
      const control = this.form.get(fieldName);
      if (control?.invalid && !missing.includes(this.fieldLabels[fieldName] || fieldName)) {
        missing.push(this.fieldLabels[fieldName] || fieldName);
      }
    });
    if (this.currentStep === 4 && this.selectedFiles.length === 0 && !missing.includes('Dossier descriptif')) {
      missing.push('Dossier descriptif');
    }
    return missing;
  }

  private shakeForm(): void {
    const formWrapper = document.querySelector('.form-wrapper');
    if (formWrapper) {
      formWrapper.animate(
        [{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
        { duration: 300 }
      );
    }
  }

  onSubmit(): void {
    if (!this.validateCurrentStep()) {
      this.showToast(
        'Champs obligatoires manquants',
        'Veuillez compléter les champs suivants pour soumettre votre candidature :',
        this.getMissingFields(),
        'error'
      );
      return;
    }

    if (this.fileError) {
      return;
    }

    this.isSubmitting = true;
    this.showOverlay('Envoi de vos fichiers...', 'Vos documents sont en cours de téléversement. Merci de patienter quelques instants.', 'Étape 1/3 — Upload des fichiers', 10);

    const msgInterval = this.startEncouragements();

    this.uploadFiles().pipe(
      switchMap(fileUrls => {
        this.updateOverlay('Préparation de votre dossier...', 'Nous rassemblons toutes vos informations.', 'Étape 2/3 — Traitement des données', 70);
        const payload = this.buildPayload(fileUrls);
        this.updateOverlay('Envoi de votre candidature...', 'Plus que quelques secondes, votre dossier est presque parti ! 🎉', 'Étape 3/3 — Envoi de la candidature', 85);
        return this.inscriptionService.submit(payload);
      }),
      finalize(() => {
        clearInterval(msgInterval);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.updateOverlay('Candidature envoyée avec succès !', 'Bravo ! Votre projet a bien été transmis au jury. Bonne chance ! 🏆', 'Terminé ✓', 100);
        setTimeout(() => {
          this.hideOverlay();
          this.router.navigate(['/merci']);
        }, 1800);
      },
      error: (err) => {
        this.hideOverlay();
        this.isSubmitting = false;
        this.showToast('Erreur d\'envoi', err.error?.error || err.error?.details || 'Une erreur est survenue lors de l\'envoi du formulaire. Veuillez réessayer.', [], 'error');
      }
    });
  }

  private uploadFiles() {
    if (this.selectedFiles.length === 0) {
      return of([]);
    }

    return forkJoin(
      this.selectedFiles.map((file, index) => {
        const pct = Math.round(10 + ((index + 1) / this.selectedFiles.length) * 50);
        this.updateOverlay(
          'Envoi de vos fichiers...',
          `Téléversement de « ${file.name} » (${index + 1}/${this.selectedFiles.length})`,
          'Étape 1/3 — Upload des fichiers',
          pct
        );
        return this.uploadService.uploadFile(file);
      })
    );
  }

  private buildPayload(fileUrls: string[]): InscriptionPayload {
    const value = this.form.value;
    return {
      ...value,
      fichiers_urls: fileUrls.join('\n'),
      nombre_membres: value.participation === 'En équipe' ? Number(value.nombre_membres) : null,
    };
  }

  private startEncouragements(): ReturnType<typeof setInterval> {
    let index = 0;
    return setInterval(() => {
      index = (index + 1) % this.encouragements.length;
      this.overlayMessage = this.encouragements[index];
    }, 3500);
  }

  private showOverlay(title: string, message: string, step: string, progress: number): void {
    this.overlayTitle = title;
    this.overlayMessage = message;
    this.overlayStep = step;
    this.overlayProgress = progress;
    this.overlayVisible = true;
  }

  private updateOverlay(title: string, message: string, step: string, progress: number): void {
    if (title) this.overlayTitle = title;
    if (message) this.overlayMessage = message;
    if (step) this.overlayStep = step;
    if (progress !== undefined) this.overlayProgress = progress;
  }

  private hideOverlay(): void {
    this.overlayVisible = false;
  }

  private showToast(title: string, message: string, fields: string[], type: 'error' | 'success'): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toast = { title, message, fields, type };
    this.toastTimeout = setTimeout(() => {
      this.toast = null;
    }, 5000);
  }

  closeToast(): void {
    this.toast = null;
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }

  asFormControl(name: string) {
    return this.form.get(name);
  }
}
