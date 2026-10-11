// Point d'entrée SSR requis par le builder Angular ; le site est servi en statique (prérendu) sur Vercel.
// Pour tester le rendu serveur en local : node dist/frontend/server/server.mjs
import { CommonEngine } from '@angular/ssr';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './src/main.server';

const serverDist = dirname(fileURLToPath(import.meta.url));
const browserDist = resolve(serverDist, '../browser');
const engine = new CommonEngine();
const TYPES: Record<string, string> = { '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.pdf': 'application/pdf', '.ico': 'image/x-icon' };

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
  const file = join(browserDist, url.pathname);
  if (extname(url.pathname) && file.startsWith(browserDist) && existsSync(file)) {
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(readFileSync(file));
    return;
  }
  try {
    const html = await engine.render({ bootstrap, documentFilePath: join(serverDist, 'index.server.html'), url: url.href, publicPath: browserDist });
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } catch (e) {
    res.writeHead(500);
    res.end(String(e));
  }
}).listen(Number(process.env['PORT'] ?? 4000));
