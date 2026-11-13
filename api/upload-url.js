const { issueSignedToken, presignUrl } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  let filename = req.query?.filename;
  if (!filename && req.url) {
    try {
      const u = new URL(req.url, 'http://localhost');
      filename = u.searchParams.get('filename');
    } catch {}
  }

  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ error: 'Nom de fichier requis (query ?filename=...)' });
  }

  // 1. Si Google Drive est configuré avec un refresh token, utiliser Google Drive
  if (process.env.GOOGLE_REFRESH_TOKEN && process.env.GOOGLE_CLIENT_ID) {
    try {
      const path = require('node:path');
      const { createResumableUploadSession } = require('./_lib/google-drive');
      const ext = path.extname(filename).toLowerCase();
      let mimeType = 'application/octet-stream';
      if (ext === '.pdf') mimeType = 'application/pdf';
      else if (ext === '.mp4') mimeType = 'video/mp4';
      else if (['.jpg', '.jpeg'].includes(ext)) mimeType = 'image/jpeg';
      else if (ext === '.png') mimeType = 'image/png';
      else if (ext === '.webp') mimeType = 'image/webp';

      let origin = req.headers.origin;
      if (!origin && req.headers.referer) {
        try {
          origin = new URL(req.headers.referer).origin;
        } catch {}
      }
      if (!origin) {
        origin = 'http://localhost:4200';
      }

      const uploadUrl = await createResumableUploadSession({
        filename: `${Date.now()}_${decodeURIComponent(filename)}`,
        mimeType,
        origin,
      });

      return res.status(200).json({ url: uploadUrl, provider: 'google-drive' });
    } catch (err) {
      console.warn('Google Drive non disponible, bascule vers Vercel Blob :', err.message);
    }
  }

  // 2. Sinon, utiliser Vercel Blob Storage
  const pathname = `candidatures/${Date.now()}_${decodeURIComponent(filename)}`;

  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.InnovaData_READ_WRITE_TOKEN;
    const signedToken = await issueSignedToken({
      token,
      operations: ['put'],
      pathname,
      validUntil: Date.now() + 30 * 60 * 1000,
      maximumSizeInBytes: 200 * 1024 * 1024,
    });

    const { presignedUrl } = await presignUrl(signedToken, {
      token,
      operation: 'put',
      pathname,
      access: 'public',
      validUntil: Date.now() + 20 * 60 * 1000,
    });

    return res.status(200).json({ url: presignedUrl });
  } catch (error) {
    console.error('Erreur génération URL signée:', error);
    return res.status(500).json({ error: 'Erreur lors de la génération de l\'URL d\'upload', details: error.message });
  }
};
