const { google } = require('googleapis');

function getOAuthClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  if (process.env.GOOGLE_REFRESH_TOKEN) {
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
  }

  return oauth2Client;
}

function getDriveClient() {
  const auth = getOAuthClient();
  return google.drive({ version: 'v3', auth });
}

/**
 * Crée ou récupère le sous-dossier de candidature (ex: INNOVA27-XXXXX)
 */
async function getOrCreateFolder(folderName, parentFolderId) {
  const drive = getDriveClient();
  const parentId = parentFolderId || process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;

  let query = `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  if (parentId) {
    query += ` and '${parentId}' in parents`;
  }

  const existing = await drive.files.list({
    q: query,
    fields: 'files(id, name)',
  });

  if (existing.data.files && existing.data.files.length > 0) {
    return existing.data.files[0].id;
  }

  const fileMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    ...(parentId ? { parents: [parentId] } : {}),
  };

  const res = await drive.files.create({
    requestBody: fileMetadata,
    fields: 'id, name, webViewLink',
  });

  // Permission de lecture via lien
  try {
    await drive.permissions.create({
      fileId: res.data.id,
      requestBody: { role: 'reader', type: 'anyone' },
    });
  } catch {}

  return res.data.id;
}

/**
 * Génère une URL de session de téléversement "Resumable" Google Drive
 * Permet au navigateur client d'uploader directement vers Google Drive sans transiter par Vercel.
 * Le header Origin est indispensable pour que Google Drive autorise le PUT cross-origin (CORS).
 */
async function createResumableUploadSession({ filename, mimeType, parentFolderId, origin }) {
  const auth = getOAuthClient();
  const { token } = await auth.getAccessToken();

  const parentId = parentFolderId || process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;

  const metadata = {
    name: filename,
    mimeType: mimeType || 'application/octet-stream',
    ...(parentId ? { parents: [parentId] } : {}),
  };

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Upload-Content-Type': mimeType || 'application/octet-stream',
  };

  if (origin) {
    headers['Origin'] = origin;
  }

  const initRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', {
    method: 'POST',
    headers,
    body: JSON.stringify(metadata),
  });

  if (!initRes.ok) {
    const errorText = await initRes.text();
    throw new Error(`Google Drive Resumable Init Failed (${initRes.status}): ${errorText}`);
  }

  const uploadUrl = initRes.headers.get('location');
  if (!uploadUrl) {
    throw new Error('Google Drive n\'a pas retourné d\'en-tête Location pour la session de téléversement');
  }

  return uploadUrl;
}

/**
 * Extrait l'identifiant Google Drive d'une URL de fichier
 */
function extractDriveFileId(url) {
  if (!url || typeof url !== 'string') return null;
  const m1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m1) return m1[1];
  const m2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m2) return m2[1];
  return null;
}

/**
 * Déplace un fichier dans un dossier cible et assure l'accès lecture
 */
async function moveFileToFolder(fileId, folderId) {
  if (!fileId || !folderId) return;
  const drive = getDriveClient();
  try {
    const file = await drive.files.get({
      fileId,
      fields: 'parents',
    });
    const previousParents = (file.data.parents || []).join(',');
    await drive.files.update({
      fileId,
      addParents: folderId,
      removeParents: previousParents,
      fields: 'id, parents',
    });
    try {
      await drive.permissions.create({
        fileId,
        requestBody: { role: 'reader', type: 'anyone' },
      });
    } catch {}
  } catch (err) {
    console.warn(`Impossible de déplacer le fichier ${fileId} vers le dossier ${folderId}:`, err.message);
  }
}

/**
 * Récupère le lien de consultation webViewLink d'un fichier Drive
 */
async function getDriveFileLink(fileId) {
  const drive = getDriveClient();
  try {
    // Assurer les droits de lecture
    try {
      await drive.permissions.create({
        fileId,
        requestBody: { role: 'reader', type: 'anyone' },
      });
    } catch {}

    const res = await drive.files.get({
      fileId,
      fields: 'id, name, webViewLink, webContentLink',
    });
    return res.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;
  } catch (err) {
    console.warn(`Impossible de récupérer le lien Drive pour ${fileId}:`, err.message);
    return `https://drive.google.com/file/d/${fileId}/view`;
  }
}

module.exports = {
  getOAuthClient,
  getDriveClient,
  getOrCreateFolder,
  createResumableUploadSession,
  extractDriveFileId,
  moveFileToFolder,
  getDriveFileLink,
};
