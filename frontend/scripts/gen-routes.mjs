// Génère, avant chaque build, la liste des routes à prérendre (routes.txt) et le sitemap.xml.
// Les fiches /projets/:slug viennent de public/assets/data/projets.json.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(readFileSync(join(root, 'src/environments/site.json'), 'utf8'));
const dataFile = join(root, 'public/assets/data/projets.json');
const projets = existsSync(dataFile) ? JSON.parse(readFileSync(dataFile, 'utf8')) : [];

const routes = [...site.routes, ...projets.map((p) => `/projets/${p.slug}`)];
writeFileSync(join(root, 'routes.txt'), routes.join('\n') + '\n');

const today = new Date().toISOString().slice(0, 10);
const urls = routes
  .map((r) => `  <url><loc>${site.url}${r === '/' ? '/' : r}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n');
writeFileSync(
  join(root, 'public/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
console.log(`gen-routes : ${routes.length} routes`);
