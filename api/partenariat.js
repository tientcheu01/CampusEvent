const { esc, cors, list, transporter, layout, rows, from } = require('./_lib/mail');

const REQUIRED = ['structure', 'representant', 'fonction', 'telephone', 'email', 'formule', 'contribution'];

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;
  try {
    const d = req.body || {};
    const missing = REQUIRED.filter((k) => !d[k] || !String(d[k]).trim());
    if (missing.length) return res.status(400).json({ error: `Champs manquants : ${missing.join(', ')}` });

    const to = list(process.env.PARTNER_EMAILS || process.env.CONTACT_EMAILS || process.env.JURY_EMAILS);
    if (!to.length) return res.status(500).json({ error: 'Aucun destinataire configuré (PARTNER_EMAILS)' });

    const mailer = transporter();
    await mailer.verify();
    await mailer.sendMail({
      from: from(),
      to: to.join(', '),
      replyTo: d.email,
      subject: `Bulletin d'engagement — ${d.structure} (${d.formule})`,
      html: layout(
        "Nouveau bulletin d'engagement partenaire",
        rows([
          ['Structure', esc(d.structure)],
          ['Représentant', esc(d.representant)],
          ['Fonction', esc(d.fonction)],
          ['Téléphone', esc(d.telephone)],
          ['E-mail', esc(d.email)],
          ['Formule souhaitée', esc(d.formule)],
          ['Nature de la contribution', esc(d.contribution)],
        ]),
      ),
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erreur partenariat:', error);
    return res.status(500).json({ error: "Erreur lors de l'envoi du bulletin" });
  }
};
