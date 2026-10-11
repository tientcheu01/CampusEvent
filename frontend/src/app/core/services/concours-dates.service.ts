import { Injectable, NgZone, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Le Cameroun est en UTC+01:00 toute l'année : le décalage est explicite pour qu'un visiteur
// à Paris en été ne voie pas un jour de décalage.
export const DATES = {
  ouverture: new Date('2026-11-16T00:00:00+01:00'),
  cloture: new Date('2026-12-18T23:59:59+01:00'),
  evalDebut: new Date('2026-12-21T00:00:00+01:00'),
  evalFin: new Date('2027-01-22T23:59:59+01:00'),
  finale: new Date('2027-02-10T13:00:00+01:00'),
  finaleFin: new Date('2027-02-10T17:00:00+01:00'),
} as const;

export type Phase = 'avant' | 'depots' | 'evaluation' | 'vers-finale' | 'apres';

export interface CountdownText {
  before: string;
  n: number | null;
  unit: string;
  after: string;
}

const DAY = 86_400_000;
const daysUntil = (to: Date, from: Date) => Math.max(0, Math.ceil((to.getTime() - from.getTime()) / DAY));
const plural = (n: number) => (n > 1 ? 'jours' : 'jour');

function phaseAt(now: Date): Phase {
  if (now < DATES.ouverture) return 'avant';
  if (now <= DATES.cloture) return 'depots';
  if (now <= DATES.evalFin) return 'evaluation';
  if (now < DATES.finaleFin) return 'vers-finale';
  return 'apres';
}

/**
 * Tout ce qui dépend du calendrier passe ici : compte à rebours, libellé du bouton principal,
 * état de /deposer, barre de progression. Le site change de phase sans intervention.
 * Le HTML prérendu est figé à la date du build ; l'horloge réelle prend le relais au chargement.
 */
@Injectable({ providedIn: 'root' })
export class ConcoursDatesService {
  private readonly now = signal(new Date());

  readonly phase = computed<Phase>(() => phaseAt(this.now()));

  readonly daysLeft = computed(() => {
    const now = this.now();
    switch (this.phase()) {
      case 'avant':
        return daysUntil(DATES.ouverture, now);
      case 'depots':
        return daysUntil(DATES.cloture, now);
      case 'vers-finale':
        return daysUntil(DATES.finale, now);
      default:
        return 0;
    }
  });

  readonly countdown = computed<CountdownText>(() => {
    const n = this.daysLeft();
    const unit = plural(n);
    switch (this.phase()) {
      case 'avant':
        return { before: 'Les dépôts ouvrent dans', n, unit, after: '' };
      case 'depots':
        return { before: 'Il vous reste', n, unit, after: 'pour déposer' };
      case 'evaluation':
        return { before: 'Le jury évalue les projets. Résultats le 22 janvier.', n: null, unit: '', after: '' };
      case 'vers-finale':
        return { before: "La grande finale, c'est dans", n, unit, after: '' };
      default:
        return { before: 'Édition 2027 terminée. Découvrez les lauréats.', n: null, unit: '', after: '' };
    }
  });

  /** Texte brut du compte à rebours (aria-label, partage). */
  readonly countdownLabel = computed(() => {
    const c = this.countdown();
    return [c.before, c.n, c.unit, c.after].filter((p) => p !== null && p !== '').join(' ');
  });

  /** Le bouton principal change de libellé et d'action selon la phase. */
  readonly cta = computed(() => {
    switch (this.phase()) {
      case 'avant':
        return { label: "Être prévenu de l'ouverture", link: '/deposer' };
      case 'depots':
        return { label: 'Déposer mon projet', link: '/deposer' };
      case 'apres':
        return { label: 'Découvrir les lauréats', link: '/projets' };
      default:
        return { label: 'Voir le calendrier', link: '/le-concours', fragment: 'calendrier' };
    }
  });

  readonly depotsOuverts = computed(() => this.phase() === 'depots');

  /** 0 → 1 le long des trois temps forts de la bande calendrier. */
  readonly progress = computed(() => {
    const t = this.now().getTime();
    const seg = (a: Date, b: Date) => Math.min(1, Math.max(0, (t - a.getTime()) / (b.getTime() - a.getTime())));
    return (seg(DATES.ouverture, DATES.cloture) + seg(DATES.evalDebut, DATES.evalFin) + seg(DATES.finale, DATES.finaleFin)) / 3;
  });

  constructor() {
    const zone = inject(NgZone);
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      this.now.set(new Date());
      // Hors zone : un setInterval permanent empêcherait l'application d'être « stable ».
      zone.runOutsideAngular(() => setInterval(() => zone.run(() => this.now.set(new Date())), 60_000));
    }
  }
}
