const { esc, cors, list, transporter, layout, rows, from } = require('./_lib/mail');

const REQUIRED = ['projet', 'porteur', 'filiere', 'niveau', 'telephone', 'email', 'probleme', 'solution', 'avancement', 'domaine', 'dossierUrl', 'videoUrl'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function numeroDossier() {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase().padEnd(5, '0');
  return `INNOVA27-${rand}`;
}

const link = (u, label) => `<a href="${esc(u)}" style="color:#17439b">${esc(label)}</a>`;

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;

  try {
    const d = req.body || {};
    const missing = REQUIRED.filter((k) => !d[k] || !String(d[k]).trim());
    if (missing.length) return res.status(400).json({ error: `Champs manquants : ${missing.join(', ')}` });
    if (!EMAIL.test(d.email)) return res.status(400).json({ error: 'Adresse e-mail invalide' });

    const jury = list(process.env.JURY_EMAILS);
    if (!jury.length) return res.status(500).json({ error: 'Aucun e-mail de jury configuré (JURY_EMAILS)' });

    const numero = numeroDossier();
    const membres = Array.isArray(d.membres) ? d.membres.filter(Boolean) : [];
    const images = Array.isArray(d.imagesUrls) ? d.imagesUrls : [];
    const video = /^https?:\/\//.test(d.videoUrl) ? link(d.videoUrl, 'Voir la vidéo') : esc(d.videoUrl);

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
          ['Filière · niveau', `${esc(d.filiere)} · ${esc(d.niveau)}`],
          ['Contact', `${esc(d.telephone)} · ${esc(d.email)}`],
          ['Membres', esc(membres.join(', ') || 'Aucun')],
          ['Problème traité', esc(d.probleme)],
          ['Solution proposée', esc(d.solution)],
          ['Avancement · domaine', `${esc(d.avancement)} · ${esc(d.domaine)}`],
          ['Dossier (PDF)', link(d.dossierUrl, 'Télécharger le dossier')],
          ['Vidéo', video],
          ['Images', images.length ? images.map((u, i) => link(u, `Image ${i + 1}`)).join('<br>') : 'Aucune'],
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
<p>Notez-le, il vous sera demandé. Le jury évalue les dossiers du 21 décembre 2026 au 22 janvier 2027 ; les résultats de la présélection seront annoncés le 22 janvier.</p>
<p>Une question&nbsp;? Appelez le 694 88 23 94.</p>`,
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
