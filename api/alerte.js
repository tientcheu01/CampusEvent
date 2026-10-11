const { esc, cors, list, transporter, layout, rows, from } = require('./_lib/mail');

// Pas de base de données : chaque demande d'alerte est transmise au comité, qui prévient les inscrits le 16 novembre.
module.exports = async function handler(req, res) {
  if (cors(req, res)) return;
  try {
    const { email } = req.body || {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Adresse e-mail invalide' });

    const to = list(process.env.CONTACT_EMAILS || process.env.JURY_EMAILS);
    if (!to.length) return res.status(500).json({ error: 'Aucun destinataire configuré (CONTACT_EMAILS)' });

    const mailer = transporter();
    await mailer.verify();
    await mailer.sendMail({
      from: from(),
      to: to.join(', '),
      replyTo: email,
      subject: `[Alerte ouverture] ${email}`,
      html: layout("Demande d'alerte d'ouverture des dépôts", rows([['E-mail à prévenir le 16 novembre', esc(email)]])),
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erreur alerte:', error);
    return res.status(500).json({ error: "Erreur lors de l'enregistrement" });
  }
};
