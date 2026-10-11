const { esc, cors, list, transporter, layout, rows, from } = require('./_lib/mail');

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;
  try {
    const { nom, qualite, message, email } = req.body || {};
    if (!nom || !qualite || !message) return res.status(400).json({ error: 'Données manquantes (nom, qualité, message)' });

    const to = list(process.env.CONTACT_EMAILS || process.env.JURY_EMAILS);
    if (!to.length) return res.status(500).json({ error: 'Aucun destinataire configuré (CONTACT_EMAILS)' });

    const mailer = transporter();
    await mailer.verify();
    await mailer.sendMail({
      from: from(),
      to: to.join(', '),
      ...(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? { replyTo: email } : {}),
      subject: `[Contact] ${qualite} — ${nom}`,
      html: layout(
        'Nouveau message de contact',
        rows([
          ['Nom', esc(nom)],
          ['Qualité', esc(qualite)],
          ['Pour répondre', esc(email || 'Non renseigné')],
          ['Message', esc(message)],
        ]),
      ),
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erreur contact:', error);
    return res.status(500).json({ error: "Erreur lors de l'envoi du message" });
  }
};
