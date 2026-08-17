/*
 * Kin Score card — the share image for a provider detail page.
 *
 * One 1200x630 SVG per provider: the K'in sun, the provider's name, the
 * composite and its band, agent readiness, and all six facet values. Emitted as
 * an SVG string and rasterized by the caller, so the same function can render a
 * batch to disk today and serve a card live later without a second
 * implementation of the layout.
 *
 * ONE card serves both apis.io and providers.apievangelist.com, so the strip
 * carries the butterfly and the KIN SCORE wordmark and names no domain — a card
 * must never contradict whichever site it was shared from.
 *
 * The sun itself is NOT drawn here. It comes from ../glyph/kin-glyph.js, the
 * source of truth every surface draws from, so a card can never disagree with
 * the provider page or the embeddable badge.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { kinGlyph, FACETS, DIMENSIONS } from '../glyph/kin-glyph.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));

/* The lockup is dark-on-transparent, which is why the strip is white. Inlined
   as a data URI: resvg resolves no external hrefs, and a card that silently
   loses its branding is worse than one that fails to build. */
const BUTTERFLY = 'data:image/png;base64,' + fs.readFileSync(
  path.resolve(HERE, '../../api-evangelist-branding/api-evangelist-logo-butterfly.png')
).toString('base64');

/* All six composite bands. `thin` is easy to miss — it is 4,114 providers, and
   omitting it silently paints them with the fallback colour. Ordered worst to
   best; the ramp warms as the score rises, matching the ordinal palette's logic
   without borrowing the ray gold, which belongs to agent readiness alone. */
export const BAND_COLOR = {
  minimal: '#8b8f98',
  // Warm terracotta, NOT a warm grey. The first try (#9a7f86) was a hair off
  // minimal's cool grey, and those two adjacent bands are 15,613 providers —
  // 59% of the catalog sharing an accent that was supposed to distinguish them.
  thin: '#b5776b',
  emerging: '#d95926',
  developing: '#eda100',
  strong: '#3987e5',
  exemplar: '#1baf7a',
};

const FONT = 'Helvetica,Arial,sans-serif';
const CARD_W = 1200, CARD_H = 630;
const COL_X = 566;              // right column origin
const COL_W = 576;
const STRIP_Y = 548;            // top of the white strip — nothing may cross it

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

/* SVG has no auto-fit and resvg exposes no measurement, so advances are
   estimated. Deliberately runs slightly wide — overestimating shrinks text that
   would have fit, underestimating lets a name run off the card. */
const WIDE = new Set('MWmw@%'), NARROW = new Set("iljItfr .,:;'!|[]()");
export function textWidth(s, size, weight = 400) {
  let u = 0;
  for (const ch of s) {
    u += WIDE.has(ch) ? 0.90
      : NARROW.has(ch) ? 0.30
      : (ch === ch.toUpperCase() && ch !== ch.toLowerCase()) ? 0.68
      : 0.55;
  }
  return u * size * (weight >= 700 ? 1.05 : 1);
}

/* Provider names run to 77 characters ("National Institute of Arthritis and
   Musculoskeletal and Skin Diseases (NIAMS)") while the 99th percentile is 35.
   Shrinking alone takes the long tail below legibility, so try one line first
   and fall back to two.
   The name sits in a fixed box between the kicker and the accent rule, so each
   case gets its OWN size ceiling and its own baselines. A shared "centre the
   block" rule is what put the second line straight through the rule. */
const NAME_1_MAX = 76, NAME_1_MIN = 48, NAME_1_BASE = 158;
const NAME_2_MAX = 52, NAME_2_MIN = 28, NAME_2_BASE = 168;

