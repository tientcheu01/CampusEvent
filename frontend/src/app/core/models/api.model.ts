export type Avancement = 'idee' | 'prototype' | 'teste';

/** Dossier déposé via /deposer (4 étapes). */
export interface DepotPayload {
  projet: string;
  porteur: string;
  filiere: string;
  niveau: string;
  telephone: string;
  email: string;
  membres: string[];
  probleme: string;
  solution: string;
  avancement: Avancement;
  domaine: string;
  dossierUrl: string;
  videoUrl: string;
  imagesUrls: string[];
}

export interface DepotResponse {
  success: boolean;
  numero: string;
}

export interface ContactPayload {
  nom: string;
  qualite: string;
  message: string;
  email?: string;
}

/** Bulletin d'engagement partenaire. */
export interface PartenariatPayload {
  structure: string;
  representant: string;
  fonction: string;
  telephone: string;
  email: string;
  formule: string;
  contribution: string;
}

export interface AlertePayload {
  email: string;
}

export interface OkResponse {
  success: boolean;
}

export interface UploadProgress {
  /** 0 → 100 */
  progress: number;
  url?: string;
}

/** Fiche projet de l'édition précédente : public/assets/data/projets.json */
export interface Projet {
  slug: string;
  titre: string;
  edition: number;
  domaine: string;
  filiere: string;
  porteurs: string[];
  resume: string;
  probleme: string;
  solution: string;
  prototype: string;
  images: { src: string; alt: string }[];
  prix?: string;
}
