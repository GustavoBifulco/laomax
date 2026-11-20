import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { renderPages } from '../src/pages.mjs';

const root = resolve(import.meta.dirname, '..');
const site = JSON.parse(await readFile(resolve(root, 'content/site.json'), 'utf8'));
const articles = JSON.parse(await readFile(resolve(root, 'content/articles.json'), 'utf8'));
for (const field of ['url', 'instagram', 'selection']) if (!(field in site)) throw new Error(`Campo ausente: ${field}`);
for (const value of [site.url, site.instagram, site.selection.url, site.selection.noticeUrl, site.statuteUrl, ...site.partners.map(p => p.url), ...site.events.map(e => e.url)]) {
  if (value && !/^https:\/\//.test(value)) throw new Error('Links públicos devem começar com https://');
}
if (site.selection.open && (!site.selection.url || !Number.isFinite(Date.parse(site.selection.closesAt)))) throw new Error('Seleção aberta exige URL e closesAt com prazo válido.');
for (const event of site.events) {
  if (!/^[a-z0-9-]+$/.test(event.id)) throw new Error('ID do evento inválido');
  if (!['Ensino', 'Pesquisa', 'Extensão'].includes(event.category)) throw new Error('Categoria de evento inválida');
  if (!Number.isFinite(Date.parse(event.start)) || !Number.isFinite(Date.parse(event.end)) || new Date(event.end) <= new Date(event.start)) throw new Error('Datas de evento inválidas');
}
const pages = renderPages(site, articles);
await rm(resolve(root, 'dist'), { recursive: true, force: true });
await mkdir(resolve(root, 'dist'), { recursive: true });
for (const [file, html] of Object.entries(pages)) {
  await writeFile(resolve(root, file), html);
  await writeFile(resolve(root, 'dist', file), html);
}
for (const file of ['assets', 'robots.txt', 'CNAME', '_headers', '.htaccess']) await cp(resolve(root, file), resolve(root, 'dist', file), { recursive: true });
const origin = site.url ? new URL(site.url).origin : '';
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${origin ? Object.keys(pages).filter(p => p !== '404.html').map(p => `<url><loc>${origin}/${p === 'index.html' ? '' : p}</loc></url>`).join('') : ''}</urlset>\n`;
await writeFile(resolve(root, 'sitemap.xml'), xml);
await writeFile(resolve(root, 'dist/sitemap.xml'), xml);
console.log(`${Object.keys(pages).length} páginas geradas. Arquivos para hospedagem em dist/.`);
if (!origin) console.log('Domínio ainda não informado: sitemap sem URLs e sem canonical fictício.');