function layoutName(name, maxW) {
  for (let size = NAME_1_MAX; size >= NAME_1_MIN; size -= 2) {
    if (textWidth(name, size, 800) <= maxW) {
      return { size, lines: [name], baselines: [NAME_1_BASE] };
    }
  }
  const words = name.split(/\s+/);
  const two = (size) => {
    // Break at the point leaving the two lines closest in length.
    let best = null;
    for (let i = 1; i < words.length; i++) {
      const a = words.slice(0, i).join(' '), b = words.slice(i).join(' ');
      const worst = Math.max(textWidth(a, size, 800), textWidth(b, size, 800));
      if (worst <= maxW && (!best || worst < best.worst)) best = { worst, lines: [a, b] };
    }
    return best;
  };
  for (let size = NAME_2_MAX; size >= NAME_2_MIN; size -= 2) {
    const best = words.length > 1 ? two(size) : null;
    if (best) {
      return { size, lines: best.lines,
        baselines: [NAME_2_BASE - size * 1.12, NAME_2_BASE] };
    }
  }
  /* Longer than two lines can hold at the floor size. Pack words greedily and
     ellipsize what is left over — an earlier character-level clip produced
     "National Institute of Arthritis an / d Musculoskeletal", and a name broken
     mid-word reads as a rendering bug. The full name is on the page anyway. */
  const size = NAME_2_MIN;
  const baselines = [NAME_2_BASE - size * 1.12, NAME_2_BASE];
  const lines = ['', ''];
  let li = 0;
  for (const word of words) {
    const next = lines[li] ? `${lines[li]} ${word}` : word;
    if (textWidth(next, size, 800) <= maxW) { lines[li] = next; continue; }
    if (li === 0) { li = 1; lines[1] = word; continue; }
    lines[1] += '…';
    break;
  }
  if (!lines[0]) {
    // A single token too wide even at the floor: nothing to break on.
    const per = Math.max(4, Math.floor(maxW / textWidth('n', size, 800)));
    return { size, lines: [name.slice(0, per), name.slice(per, per * 2 - 1) + '…'],
      baselines };
  }
  return { size, lines: lines.filter(Boolean), baselines: baselines.slice(-lines.filter(Boolean).length) };
}

/**
 * @param {{slug:string,name:string,composite:number,band:string,
 *          facets:Object,agent_score:number,agent_band:string,
 *          agent_dims:Object}} p
 * @returns {string} SVG
 */
export function card(p) {
  const accent = BAND_COLOR[p.band] || '#3098d8';
  const composite = Number(p.composite) || 0;
  const agentScore = Number(p.agent_score) || 0;

  const sun = kinGlyph(
    { name: p.name, score: composite, band: p.band, facets: p.facets,
      agent_score: agentScore, agent_band: p.agent_band, agent_dims: p.agent_dims },
    { size: 440, mode: 'dark', palette: 'facet', coreFill: '#0d1524' });
  // Strip the wrapper so the glyph composes into this card's coordinate space;
  // its own <title> goes with it, since the card states its own alt text.
  const sunInner = sun
    .replace(/^<svg[^>]*>/, '')
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<\/svg>$/, '');

  const { size: nameSize, lines: nameLines, baselines } = layoutName(p.name, COL_W - 16);

  const nameSvg = nameLines.map((line, i) =>
    `<text x="${COL_X}" y="${baselines[i].toFixed(1)}" ` +
    `font-family="${FONT}" font-size="${nameSize}" font-weight="800" ` +
    `fill="#ffffff">${esc(line)}</text>`).join('');

  // Three rows of two. Base 452 so the last row lands at 512, clear of the
  // strip at 548 — at the original base the third row rendered underneath it.
  const legend = FACETS.map((f, i) => {
    const x = COL_X + (i % 2) * 296;
    const y = 452 + ((i / 2) | 0) * 30;
    const v = Number(p.facets?.[f.id] ?? 0);
    return `<rect x="${x}" y="${y - 9}" width="11" height="11" rx="3" fill="${f.dark}"/>` +
      `<text x="${x + 20}" y="${y}" font-family="${FONT}" font-size="14" ` +
      `fill="#9aa6b6">${esc(f.label)}</text>` +
      `<text x="${x + 262}" y="${y}" font-family="${FONT}" font-size="14" ` +
      `font-weight="700" fill="#dfe6f0" text-anchor="end">${v.toFixed(0)}</text>`;
  }).join('');

  const scoreW = textWidth(composite.toFixed(1), 82, 800);
  const pillW = textWidth(p.band, 17, 700) + 40;

  const alt = `${p.name}: Kin Score ${composite.toFixed(1)} out of 100 (${p.band}), ` +
    `agent readiness ${agentScore.toFixed(1)} (${p.agent_band}).`;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \
