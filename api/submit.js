const { esc, cors, list, transporter, layout, rows, from } = require('./_lib/mail');

const REQUIRED = ['projet', 'porteur', 'niveau', 'telephone', 'email', 'probleme', 'solution', 'avancement', 'domaine', 'dossierUrl', 'videoUrl'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function numeroDossier() {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase().padEnd(5, '0');
  return `INNOVA27-${rand}`;
}

const link = (u, label) => `<a href="${esc(u)}" style="color:#17439b">${esc(label)}</a>`;

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (err) {
        return res.status(400).json({ error: 'Corps de requête JSON invalide' });
      }
    }
    const raw = body || {};

    // Normalisation des champs pour supporter le formulaire Angular 2027 et toute variante
    const projet = (raw.projet || raw.titre_projet || '').trim();
    const porteur = (raw.porteur || raw.porteurs || '').trim();
    const filiere = (raw.filiere || '').trim();
    const niveau = (raw.niveau || 'Non spécifié').trim();
    const telephone = (raw.telephone || raw.tel || '').trim();
    const email = (raw.email || raw.mail || '').trim();
    const probleme = (raw.probleme || raw.problematique || '').trim();
    const solution = (raw.solution || raw.principe_fonctionnement || raw.caractere_innovant || '').trim();
    const avancement = (raw.avancement || 'Idée / Concept').trim();
    const domaine = (raw.domaine || 'Innovation').trim();

    // URLs de fichiers
    let dossierUrl = (raw.dossierUrl || '').trim();
    let videoUrl = (raw.videoUrl || '').trim();
    let imagesUrls = Array.isArray(raw.imagesUrls) ? raw.imagesUrls.filter(Boolean) : [];

    // Fallback si transmis sous format fichiers_urls
    if (!dossierUrl && raw.fichiers_urls) {
      const urls = Array.isArray(raw.fichiers_urls)
        ? raw.fichiers_urls.filter(Boolean)
        : String(raw.fichiers_urls).split('\n').map((u) => u.trim()).filter(Boolean);
      if (urls.length > 0) dossierUrl = urls[0];
      if (!videoUrl && urls.length > 1) videoUrl = urls[1];
      if (imagesUrls.length === 0 && urls.length > 2) imagesUrls = urls.slice(2);
    }

    if (!videoUrl) {
      videoUrl = 'Non renseignée';
    }

    const membres = Array.isArray(raw.membres)
      ? raw.membres.filter((m) => m && String(m).trim()).map((m) => String(m).trim())
      : [];

    const d = {
      projet,
      porteur,
      filiere,
      niveau,
      telephone,
      email,
      probleme,
      solution,
      avancement,
      domaine,
      dossierUrl,
      videoUrl,
      imagesUrls,
      membres,
    };

    const missing = REQUIRED.filter((k) => !d[k] || !String(d[k]).trim());
    if (missing.length) {
      return res.status(400).json({ error: `Champs manquants : ${missing.join(', ')}` });
    }
    if (!EMAIL.test(d.email)) {
      return res.status(400).json({ error: 'Adresse e-mail invalide' });
    }

    const jury = list(process.env.JURY_EMAILS);
    if (!jury.length) {
      return res.status(500).json({ error: 'Aucun e-mail de jury configuré (JURY_EMAILS)' });
    }

    const numero = numeroDossier();
    const video = /^https?:\/\//.test(d.videoUrl) ? link(d.videoUrl, 'Voir la vidéo') : esc(d.videoUrl);

    let driveFolderLink = '';
    if (process.env.GOOGLE_REFRESH_TOKEN && process.env.GOOGLE_CLIENT_ID) {
      try {
        const { getOrCreateFolder, moveFileToFolder, extractDriveFileId } = require('./_lib/google-drive');
        const folderId = await getOrCreateFolder(numero);
        driveFolderLink = `https://drive.google.com/drive/folders/${folderId}`;

        // Ranger les fichiers téléversés dans le sous-dossier de la candidature
        const allFileUrls = [d.dossierUrl, d.videoUrl, ...(Array.isArray(imagesUrls) ? imagesUrls : [])];
        for (const fileUrl of allFileUrls) {
          const fid = extractDriveFileId(fileUrl);
          if (fid) {
            await moveFileToFolder(fid, folderId);
          }
        }
      } catch (err) {
        console.warn('Organisation dossier Google Drive ignorée :', err.message);
      }
    }

    const mailer = transporter();
    await mailer.verify();

    await mailer.sendMail({
      from: from(),
      to: jury.join(', '),
      replyTo: d.email,
      subject: `Nouveau dossier ${numero} — ${d.projet} — SJI INNOVA 2027`,
      html: layout(
        `Nouveau dossier ${numero}`,
        rows([
          ['Projet', esc(d.projet)],
          ['Porteur', esc(d.porteur)],
          ['Niveau d\'études', d.filiere ? `${esc(d.filiere)} · ${esc(d.niveau)}` : esc(d.niveau)],
          ['Contact', `${esc(d.telephone)} · ${esc(d.email)}`],
          ['Membres', esc(membres.join(', ') || 'Aucun')],
          ['Problème traité', esc(d.probleme)],
          ['Solution proposée', esc(d.solution)],
          ['Avancement · domaine', `${esc(d.avancement)} · ${esc(d.domaine)}`],
          ['Dossier (PDF)', link(d.dossierUrl, 'Télécharger le dossier')],
          ['Vidéo', video],
          ['Images', imagesUrls.length ? imagesUrls.map((u, i) => link(u, `Image ${i + 1}`)).join('<br>') : 'Aucune'],
          ...(driveFolderLink ? [['Dossier Google Drive', link(driveFolderLink, `Consulter les fichiers sur Drive (${numero})`)]] : []),
        ]),
      ),
    });

    // Confirmation au candidat. Un échec ici ne doit pas invalider le dépôt déjà transmis au jury.
    try {
      await mailer.sendMail({
        from: from(),
        to: d.email,
        subject: `Dossier reçu — ${numero} — SJI INNOVA 2027`,
        html: layout(
          'Dossier reçu',
          `<p>Bonjour ${esc(d.porteur)},</p>
<p>Votre dossier « ${esc(d.projet)} » a bien été reçu. Votre numéro est&nbsp;:</p>
<p style="font-size:30px;font-weight:bold;letter-spacing:-.02em;margin:8px 0 20px">${esc(numero)}</p>
<p>Le jury évalue les dossiers du 21 décembre 2026 au 22 janvier 2027 ; les résultats de la présélection seront annoncés le 22 janvier.</p>
<p>Une question&nbsp;? Appelez le 656 03 32 52 ou le 655 66 03 95.</p>`,
        ),
      });
    } catch (e) {
      console.error('Confirmation candidat non envoyée:', e.message);
    }

    return res.status(200).json({ success: true, numero });
  } catch (error) {
    console.error('Erreur dépôt:', error);
    return res.status(500).json({ error: "Erreur lors de l'envoi du dossier" });
  }
};
