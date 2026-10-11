# SJI INNOVA 2027 — site du concours

Angular 18 standalone + signals, prérendu statique (SSG), thème clair.
La charte, les composants et les contenus suivent le document d'implémentation à la racine.

## Commandes

| Commande | Effet |
| --- | --- |
| `npm start` | Serveur de développement sur http://localhost:4200 |
| `npm run build` | Génère `routes.txt` + `sitemap.xml`, puis prérend toutes les routes publiques dans `dist/frontend/browser` |
| `npm test` | Tests unitaires (Karma) |

## Structure

```
src/app/
  core/       services (dates, SEO, Lenis, halo, mesure), directives d'animation, données du site
  shared/ui/  les primitives du design system (bouton, champ, carte, compte à rebours…)
  shared/layout/ en-tête, pied de page, diagonale dorée, voile de transition
  pages/      une page par route ; l'accueil a un composant par section
src/styles/   tokens, typographie, base, utilitaires
```

**Tout passe par les tokens CSS de `src/styles/_tokens.scss`.** Aucune couleur ni taille en dur.

## Où modifier quoi

| À changer | Fichier |
| --- | --- |
| Dates du concours | `src/app/core/services/concours-dates.service.ts` (`DATES`) — tout le site change de phase ensuite |
| Textes, contacts, réseaux, niveaux de partenariat | `src/app/core/data/site-data.ts` |
| Projets de la 1ʳᵉ édition | `public/assets/data/projets.json` (les fiches `/projets/:slug` sont prérendues depuis ce fichier) |
| Domaine du site | `src/environments/site.json` (`url`) — utilisé par le SEO et le sitemap |
| Logos partenaires confirmés | `PARTENAIRES_CONFIRMES` dans `pages/home/sections/partenaires-home.component.ts` |

## Déploiement (Vercel)

`vercel.json` à la racine du dépôt : build `npm run build`, sortie `frontend/dist/frontend/browser`,
repli SPA sur `index.csr.html`. Les fonctions `/api` (envoi des e-mails) demandent ces variables :

```
SMTP_HOST  SMTP_PORT  SMTP_USER  SMTP_PASS  FROM_EMAIL
JURY_EMAILS       destinataires des dossiers déposés
CONTACT_EMAILS    destinataires du formulaire de contact et des alertes (défaut : JURY_EMAILS)
PARTNER_EMAILS    destinataires des bulletins d'engagement (défaut : CONTACT_EMAILS)
BLOB_READ_WRITE_TOKEN   téléversement des pièces vers Vercel Blob
```

## Avant la mise en ligne

Reste à fournir par le comité d'organisation :

- le **logo vectoriel officiel** (`shared/ui/logo.component.ts` en contient une reconstitution) et les codes exacts de la charte, relevés à la pipette ;
- le **tableau des contreparties** réel (`CONTREPARTIES` dans `site-data.ts` est indicatif) ;
- le **dossier de partenariat** et le **modèle de dossier** en PDF (`DOCS` dans `site-data.ts`) ;
- les **projets et photos de la 1ʳᵉ édition** ;
- la vérification des **trois numéros** et des **comptes réseaux**.

La checklist de recette complète est à la fin du document d'implémentation.
