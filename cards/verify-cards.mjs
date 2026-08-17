/*
 * Cross-check what the cards say against what the live badges say.
 *
 * The cards read provider frontmatter directly; apis.io's embeddable badges are
 * served from badges.json, built by apis-io-aws/index-builder. Two readers of
 * the same source, so a disagreement means one of them drifted — and a card
 * that contradicts the badge on the same provider's page is the worst possible
 * failure of this feature.
 *
 *   node verify-cards.mjs [--sample N] [--all]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extract } from './build-cards.mjs';
import { fromBadge } from './render-card.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GH = path.resolve(HERE, '../../..');
const PROVIDERS = path.join(GH, 'api-search/providers/_providers');
const BADGES = path.join(GH, 'apis-io-aws/lambdas/badge/data/badges.json');

const argv = process.argv.slice(2);
const sample = Number(argv[argv.indexOf('--sample') + 1]) || 250;
const all = argv.includes('--all');

const shard = JSON.parse(fs.readFileSync(BADGES, 'utf8'));
console.log(`badges.json: ${shard.count} providers, built ${shard.generated_at}, ` +
  `rubric ${shard.schema_version}`);

let slugs = Object.keys(shard.providers);
if (!all) {
  // Evenly spaced rather than the first N, so the sample isn't all "0"-prefixed.
  const step = Math.max(1, Math.floor(slugs.length / sample));
  slugs = slugs.filter((_, i) => i % step === 0).slice(0, sample);
}

const near = (a, b) => Math.abs(Number(a) - Number(b)) < 0.05;
const diffs = [];
let checked = 0, missing = 0;

for (const slug of slugs) {
  const file = path.join(PROVIDERS, `${slug}.md`);
  if (!fs.existsSync(file)) { missing++; continue; }
  const mine = extract(file);
  if (!mine) { missing++; continue; }
  const theirs = fromBadge(slug, shard.providers[slug]);
  checked++;

  const bad = [];
  if (mine.name !== theirs.name) bad.push(`name ${mine.name!==theirs.name?`"${mine.name}" vs "${theirs.name}"`:''}`);
  if (!near(mine.composite, theirs.composite)) bad.push(`composite ${mine.composite} vs ${theirs.composite}`);
  if (mine.band !== theirs.band) bad.push(`band ${mine.band} vs ${theirs.band}`);
  if (!near(mine.agent_score, theirs.agent_score)) bad.push(`agent ${mine.agent_score} vs ${theirs.agent_score}`);
  if (mine.agent_band !== theirs.agent_band) bad.push(`agent_band ${mine.agent_band} vs ${theirs.agent_band}`);
  for (const [k, v] of Object.entries(theirs.facets)) {
    if (!near(mine.facets[k] ?? 0, v)) bad.push(`${k} ${mine.facets[k]} vs ${v}`);
  }
  if (bad.length) diffs.push({ slug, bad });
}

console.log(`checked ${checked} providers (${missing} not present as scored .md files)`);
if (!diffs.length) {
  console.log('PASS — every card agrees with its badge on name, composite, band, facets and agent readiness');
} else {
  console.log(`FAIL — ${diffs.length} disagree:`);
  for (const d of diffs.slice(0, 25)) console.log(`  ${d.slug}: ${d.bad.join('; ')}`);
  process.exitCode = 1;
}
