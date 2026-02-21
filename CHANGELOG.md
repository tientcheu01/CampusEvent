# Résumé des modifications — SJI INNOVA 2026

**Date :** 21 février 2026  
**Projet :** test-nova (event-campus)  
**URL Production :** https://test-nova-seven.vercel.app

---

## Problème initial

Les emails ne partaient pas après soumission du formulaire de candidature, bien que les fichiers étaient correctement uploadés vers Vercel Blob.

### Cause identifiée

Le site était **100% statique** (HTML/CSS/JS uniquement) — aucun backend, aucune fonction serverless, aucun fichier `api/`.  
Les variables d'environnement SMTP configurées sur Vercel (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, etc.) **n'étaient utilisées par rien** car il n'existait aucun code serveur pour les lire.

L'envoi d'email était délégué à **FormSubmit.co**, un service tiers qui ne fonctionnait pas correctement (email non vérifié ou problème de configuration).

---

## Modifications effectuées

### 1. Création de `package.json`

Ajout de la dépendance `nodemailer` nécessaire à l'envoi d'emails via SMTP.

```json
{
  "name": "event-campus-sji-innova",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "nodemailer": "^6.9.16"
  }
}
```

### 2. Création de `api/submit.js` — Fonction Serverless Vercel

Nouvelle API serverless qui :

- Reçoit les données du formulaire en JSON (`POST /api/submit`)
- Se connecte au serveur SMTP Gmail via les variables d'environnement Vercel
- Construit un **email HTML richement formaté** avec toutes les sections du dossier de candidature :
  - Informations générales (titre, porteurs, participation, encadreur)
  - Problématique (contexte, objectifs)
  - Solution proposée (principe, innovation, caractère innovant)
  - Faisabilité & Impacts
  - Pièces jointes (liens vers les fichiers uploadés sur Vercel Blob)
  - Engagement et date de signature
- Envoie l'email à tous les jurés listés dans `JURY_EMAILS`
- Retourne un JSON de confirmation ou d'erreur

**Variables d'environnement utilisées :**

| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | Serveur SMTP (smtp.gmail.com) |
| `SMTP_PORT` | Port SMTP (587) |
| `SMTP_USER` | Adresse Gmail expéditrice |
| `SMTP_PASS` | Mot de passe d'application Google |
| `FROM_EMAIL` | Adresse affichée comme expéditeur |
| `JURY_EMAILS` | Liste des emails du jury (séparés par des virgules) |

### 3. Modification de `inscription.html`

Remplacement de l'appel à FormSubmit.co par un appel à la nouvelle API serverless :

**Avant :**
```js
const response = await fetch('https://formsubmit.co/ajax/d99fe1f7a46078e5d703d4100a630869', { ... });
```

**Après :**
```js
const response = await fetch('/api/submit', { ... });
```

Le formulaire gère désormais la réponse JSON de l'API avec les champs `success`, `error` et `details`.

---

## Architecture finale

```
event-campus/
├── index.html              # Page d'accueil
├── inscription.html        # Formulaire de candidature (modifié)
├── merci.html              # Page de remerciement
├── package.json            # ✅ NOUVEAU — dépendances Node.js
├── api/
│   └── submit.js           # ✅ NOUVEAU — API serverless (envoi email SMTP)
├── css/
│   └── style.css
├── js/
│   └── main.js
└── assets/
    └── images/
```

## Flux de soumission

```
Candidat remplit le formulaire
        │
        ▼
Upload fichiers → Vercel Blob (stockage)
        │
        ▼
Envoi données JSON → /api/submit (serverless)
        │
        ▼
Nodemailer → SMTP Gmail → Email aux jurés
        │
        ▼
Redirection → merci.html
```

---

## Prérequis pour le bon fonctionnement

1. **Mot de passe d'application Google** : La variable `SMTP_PASS` doit contenir un mot de passe d'application (pas le mot de passe Gmail classique). Générable sur https://myaccount.google.com/apppasswords avec la validation en 2 étapes activée.

2. **Variables d'environnement sur Vercel** : Les 6 variables doivent être configurées pour l'environnement **Production** dans Dashboard → Settings → Environment Variables.

3. **Déploiement** : `vercel --prod` depuis le dossier du projet.
