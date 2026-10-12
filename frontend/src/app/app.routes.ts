import { Routes } from '@angular/router';
import { veilGuard } from './core/services/veil.guard';
import { HomeComponent } from './pages/home/home.component';
import { SeoData } from './core/services/seo.service';

const seo = (data: SeoData) => ({ seo: data });
const SUFFIX = 'SJI INNOVA 2027 · Saint Jean Ingénieur';

/**
 * Toutes les pages passent sous un parent unique qui porte le voile de transition.
 * L'accueil est dans le bundle initial ; les autres routes sont chargées à la demande
 * (/deposer est préchargée : c'est le parcours qu'on optimise).
 */
export const routes: Routes = [
  {
    path: '',
    canActivateChild: [veilGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
        data: seo({
          title: "SJI INNOVA 2027 · Concours d'innovation étudiante · Saint Jean Ingénieur, Yaoundé",
          description:
            "2ᵉ édition du concours d'innovation étudiante de Saint Jean Ingénieur. Dépôt des projets du 16 novembre au 18 décembre 2026, grande finale le 10 février 2027 à Yaoundé. 100 000 FCFA et un accompagnement pour le projet lauréat.",
        }),
      },
      {
        path: 'deposer',
        loadComponent: () => import('./pages/deposer/deposer.component').then((m) => m.DeposerComponent),
        data: {
          preload: true,
          ...seo({
            title: `Déposer un projet · ${SUFFIX}`,
            description: "Déposez votre dossier et votre vidéo avant le 18 décembre 2026 pour participer au concours d'innovation étudiante SJI INNOVA 2027.",
            noindex: true,
          }),
        },
      },
      {
        path: 'le-concours',
        loadComponent: () => import('./pages/concours/concours.component').then((m) => m.ConcoursComponent),
        data: seo({
          title: `Le concours : règlement, critères, jury, FAQ · ${SUFFIX}`,
          description:
            "Règlement, critères d'évaluation, composition du jury, calendrier et questions fréquentes du concours d'innovation étudiante SJI INNOVA 2027, à Saint Jean Ingénieur (Yaoundé).",
          image: 'og-concours.png',
        }),
      },
      {
        path: 'projets',
        loadComponent: () => import('./pages/projets/projets.component').then((m) => m.ProjetsComponent),
        data: seo({
          title: `Les projets de la première édition · ${SUFFIX}`,
          description: 'Les projets portés par des étudiants de Saint Jean Ingénieur lors de la première édition de SJI INNOVA : problème, solution, prototype, équipe.',
          image: 'og-projets.png',
        }),
      },
      {
        path: 'projets/:slug',
        loadComponent: () => import('./pages/projets/projet-fiche.component').then((m) => m.ProjetFicheComponent),
        data: seo({ title: `Projet · ${SUFFIX}`, description: 'Fiche projet de la première édition de SJI INNOVA.', image: 'og-projets.png' }),
      },
      {
        path: 'partenaires',
        loadComponent: () => import('./pages/partenaires/partenaires.component').then((m) => m.PartenairesComponent),
        data: seo({
          title: `Devenir partenaire · ${SUFFIX}`,
          description:
            "Associez votre marque à la créativité de la jeunesse camerounaise : quatre niveaux de partenariat (Platine, Or, Argent, Bronze) pour le concours SJI INNOVA 2027, à Yaoundé.",
          image: 'og-partenaires.png',
        }),
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/contact/contact.component').then((m) => m.ContactComponent),
        data: seo({
          title: `Contact · ${SUFFIX}`,
          description: "Une question sur SJI INNOVA 2027 ? Appelez, écrivez sur WhatsApp ou rendez-vous au campus d'Etok-Koss, à Yaoundé.",
        }),
      },
      {
        path: 'galerie',
        loadComponent: () => import('./pages/affiche/affiche.component').then((m) => m.AfficheComponent),
        data: seo({
          title: `Galerie photo · ${SUFFIX}`,
          description: "Découvrez en images les visages, l'énergie et les moments forts de la communauté SJI INNOVA.",
        }),
      },
      {
        path: 'affiche',
        redirectTo: 'galerie',
        pathMatch: 'full',
      },
      {
        path: '**',
        loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
        data: seo({ title: `Page introuvable · ${SUFFIX}`, description: "Cette page n'existe pas. Mais le concours, si.", noindex: true }),
      },
    ],
  },
];