width="${CARD_W}" height="${CARD_H}" viewBox="0 0 ${CARD_W} ${CARD_H}" role="img" aria-label="${esc(alt)}">
<title>${esc(alt)}</title>
<defs>
  <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
    <path d="M48 0H0v48" fill="none" stroke="#3098d8" stroke-opacity=".10" stroke-width="1"/>
  </pattern>
  <radialGradient id="glow" cx="42%" cy="46%" r="50%">
    <stop offset="0" stop-color="#3098d8" stop-opacity=".28"/>
    <stop offset=".34" stop-color="#3098d8" stop-opacity=".10"/>
    <stop offset=".62" stop-color="#080c14" stop-opacity="0"/>
  </radialGradient>
</defs>
<rect width="${CARD_W}" height="${CARD_H}" fill="#080c14"/>
<rect width="${CARD_W}" height="${CARD_H}" fill="url(#grid)"/>
<rect x="-60" y="-90" width="760" height="760" fill="url(#glow)"/>
<g transform="translate(74,58)">${sunInner}</g>
<text x="${COL_X}" y="64" font-family="${FONT}" font-size="19" font-weight="700" \
letter-spacing="3.8" fill="${accent}">KIN SCORE</text>
${nameSvg}
<rect x="${COL_X}" y="198" width="96" height="3" fill="${accent}"/>
<text x="${COL_X}" y="300" font-family="${FONT}" font-size="82" font-weight="800" \
fill="#ffffff">${composite.toFixed(1)}</text>
<text x="${(COL_X + scoreW + 12).toFixed(1)}" y="300" font-family="${FONT}" font-size="30" \
font-weight="600" fill="#7f8b9c">/100</text>
<rect x="${COL_X}" y="330" width="${pillW.toFixed(1)}" height="40" rx="20" fill="none" \
stroke="${accent}" stroke-width="2"/>
<text x="${(COL_X + pillW / 2).toFixed(1)}" y="357" font-family="${FONT}" font-size="17" \
font-weight="700" letter-spacing="2" fill="${accent}" text-anchor="middle">${esc(p.band.toUpperCase())}</text>
<text x="${COL_X}" y="410" font-family="${FONT}" font-size="19" fill="#8d99ab">Agent readiness \
<tspan font-weight="700" fill="#dea800">${agentScore.toFixed(1)}</tspan>  ·  ${esc(p.agent_band)}</text>
${legend}
<rect x="0" y="${STRIP_Y}" width="${CARD_W}" height="${CARD_H - STRIP_Y}" fill="#ffffff"/>
<image x="34" y="565" width="215" height="50" xlink:href="${BUTTERFLY}"/>
<text x="1166" y="596" font-family="${FONT}" font-size="18" font-weight="700" \
letter-spacing="2.4" fill="#1c2430" text-anchor="end">KIN SCORE</text>
<rect x="14" y="14" width="${CARD_W - 28}" height="${CARD_H - 28}" rx="3" fill="none" \
stroke="#e8edf5" stroke-opacity=".16" stroke-width="2"/>
</svg>`;
}

/* Positional decode of the badges.json compact encoding, for cross-checking a
   card against the shard the embeddable badges are served from. */
export function fromBadge(slug, b) {
  return {
    slug,
    name: b.n,
    composite: b.c,
    band: b.b,
    facets: Object.fromEntries(FACETS.map((f, i) => [f.id, b.f[i]])),
    agent_score: b.a,
    agent_band: b.ab,
    agent_dims: Object.fromEntries(DIMENSIONS.map((d, i) => [d.id, b.d[i]])),
  };
}
