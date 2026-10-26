# SJI INNOVA 2027 — Document d'implémentation du backend

> **Pour qui :** le développeur (ou l'agent) qui construit le backend.
> **Objectif :** passer du backend actuel (5 fonctions qui envoient des e-mails, rien n'est enregistré) à un backend complet : base de données, dépôts fiables, téléversements sécurisés, e-mails avec reprise, espace jury avec notation, publication des résultats, cron, sécurité, RGPD, tests, déploiement.
> **Règle d'or :** le contrat d'API que le front Angular appelle déjà **ne change pas**. Le front se déploie tel quel.
> **Date de rédaction :** 23 octobre 2026. **Ouverture des dépôts : 16 novembre 2026, soit 24 jours.** Le plan (§19) est ordonné en conséquence.

---

## Table des matières

1. [Décisions d'architecture](#1-décisions-darchitecture)
2. [État des lieux : ce qui existe et ce qui manque](#2-état-des-lieux)
3. [Contrat d'API à préserver](#3-contrat-dapi-à-préserver)
4. [Stack et arborescence](#4-stack-et-arborescence)
5. [Variables d'environnement](#5-variables-denvironnement)
6. [Modèle de données (SQL complet)](#6-modèle-de-données)
7. [Règles métier](#7-règles-métier)
8. [Socle commun (`api/_lib`)](#8-socle-commun)
9. [Endpoints publics](#9-endpoints-publics)
10. [Téléversement sécurisé](#10-téléversement-sécurisé)
11. [E-mails : outbox et reprise](#11-e-mails--outbox-et-reprise)
12. [Espace jury et administration](#12-espace-jury-et-administration)
13. [Tâches planifiées (cron)](#13-tâches-planifiées-cron)
14. [Sécurité](#14-sécurité)
15. [Données personnelles](#15-données-personnelles)
16. [Observabilité et sauvegardes](#16-observabilité-et-sauvegardes)
17. [Tests](#17-tests)
18. [CI/CD et déploiement](#18-cicd-et-déploiement)
19. [Plan d'exécution par phase](#19-plan-dexécution-par-phase)
20. [Recette finale](#20-recette-finale)
21. [Ce qu'on ne construit volontairement pas](#21-ce-quon-ne-construit-volontairement-pas)
22. [Changements front facultatifs](#22-changements-front-facultatifs)

---

## 1. Décisions d'architecture

| Sujet | Choix | Pourquoi |
| --- | --- | --- |
| Hébergement | **Vercel Functions**, comme aujourd'hui | Le site y est déjà déployé (`vercel.json`), même origine que le front (`/api/...`), pas de CORS à gérer, pas de serveur à maintenir. |
| Langage | **TypeScript** (Node 20+) | Vercel compile les `.ts` de `api/` sans configuration. Les schémas Zod remplacent les validations écrites à la main. |
| Base de données | **PostgreSQL serverless (Neon)**, via la Marketplace Vercel | Gratuit pour ce volume, branches de base par aperçu de déploiement, restauration à un instant donné. |
| Accès à la base | **SQL brut** (`@neondatabase/serverless`) + fichiers de migration numérotés | Une dizaine de tables, aucun ORM : moins de magie, moins de dépendances. |
| Validation | **Zod** | Une seule définition = validation + types. |
| Fichiers | **Vercel Blob** (déjà en place) | Le front téléverse déjà directement vers Blob avec progression réelle. On garde ce mécanisme et on le durcit. |
| E-mails | **nodemailer + SMTP** (déjà en place), plus une **table outbox** | Un dossier n'est plus jamais perdu parce que le SMTP est en panne. |
| Limitation de débit | **Table Postgres** (fenêtre fixe) | Évite d'ajouter Redis pour 5 formulaires. |
| Tâches planifiées | **Vercel Cron** → une seule fonction `api/cron.ts` | Alerte d'ouverture le 16 novembre, relance de l'outbox, nettoyage. |
| Espace jury | **Lien magique par e-mail** (sans mot de passe) + cookie de session | 5 à 10 jurés : pas besoin de gérer des mots de passe. |
| Limite de fonctions | **Une fonction `api/admin.ts` avec routeur interne** | Le plan Hobby de Vercel plafonne le nombre de fonctions par déploiement (12 à la date de rédaction, à vérifier). Les routes admin ne doivent pas chacune consommer un fichier. |

Si l'équipe préfère un serveur classique (NestJS, Express, Laravel…), les §6 à §15 restent valables tels quels : seul le §8 (socle) et le §18 (déploiement) changent.

---

## 2. État des lieux

Lu dans le dépôt : `api/*.js`, `api/_lib/mail.js`, `frontend/src/app/core/services/{api,upload}.service.ts`, `frontend/src/app/pages/deposer/depot-form.service.ts`, `concours-dates.service.ts`.

### Ce qui existe

| Fonction | Rôle actuel |
| --- | --- |
| `api/submit.js` | Valide à la main, génère un numéro aléatoire, envoie un e-mail au jury et une confirmation au candidat. |
| `api/contact.js` | Envoie le message par e-mail au comité. |
| `api/partenariat.js` | Envoie le bulletin d'engagement par e-mail. |
| `api/alerte.js` | Envoie l'adresse à rappeler au comité. Le comité prévient les inscrits **à la main** le 16 novembre. |
| `api/upload-url.js` | Émet une URL de téléversement Vercel Blob (200 Mo max, 20 minutes). |

### Ce qui manque ou pose problème

| # | Constat | Conséquence |
| --- | --- | --- |
| 1 | **Rien n'est enregistré.** Un dossier = un e-mail. | Si le SMTP échoue, l'API répond 500 : le dossier n'existe nulle part et les fichiers téléversés sont orphelins. Aucun suivi, aucune statistique, aucune notation possible. |
| 2 | Le numéro de dossier est aléatoire, **non stocké**, et son unicité n'est pas garantie. | Impossible de retrouver un dossier par son numéro. |
| 3 | **Aucun contrôle de date côté serveur.** Seul le front ferme `/deposer`. | Un appel direct à `POST /api/submit` passe avant le 16 novembre et après le 18 décembre. |
| 4 | `upload-url` est **ouvert à tous**, sans limite de débit ni de type. Le plafond de 200 Mo vaut pour tout, même pour une image. Le nom de fichier est décodé deux fois (`decodeURIComponent` sur une valeur déjà décodée). | N'importe qui peut remplir le stockage Blob (coût), ou fabriquer des chemins étranges. |
| 5 | `submit` accepte **n'importe quelle URL** pour `dossierUrl`, `videoUrl`, `imagesUrls`, puis les place dans un `href` du mail au jury. | Lien de phishing ou schéma `javascript:` glissé dans un e-mail envoyé au jury. |
| 6 | Validation incomplète : pas de longueur maximale, `avancement` non vérifié, `membres` et `imagesUrls` sans limite, corps non borné. Le front impose 30 à 800 caractères pour le problème, 30 à 1200 pour la solution, 4 membres au plus : le serveur ne le vérifie pas. | Un appel direct contourne toutes les règles du formulaire. |
| 7 | CORS ouvert à `*`, pas de limite de débit, pas de piège anti-robot. | Spam du jury et du comité, boîtes pleines. |
| 8 | `mailer.verify()` à chaque requête et `secure: false` figé. | Un aller-retour SMTP inutile par requête. `secure: false` ne convient pas à un SMTP en TLS implicite (port 465). |
| 9 | Les fichiers du dossier sont des **URL publiques**. | Quiconque a le lien lit le dossier d'un étudiant. L'URL contient un suffixe aléatoire, mais elle circule en clair dans les e-mails. |
| 10 | Le texte de confirmation contient les dates du jury en dur dans `submit.js`. | Une date qui change dans `concours-dates.service.ts` n'est pas répercutée. |

Le front est solide sur la partie client (brouillon `localStorage`, progression réelle, messages d'erreur). Le backend doit donc rester **compatible octet pour octet** avec ce que le front envoie et attend.

---

## 3. Contrat d'API à préserver

Source : `api.service.ts`, `upload.service.ts`, `api.model.ts`. En développement, le front **simule** ces appels (`environment.production === false`) : le backend se teste donc avec `curl` ou avec un build de production.

| Méthode | Route | Corps | Réponse succès | Erreurs |
| --- | --- | --- | --- | --- |
| `POST` | `/api/upload-url?filename=<nom encodé>` | aucun | `200 { "url": "<URL signée>" }`. Le front fait ensuite un `PUT` du fichier sur cette URL ; la réponse du `PUT` contient `{ url }`, l'URL finale du fichier. | `4xx/5xx { "error": "…" }` |
| `POST` | `/api/submit` | `DepotPayload` | `200 { "success": true, "numero": "INNOVA27-XXXXX" }` | idem |
| `POST` | `/api/contact` | `ContactPayload` | `200 { "success": true }` | idem |
| `POST` | `/api/partenariat` | `PartenariatPayload` | `200 { "success": true }` | idem |
| `POST` | `/api/alerte` | `{ "email" }` | `200 { "success": true }` | idem |

Le front ne lit que `success`, `numero` et `url`. Toute erreur affiche un message générique : le champ `error` sert au débogage et aux journaux.

### Pièges relevés dans le front

- **Contact :** le champ `email` est étiqueté « E-mail *ou téléphone* pour vous répondre ». Il contient donc du texte libre. Le serveur ne doit **pas** exiger un e-mail valide. Il le traite comme « moyen de réponse » et ne le met en `replyTo` que s'il ressemble à un e-mail (comportement actuel de `contact.js`).
- **Partenariat :** `formule` vaut l'un de `Platine | Or | Argent | Bronze | Format sur mesure`. `contribution` est le libellé d'un menu déroulant (`CONTRIBUTIONS`) : le valider comme texte court, pas comme énumération figée.
- **Dépôt :** le front n'envoie **pas** la case « j'accepte le règlement » (`accord`). Elle bloque l'envoi côté client. Le serveur horodate l'acceptation à la création du dossier (voir §22 pour l'envoyer explicitement).
- **Vidéo :** `videoUrl` est soit l'URL Blob d'un fichier MP4, soit un lien `youtube.com`, `youtu.be` ou `drive.google.com` (regex du front).
- **Images :** facultatives, JPG/PNG/WebP, 5 Mo chacune, sans limite de nombre côté front. Le serveur plafonne à 10.
- **Reprise :** si l'envoi échoue, le front rejoue **tout** (nouveaux téléversements puis nouvel appel à `/api/submit`). `submit` doit donc être **idempotent** (§7.3).

---

## 4. Stack et arborescence

```
event-campus - Copie Final/
├─ api/
│  ├─ _lib/
│  │  ├─ env.ts            variables d'environnement validées
│  │  ├─ db.ts             client Postgres
│  │  ├─ http.ts           enveloppe commune : méthode, corps, erreurs, rate limit
│  │  ├─ phase.ts          dates du concours et phase courante
│  │  ├─ schemas.ts        schémas Zod de tous les corps
│  │  ├─ numero.ts         numéro de dossier
│  │  ├─ blob.ts           vérification des fichiers téléversés
│  │  ├─ ratelimit.ts      limite de débit
│  │  ├─ mail.ts           transport SMTP, gabarits, outbox
│  │  ├─ auth.ts           lien magique, sessions, rôles
│  │  └─ scoring.ts        calcul des notes pondérées
│  ├─ submit.ts            POST /api/submit
│  ├─ upload-url.ts        POST /api/upload-url
│  ├─ contact.ts           POST /api/contact
│  ├─ partenariat.ts       POST /api/partenariat
│  ├─ alerte.ts            POST /api/alerte
│  ├─ suivi.ts             POST /api/suivi (statut d'un dossier)
│  ├─ desabonner.ts        GET  /api/desabonner?token=
│  ├─ health.ts            GET  /api/health
│  ├─ admin.ts             /api/admin/*  (routeur interne)
│  └─ cron.ts              /api/cron?job=…
├─ db/migrations/
│  ├─ 001_init.sql
│  └─ 002_jury.sql
├─ scripts/
│  ├─ migrate.mjs
│  └─ smoke.sh
├─ tests/
├─ package.json
└─ vercel.json
```

Fonctions déployées : 8 publiques + `admin` + `cron` = **10**, sous le plafond de 12.

Dépendances à ajouter :

```
npm i zod @neondatabase/serverless @vercel/functions
npm i -D typescript @vercel/node vitest tsx
```

On conserve `@vercel/blob` et `nodemailer`.

---

## 5. Variables d'environnement

À définir dans Vercel (Production, Preview, Development). Un fichier `.env.example` sans valeurs est versionné ; `.env*` est dans `.gitignore`.

| Variable | Rôle | Exemple / remarque |
| --- | --- | --- |
| `DATABASE_URL` | Connexion Postgres (Neon) | fournie par l'intégration Marketplace |
| `SITE_URL` | URL publique, pour les liens dans les e-mails | `https://test-nova-seven.vercel.app` (valeur de `site.json`), puis le vrai domaine |
| `ALLOWED_ORIGINS` | Origines autorisées pour les requêtes cross-origin | `https://test-nova-seven.vercel.app`. Vide = même origine uniquement. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Transport e-mail (déjà définies) | `SMTP_SECURE=true` si port 465 |
| `FROM_EMAIL` | Expéditeur (déjà définie) | doit appartenir à un domaine avec SPF + DKIM + DMARC |
| `JURY_EMAILS` | Destinataires des notifications de dépôt (déjà définie) | liste séparée par des virgules |
| `CONTACT_EMAILS` | Messages de contact | défaut : `JURY_EMAILS` |
| `PARTNER_EMAILS` | Bulletins partenaires | défaut : `CONTACT_EMAILS` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (déjà définie) | |
| `CRON_SECRET` | Authentifie les appels cron | longue chaîne aléatoire. Vercel l'envoie en `Authorization: Bearer …`. |
| `IP_HASH_SALT` | Sel pour hacher les adresses IP | longue chaîne aléatoire, ne jamais la changer en cours d'édition |
| `ADMIN_EMAILS` | Amorçage : e-mails des administrateurs | lus par `scripts/migrate.mjs` pour créer les premiers comptes |
| `TURNSTILE_SECRET` | Optionnel : anti-robot Cloudflare | vide = désactivé |
| `FORCE_PHASE` | **Hors production seulement** : force `depots` pour tester | l'équivalent serveur de `devForceOpen` |

`env.ts` lit `process.env` une seule fois, échoue au démarrage avec le nom de la variable manquante, et refuse `FORCE_PHASE` si `VERCEL_ENV === 'production'`.

---

## 6. Modèle de données

`db/migrations/001_init.sql`. Les identifiants sont des `uuid` générés par l'application (ils sont connus avant l'insertion, ce qui permet d'insérer dossier, fichiers et e-mails dans une seule transaction).

```sql
create extension if not exists pgcrypto;

-- ─── Dossiers de candidature ────────────────────────────────────────────────
create type statut_dossier as enum
  ('recu', 'en_evaluation', 'preselectionne', 'non_retenu', 'finaliste', 'laureat', 'disqualifie');
create type avancement as enum ('idee', 'prototype', 'teste');

create table submissions (
  id              uuid primary key,
  numero          text not null unique,                  -- INNOVA27-XXXXX
  edition         smallint not null default 2027,
  statut          statut_dossier not null default 'recu',
  prix_rang       smallint check (prix_rang between 1 and 3),   -- 1er, 2e, 3e prix
  projet          text not null,
  porteur         text not null,
  filiere         text not null,
  niveau          text not null,
  telephone       text not null,
  email           text not null,                         -- en minuscules
  membres         text[] not null default '{}',
  probleme        text not null,
  solution        text not null,
  avancement      avancement not null,
  domaine         text not null,
  video_url       text not null,
  video_kind      text not null check (video_kind in ('fichier', 'lien')),
  reglement_ok_at timestamptz not null default now(),    -- acceptation du règlement
  ip_hash         text,
  user_agent      text,
  result_notified_at timestamptz,                        -- e-mail de résultat envoyé
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
-- Idempotence : un même candidat qui renvoie le même projet retrouve son dossier.
create unique index submissions_dedup on submissions (edition, email, lower(projet));
create index submissions_statut on submissions (edition, statut);
create index submissions_created on submissions (created_at desc);

create table submission_files (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references submissions(id) on delete cascade,
  kind          text not null check (kind in ('dossier', 'video', 'image')),
  url           text not null,
  pathname      text not null,
  size_bytes    bigint not null,
  content_type  text not null,
  created_at    timestamptz not null default now()
);
create index submission_files_sub on submission_files (submission_id);

-- ─── Formulaires annexes ────────────────────────────────────────────────────
create table contact_messages (
  id          uuid primary key default gen_random_uuid(),
  nom         text not null,
  qualite     text not null,
  reponse_a   text,                                      -- e-mail OU téléphone, texte libre
  message     text not null,
  traite      boolean not null default false,
  ip_hash     text,
  created_at  timestamptz not null default now()
);

create type statut_partenaire as enum ('nouveau', 'contacte', 'confirme', 'decline');
create table partner_requests (
  id            uuid primary key default gen_random_uuid(),
  structure     text not null,
  representant  text not null,
  fonction      text not null,
  telephone     text not null,
  email         text not null,
  formule       text not null,                           -- Platine | Or | Argent | Bronze | Format sur mesure
  contribution  text not null,
  statut        statut_partenaire not null default 'nouveau',
  notes         text,
  ip_hash       text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table alert_subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           text not null,
  token           text not null unique default encode(gen_random_bytes(16), 'hex'),
  notified_at     timestamptz,                           -- alerte d'ouverture envoyée
  unsubscribed_at timestamptz,
  created_at      timestamptz not null default now()
);
create unique index alert_subscribers_email on alert_subscribers (lower(email));

-- ─── E-mails sortants (outbox) ──────────────────────────────────────────────
create type statut_mail as enum ('pending', 'sent', 'failed');
create table email_outbox (
  id              uuid primary key default gen_random_uuid(),
  kind            text not null,       -- depot_jury, depot_candidat, contact, partenariat, alerte_comite,
                                       -- alerte_ouverture, resultat, lien_magique
  to_addrs        text[] not null,
  reply_to        text,
  subject         text not null,
  html            text not null,
  statut          statut_mail not null default 'pending',
  attempts        smallint not null default 0,
  last_error      text,
  next_attempt_at timestamptz not null default now(),
  sent_at         timestamptz,
  created_at      timestamptz not null default now()
);
create index email_outbox_due on email_outbox (next_attempt_at) where statut = 'pending';

-- ─── Limite de débit ────────────────────────────────────────────────────────
create table rate_hits (
  key          text not null,
  window_start bigint not null,
  hits         int not null default 1,
  primary key (key, window_start)
);

-- ─── Journal d'audit ────────────────────────────────────────────────────────
create table audit_log (
  id         bigserial primary key,
  actor      text not null,            -- e-mail du juré/admin, ou 'system'
  action     text not null,            -- statut_change, export_csv, publier_resultats…
  entity     text,
  entity_id  text,
  meta       jsonb,
  at         timestamptz not null default now()
);

create table schema_migrations (name text primary key, applied_at timestamptz not null default now());
```

`db/migrations/002_jury.sql` (espace jury, à appliquer avant le 21 décembre) :

```sql
create type role_jury as enum ('admin', 'jury');

create table jury_members (
  id        uuid primary key default gen_random_uuid(),
  email     text not null,
  nom       text not null,
  role      role_jury not null default 'jury',
  actif     boolean not null default true,
  created_at timestamptz not null default now()
);
create unique index jury_members_email on jury_members (lower(email));

create table login_tokens (            -- lien magique : usage unique, 15 minutes
  token_hash text primary key,
  jury_id    uuid not null references jury_members(id) on delete cascade,
  expires_at timestamptz not null,
  used_at    timestamptz
);

create table sessions (                -- cookie de session : 8 heures
  token_hash text primary key,
  jury_id    uuid not null references jury_members(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- Une évaluation par juré et par dossier. Barème de l'article 8 du règlement (30/25/25/20).
create table evaluations (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references submissions(id) on delete cascade,
  jury_id       uuid not null references jury_members(id),
  originalite   smallint check (originalite   between 0 and 10),   -- poids 30
  faisabilite   smallint check (faisabilite   between 0 and 10),   -- poids 25
  impact        smallint check (impact        between 0 and 10),   -- poids 25
  presentation  smallint check (presentation  between 0 and 10),   -- poids 20
  commentaire   text,
  recuse        boolean not null default false,       -- conflit d'intérêt : le juré se déclare écarté
  soumise       boolean not null default false,       -- brouillon tant que false
  updated_at    timestamptz not null default now(),
  unique (submission_id, jury_id),
  check (recuse or not soumise or
         (originalite is not null and faisabilite is not null and impact is not null and presentation is not null))
);
```

`scripts/migrate.mjs` (exécute dans l'ordre les fichiers non encore appliqués, puis crée les admins d'`ADMIN_EMAILS` après la migration 002) :

```js
import { neon } from '@neondatabase/serverless';
import { readdirSync, readFileSync } from 'node:fs';

const sql = neon(process.env.DATABASE_URL);
await sql`create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())`;
const done = new Set((await sql`select name from schema_migrations`).map((r) => r.name));

for (const file of readdirSync('db/migrations').sort()) {
  if (done.has(file)) continue;
  console.log('→', file);
  // Un fichier peut contenir plusieurs instructions : on les exécute séparément.
  for (const stmt of readFileSync(`db/migrations/${file}`, 'utf8').split(/;\s*$/m).filter((s) => s.trim())) await sql.query(stmt);
  await sql`insert into schema_migrations (name) values (${file})`;
}

for (const e of (process.env.ADMIN_EMAILS ?? '').split(',').map((s) => s.trim()).filter(Boolean)) {
  await sql`insert into jury_members (email, nom, role) values (${e.toLowerCase()}, ${e}, 'admin') on conflict do nothing`.catch(() => {});
}
```

> Le découpage par `;` fonctionne tant qu'aucun fichier ne contient de bloc `do $$ … $$` ou de fonction. Si le besoin apparaît, passer à un outil de migration (`dbmate`, `node-pg-migrate`).

---

## 7. Règles métier

### 7.1 Phases et dates

Source de vérité du front : `DATES` dans `concours-dates.service.ts`. Le serveur en tient **une copie** dans `api/_lib/phase.ts`. Fuseau : Cameroun, UTC+01:00 toute l'année.

```ts
// api/_lib/phase.ts
export const DATES = {
  ouverture: new Date('2026-11-16T00:00:00+01:00'),
  cloture:   new Date('2026-12-18T23:59:59+01:00'),
  evalDebut: new Date('2026-12-21T00:00:00+01:00'),
  evalFin:   new Date('2027-01-22T23:59:59+01:00'),
  finale:    new Date('2027-02-10T13:00:00+01:00'),
  finaleFin: new Date('2027-02-10T17:00:00+01:00'),
} as const;

export type Phase = 'avant' | 'depots' | 'evaluation' | 'vers-finale' | 'apres';

/** Tolérance après la clôture : un candidat qui a commencé à 23 h 50 ne perd pas son dossier. */
export const GRACE_MS = 30 * 60 * 1000;

export function phaseAt(now = new Date()): Phase {
  if (process.env.FORCE_PHASE && process.env.VERCEL_ENV !== 'production') return process.env.FORCE_PHASE as Phase;
  if (now < DATES.ouverture) return 'avant';
  if (now <= DATES.cloture) return 'depots';
  if (now <= DATES.evalFin) return 'evaluation';
  if (now < DATES.finaleFin) return 'vers-finale';
  return 'apres';
}

export const depotsOuverts = (now = new Date()) =>
  phaseAt(now) === 'depots' || (phaseAt(now) === 'evaluation' && now.getTime() <= DATES.cloture.getTime() + GRACE_MS);
```

> **Deux copies des dates** = un risque de divergence. Mitigation courte : un test (§17) qui lit `concours-dates.service.ts` avec une regex et compare aux dates du serveur. Alternative propre : `GET /api/config` (§9.8) et le front les lit au chargement. Ne pas le faire avant l'ouverture : le front prérendu fonctionne sans.

| Endpoint | `avant` | `depots` | `evaluation` | `vers-finale` / `apres` |
| --- | --- | --- | --- | --- |
| `upload-url`, `submit` | 403 « Les dépôts ne sont pas ouverts » | ✅ | ✅ jusqu'à `cloture + GRACE_MS`, puis 403 « Les dépôts sont clos » | 403 |
| `alerte` | ✅ | 200 sans rien enregistrer (déjà ouvert) | idem | idem |
| `contact`, `partenariat` | ✅ | ✅ | ✅ | ✅ |

### 7.2 Numéro de dossier

Format conservé : `INNOVA27-XXXXX` (5 caractères). Alphabet sans caractères ambigus (ni `0 O 1 I L`) ; l'unicité est garantie par la contrainte `unique`, avec 5 tentatives.

```ts
// api/_lib/numero.ts
import { randomInt } from 'node:crypto';
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'; // 31 caractères
export const nouveauNumero = () =>
  'INNOVA27-' + Array.from({ length: 5 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');
```

Le numéro est **non séquentiel** : on ne peut pas deviner celui d'un autre candidat. L'endpoint de suivi (§9.6) exige de toute façon numéro **et** e-mail.

### 7.3 Idempotence du dépôt

Le front rejoue tout après un échec. Règle : un même couple `(e-mail, titre du projet)` ne crée **qu'un** dossier par édition.

- Insertion avec `on conflict do nothing`.
- Si le dossier existe déjà : réponse `200 { success: true, numero }` avec le numéro **existant**, aucun nouvel e-mail, aucun fichier supplémentaire enregistré.
- Si l'e-mail est le même mais que le titre diffère : c'est un second projet, il est accepté (limite : 3 dossiers par e-mail et par édition, au-delà `409`).

### 7.4 Validation (miroir du front)

| Champ | Règle serveur | Origine |
| --- | --- | --- |
| `projet`, `porteur` | 2 à 120 caractères | |
| `filiere` | 1 à 120 | |
| `niveau` | 1 à 60 | |
| `telephone` | `/^[+\d][\d\s().-]{7,}$/`, 30 caractères maximum | `depot-form.service.ts` |
| `email` | e-mail valide, 254 maximum, mis en minuscules | |
| `membres` | tableau de 4 chaînes au plus (1 à 120 caractères) | `MAX_MEMBRES = 4` |
| `probleme` | 30 à 800 caractères | front |
| `solution` | 30 à 1200 caractères | front |
| `avancement` | `idee | prototype | teste` | `Avancement` |
| `domaine` | 1 à 60 caractères | liste `DOMAINES` (texte libre côté serveur pour ne pas casser si le front ajoute un domaine) |
| `dossierUrl` | URL Blob du projet, chemin `candidatures/`, PDF ≤ 10 Mo | `LIMITS.dossierMo` |
| `videoUrl` | URL Blob (MP4 ≤ 200 Mo) **ou** lien `youtube.com`, `youtu.be`, `drive.google.com` | `LIMITS.videoMo` |
| `imagesUrls` | 10 URL Blob au plus, JPG/PNG/WebP ≤ 5 Mo chacune | `LIMITS.imageMo` |

Les chaînes sont passées par `trim()`. Les retours à la ligne sont supprimés des champs qui finissent dans un **sujet d'e-mail** (`projet`, `nom`, `qualite`, `structure`).

---

## 8. Socle commun

Chaque fonction publique passe par la même enveloppe, de façon qu'aucune ne puisse oublier un contrôle.

```ts
// api/_lib/http.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z, ZodError } from 'zod';
import { limite } from './ratelimit';
import { ipHash } from './ratelimit';

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

interface Options<S extends z.ZodTypeAny> {
  method?: 'POST' | 'GET';
  schema?: S;
  /** [nombre de requêtes, fenêtre en secondes] par IP. */
  limit?: [number, number];
  name: string;
}

export function route<S extends z.ZodTypeAny>(opts: Options<S>, fn: (ctx: { body: z.infer<S>; req: VercelRequest; ip: string }) => Promise<object>) {
  return async (req: VercelRequest, res: VercelResponse) => {
    const t0 = Date.now();
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    try {
      // CORS : même origine par défaut ; sinon liste blanche, jamais « * ».
      const origin = req.headers.origin;
      if (origin && (process.env.ALLOWED_ORIGINS ?? '').split(',').includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Methods', `${opts.method ?? 'POST'}, OPTIONS`);
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      }
      if (req.method === 'OPTIONS') return res.status(204).end();
      if (req.method !== (opts.method ?? 'POST')) throw new HttpError(405, 'Méthode non autorisée');

      const ip = ipHash(req);
      if (opts.limit) await limite(`${opts.name}:${ip}`, ...opts.limit);

      const body = opts.schema ? opts.schema.parse(req.body ?? {}) : (undefined as z.infer<S>);
      const out = await fn({ body, req, ip });
      log({ route: opts.name, status: 200, ms: Date.now() - t0 });
      return res.status(200).json(out);
    } catch (e) {
      const status = e instanceof HttpError ? e.status : e instanceof ZodError ? 400 : 500;
      const error = e instanceof ZodError ? e.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(' ; ')
        : e instanceof HttpError ? e.message : 'Erreur interne';
      log({ route: opts.name, status, ms: Date.now() - t0, err: status === 500 ? String(e) : undefined });
      return res.status(status).json({ error });
    }
  };
}

const log = (o: object) => console.log(JSON.stringify({ t: new Date().toISOString(), ...o }));
```

Le corps JSON est limité à **1 Mo** par Vercel (4,5 Mo pour les fonctions) ; le front n'envoie jamais de fichier dans ce corps. Le serveur refuse un `Content-Type` autre que `application/json` (le front utilise `HttpClient`, qui l'envoie).

```ts
// api/_lib/ratelimit.ts — fenêtre fixe dans Postgres
import { createHash } from 'node:crypto';
import { sql } from './db';
import { HttpError } from './http';

export const ipHash = (req: { headers: Record<string, string | string[] | undefined> }) => {
  const ip = String(req.headers['x-forwarded-for'] ?? req.headers['x-real-ip'] ?? '').split(',')[0].trim() || 'inconnue';
  return createHash('sha256').update(ip + process.env.IP_HASH_SALT).digest('hex').slice(0, 32);
};

export async function limite(key: string, max: number, windowSec: number) {
  const win = Math.floor(Date.now() / 1000 / windowSec);
  const [{ hits }] = await sql`
    insert into rate_hits (key, window_start) values (${key}, ${win})
    on conflict (key, window_start) do update set hits = rate_hits.hits + 1
    returning hits`;
  if (hits > max) throw new HttpError(429, 'Trop de requêtes, réessayez plus tard');
}
```

> **Limite connue :** fenêtre fixe, donc un pic possible à cheval sur deux fenêtres (jusqu'à 2 × le maximum). Sans importance pour ces volumes.

Seuils de départ :

| Route | Par IP |
| --- | --- |
| `upload-url` | 40 par heure (un dépôt consomme 1 dossier + 1 vidéo + N images) |
| `submit` | 5 par heure |
| `contact` | 5 par heure |
| `partenariat` | 5 par heure |
| `alerte` | 10 par heure |
| `suivi` | 20 par heure |
| `admin/auth/login` | 5 par heure, par IP **et** par e-mail |

> **Écoles et campus :** beaucoup d'étudiants partagent la même IP publique (Wi-Fi du campus, opérateur mobile avec NAT). Surveiller les 429 le jour de la clôture ; relever `submit` à 15 par heure si nécessaire.

---

## 9. Endpoints publics

### 9.1 `POST /api/submit`

Remplace `submit.js`. Étapes, dans cet ordre :

1. Phase : `depotsOuverts()`, sinon `403`.
2. Limite de débit.
3. Schéma Zod (§7.4). Champ piège `website` : s'il est rempli, répondre `200 { success: true, numero: "INNOVA27-00000" }` sans rien enregistrer (le robot croit avoir réussi).
4. Vérification des fichiers (§10.3) : chaque URL Blob existe, a la bonne taille, le bon type, les bons octets magiques.
5. Transaction unique : `submissions` + `submission_files` + 2 lignes `email_outbox` (jury, candidat).
6. Réponse `200 { success: true, numero }`.
7. En tâche de fond (`waitUntil`) : tentative d'envoi immédiate de ces deux e-mails. En cas d'échec, le cron les reprend.

```ts
// api/submit.ts
import { waitUntil } from '@vercel/functions';
import { randomUUID } from 'node:crypto';
import { route, HttpError } from './_lib/http';
import { DepotSchema } from './_lib/schemas';
import { depotsOuverts } from './_lib/phase';
import { nouveauNumero } from './_lib/numero';
import { verifierFichiers } from './_lib/blob';
import { sql } from './_lib/db';
import { enfiler, vider, mailJury, mailCandidat } from './_lib/mail';

export default route({ name: 'submit', schema: DepotSchema, limit: [5, 3600] }, async ({ body: d, req, ip }) => {
  if (!depotsOuverts()) throw new HttpError(403, "Les dépôts ne sont pas ouverts");
  if (d.website) return { success: true, numero: 'INNOVA27-00000' };            // piège à robots

  const deja = await sql`select numero from submissions where edition = 2027 and email = ${d.email} and lower(projet) = lower(${d.projet})`;
  if (deja.length) return { success: true, numero: deja[0].numero };             // idempotence (§7.3)

  const [{ n }] = await sql`select count(*)::int n from submissions where edition = 2027 and email = ${d.email}`;
  if (n >= 3) throw new HttpError(409, 'Nombre maximal de dossiers atteint pour cette adresse');

  const fichiers = await verifierFichiers(d);                                    // §10.3

  const id = randomUUID();
  for (let essai = 0; ; essai++) {
    const numero = nouveauNumero();
    try {
      const mails = [mailJury({ ...d, numero, fichiers }), mailCandidat({ ...d, numero })];
      await sql.transaction([
        sql`insert into submissions (id, numero, projet, porteur, filiere, niveau, telephone, email, membres,
              probleme, solution, avancement, domaine, video_url, video_kind, ip_hash, user_agent)
            values (${id}, ${numero}, ${d.projet}, ${d.porteur}, ${d.filiere}, ${d.niveau}, ${d.telephone}, ${d.email},
              ${d.membres}, ${d.probleme}, ${d.solution}, ${d.avancement}, ${d.domaine}, ${d.videoUrl},
              ${fichiers.some((f) => f.kind === 'video') ? 'fichier' : 'lien'}, ${ip}, ${String(req.headers['user-agent'] ?? '').slice(0, 200)})`,
        ...fichiers.map((f) => sql`insert into submission_files (submission_id, kind, url, pathname, size_bytes, content_type)
            values (${id}, ${f.kind}, ${f.url}, ${f.pathname}, ${f.size}, ${f.contentType})`),
        ...mails.map(enfiler),
      ]);
      waitUntil(vider(mails.map((m) => m.id)));
      return { success: true, numero };
    } catch (e: any) {
      if (e?.code === '23505' && essai < 4) continue;   // collision sur le numéro : on en retire un autre
      throw e;
    }
  }
});
```

> Si `sql.transaction` n'est pas disponible dans la version installée du client Neon, passer par `Pool` de `@neondatabase/serverless` avec `BEGIN … COMMIT`.

### 9.2 `POST /api/upload-url`

Voir §10.

### 9.3 `POST /api/contact`

Schéma : `nom` 1 à 120, `qualite` 1 à 80, `message` **10 à 1000** (règle du front), `email` facultatif **texte libre** jusqu'à 254 caractères.

- Enregistre dans `contact_messages`, met en outbox un e-mail vers `CONTACT_EMAILS`.
- `replyTo` n'est renseigné que si `email` correspond à `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
- Piège `website`, limite 5 par heure.

### 9.4 `POST /api/partenariat`

Schéma : `structure`, `representant`, `fonction` (1 à 120), `telephone` (même regex que le dépôt), `email`, `formule` parmi `Platine | Or | Argent | Bronze | Format sur mesure`, `contribution` (1 à 200).

- Enregistre dans `partner_requests` (statut `nouveau`), e-mail au comité vers `PARTNER_EMAILS`.
- Facultatif : accusé de réception au partenaire (« Nous vous recontactons sous 48 heures »). À valider avec le comité avant de promettre un délai.

### 9.5 `POST /api/alerte`

- Valide l'e-mail, insère dans `alert_subscribers` (`on conflict do nothing`), répond toujours `200 { success: true }` (on ne révèle pas si l'adresse existait).
- Met en outbox l'e-mail au comité (comportement actuel de `alerte.js`, conservé pendant la transition).
- Le **cron du 16 novembre** (§13) envoie « Les dépôts sont ouverts » à tous les inscrits : fin du traitement manuel.
- Chaque e-mail d'alerte contient un lien de désinscription (§9.7).

### 9.6 `POST /api/suivi` (nouveau, facultatif)

Corps `{ numero, email }`, réponse `{ statut, projet }` ou `404` identique si le couple est faux (pas de fuite). Limite 20 par heure. Statuts affichés au candidat : « Reçu », « En évaluation », « Présélectionné » ou « Non retenu » **uniquement après** `result_notified_at`, « Finaliste », « Lauréat ». Le front actuel dit « conservez ce numéro pour le suivi » sans page de suivi : cet endpoint prépare cette page.

### 9.7 `GET /api/desabonner?token=…`

Passe `unsubscribed_at` à `now()`, renvoie une page HTML de dix lignes. Obligatoire dès qu'on envoie des e-mails en masse.

### 9.8 `GET /api/health` et `GET /api/config`

`health` : `select 1` en base, renvoie `{ ok: true, phase, outboxEnAttente }`. Sert au contrôle de disponibilité (§16). `config` (facultatif) : `{ phase, dates }` pour supprimer la double saisie des dates.

---

## 10. Téléversement sécurisé

### 10.1 Contrat conservé

`POST /api/upload-url?filename=<nom>` → `{ url }`, puis le front fait `PUT <url>` avec le fichier. La mécanique actuelle (`issueSignedToken` + `presignUrl` de `@vercel/blob`) reste. On y ajoute les contrôles qui manquent.

### 10.2 Durcissement de `upload-url`

```ts
// api/upload-url.ts (extrait)
const EXT = { pdf: 'application/pdf', mp4: 'video/mp4', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' } as const;
const MAX_MO = { pdf: 10, mp4: 200, jpg: 5, jpeg: 5, png: 5, webp: 5 } as const;   // LIMITS du front

export default route({ name: 'upload-url', limit: [40, 3600] }, async ({ req }) => {
  if (!depotsOuverts()) throw new HttpError(403, 'Les dépôts ne sont pas ouverts');

  const brut = String(req.query.filename ?? '');            // Node a déjà décodé le paramètre : ne pas rappeler decodeURIComponent
  const ext = brut.split('.').pop()?.toLowerCase() as keyof typeof EXT | undefined;
  if (!ext || !(ext in EXT)) throw new HttpError(400, 'Type de fichier non accepté (PDF, MP4, JPG, PNG, WebP)');

  // Nom d'origine neutralisé, préfixé d'un identifiant aléatoire : pas de collision, pas de chemin imprévu.
  const base = brut.replace(/\.[^.]+$/, '').normalize('NFKD').replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'fichier';
  const pathname = `candidatures/${randomUUID()}/${base}.${ext}`;

  // …issueSignedToken({ operations: ['put'], pathname, maximumSizeInBytes: MAX_MO[ext] * 1024 * 1024, validUntil: …,
  //   allowedContentTypes: [EXT[ext]] }) puis presignUrl comme aujourd'hui.
  return { url };
});
```

> **À vérifier dans la documentation de la version installée de `@vercel/blob` :** que `issueSignedToken` accepte bien `maximumSizeInBytes` (déjà utilisé dans le code actuel) et un filtre de type de contenu. Si le filtre de type n'existe pas, les contrôles du §10.3 restent la barrière.

Changements par rapport à l'existant : liste blanche d'extensions, plafond de taille **par type** (au lieu de 200 Mo pour tout), chemin à identifiant aléatoire, fenêtre de dépôt respectée, limite de débit, un seul décodage du nom.

### 10.3 Vérification au moment du dépôt (`api/_lib/blob.ts`)

Le front envoie des URL ; rien ne prouve qu'elles viennent de notre stockage. Pour chaque URL de fichier :

1. **Origine :** le nom d'hôte se termine par `.blob.vercel-storage.com` (ou par le domaine de la boutique Blob configurée) et le chemin commence par `/candidatures/`. Sinon `400`.
2. **Existence, taille, type :** `head(url)` de `@vercel/blob` renvoie la taille et le type. Comparer aux plafonds du §7.4 et au type attendu pour le rôle du fichier (`dossierUrl` = PDF, etc.).
3. **Octets magiques :** lire les 12 premiers octets (`fetch` avec `Range: bytes=0-11`). PDF commence par `%PDF-` ; MP4 contient `ftyp` aux octets 4 à 7 ; JPEG `FF D8 FF` ; PNG `89 50 4E 47` ; WebP `RIFF….WEBP`.
4. **Lien vidéo :** si ce n'est pas un fichier, il doit correspondre à `^https?://(www\.)?(youtube\.com|youtu\.be|drive\.google\.com)/\S+$`. Le serveur ne suit pas le lien.

Résultat : `[{ kind, url, pathname, size, contentType }]`, enregistré dans `submission_files`.

### 10.4 Fichiers orphelins

Un candidat qui téléverse puis abandonne laisse des fichiers sans dossier. Le cron `purge-blobs` (§13) liste le préfixe `candidatures/` (`list()` de `@vercel/blob`) et supprime tout fichier de plus de 48 heures qui ne figure pas dans `submission_files`.

### 10.5 Confidentialité

Les fichiers sont aujourd'hui publics. Deux niveaux possibles :

- **Minimal (recommandé avant le 16 novembre) :** conserver des URL publiques à chemin aléatoire (UUID), ne jamais les publier, ne les montrer qu'au jury connecté.
- **Complet :** si la version de `@vercel/blob` installée prend en charge des fichiers privés, les utiliser, et faire servir les fichiers par `GET /api/admin/dossiers/:id/fichiers/:fileId`, qui vérifie la session. À vérifier dans la documentation avant d'en faire une exigence.

---

## 11. E-mails : outbox et reprise

**Principe :** aucun endpoint n'envoie directement. Il écrit une ligne dans `email_outbox` **dans la même transaction** que la donnée. L'envoi est tenté tout de suite (`waitUntil`), puis repris par le cron en cas d'échec.

```ts
// api/_lib/mail.ts (extrait)
let transport: Transporter | undefined;
const mailer = () => (transport ??= nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',        // true pour le port 465
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
}));                                                  // pas de verify() à chaque requête

export async function vider(ids?: string[]) {
  const dus = await sql`
    select * from email_outbox
    where statut = 'pending' and next_attempt_at <= now() ${ids ? sql`and id = any(${ids})` : sql``}
    order by created_at limit 20
    for update skip locked`;
  for (const m of dus) {
    try {
      await mailer().sendMail({ from: from(), to: m.to_addrs, replyTo: m.reply_to ?? undefined, subject: m.subject, html: m.html });
      await sql`update email_outbox set statut = 'sent', sent_at = now(), attempts = attempts + 1 where id = ${m.id}`;
    } catch (e) {
      const tentatives = m.attempts + 1;
      await sql`update email_outbox set attempts = ${tentatives}, last_error = ${String(e).slice(0, 300)},
                  statut = ${tentatives >= 8 ? 'failed' : 'pending'},
                  next_attempt_at = now() + (${2 ** tentatives} * interval '1 minute') where id = ${m.id}`;
    }
  }
}
```

- Reprise exponentielle : 2, 4, 8… minutes, **8 tentatives** puis `failed`.
- Un e-mail `failed` déclenche une alerte (§16) : il faut qu'un humain le voie.
- Les gabarits restent ceux de `_lib/mail.js` (`layout`, `rows`, `esc`, filet tricolore), transposés en TypeScript. **Tout** ce qui vient d'un utilisateur passe par `esc()`. Les `href` n'acceptent que `https://` (§2, point 5).
- Les dates affichées dans les e-mails viennent de `phase.ts`, plus de texte en dur.

### Gabarits

| `kind` | Destinataire | Contenu |
| --- | --- | --- |
| `depot_jury` | `JURY_EMAILS` | Tableau du dossier (comme aujourd'hui), plus le lien vers la fiche dans l'espace jury dès qu'il existe. |
| `depot_candidat` | le candidat | Numéro en grand, calendrier d'évaluation, téléphone du comité. |
| `contact` | `CONTACT_EMAILS` | Nom, qualité, moyen de réponse, message. |
| `partenariat` | `PARTNER_EMAILS` | Le bulletin. |
| `alerte_comite` | `CONTACT_EMAILS` | « Nouvelle demande d'alerte ». Peut être supprimé quand l'envoi automatique du 16 novembre est validé. |
| `alerte_ouverture` | chaque inscrit | « Les dépôts sont ouverts jusqu'au 18 décembre », lien `SITE_URL/deposer`, lien de désinscription. |
| `resultat` | le candidat | Présélectionné ou non retenu, avec la suite (§12.5). |
| `lien_magique` | le juré | Lien de connexion valable 15 minutes. |

### Délivrabilité

Configurer **SPF, DKIM et DMARC** sur le domaine de `FROM_EMAIL`, sinon les confirmations de dépôt finissent en courrier indésirable. Si le SMTP actuel est limité en volume (hébergeur mutualisé : souvent 100 à 500 e-mails par jour), l'alerte du 16 novembre peut le dépasser : le cron envoie par lots de 20 toutes les quelques minutes, ou bascule sur un service transactionnel (Brevo, Resend, Postmark) en changeant seulement `mailer()`.

---

## 12. Espace jury et administration

### 12.1 Authentification (lien magique)

1. `POST /api/admin/auth/login { email }` : répond **toujours** `200`. Si l'e-mail correspond à un `jury_members` actif, crée un jeton aléatoire de 32 octets, stocke son **hachage SHA-256** dans `login_tokens` (15 minutes, usage unique) et met en outbox un lien `SITE_URL/admin/connexion?token=…`.
2. `POST /api/admin/auth/verify { token }` : vérifie le hachage, marque le jeton utilisé, crée une session (`sessions`, 8 heures) et pose le cookie.
3. `POST /api/admin/auth/logout` : supprime la session.

Cookie de session : `HttpOnly; Secure; SameSite=Lax; Path=/api/admin; Max-Age=28800`. Les routes qui modifient des données exigent `Content-Type: application/json` **et** un en-tête `Origin` égal à `SITE_URL` (protection CSRF suffisante avec `SameSite=Lax`).

| Rôle | Peut |
| --- | --- |
| `jury` | Lister et lire les dossiers, rédiger **sa** notation, voir le classement une fois ses notes soumises. |
| `admin` | Tout : changer les statuts, gérer le jury, voir les messages et partenaires, exporter, publier les résultats. |

### 12.2 Routes (`api/admin.ts`)

Un seul fichier, un routeur de dix lignes. Réécriture dans `vercel.json` : `{ "source": "/api/admin/:path*", "destination": "/api/admin?path=:path*" }`.

```ts
const routes: Record<string, Handler> = {
  'POST auth/login': login,           'POST auth/verify': verify,        'POST auth/logout': logout,
  'GET me': me,
  'GET dossiers': listeDossiers,      'GET dossiers/:id': detailDossier, 'PATCH dossiers/:id': changerStatut,   // admin
  'PUT dossiers/:id/evaluation': saveEvaluation,                          'GET dossiers/:id/evaluation': monEvaluation,
  'GET classement': classement,       // jury après soumission, admin toujours
  'GET messages': messages,           'PATCH messages/:id': traiterMessage,                                      // admin
  'GET partenaires': partenaires,     'PATCH partenaires/:id': majPartenaire,                                    // admin
  'GET jury': listeJury,              'POST jury': ajouterJure,          'PATCH jury/:id': majJure,              // admin
  'GET stats': stats,                 // admin
  'GET export/dossiers.csv': exportDossiers,   'GET export/alertes.csv': exportAlertes,                         // admin
  'POST resultats/publier': publier,  // admin
  'POST outbox/relancer': relancerOutbox,                                                                        // admin
};
```

Principes communs : chaque route lit la session d'abord (`401` sinon), vérifie le rôle (`403`), puis exécute. Les écritures de l'admin passent par `audit_log`.

### 12.3 Notation

Barème de l'article 8 du règlement (`CRITERES_PONDERES` dans `site-data.ts`, **« à refaire valider pour 2027 »**) :

| Critère | Colonne | Poids |
| --- | --- | --- |
| Originalité et innovation | `originalite` | 30 |
| Faisabilité technique | `faisabilite` | 25 |
| Impact potentiel | `impact` | 25 |
| Qualité de la présentation | `presentation` | 20 |

Chaque critère est noté de 0 à 10. Note du dossier pour un juré : `(30·o + 25·f + 25·i + 20·p) / 10`, soit un résultat **sur 100**.

```ts
// api/_lib/scoring.ts
export const POIDS = { originalite: 30, faisabilite: 25, impact: 25, presentation: 20 } as const;

export const noteSur100 = (n: Record<keyof typeof POIDS, number>) =>
  Object.entries(POIDS).reduce((s, [k, p]) => s + p * n[k as keyof typeof POIDS], 0) / 10;
```

Classement : moyenne des notes **soumises** (hors `recuse`), à condition d'avoir au moins `MIN_EVALS` évaluations (3 par défaut). L'écart-type est affiché : au-delà de 15 points, le dossier est signalé « à débattre ». Les jurés ne voient jamais les notes des autres avant d'avoir soumis la leur.

Options à trancher par le comité :

- **Évaluation à l'aveugle :** masquer `porteur`, `email`, `telephone`, `membres` et `filiere` à la fiche jury (`JURY_BLIND=1`). Le serveur ne renvoie tout simplement pas ces champs.
- **Conflit d'intérêt :** un juré qui connaît une équipe coche `recuse`. Son avis est écarté du calcul.
- **Nombre de dossiers présélectionnés et de finalistes :** fixé par le règlement, absent du code du front. À confirmer avant d'implémenter une « suggestion de présélection ».

### 12.4 Statuts d'un dossier

```
recu ──► en_evaluation ──► preselectionne ──► finaliste ──► laureat (prix_rang 1, 2 ou 3)
  │                  └───► non_retenu
  └──► disqualifie  (depuis n'importe quel état, motif obligatoire dans audit_log)
```

Le passage de `recu` à `en_evaluation` se fait par lot, le 21 décembre (`POST /api/admin/dossiers/lot`) ; l'évaluation ne démarre pas toute seule.

### 12.5 Publication des résultats (22 janvier 2027)

`POST /api/admin/resultats/publier` :

- refusé avant le 22 janvier 2027 sauf paramètre explicite `force=true` (journalisé) ;
- pour chaque dossier `preselectionne` ou `non_retenu` avec `result_notified_at is null` : met en outbox l'e-mail `resultat` puis renseigne `result_notified_at` (**idempotent** : relancer ne renvoie rien aux candidats déjà prévenus) ;
- un aperçu `?dry=true` renvoie la liste des destinataires sans rien envoyer ;
- le texte « non retenu » est validé par le comité avant l'envoi réel.

### 12.6 Interface

Deux niveaux, au choix du calendrier :

- **Phase 2 (avant la clôture) : sans interface.** Export CSV (`;` comme séparateur, BOM UTF-8 pour Excel, cellules commençant par `= + - @` préfixées d'une apostrophe contre l'injection de formules) et console Neon pour lire les tables.
- **Phase 3 (avant le 21 décembre) : routes Angular `/admin/**`**, chargées à la demande, `noindex`, hors du prérendu : connexion, liste filtrable, fiche dossier avec lecteur PDF/vidéo, formulaire de notation, classement, messages, partenaires, statistiques. Elles consomment les routes du §12.2.

---

## 13. Tâches planifiées (cron)

`api/cron.ts` lit `?job=…`, refuse toute requête sans `Authorization: Bearer ${CRON_SECRET}` (`401`), exécute le job.

```json
// vercel.json (ajout)
"crons": [
  { "path": "/api/cron?job=outbox",       "schedule": "*/15 * * * *" },
  { "path": "/api/cron?job=ouverture",    "schedule": "0 6 16 11 *"  },
  { "path": "/api/cron?job=rappel",       "schedule": "0 6 15 12 *"  },
  { "path": "/api/cron?job=nettoyage",    "schedule": "30 3 * * *"   }
]
```

Les horaires Vercel sont en **UTC** : `0 6 16 11 *` = 6 h UTC = 7 h au Cameroun, le matin du 16 novembre.

| Job | Rôle | Idempotence |
| --- | --- | --- |
| `outbox` | Envoie les e-mails `pending` échus. | `for update skip locked` |
| `ouverture` | Si la phase est `depots` : met en outbox `alerte_ouverture` pour chaque inscrit dont `notified_at is null` et `unsubscribed_at is null`, puis renseigne `notified_at`. | `notified_at` |
| `rappel` | À J-3 de la clôture : rappel aux inscrits **sans dossier** déposé (comparaison par e-mail). | `notified_at` dédié ou clé dans `audit_log` |
| `nettoyage` | Supprime les `rate_hits` de plus de 2 jours, les `login_tokens` et `sessions` expirés ; supprime les fichiers Blob orphelins (§10.4). | naturelle |

> **Plan Hobby :** les cron ne peuvent s'exécuter qu'**une fois par jour**, avec une précision d'environ une heure. `outbox` toutes les 15 minutes demande le plan Pro. Sur Hobby, la reprise passe par `nettoyage` quotidien **et** par l'envoi opportuniste : chaque appel à `submit`/`contact` termine par `waitUntil(vider())`, ce qui reprend les e-mails en attente. Vérifier aussi que l'usage d'un plan Hobby (usage non commercial) est compatible avec un concours qui a des partenaires financiers.

---

## 14. Sécurité

| Risque (OWASP) | Mesure |
| --- | --- |
| Injection SQL | Requêtes paramétrées uniquement (gabarits `sql\`…\``). Jamais de concaténation de chaînes dans une requête. |
| Injection HTML dans les e-mails | `esc()` partout ; `href` limités à `https://` ; `javascript:` refusé par le schéma Zod. |
| Injection d'en-têtes e-mail | Retours à la ligne supprimés des sujets ; `replyTo` validé. |
| Contrôle d'accès défaillant | Session vérifiée en tête de chaque route admin ; rôle vérifié ; un juré ne lit et n'écrit que **sa** notation ; test automatisé qui appelle chaque route admin sans session et attend `401`. |
| Authentification | Lien magique à usage unique, hachage SHA-256 en base, expiration 15 minutes ; réponse identique que l'e-mail existe ou non ; limite de 5 par heure. |
| Téléversement malveillant | Liste blanche d'extensions, plafonds de taille par type, octets magiques, chemin à UUID, URL de dépôt limitées à notre stockage. Les fichiers ne sont jamais exécutés ni servis depuis notre domaine. |
| Déni de service / abus de coût | Limite de débit sur chaque route, plafond de taille de jeton Blob, corps JSON borné, nettoyage des orphelins. |
| Robots | Champ piège `website` (§22), Cloudflare Turnstile facultatif (§22). |
| CORS | Liste blanche (`ALLOWED_ORIGINS`), même origine par défaut, plus de `*`. |
| Secrets | Variables d'environnement Vercel uniquement ; aucune valeur dans le dépôt ; `.env.example` sans valeurs. Si le dépôt a déjà contenu des identifiants SMTP, les **changer**. |
| Fuite d'informations | Les erreurs 500 renvoient « Erreur interne » (le détail va dans les journaux). Plus de champ `details: error.message` dans les réponses (présent dans `upload-url.js` aujourd'hui). |
| En-têtes de sécurité | Dans `vercel.json` : `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`. Une `Content-Security-Policy` est possible mais à tester avec le front (GSAP, Plausible). |
| Dépendances | `npm audit` en intégration continue ; Dependabot ou Renovate activé. |
| Journalisation | Les journaux ne contiennent ni message de contact, ni numéro de téléphone, ni contenu de dossier. L'IP n'est stockée que sous forme hachée. |

---

## 15. Données personnelles

Le backend stocke des données personnelles : noms, e-mails, numéros de téléphone d'étudiants, de partenaires et d'inscrits à l'alerte. La loi camerounaise de 2024 sur la protection des données personnelles s'applique (à faire valider par le comité ou un juriste), et le RGPD si des candidats ou partenaires résident dans l'Union européenne.

| Obligation | Mise en œuvre |
| --- | --- |
| Information | Une page « Confidentialité » liée depuis le pied de page et les formulaires : finalités (gérer le concours), responsable (Saint Jean Ingénieur), durée, droits, contact. **Cette page n'existe pas dans le front actuel.** |
| Consentement à l'alerte | Le formulaire d'alerte doit dire à quoi l'adresse sert. Désinscription en un clic (§9.7). |
| Acceptation du règlement | Horodatée dans `reglement_ok_at`. |
| Minimisation | Pas d'âge, de date de naissance, de pièce d'identité. L'IP n'est conservée que hachée. |
| Durée de conservation | **À décider avec le comité.** Proposition : dossiers non retenus anonymisés 12 mois après la finale (nom, e-mail, téléphone effacés) ; dossiers lauréats conservés avec accord ; messages de contact supprimés après 12 mois ; inscrits à l'alerte supprimés après l'édition. Un cron annuel `purge-rgpd` applique la règle. |
| Droit d'accès et d'effacement | Procédure manuelle documentée : `scripts/effacer.mjs <email>` supprime ou anonymise toutes les lignes liées à une adresse (dossiers, fichiers Blob, messages, inscription, outbox), et journalise l'opération. |
| Sous-traitants | Vercel, Neon, SMTP/hébergeur : à citer dans la page de confidentialité. |
| Sécurité | §14. Notification de l'autorité en cas de fuite : procédure à définir. |

---

## 16. Observabilité et sauvegardes

### Journaux

Une ligne JSON par requête (`route`, `status`, `ms`, `err`), déjà émise par l'enveloppe du §8. Consultation dans les journaux Vercel. Ne jamais journaliser le corps des requêtes.

### Alertes

| Signal | Seuil | Moyen |
| --- | --- | --- |
| `GET /api/health` en erreur | 2 échecs d'affilée | sonde gratuite (UptimeRobot, Better Stack) toutes les 5 minutes |
| E-mails `failed` | ≥ 1 | le cron `outbox` envoie un e-mail au comité avec le décompte |
| E-mails `pending` depuis plus d'une heure | ≥ 1 | idem |
| 5xx | ≥ 5 en 10 minutes | Sentry (`@sentry/node`, plan gratuit), facultatif |
| 429 sur `submit` à l'approche de la clôture | surveillance manuelle du 16 au 18 décembre | journaux |

### Statistiques (`GET /api/admin/stats`)

Dépôts par jour, par domaine, par filière, par niveau, par état d'avancement, taille moyenne des équipes, part de vidéos fichier / lien, inscrits à l'alerte, taux de conversion alerte → dépôt. Le tunnel étape par étape (« Etape depot ») reste dans Plausible, côté front.

### Sauvegardes

| Donnée | Sauvegarde |
| --- | --- |
| Postgres | Restauration à un instant donné de Neon (durée selon le plan) **et** un `pg_dump` hebdomadaire par GitHub Actions, déposé dans un stockage privé distinct. Un dump **restauré une fois en test** avant le 16 novembre. |
| Blob | Script `scripts/archive-blobs.mjs` qui liste `candidatures/` et télécharge tout après la clôture (18 décembre) vers un disque du comité. Une base sauvegardée sans ses fichiers ne vaut rien. |

---

## 17. Tests

Un outil : **Vitest**. Une base Postgres jetable pour les tests d'intégration (conteneur local ou branche Neon).

| Niveau | Quoi | Fichier |
| --- | --- | --- |
| Unitaire | `phaseAt` aux 12 instants limites (23:59:59 le 15 novembre, 00:00:00 le 16, 23:59:59 le 18 décembre, +30 min de grâce, etc.) | `tests/phase.test.ts` |
| Unitaire | `noteSur100` (cas 10/10/10/10 = 100, 0 = 0, pondération 30/25/25/20) | `tests/scoring.test.ts` |
| Unitaire | `nouveauNumero` : format, alphabet, absence de caractères ambigus | `tests/numero.test.ts` |
| Unitaire | Schémas : chaque règle du §7.4 avec une valeur limite (29 / 30 caractères, 4 / 5 membres, `javascript:` refusé, contact avec téléphone dans `email`) | `tests/schemas.test.ts` |
| Cohérence | Les dates de `phase.ts` égalent celles de `concours-dates.service.ts` ; les longueurs min/max du dépôt égalent celles de `depot-form.service.ts` | `tests/front-parity.test.ts` |
| Intégration | `submit` : succès ; hors période → 403 ; second envoi identique → même numéro, un seul dossier, deux e-mails ; collision de numéro simulée ; SMTP en panne → dossier créé, e-mail `pending` | `tests/submit.test.ts` |
| Intégration | `alerte` + cron `ouverture` : un seul e-mail par inscrit même si le cron tourne deux fois | `tests/alerte.test.ts` |
| Intégration | Admin : chaque route sans session → 401 ; juré sur route admin → 403 ; juré qui lit la note d'un autre → refusé | `tests/admin-access.test.ts` |
| Intégration | `publier` : deux appels successifs n'envoient chaque résultat qu'une fois | `tests/publier.test.ts` |
| Fumée | `scripts/smoke.sh <URL>` : `health`, un `POST` valide sur `contact`, un `POST` invalide qui doit renvoyer 400, un `OPTIONS` | exécuté après chaque déploiement |
| Charge | 50 dépôts en parallèle sur un aperçu (script `tsx`), sans erreur ni doublon | une fois avant le 16 novembre |

Critère : `npm test` passe en moins de 30 secondes sur la machine du développeur.

---

## 18. CI/CD et déploiement

### Intégration continue (`.github/workflows/ci.yml`)

À chaque push et pull request : `npm ci`, `tsc --noEmit`, `npm test`, `npm audit --audit-level=high`. Une base Postgres de service (`services: postgres`) pour les tests d'intégration.

### Déploiement

1. Créer la base Neon depuis la Marketplace Vercel (variable `DATABASE_URL` injectée automatiquement, **une branche de base par aperçu**).
2. Définir toutes les variables du §5 (Production + Preview).
3. Exécuter `node scripts/migrate.mjs` : en local contre la base de production la première fois, puis en étape de build (`vercel.json` → `buildCommand: "node scripts/migrate.mjs && cd frontend && npm install && npm run build"`).
4. Ajouter le bloc `crons` et la réécriture `/api/admin/:path*` à `vercel.json`. Garder la règle de repli SPA **après** les règles `/api`.
5. Déployer, lancer `scripts/smoke.sh`, faire un dépôt complet de bout en bout avec `FORCE_PHASE=depots` sur l'**aperçu** (jamais en production).
6. Vérifier que les e-mails du jury et du candidat arrivent **dans la boîte de réception**, pas dans les indésirables.

### Retour arrière

Les migrations n'ont pas de « down » : elles sont additives. Pour revenir en arrière, redéployer la version précédente de l'API (l'ancien code ignore les nouvelles tables) ; en cas de corruption, restaurer Neon à l'instant précédent. Toute migration destructive (suppression de colonne) attend la fin de l'édition.

---

## 19. Plan d'exécution par phase

Ordonné par la date où chaque morceau devient indispensable. Aujourd'hui : 23 octobre 2026.

| Phase | Échéance | Contenu | Résultat vérifiable |
| --- | --- | --- | --- |
| **0. Socle** | 30 octobre | TypeScript, Zod, Neon, `migrate.mjs`, migration 001, `env.ts`, `http.ts`, `ratelimit.ts`, `phase.ts`, CI. | `npm test` vert ; `GET /api/health` répond. |
| **1. Dépôts fiables** | **10 novembre** (une semaine de marge avant l'ouverture) | `submit`, `upload-url` durcis, vérification des fichiers, outbox + `vider`, `contact`, `partenariat`, `alerte` enregistrés en base, désinscription, cron `outbox` et `ouverture`, SPF/DKIM/DMARC, sauvegarde testée. | Un dépôt complet sur l'aperçu donne un numéro, deux e-mails reçus, une ligne en base, trois fichiers vérifiés. SMTP coupé : le dépôt réussit et l'e-mail part plus tard. |
| **2. Pilotage de la période de dépôt** | 16 novembre → 18 décembre | Export CSV, statistiques, sonde de disponibilité, alertes d'outbox, rappel J-3, `suivi`. | Le comité exporte les dossiers en CSV lisible par Excel. |
| **3. Espace jury** | **18 décembre** (prêt pour le 21) | Migration 002, lien magique, notation, classement, statuts, fiche dossier, interface Angular `/admin`. | Trois jurés notent un dossier de test ; le classement se calcule ; un juré ne voit pas les notes des autres avant de soumettre. |
| **4. Résultats** | 15 janvier 2027 (avant le 22) | `publier` avec `dry`, gabarits `resultat`, statut `non_retenu` / `preselectionne`. | Aperçu de la liste de destinataires validé par le comité ; envoi réel idempotent. |
| **5. Finale et clôture** | 10 février 2027 et après | Statuts `finaliste` / `laureat` + `prix_rang`, archive des fichiers, purge selon la durée de conservation, bilan chiffré. | Archive complète vérifiée ; données purgées selon la décision du comité. |

Règle de priorité : **si le temps manque, couper dans l'ordre inverse** (phase 5, puis 4, puis l'interface de la phase 3 en gardant le CSV). La phase 1 n'est pas négociable : c'est elle qui protège les dossiers des étudiants.

---

## 20. Recette finale

À cocher sur l'**aperçu de production**, avant le 16 novembre.

**Dépôt**
- [ ] Dépôt complet (PDF + MP4 + 2 images) : numéro `INNOVA27-XXXXX` affiché, e-mail candidat reçu en boîte de réception, e-mail jury reçu.
- [ ] Dépôt avec lien YouTube à la place du fichier vidéo.
- [ ] Même dépôt envoyé deux fois : un seul dossier, même numéro, pas de second e-mail.
- [ ] `POST /api/submit` avant le 16 novembre et après le 18 décembre à 00 h 30 : 403.
- [ ] URL de fichier étrangère (`https://exemple.com/x.pdf`), `javascript:alert(1)`, PDF renommé en `.mp4` : refusés.
- [ ] Problème de 29 caractères, 5 membres, avancement inconnu : 400.
- [ ] SMTP volontairement coupé : le dépôt réussit, l'e-mail est `pending`, puis part après rétablissement.

**Téléversement**
- [ ] Extension `.exe` refusée ; image de 6 Mo refusée ; PDF de 11 Mo refusé.
- [ ] 41ᵉ appel en une heure : 429.

**Formulaires**
- [ ] Contact avec un numéro de téléphone dans « E-mail ou téléphone » : accepté.
- [ ] Partenariat avec chacune des 5 formules.
- [ ] Alerte : même adresse deux fois, une seule ligne ; le cron `ouverture` lancé deux fois n'envoie qu'un e-mail ; le lien de désinscription fonctionne.

**Sécurité**
- [ ] Toute route `/api/admin/*` sans cookie : 401.
- [ ] Un compte `jury` sur une route `admin` : 403.
- [ ] Le lien magique ne fonctionne qu'une fois et plus après 15 minutes.
- [ ] Aucun secret dans le dépôt (`git log -p | grep -i smtp_pass`).
- [ ] `FORCE_PHASE` refusée en production.

**Exploitation**
- [ ] `GET /api/health` surveillé, alerte reçue quand la base est coupée.
- [ ] Dump Postgres restauré avec succès dans une base vide.
- [ ] Export CSV ouvert dans Excel : accents corrects, une colonne par champ.
- [ ] Page de confidentialité en ligne et liée.

---

## 21. Ce qu'on ne construit volontairement pas

| Idée écartée | Raison | À reconsidérer si… |
| --- | --- | --- |
| ORM (Prisma, Drizzle) | Dix tables, requêtes simples. | Les requêtes se multiplient ou l'équipe est plusieurs développeurs. |
| Redis / Upstash | Une table Postgres suffit pour 5 formulaires. | Le trafic dépasse quelques centaines de requêtes par minute. |
| API publique des projets | `public/assets/data/projets.json` suffit pour l'édition précédente. | Les lauréats 2027 doivent s'afficher sans redéploiement : un script exporte alors la base vers ce JSON. |
| Comptes candidats avec mot de passe | Le numéro + l'e-mail suffisent pour le suivi. | Les candidats doivent modifier leur dossier après dépôt. |
| Modification d'un dossier déposé | Le règlement ne le prévoit pas ; il ouvrirait la question des versions. | Le comité l'exige : ajouter une fenêtre de correction et une table de versions. |
| Paiement en ligne des partenaires | Le formulaire est un bulletin d'engagement, le contrat se fait hors ligne. | Un partenariat se règle par Mobile Money en ligne. |
| Antivirus sur les fichiers | Pas d'exécution possible dans une fonction Vercel. | Le jury ouvre des fichiers hors du navigateur : scan à la sauvegarde sur un poste dédié. |
| Notifications temps réel (WebSocket) | Aucun besoin : le jury rafraîchit une liste. | — |
| Microservices, file de messages | L'outbox en base fait le travail. | — |
| Détection de plagiat | Hors périmètre technique. | Le comité le demande. |

---

## 22. Changements front facultatifs

Le backend fonctionne **sans aucune modification du front**. Ces trois ajouts le renforcent, chacun en quelques lignes.

1. **Champ piège anti-robot** sur les quatre formulaires : un `<input name="website" tabindex="-1" autocomplete="off" aria-hidden="true">` masqué en CSS, envoyé dans le corps. Le schéma serveur accepte `website` et l'ignore s'il est vide.
2. **Taille et type à la demande d'URL** : `upload.service.ts` ajoute `&size=${file.size}&type=${encodeURIComponent(file.type)}` à l'appel `upload-url` ; le serveur refuse un fichier dont la taille annoncée dépasse le plafond avant même d'émettre l'URL. Les contrôles du §10.3 s'appliquent de toute façon.
3. **Case du règlement** : ajouter `accord: true` à `DepotPayload` pour enregistrer explicitement l'acceptation (le serveur l'horodate déjà à la création).

Autres ajouts possibles, non nécessaires pour l'ouverture :

- **Cloudflare Turnstile** sur `/deposer` et `/contact` : le widget fournit un jeton envoyé dans `turnstileToken`, vérifié côté serveur avec `TURNSTILE_SECRET`. À ajouter seulement si le champ piège ne suffit pas.
- **Page de suivi** `/suivi` appelant `POST /api/suivi`.
- **Page de confidentialité** (§15).
- **Routes `/admin/**`** (§12.6).
