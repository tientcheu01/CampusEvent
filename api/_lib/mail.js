const nodemailer = require('nodemailer');

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function cors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée' });
    return true;
  }
  return false;
}

const list = (v) => (v || '').split(',').map((e) => e.trim()).filter(Boolean);

function transporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

/** Gabarit commun : clair, filet tricolore, bleu nuit SJI INNOVA 2027. */
function layout(title, body) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#0a1f4d">
  <div style="height:4px;background:linear-gradient(90deg,#13a04a 33%,#d4262c 33% 66%,#f8a91b 66%)"></div>
  <div style="padding:28px 8px">
    <h1 style="font-size:22px;margin:0 0 20px">${esc(title)}</h1>${body}
    <p style="margin-top:32px;font-size:12px;color:#4a5e8a">SJI INNOVA 2027 · Saint Jean Ingénieur, campus d'Etok-Koss, Yaoundé</p>
  </div></div>`;
}

/** Les valeurs doivent déjà être échappées (ou contenir du HTML maîtrisé). */
const rows = (pairs) =>
  `<table style="width:100%;border-collapse:collapse">${pairs
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 10px;border:1px solid #dbe3f3;background:#f4f7fc;width:34%;font-weight:bold;vertical-align:top">${esc(k)}</td><td style="padding:8px 10px;border:1px solid #dbe3f3;white-space:pre-wrap">${v}</td></tr>`,
    )
    .join('')}</table>`;

const from = () => `"SJI INNOVA 2027" <${process.env.FROM_EMAIL}>`;

module.exports = { esc, cors, list, transporter, layout, rows, from };
