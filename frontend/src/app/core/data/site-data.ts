// Contenus et constantes du site. Source : document d'implémentation SJI INNOVA 2027.
// Les textes marqués « à valider » doivent passer devant le comité d'organisation avant mise en ligne.

export const NB = ' ';

/** Espaces insécables avant : ; ! ? » et après « (règle typographique française). */
export const fr = (s: string): string => s.replace(/ ([:;!?»])/g, `${NB}$1`).replace(/« /g, `«${NB}`);

export interface NavItem {
  label: string;
  path: string;
}

/** Cinq rubriques, pas plus. Le bouton « Déposer » est à part. */
export const NAV: NavItem[] = [
  { label: 'Le concours', path: '/le-concours' },
  { label: 'Projets', path: '/projets' },
  { label: 'Partenaires', path: '/partenaires' },
  { label: 'Contact', path: '/contact' },
  { label: 'Galerie', path: '/galerie' },
];

export const CONTACT = {
  phones: [
    { display: '694 88 23 94', tel: '+237694882394' },
    { display: '656 03 32 52', tel: '+237656033252' },
    { display: '655 66 03 95', tel: '+237655660395' },
  ],
  whatsapp: 'https://wa.me/237694882394',
  email: 'info@saintjeaningenieur.org',
  address: "Campus d'Etok-Koss, Simbock, Yaoundé",
  itineraire: 'https://www.google.com/maps/search/?api=1&query=Saint+Jean+Ing%C3%A9nieur+Etok-Koss+Simbock+Yaound%C3%A9',
  hashtag: '#SJIINNOVA2027',
};

// À vérifier : les trois profils doivent pointer vers les bons comptes (checklist de recette).
export const SOCIAL = [
  { label: 'Facebook', handle: '@SJI_INNOVA', url: 'https://www.facebook.com/SJI_INNOVA' },
  { label: 'Instagram', handle: '@sji_innova', url: 'https://www.instagram.com/sji_innova' },
  { label: 'LinkedIn', handle: '@SJI INNOVA', url: 'https://www.linkedin.com/company/sji-innova' },
];

export const DOCS = {
  reglement: '/assets/documents/reglement-sji-innova.pdf',
  /** Dossier de partenariat PDF : pas encore dans le dépôt. Renseigner le chemin quand il sera ajouté. */
  dossierPartenariat: null as string | null,
  /** Modèle de dossier de candidature : idem. */
  modeleDossier: null as string | null,
};

export const LIMITS = {
  dossierMo: 10,
  videoMo: 200,
  imageMo: 5,
  hardLimitText: { dossier: 'PDF de 10 Mo maximum.', video: 'Fichier MP4 de 200 Mo maximum, ou un lien YouTube ou Google Drive accessible' },
};

export const BANDE_MOTS = ['Créativité', 'Ingéniosité', 'Innovation', 'Au service de la société'];

export const VERBES = [
  { verbe: 'Détecter', texte: 'Repérer les idées et les talents capables de répondre à de vrais besoins.' },
  { verbe: 'Valoriser', texte: 'Donner de la visibilité aux projets et récompenser les meilleurs lors d’une grande cérémonie.' },
  { verbe: 'Accompagner', texte: 'Offrir aux jeunes innovateurs un accompagnement à la hauteur de leurs ambitions.' },
];

export const PALIERS = [
  { mot: 'Idée', texte: "Vous repérez un problème que personne autour de vous n'a résolu." },
  { mot: 'Projet', texte: 'Vous le structurez, seul ou en équipe, et vous le déposez.' },
  { mot: 'Solution', texte: 'Le jury évalue, présélectionne, et vous accompagne.' },
  { mot: 'Impact', texte: 'Votre projet quitte le campus et sert.' },
];

export interface TempsFort {
  titre: string;
  dates: string;
  texte: string;
  lieu?: string;
}

export const CALENDRIER: TempsFort[] = [
  { titre: 'Lancement et dépôt', dates: '16 novembre → 18 décembre 2026', texte: 'Remise des dossiers et de la vidéo de présentation.' },
  { titre: 'Évaluation et présélection', dates: '21 décembre 2026 → 22 janvier 2027', texte: "Le jury d'évaluation examine les dossiers." },
  {
    titre: 'Grande finale et remise des prix',
    dates: '10 février 2027, 13h–17h',
    texte: "Grande salle Licence 1 francophone, campus d'Etok-Koss.",
  },
];

// Barème de l'article 8 du règlement en vigueur. À refaire valider pour l'édition 2027.
export const CRITERES_PONDERES = [
  { nom: 'Originalité et innovation', poids: 30 },
  { nom: 'Faisabilité technique', poids: 25 },
  { nom: 'Impact potentiel', poids: 25 },
  { nom: 'Qualité de la présentation', poids: 20 },
];

export const CRITERES = CRITERES_PONDERES.map((c) => c.nom);

export interface FaqItem {
  titre: string;
  paragraphes: string[];
  liste?: string[];
}

