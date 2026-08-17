/*
 * Build a Kin Score card for every scored provider.
 *
 * Source of truth is api-search/providers/_providers/*.md — the frontmatter
 * `score.rb --write` actually writes. Reading the built site or the apis.io
 * badge shard instead would make the cards lag a rescore by a full rebuild.
 *
 * Only the four keys the card needs are lifted out of that frontmatter. A
 * full YAML parse of 26,926 files averaging 13 KB (one is 1.3 MB) costs minutes
 * for data we throw away, so this scans for four column-0 keys instead.
 *
 *   node build-cards.mjs [--only slug,slug] [--limit N] [--jobs N]
 *                        [--force] [--dry-run] [--out DIR]
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GH = path.resolve(HERE, '../../..');
const PROVIDERS = path.join(GH, 'api-search/providers/_providers');
const DELISTED = path.join(GH, 'api-search/network/_data/delisted.yml');
const OUT_DEFAULT = path.join(HERE, 'dist/cards');
const MANIFEST = path.join(HERE, 'manifest.json');

/* ---------- frontmatter extraction ------------------------------------- */

const unquote = (s) => {
  const t = s.trim();
  if ((t.startsWith("'") && t.endsWith("'")) || (t.startsWith('"') && t.endsWith('"'))) {
    return t.slice(1, -1);
  }
  return t;
};

/* YAML scalars as they appear in these blocks: numbers, booleans, and grade
   strings like `derived` / `verified` that the glyph turns into ray states. */
function scalar(raw) {
  const v = unquote(raw);
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v === '' || v === 'null' || v === '~') return null;
  const n = Number(v);
  return Number.isNaN(n) ? v : n;
}

/* Pull one column-0 block (`score:` / `agent_readiness:`) as nested objects,
   keyed by indent. Handles exactly the two-level shape those blocks have. */
function block(lines, start) {
  const out = {};
  let sub = null, subKey = null;
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (!/^\s/.test(line)) break;                 // back to column 0: block ended
    const m = /^(\s+)([\w.-]+):\s*(.*)$/.exec(line);
    if (!m) continue;
    const [, indent, key, rest] = m;
    if (indent.length <= 2) {
      if (rest === '') { sub = {}; subKey = key; out[key] = sub; }
      else { sub = null; subKey = null; out[key] = scalar(rest); }
    } else if (sub && subKey) {
      sub[key] = scalar(rest);
    }
  }
  return out;
}

export function extract(file) {
  const text = fs.readFileSync(file, 'utf8');
  if (!text.startsWith('---')) return null;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return null;
  const lines = text.slice(0, end).split('\n');

  let name = null, slug = null, score = null, ar = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s/.test(line)) continue;               // column 0 only — `- name:`
    if (line.startsWith('name:')) name ??= unquote(line.slice(5));
    else if (line.startsWith('slug:')) slug ??= unquote(line.slice(5));
    else if (line.startsWith('score:')) score ??= block(lines, i);
    else if (line.startsWith('agent_readiness:')) ar ??= block(lines, i);
  }

  slug ||= path.basename(file, '.md');
  if (!name || !score || typeof score.composite !== 'number' || !score.band) return null;

  return {
    slug,
    name,
    composite: score.composite,
    band: score.band,
    facets: score.facets || {},
    scored_at: String(score.scored_at ?? ''),
    schema_version: String(score.schema_version ?? ''),
    agent_score: ar?.score ?? 0,
    agent_band: ar?.band ?? 'human-only',
    agent_dims: ar?.dimensions || {},
  };
}

/* Delisted providers must never get a generated share card. Read as text —
   pulling in a YAML dependency for a 12-entry allow/deny list is not worth it,
   and the file's shape is a flat list of `- slug:` entries. */
function delistedSlugs() {
  if (!fs.existsSync(DELISTED)) return new Set();
  const out = new Set();
  for (const line of fs.readFileSync(DELISTED, 'utf8').split('\n')) {
    const m = /^\s*-?\s*slug:\s*(.+)$/.exec(line);
    if (m) out.add(unquote(m[1]));
  }
  return out;
}

const fingerprint = (r) => crypto.createHash('sha1').update(JSON.stringify([
  r.name, r.composite, r.band, r.facets, r.agent_score, r.agent_band, r.agent_dims,
])).digest('hex').slice(0, 16);

/* ---------- worker ------------------------------------------------------ */

if (!isMainThread) {
  const { records, out } = workerData;
  const { card } = await import('./render-card.mjs');
  const { Resvg } = await import('@resvg/resvg-js');
  const failures = [];
  let bytes = 0;
  for (const r of records) {
    try {
      const png = new Resvg(card(r), { fitTo: { mode: 'width', value: 1200 } })
        .render().asPng();
      fs.writeFileSync(path.join(out, `${r.slug}.png`), png);
      bytes += png.length;
    } catch (e) {
      failures.push({ slug: r.slug, error: String(e.message || e) });
    }
  }
  parentPort.postMessage({ bytes, failures });
}

/* ---------- main -------------------------------------------------------- */

