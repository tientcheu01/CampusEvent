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

/**
 * Un bloc de la fiche projet. L'ordre du tableau fait foi : le numéro affiché (01, 02…)
 * vient de la position, jamais des données.
 */
export interface ProjetBloc {
  titre: string;
  intro?: string;
  paragraphes?: string[];
  items?: { titre: string; texte: string }[];
}

/** Fiche projet de l'édition précédente : public/assets/data/projets.json */
export interface Projet {
  slug: string;
  titre: string;
  /** Ligne de positionnement affichée sous le titre. */
  accroche: string;
  citation: string;
  edition: number;
  domaine: string;
  prix: string;
  resume: string;
  blocs: ProjetBloc[];
  ambition: string;
  filiere?: string;
  porteurs?: string[];
  images?: { src: string; alt: string }[];
}
