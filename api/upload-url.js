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

  const filename = req.query?.filename;
  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ error: 'Nom de fichier requis (query ?filename=...)' });
  }

  const pathname = `candidatures/${Date.now()}_${decodeURIComponent(filename)}`;

  try {
    const signedToken = await issueSignedToken({
      operations: ['put'],
      pathname,
      validUntil: Date.now() + 30 * 60 * 1000,
      maximumSizeInBytes: 200 * 1024 * 1024,
    });

    const { presignedUrl } = await presignUrl(signedToken, {
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
