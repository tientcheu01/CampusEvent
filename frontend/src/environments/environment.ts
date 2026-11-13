export const environment = {
  production: true,
  apiUrl: '/api',
  uploadUrl: '/api/upload-url',
  // Ouvre /deposer hors période de dépôt (développement uniquement)
  devForceOpen: false,
  // Connecté au backend réel (mettre à true uniquement pour simuler sans backend)
  mockApi: false,
  // Domaine Plausible (ex. 'sji-innova.vercel.app'). Vide = aucune mesure, aucun script tiers.
  plausibleDomain: '',
};
