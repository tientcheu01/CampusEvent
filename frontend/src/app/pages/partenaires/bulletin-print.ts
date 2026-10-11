import { PartenariatPayload } from '../../core/models/api.model';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Bulletin d'engagement pré-rempli, prêt à être signé : ouvert dans un onglet, imprimé ou enregistré en PDF
 * depuis la boîte de dialogue du navigateur (aucune bibliothèque PDF embarquée).
 */
export function openBulletin(data: PartenariatPayload): void {
  const rows: [string, string][] = [
    ['Structure', data.structure],
    ['Représentant', data.representant],
    ['Fonction', data.fonction],
    ['Téléphone', data.telephone],
    ['E-mail', data.email],
    ['Formule souhaitée', data.formule],
    ['Nature de la contribution', data.contribution],
  ];
  const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Bulletin d'engagement · SJI INNOVA 2027</title>
<style>
  @page { margin: 22mm 18mm; }
  body { font: 14px/1.6 system-ui, 'Segoe UI', Arial, sans-serif; color: #0a1f4d; }
  .bar { height: 4px; background: linear-gradient(90deg,#13a04a 0 33.3%,#d4262c 33.3% 66.6%,#f8a91b 66.6%); margin-bottom: 28px; }
  h1 { font-size: 26px; margin: 0 0 4px; letter-spacing: -.02em; }
  .sub { color: #4a5e8a; margin: 0 0 28px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 36px; }
  th, td { text-align: left; padding: 10px 12px; border: 1px solid rgba(10,31,77,.2); vertical-align: top; }
  th { width: 34%; font-weight: 600; background: #f4f7fc; }
  .sign { display: flex; gap: 48px; margin-top: 56px; }
  .sign div { flex: 1; border-top: 1px solid #0a1f4d; padding-top: 8px; color: #4a5e8a; }
  .note { margin-top: 36px; font-size: 12px; color: #4a5e8a; }
</style></head><body>
<div class="bar"></div>
<h1>Bulletin d'engagement partenaire</h1>
<p class="sub">SJI INNOVA 2027 · 2ᵉ édition · Saint Jean Ingénieur, campus d'Etok-Koss, Yaoundé</p>
<table>${rows.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</table>
<p>Fait le ${date}.</p>
<div class="sign"><div>Signature du partenaire</div><div>Pour Saint Jean Ingénieur</div></div>
<p class="note">Contreparties indicatives, ajustables avec le comité d'organisation. Merci de retourner ce bulletin signé à info@saintjeaningenieur.org ou par WhatsApp au 694 88 23 94.</p>
<script>window.addEventListener('load', function () { setTimeout(function () { window.print(); }, 250); });</script>
</body></html>`;
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
}
