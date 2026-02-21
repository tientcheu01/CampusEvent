const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // CORS headers
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
    const data = req.body;

    if (!data || !data.titre_projet || !data.porteurs) {
      return res.status(400).json({ error: 'Données manquantes (titre_projet, porteurs requis)' });
    }

    // Configuration SMTP depuis les variables d'environnement
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: false, // true pour 465, false pour 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Vérifier la connexion SMTP
    await transporter.verify();

    // Construire la liste des destinataires (jury)
    const juryEmails = (process.env.JURY_EMAILS || '')
      .split(',')
      .map(e => e.trim())
      .filter(Boolean);

    if (juryEmails.length === 0) {
      return res.status(500).json({ error: 'Aucun email de jury configuré (JURY_EMAILS)' });
    }

    // Formater les impacts cochés
    const impacts = [];
    if (data.impact_social) impacts.push('Social');
    if (data.impact_economique) impacts.push('Économique');
    if (data.impact_environnemental) impacts.push('Environnemental');
    if (data.impact_academique) impacts.push('Académique');
    if (data.impact_technologique) impacts.push('Technologique');

    // Formater les éléments joints cochés
    const elementsJoints = [];
    if (data.joint_ppt) elementsJoints.push('Présentation PowerPoint');
    if (data.joint_video) elementsJoints.push('Vidéo explicative');
    if (data.joint_maquette) elementsJoints.push('Maquette / Prototype');
    if (data.joint_plan_tech) elementsJoints.push('Plan technique');
    if (data.joint_plan_financier) elementsJoints.push('Plan financier');
    if (data.joint_plan_admin) elementsJoints.push('Plan administratif');
    if (data.joint_autres) elementsJoints.push('Autres : ' + data.joint_autres);

    // Liens fichiers uploadés
    const fichiersUrls = data.fichiers_urls || 'Aucun fichier';

    // Construire le HTML de l'email
    const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 700px; margin: 0 auto; background: #f4f4f9; padding: 0;">
      
      <!-- En-tête -->
      <div style="background: linear-gradient(135deg, #0D3B66 0%, #0a2d4d 100%); color: white; padding: 30px 40px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;"> Nouvelle Candidature — SJI INNOVA 2026</h1>
        <p style="margin: 8px 0 0; color: #F4D35E; font-size: 14px;">Soumise le ${data.date_signature || new Date().toLocaleDateString('fr-FR')}</p>
      </div>

      <div style="padding: 30px 40px; background: white;">

        <!-- Section 1 : Informations générales -->
        <table style="width:100%; border-collapse: collapse; margin-bottom: 25px;">
          <tr style="background: #0D3B66; color: white;">
            <td colspan="2" style="padding: 10px 15px; font-weight: bold; font-size: 15px; border-radius: 6px 6px 0 0;">
               1. Informations générales
            </td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 10px 15px; font-weight: 600; width: 35%; border-bottom: 1px solid #eee;">Titre du projet</td>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee;">${escapeHtml(data.titre_projet)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #eee;">Porteur(s)</td>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee;">${escapeHtml(data.porteurs)}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #eee;">Participation</td>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee;">${escapeHtml(data.participation || '')}${data.nombre_membres ? ' (' + escapeHtml(data.nombre_membres) + ' membres)' : ''}</td>
          </tr>
          <tr>
            <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #eee;">Encadreur</td>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee;">${escapeHtml(data.encadreur || 'Non spécifié')}</td>
          </tr>
        </table>

        <!-- Section 2 : Problématique -->
        <table style="width:100%; border-collapse: collapse; margin-bottom: 25px;">
          <tr style="background: #EE6C4D; color: white;">
            <td colspan="2" style="padding: 10px 15px; font-weight: bold; font-size: 15px; border-radius: 6px 6px 0 0;">
               2. Problématique
            </td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 10px 15px; font-weight: 600; width: 35%; border-bottom: 1px solid #eee;">Problématique</td>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee; white-space: pre-wrap;">${escapeHtml(data.problematique || '')}</td>
          </tr>
          <tr>
            <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #eee;">Objectif général</td>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee;">${escapeHtml(data.objectif_general || '')}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #eee;">Objectifs spécifiques</td>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee;">
              ${data.objectif_spec1 ? '1. ' + escapeHtml(data.objectif_spec1) + '<br>' : ''}
              ${data.objectif_spec2 ? '2. ' + escapeHtml(data.objectif_spec2) + '<br>' : ''}
              ${data.objectif_spec3 ? '3. ' + escapeHtml(data.objectif_spec3) : ''}
            </td>
          </tr>
        </table>

        <!-- Section 3 : Solution -->
        <table style="width:100%; border-collapse: collapse; margin-bottom: 25px;">
          <tr style="background: #F4D35E; color: #0D3B66;">
            <td colspan="2" style="padding: 10px 15px; font-weight: bold; font-size: 15px; border-radius: 6px 6px 0 0;">
               3. Solution proposée
            </td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 10px 15px; font-weight: 600; width: 35%; border-bottom: 1px solid #eee;">Principe de fonctionnement</td>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee; white-space: pre-wrap;">${escapeHtml(data.principe_fonctionnement || '')}</td>
          </tr>
          <tr>
            <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #eee;">Innovation apportée</td>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee; white-space: pre-wrap;">${escapeHtml(data.innovation_apportee || '')}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #eee;">Caractère innovant</td>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee; white-space: pre-wrap;">${escapeHtml(data.caractere_innovant || '')}</td>
          </tr>
        </table>

        <!-- Section 4 : Faisabilité -->
        <table style="width:100%; border-collapse: collapse; margin-bottom: 25px;">
          <tr style="background: #0D3B66; color: white;">
            <td colspan="2" style="padding: 10px 15px; font-weight: bold; font-size: 15px; border-radius: 6px 6px 0 0;">
               4. Faisabilité & Impacts
            </td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 10px 15px; font-weight: 600; width: 35%; border-bottom: 1px solid #eee;">Faisabilité technique</td>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee; white-space: pre-wrap;">${escapeHtml(data.faisabilite_technique || 'Non renseigné')}</td>
          </tr>
          <tr>
            <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #eee;">Faisabilité opérationnelle</td>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee; white-space: pre-wrap;">${escapeHtml(data.faisabilite_operationnelle || 'Non renseigné')}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #eee;">Impacts attendus</td>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee;">${impacts.length > 0 ? impacts.join(', ') : 'Aucun sélectionné'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #eee;">Description des impacts</td>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee; white-space: pre-wrap;">${escapeHtml(data.description_impacts || 'Non renseigné')}</td>
          </tr>
        </table>

        <!-- Section 5 : Fichiers et engagement -->
        <table style="width:100%; border-collapse: collapse; margin-bottom: 25px;">
          <tr style="background: #EE6C4D; color: white;">
            <td colspan="2" style="padding: 10px 15px; font-weight: bold; font-size: 15px; border-radius: 6px 6px 0 0;">
               5. Pièces jointes & Engagement
            </td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 10px 15px; font-weight: 600; width: 35%; border-bottom: 1px solid #eee;">Éléments joints</td>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee;">${elementsJoints.length > 0 ? elementsJoints.join(', ') : 'Aucun élément coché'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #eee;">Fichiers uploadés</td>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee;">
              ${formatFileUrls(fichiersUrls)}
            </td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 10px 15px; font-weight: 600; border-bottom: 1px solid #eee;">Date de signature</td>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eee;">${escapeHtml(data.date_signature || 'Non renseignée')}</td>
          </tr>
        </table>

      </div>

      <!-- Pied de page -->
      <div style="background: #0D3B66; color: #ccc; padding: 20px 40px; text-align: center; font-size: 12px; border-radius: 0 0 6px 6px;">
        <p style="margin: 0;">SJI INNOVA 2026 — Système automatique de notification</p>
        <p style="margin: 4px 0 0; color: #F4D35E;">Cet email a été envoyé automatiquement depuis le formulaire de candidature.</p>
      </div>

    </div>
    `;

    // Envoyer l'email aux jurés
    const mailOptions = {
      from: `"SJI INNOVA 2026" <${process.env.FROM_EMAIL}>`,
      to: juryEmails.join(', '),
      subject: ` Nouvelle candidature — ${data.titre_projet} — SJI INNOVA 2026`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email envoyé avec succès:', info.messageId);

    return res.status(200).json({
      success: true,
      message: 'Candidature envoyée avec succès',
      messageId: info.messageId,
    });

  } catch (error) {
    console.error('Erreur envoi email:', error);
    return res.status(500).json({
      error: 'Erreur lors de l\'envoi de l\'email',
      details: error.message,
    });
  }
};

// Utilitaires
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatFileUrls(urls) {
  if (!urls || urls === 'Aucun fichier') return 'Aucun fichier';
  return urls
    .split('\n')
    .filter(Boolean)
    .map((url, i) => `<a href="${escapeHtml(url)}" style="color: #EE6C4D; font-weight: 600;">📄 Fichier ${i + 1}</a>`)
    .join('<br>');
}
