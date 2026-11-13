/**
 * Script de configuration Google Drive OAuth2
 * Permet d'obtenir le REFRESH TOKEN et de créer le dossier racine CANDIDATURES
 * Exécution : node scripts/setup-google-drive.js
 */
const { google } = require('googleapis');
const readline = require('node:readline');
const fs = require('node:fs');
const path = require('node:path');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// URI de redirection OAuth
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/oauth2callback';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata.readonly'
];

async function main() {
  console.log('====================================================');
  console.log('   CONFIGURATION GOOGLE DRIVE — SJI INNOVA 2027');
  console.log('====================================================\n');

  console.log('Client ID     :', CLIENT_ID);
  console.log('Redirect URI  :', REDIRECT_URI);
  console.log('\nSi cette Redirect URI n\'est pas autorisée dans Google Cloud Console,');
  console.log('ajoutez-la dans : Identifiants > ID client OAuth 2.0 > URI de redirection autorisés.\n');

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });

  console.log('1. Ouvrez ce lien dans votre navigateur pour vous connecter :');
  console.log('----------------------------------------------------');
  console.log(authUrl);
  console.log('----------------------------------------------------\n');

  console.log('2. Connectez-vous avec votre compte Google et autorisez l\'application.');
  console.log('3. Vous serez redirigé vers une URL de la forme :');
  console.log('   http://localhost:3000/oauth2callback?code=4/0A...&scope=...\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Collez ici le code complet ou l\'URL de redirection obtenue : ', async (input) => {
    rl.close();

    let code = input.trim();
    if (code.includes('code=')) {
      try {
        const u = new URL(code);
        code = u.searchParams.get('code') || code;
      } catch {
        const match = code.match(/code=([^&]+)/);
        if (match) code = decodeURIComponent(match[1]);
      }
    }

    try {
      console.log('\nÉchange du code contre les jetons OAuth...');
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      const refreshToken = tokens.refresh_token;
      if (!refreshToken) {
        console.warn('\n⚠️  Aucun refresh_token reçu. Assurez-vous d\'avoir cliqué "Consent" ou révoquez les accès de l\'application dans https://myaccount.google.com/permissions pour forcer un nouveau consentement.');
      } else {
        console.log('✅ Refresh Token obtenu avec succès !');
      }

      // Initialisation du client Drive
      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      // Vérifier ou créer le dossier racine CANDIDATURES
      console.log('\nVérification / Création du dossier racine "CANDIDATURES" sur Google Drive...');
      const listRes = await drive.files.list({
        q: "name = 'CANDIDATURES' and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
        fields: 'files(id, name)',
      });

      let rootFolderId;
      if (listRes.data.files && listRes.data.files.length > 0) {
        rootFolderId = listRes.data.files[0].id;
        console.log(`✅ Dossier CANDIDATURES existant trouvé (ID: ${rootFolderId})`);
      } else {
        const createRes = await drive.files.create({
          requestBody: {
            name: 'CANDIDATURES',
            mimeType: 'application/vnd.google-apps.folder',
          },
          fields: 'id, name',
        });
        rootFolderId = createRes.data.id;
        console.log(`✅ Dossier CANDIDATURES créé avec succès (ID: ${rootFolderId})`);
      }

      // Rendre le dossier lisible via lien pour les jurés
      try {
        await drive.permissions.create({
          fileId: rootFolderId,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });
        console.log('✅ Permissions de lecture publique configurées sur le dossier.');
      } catch (e) {
        console.warn('⚠️  Impossible de rendre le dossier public (droits restreints) :', e.message);
      }

      // Mise à jour de .env.local
      const envPath = path.resolve(__dirname, '../.env.local');
      let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

      const updateOrAdd = (key, val) => {
        const regex = new RegExp(`^${key}=.*$`, 'm');
        if (regex.test(envContent)) {
          envContent = envContent.replace(regex, `${key}="${val}"`);
        } else {
          envContent += `\n${key}="${val}"`;
        }
      };

      updateOrAdd('GOOGLE_CLIENT_ID', CLIENT_ID);
      updateOrAdd('GOOGLE_CLIENT_SECRET', CLIENT_SECRET);
      updateOrAdd('GOOGLE_REDIRECT_URI', REDIRECT_URI);
      if (refreshToken) {
        updateOrAdd('GOOGLE_REFRESH_TOKEN', refreshToken);
      }
      updateOrAdd('GOOGLE_DRIVE_ROOT_FOLDER_ID', rootFolderId);

      fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');
      console.log('✅ Fichier .env.local mis à jour avec les identifiants Google Drive !\n');

      console.log('Configuration terminée avec succès.');
    } catch (err) {
      console.error('❌ Erreur lors de la configuration :', err.message);
    }
  });
}

main().catch(console.error);
