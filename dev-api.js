/**
 * Serveur de développement local pour les fonctions serverless de /api
 * Permet de tester le backend en local avec `node dev-api.js` ou `npm run dev:api`
 * Écoute sur le port 3000 (cible du proxy frontend/proxy.conf.json).
 */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

// Chargement de .env.local si disponible
const envPath = path.resolve(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

const routes = {
  '/api/submit': require('./api/submit.js'),
  '/api/upload-url': require('./api/upload-url.js'),
  '/api/contact': require('./api/contact.js'),
  '/api/partenariat': require('./api/partenariat.js'),
  '/api/alerte': require('./api/alerte.js'),
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  const pathname = parsedUrl.pathname;

  // Helpers similaires à l'environnement Vercel Serverless
  res.status = function (code) {
    this.statusCode = code;
    return this;
  };
  res.json = function (obj) {
    this.setHeader('Content-Type', 'application/json; charset=utf-8');
    this.end(JSON.stringify(obj));
    return this;
  };

  // Parsing des query params
  req.query = Object.fromEntries(parsedUrl.searchParams.entries());

  // Route d'autorisation automatique Google Drive OAuth2
  if (pathname === '/oauth2callback') {
    const code = parsedUrl.searchParams.get('code');
    if (!code) {
      res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>Erreur : Aucun code d\'autorisation fourni par Google</h1>');
      return;
    }

    try {
      const { google } = require('googleapis');
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `http://${req.headers.host || 'localhost:3000'}/oauth2callback`
      );

      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      const refreshToken = tokens.refresh_token;

      // Création / vérification du dossier CANDIDATURES
      const drive = google.drive({ version: 'v3', auth: oauth2Client });
      const listRes = await drive.files.list({
        q: "name = 'CANDIDATURES' and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
        fields: 'files(id, name)',
      });

      let rootFolderId;
      if (listRes.data.files && listRes.data.files.length > 0) {
        rootFolderId = listRes.data.files[0].id;
      } else {
        const createRes = await drive.files.create({
          requestBody: {
            name: 'CANDIDATURES',
            mimeType: 'application/vnd.google-apps.folder',
          },
          fields: 'id, name',
        });
        rootFolderId = createRes.data.id;
      }

      // Rendre le dossier lisible via lien
      try {
        await drive.permissions.create({
          fileId: rootFolderId,
          requestBody: { role: 'reader', type: 'anyone' },
        });
      } catch {}

      // Mise à jour de .env.local
      let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
      const updateOrAdd = (key, val) => {
        const regex = new RegExp(`^${key}=.*$`, 'm');
        if (regex.test(envContent)) {
          envContent = envContent.replace(regex, `${key}="${val}"`);
        } else {
          envContent += `\n${key}="${val}"`;
        }
        process.env[key] = val;
      };

      if (process.env.GOOGLE_CLIENT_ID) updateOrAdd('GOOGLE_CLIENT_ID', process.env.GOOGLE_CLIENT_ID);
      if (process.env.GOOGLE_CLIENT_SECRET) updateOrAdd('GOOGLE_CLIENT_SECRET', process.env.GOOGLE_CLIENT_SECRET);
      updateOrAdd('GOOGLE_REDIRECT_URI', `http://${req.headers.host || 'localhost:3000'}/oauth2callback`);
      if (refreshToken) updateOrAdd('GOOGLE_REFRESH_TOKEN', refreshToken);
      updateOrAdd('GOOGLE_DRIVE_ROOT_FOLDER_ID', rootFolderId);

      fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <div style="font-family:sans-serif;max-width:580px;margin:50px auto;padding:30px;border:1px solid #c7d2fe;border-radius:12px;background:#f0fdf4">
          <h1 style="color:#166534;margin-top:0">Connexion Google Drive réussie !</h1>
          <p>Le <strong>Refresh Token</strong> a bien été obtenu et enregistré dans <code>.env.local</code>.</p>
          <p>Le dossier racine <strong>CANDIDATURES</strong> (ID: <code>${rootFolderId}</code>) est prêt.</p>
          <p style="color:#15803d">Vos futurs dépôts de candidature seront automatiquement stockés sur votre Google Drive.</p>
          <a href="/" style="display:inline-block;padding:10px 20px;background:#15803d;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;margin-top:15px">Retour à l'application</a>
        </div>
      `);
      return;
    } catch (err) {
      console.error('Erreur échange code OAuth Google:', err);
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<h1>Erreur lors de la connexion Google Drive</h1><p>${err.message}</p>`);
      return;
    }
  }

  const handler = routes[pathname];
  if (!handler) {
    res.status(404).json({ error: `Route introuvable: ${pathname}` });
    return;
  }

  // Lecture du body pour les requêtes POST
  let bodyStr = '';
  req.on('data', (chunk) => {
    bodyStr += chunk;
  });

  req.on('end', async () => {
    if (bodyStr) {
      try {
        req.body = JSON.parse(bodyStr);
      } catch {
        req.body = bodyStr;
      }
    } else {
      req.body = {};
    }

    try {
      await handler(req, res);
    } catch (err) {
      console.error(`Erreur sur ${pathname}:`, err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Erreur serveur interne', details: err.message });
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Backend local SJI INNOVA écoute sur http://localhost:${PORT}`);
  console.log(`Routes disponibles : ${Object.keys(routes).join(', ')}`);
});
