#!/usr/bin/env node
/**
 * Emit the card index the sites read, and hand it to them.
 *
 * A provider page knows its own score, so it can guard its og:image on `page.score`
 * alone. An API detail page cannot: it carries `provider_slug` and nothing about
 * that provider's rating, and there are ~28k of them on apis.io plus the whole AE
 * store. Without an index those pages have to fall back to the generic site card —
 * which is exactly the "the best thing on the page never leaves the page" problem
 * the cards were built to fix, just one level down.
 *
 * So: after a card run, write slug -> {c, b} for every provider that ACTUALLY has a
 * card on disk, and copy it into the two sites whose detail pages need it. Derived
 * from the manifest and the PNGs, never from the provider frontmatter alone — the
 * index must promise a card that exists, not a card that should exist.
 *
 *   node emit-index.mjs            # write dist/kin-cards.json + distribute
 *   node emit-index.mjs --check    # report drift, write nothing
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extract } from './build-cards.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GH = path.resolve(HERE, '../../..');
const PROVIDERS = path.join(GH, 'api-search/providers/_providers');
const CARDS = path.join(HERE, 'dist/cards');
const OUT = path.join(HERE, 'dist/kin-cards.json');

// The sites whose detail pages carry `provider_slug` but no score of their own.
const TARGETS = [
  path.join(GH, 'api-search/apis/_data/kin_cards.json'),        // apis.io  /apis/*
  path.join(GH, 'api-evangelist/apis/_data/kin_cards.json'),    // apis.apievangelist.com
];

const check = process.argv.includes('--check');

if (!fs.existsSync(CARDS)) {
  console.error(`no cards at ${CARDS} — run build-cards.mjs first`);
  process.exit(1);
}
const have = new Set(
  fs.readdirSync(CARDS).filter((f) => f.endsWith('.png')).map((f) => f.slice(0, -4)),
);

const index = {};
let skipped = 0;
for (const file of fs.readdirSync(PROVIDERS)) {
  if (!file.endsWith('.md')) continue;
  const r = extract(path.join(PROVIDERS, file));
  if (!r) continue;
  if (!have.has(r.slug)) { skipped++; continue; }
  index[r.slug] = { c: r.composite, b: r.band };
}

const sorted = Object.fromEntries(Object.keys(index).sort().map((k) => [k, index[k]]));
const json = JSON.stringify(sorted) + '\n';
console.log(`indexed ${Object.keys(sorted).length} scored providers with a card` +
            (skipped ? ` (${skipped} scored but no card on disk — they fall back to the site card)` : ''));

let stale = 0;
for (const dest of [OUT, ...TARGETS]) {
  const cur = fs.existsSync(dest) ? fs.readFileSync(dest, 'utf8') : null;
  if (cur === json) continue;
  stale++;
  console.log(`  ${cur === null ? 'missing' : 'stale  '}  ${path.relative(GH, dest)}`);
  if (!check) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, json);
  }
}
if (!stale) { console.log('CARD INDEX — OK (every target current)'); process.exit(0); }
if (check) { console.log(`CARD INDEX — STALE (${stale}). Run node emit-index.mjs.`); process.exit(1); }
console.log(`CARD INDEX — wrote ${stale} file(s)`);
