// roadmap#1152: a card rendered before a takedown must be withdrawn from dist/ and the
// manifest, not merely skipped on the next render. Run: node test-withdraw-delisted.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { delistedSlugs, withdrawDelisted } from './build-cards.mjs';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cards-'));
const out = path.join(tmp, 'cards');
fs.mkdirSync(out);
for (const s of ['live-co', 'gone-co', 'restricted-co']) fs.writeFileSync(path.join(out, `${s}.png`), 'x');
const reg = path.join(tmp, 'delisted.yml');
fs.writeFileSync(reg, "- slug: gone-co\n  scope: full\n- slug: 'restricted-co'\n  scope: restricted\n- slug: manifest-only\n");
const manifest = { cards: { 'live-co': {}, 'gone-co': {}, 'restricted-co': {}, 'manifest-only': {} } };

const skipped = delistedSlugs(reg);
assert.deepEqual([...skipped].sort(), ['gone-co', 'manifest-only', 'restricted-co']);

// dry run removes nothing
const would = withdrawDelisted(out, manifest, skipped, true);
assert.deepEqual(would, ['gone-co', 'manifest-only', 'restricted-co']);
assert.ok(fs.existsSync(path.join(out, 'gone-co.png')));
assert.ok(manifest.cards['gone-co']);
console.log('ok   dry run reports the withdrawals and removes nothing');

const did = withdrawDelisted(out, manifest, skipped);
assert.deepEqual(did, would);
assert.deepEqual(fs.readdirSync(out), ['live-co.png']);
assert.deepEqual(Object.keys(manifest.cards), ['live-co']);
console.log('ok   delisted cards leave dist/ and the manifest, whatever their scope');
console.log('ok   a live provider\'s card is untouched');

assert.deepEqual(withdrawDelisted(out, manifest, skipped), []);
console.log('ok   a second run is a no-op');
fs.rmSync(tmp, { recursive: true });
