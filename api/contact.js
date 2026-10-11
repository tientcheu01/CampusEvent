const nodemailer = require('nodemailer');

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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

  try {
    const { name, email, phone, subject, message } = req.body || {};

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Données manquantes (nom, email, sujet et message requis)' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();

    const recipients = (process.env.CONTACT_EMAILS || process.env.JURY_EMAILS || '')
      .split(',')
      .map(e => e.trim())
      .filter(Boolean);

    if (recipients.length === 0) {
      return res.status(500).json({ error: 'Aucun destinataire configuré (CONTACT_EMAILS ou JURY_EMAILS)' });
    }

    const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f4f4f9;">
      <div style="background: linear-gradient(135deg, #0D3B66 0%, #0a2d4d 100%); color: white; padding: 24px 32px;">
        <h1 style="margin: 0; font-size: 20px;">Nouveau message de contact — SJI INNOVA 2026</h1>
      </div>
      <div style="padding: 32px; background: white;">
        <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
        <p><strong>Email :</strong> ${escapeHtml(email)}</p>
        <p><strong>Téléphone :</strong> ${escapeHtml(phone || 'Non renseigné')}</p>
        <p><strong>Sujet :</strong> ${escapeHtml(subject)}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
      </div>
      <div style="background: #0D3B66; color: #ccc; padding: 16px 32px; text-align: center; font-size: 12px;">
        Message envoyé depuis le formulaire de contact du site SJI INNOVA 2026.
      </div>
    </div>
    `;

    const mailOptions = {
      from: `"SJI INNOVA 2026" <${process.env.FROM_EMAIL}>`,
      to: recipients.join(', '),
      replyTo: email,
      subject: `[Contact] ${subject} — ${name}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Message envoyé avec succès',
      messageId: info.messageId,
    });

  } catch (error) {
    console.error('Erreur envoi contact:', error);
    return res.status(500).json({
      error: 'Erreur lors de l\'envoi du message',
      details: error.message,
    });
  }
};
