import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { renderPages } from '../src/pages.mjs';

const root = resolve(import.meta.dirname, '..');
const site = JSON.parse(await readFile(resolve(root, 'content/site.json'), 'utf8'));
const articles = JSON.parse(await readFile(resolve(root, 'content/articles.json'), 'utf8'));
const pages = renderPages(site, articles);
let resources = 0;
for (const [file, expected] of Object.entries(pages)) {
  const actual = await readFile(resolve(root, file), 'utf8');
  assert.equal(actual, expected, `Página precisa ser regenerada: ${file}`);
  assert.equal(await readFile(resolve(root, 'dist', file), 'utf8'), actual, `Pacote desatualizado: ${file}`);
  assert.equal((actual.match(/<h1(?:\s|>)/g) || []).length, 1, `Exatamente um título principal: ${file}`);
  assert.match(actual, /<html lang="pt-BR">/);
  assert.match(actual, /<meta name="description" content="[^"]+">/);
  assert.match(actual, /<main id="conteudo">/);
  const ids = [...actual.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, `IDs duplicados: ${file}`);
  for (const [, href] of actual.matchAll(/\b(?:href|src)="([^"]*)"/g)) {
    assert.ok(href, `Link vazio em ${file}`);
    if (/^(https:|mailto:|tel:|data:)/.test(href)) continue;
    if (href === '/' && file === '404.html') continue; // Base de resolução da página de erro.
    const [path, hash] = href.split('#');
    const target = path ? resolve(root, dirname(file), path) : resolve(root, file);
    assert.ok((await stat(target)).isFile(), `Recurso ausente: ${file} → ${href}`);
    if (hash) assert.ok((await readFile(target, 'utf8')).includes(`id="${hash}"`), `Âncora ausente: ${file} → ${href}`);
    resources++;
  }
  for (const [, payload] of actual.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(payload);
  assert.ok(!/<(?:img|script)[^>]+src="https?:/.test(actual), `Recurso externo automático: ${file}`);
}
assert.equal(new Set(articles.map(a => a.slug)).size, articles.length, 'Slugs duplicados');
for (const a of articles) {
  assert.match(a.slug, /^[a-z0-9-]+$/);
  assert.ok(a.sections.length && a.sources.length, 'Artigo sem conteúdo ou fontes');
  for (const source of a.sources) assert.equal(new URL(source.url).protocol, 'https:');
}
const hash = createHash('sha256').update(await readFile(resolve(root, 'assets/images/laomax-selo-original.png'))).digest('hex');
const manifest = JSON.parse(await readFile(resolve(root, 'assets/manifest.json'), 'utf8'));
assert.equal(hash, manifest.logoOriginal.sha256, 'Logo original foi alterado');
async function compareAssets(path = 'assets') {
  for (const entry of await readdir(resolve(root, path), { withFileTypes: true })) {
    const relative = `${path}/${entry.name}`;
    if (entry.isDirectory()) await compareAssets(relative);
    else assert.deepEqual(await readFile(resolve(root, relative)), await readFile(resolve(root, 'dist', relative)), `Recurso desatualizado no pacote: ${relative}`);
  }
}
await compareAssets();
console.log(`OK: ${Object.keys(pages).length} páginas, ${resources} referências internas, âncoras, metadados, recursos do pacote e integridade do logo.`);