/** Accordéon de l'accueil : cinq entrées maximum. Contenu repris du règlement en vigueur, à valider pour 2027. */
export const FAQ_ACCUEIL: FaqItem[] = [
  {
    titre: "Conditions d'éligibilité",
    paragraphes: ['Le concours est ouvert aux étudiants de Saint Jean Ingénieur, campus d’Etok-Koss.'],
    liste: [
      'Être régulièrement inscrit au campus.',
      'Participer seul ou en équipe de 2 à 5 étudiants, tous niveaux confondus.',
      "Présenter un projet d'innovation technologique original et réalisable.",
      'Chaque étudiant ne peut participer qu’à un seul projet.',
    ],
  },
  {
    titre: 'Pièces à fournir',
    paragraphes: ['Deux pièces sont indispensables ; les compléments (maquette, plans) renforcent le dossier.'],
    liste: [
      `Le dossier du projet, en PDF (${LIMITS.dossierMo} Mo maximum).`,
      `La vidéo de présentation, de 2 à 3 minutes : fichier MP4 (${LIMITS.videoMo} Mo maximum) ou lien YouTube ou Google Drive accessible.`,
      'Facultatif : images, prototype, plan technique, plan financier.',
    ],
  },
  {
    titre: "Critères d'évaluation du jury",
    paragraphes: ['Le jury examine chaque dossier selon quatre critères.'],
    liste: [...CRITERES, 'Barème détaillé publié avec le règlement.'],
  },
  {
    titre: 'Calendrier détaillé',
    paragraphes: CALENDRIER.map((c) => `${c.titre} · ${c.dates}. ${c.texte}`),
  },
  {
    titre: 'Questions pratiques',
    paragraphes: [
      "La finale se tient à Yaoundé, dans la Grande salle Licence 1 francophone du campus d'Etok-Koss.",
      'Une question ? Écrivez-nous sur WhatsApp ou appelez l’un des trois numéros de la page Contact.',
    ],
  },
];

export const FAQ_CONCOURS: FaqItem[] = [
  ...FAQ_ACCUEIL.filter((f) => f.titre !== 'Calendrier détaillé' && f.titre !== "Critères d'évaluation du jury"),
  {
    titre: 'Puis-je déposer un projet seul ?',
    paragraphes: ['Oui. Un projet peut être porté par un seul étudiant ou par une équipe de 2 à 5 étudiants.'],
  },
  {
    titre: 'Que se passe-t-il après la présélection ?',
    paragraphes: ['Les projets présélectionnés sont accompagnés jusqu’à la grande finale du 10 février 2027, où le jury désigne les lauréats.'],
  },
];

export const RECOMPENSES = {
  montant: 100000,
  trophees: 3,
};

/** Article 10 du règlement. Les récompenses peuvent être complétées selon les partenaires. */
export const PRIX = [
  { rang: '1er prix', montant: '100 000', lots: ['Trophée', 'Accompagnement personnalisé'], phare: true },
  { rang: '2e prix', montant: '50 000', lots: ['Trophée', 'Accompagnement personnalisé'], phare: false },
  { rang: '3e prix', montant: '25 000', lots: ['Trophée'], phare: false },
];

// ─── Partenariat ──────────────────────────────────────────────────────────────

export const RAISONS_PARTENAIRE = [
  'Une visibilité directe auprès des étudiants, des enseignants et des familles de Saint Jean Ingénieur.',
  'Un accès précoce à des projets et des talents, repérés avant les autres.',
  'Une présence lors de la grande finale et de la remise des prix, devant le jury et le public.',
  'Un soutien concret à des projets qui répondent à un besoin réel de la société camerounaise.',
  "Un format sur mesure : si aucun niveau ne vous correspond, la contribution s'ajuste avec le comité d'organisation.",
];

export const PUBLICS = ['Étudiants', 'Enseignants', 'Partenaires académiques', 'Acteurs socio-économiques'];

export const CONTRIBUTIONS = [
  { nom: 'Financière', texte: 'Dotation des prix et organisation de la finale.' },
  { nom: 'Matérielle', texte: 'Équipement, matériel ou lots pour les lauréats.' },
  { nom: 'Technique', texte: 'Expertise, mentorat, accès à des outils ou des plateformes.' },
  { nom: 'Institutionnelle', texte: 'Appui, parrainage ou mise en réseau.' },
];

export const NIVEAUX = ['Platine', 'Or', 'Argent', 'Bronze'] as const;
export type Niveau = (typeof NIVEAUX)[number];

export interface Contrepartie {
  ligne: string;
  valeurs: [string, string, string, string]; // Platine, Or, Argent, Bronze ; '—' = non inclus
}

// À REMPLACER par le tableau exact du dossier de partenariat 2027 (non disponible dans le dépôt).
// Les valeurs ci-dessous sont indicatives et ne contiennent aucun montant.
export const CONTREPARTIES: Contrepartie[] = [
  { ligne: 'Logo sur le site SJI INNOVA', valeurs: ['Page d’accueil, en tête', 'Page d’accueil', 'Page partenaires', 'Page partenaires'] },
  { ligne: 'Logo sur les supports de la finale', valeurs: ['Principal', 'Visible', 'Visible', '—'] },
  { ligne: 'Prise de parole à la cérémonie', valeurs: ['Oui', 'Oui', '—', '—'] },
  { ligne: 'Remise d’un prix ou d’un trophée', valeurs: ['Oui', 'Oui', 'Oui', '—'] },
  { ligne: 'Mention sur les réseaux de SJI INNOVA', valeurs: ['Oui', 'Oui', 'Oui', 'Oui'] },
  { ligne: 'Invitation à la grande finale', valeurs: ['Oui', 'Oui', 'Oui', 'Oui'] },
];

// ─── Dépôt ────────────────────────────────────────────────────────────────────

export const DOMAINES = ['Santé', 'Agriculture', 'Éducation', 'Énergie', 'Environnement', 'Mobilité', 'Finance et commerce', 'Numérique', 'Autre'];
export const AVANCEMENTS = [
  { value: 'idee', label: 'Idée' },
  { value: 'prototype', label: 'Prototype' },
  { value: 'teste', label: 'Testé' },
];
