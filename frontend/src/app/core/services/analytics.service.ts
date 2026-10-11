import { DOCUMENT } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

export type SjiEvent =
  | 'CTA Deposer' // clic sur « Déposer mon projet », avec la section d'origine
  | 'Formulaire ouvert'
  | 'Etape depot' // passage d'une étape (1 → 2 → 3 → 4)
  | 'Depot termine'
  | 'Dossier partenariat' // clic sur « Voir le dossier de partenariat » ou envoi du bulletin
  | 'Telechargement reglement';

type Plausible = (event: string, options?: { props: Record<string, string | number> }) => void;

/**
 * Plausible : moins de 2 Ko, pas de bandeau cookies. Aucun script n'est chargé tant que
 * `environment.plausibleDomain` est vide (donc aucun appel vers un domaine tiers non prévu).
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly doc = inject(DOCUMENT);

  init(): void {
    const domain = environment.plausibleDomain;
    if (!this.browser || !domain) return;
    const s = this.doc.createElement('script');
    s.defer = true;
    s.dataset['domain'] = domain;
    s.src = 'https://plausible.io/js/script.js';
    this.doc.head.appendChild(s);
  }

  track(event: SjiEvent, props?: Record<string, string | number>): void {
    if (!this.browser) return;
    (window as unknown as { plausible?: Plausible }).plausible?.(event, props ? { props } : undefined);
  }
}