/* Gate the CLI on this file being the entry point, not merely on isMainThread —
   verify-cards.mjs imports `extract` from here, and on isMainThread alone that
   import silently kicked off a full 26k-card build. */
const IS_ENTRY = isMainThread
  && process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (IS_ENTRY) {
  const argv = process.argv.slice(2);
  const flag = (n, d = null) => {
    const i = argv.indexOf(n);
    return i === -1 ? d : argv[i + 1];
  };
  const has = (n) => argv.includes(n);

  const only = flag('--only') ? new Set(flag('--only').split(',')) : null;
  const limit = Number(flag('--limit', 0)) || 0;
  const jobs = Number(flag('--jobs', 0)) || Math.max(1, os.cpus().length - 2);
  const out = path.resolve(flag('--out', OUT_DEFAULT));
  const force = has('--force');
  const dryRun = has('--dry-run');
  /* Stamp the manifest from the PNGs already on disk, rendering nothing. The
     recovery path for a manifest that went missing or got truncated — without
     it the only way back is re-rendering 4.3 GB to reproduce files that are
     already correct. */
  const reconcile = has('--reconcile');

  const t0 = Date.now();
  const skipped = delistedSlugs();
  let files = fs.readdirSync(PROVIDERS).filter((f) => f.endsWith('.md'));
  if (only) files = files.filter((f) => only.has(path.basename(f, '.md')));

  const records = [];
  let unscored = 0, delisted = 0;
  for (const f of files) {
    const r = extract(path.join(PROVIDERS, f));
    if (!r) { unscored++; continue; }
    if (skipped.has(r.slug)) { delisted++; continue; }
    records.push(r);
    if (limit && records.length >= limit) break;
  }
  console.log(`scanned ${files.length} providers in ${((Date.now() - t0) / 1000).toFixed(1)}s ` +
    `— ${records.length} scored, ${unscored} unscored, ${delisted} delisted`);

  /* ALWAYS load the manifest. `force` decides what gets re-rendered, never
     whether the record is read: starting from an empty manifest under --force
     means a `--force --only <subset>` run rewrites the file with only that
     subset, silently discarding every other provider's entry. That turned a
     4,114-card re-render into a lost record of the other 22,456, and the next
     ordinary run tried to rebuild them all. */
  const manifest = fs.existsSync(MANIFEST)
    ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : { cards: {} };
  manifest.cards ||= {};

  fs.mkdirSync(out, { recursive: true });

  if (reconcile) {
    let stamped = 0, absent = 0;
    for (const r of records) {
      if (fs.existsSync(path.join(out, `${r.slug}.png`))) {
        manifest.cards[r.slug] = { fp: fingerprint(r), scored_at: r.scored_at };
        stamped++;
      } else absent++;
    }
    manifest.generated_at = new Date().toISOString();
    manifest.count = Object.keys(manifest.cards).length;
    fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
    console.log(`reconciled — ${stamped} cards on disk stamped, ${absent} still missing`);
    console.log(`manifest now holds ${manifest.count}`);
    process.exit(0);
  }

  const todo = records.filter((r) => {
    const prev = manifest.cards[r.slug];
    return force || !prev || prev.fp !== fingerprint(r)
      || !fs.existsSync(path.join(out, `${r.slug}.png`));
  });
  console.log(`${todo.length} to render, ${records.length - todo.length} unchanged`);

  if (dryRun || !todo.length) {
    console.log(dryRun ? 'dry run — nothing written' : 'nothing to do');
    process.exit(0);
  }

  const t1 = Date.now();
  const shards = Array.from({ length: jobs }, () => []);
  todo.forEach((r, i) => shards[i % jobs].push(r));

  const results = await Promise.all(shards.filter((s) => s.length).map((records) =>
    new Promise((resolve, reject) => {
      const w = new Worker(fileURLToPath(import.meta.url), { workerData: { records, out } });
      w.on('message', resolve);
      w.on('error', reject);
    })));

  const failures = results.flatMap((r) => r.failures);
  const bytes = results.reduce((a, r) => a + r.bytes, 0);
  const done = new Set(todo.map((r) => r.slug));
  for (const f of failures) done.delete(f.slug);

  for (const r of records) {
    if (done.has(r.slug) || manifest.cards[r.slug]) {
      manifest.cards[r.slug] = { fp: fingerprint(r), scored_at: r.scored_at };
    }
  }
  manifest.generated_at = new Date().toISOString();
  manifest.count = Object.keys(manifest.cards).length;
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

  const secs = (Date.now() - t1) / 1000;
  console.log(`rendered ${done.size} cards in ${secs.toFixed(1)}s ` +
    `(${(secs * 1000 / Math.max(1, done.size)).toFixed(0)}ms each, ` +
    `${(bytes / 1e9).toFixed(2)} GB, avg ${(bytes / Math.max(1, done.size) / 1024).toFixed(0)} KB)`);
  if (failures.length) {
    console.error(`${failures.length} FAILED:`);
    for (const f of failures.slice(0, 20)) console.error(`  ${f.slug}: ${f.error}`);
    process.exitCode = 1;
  }
}
