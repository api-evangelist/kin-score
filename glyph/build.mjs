/*
 * Builds the distributable browser bundle from kin-glyph.js.
 *
 *   node build.mjs
 *
 * Output: dist/kin-glyph.js — a classic <script> (no module, no build step at
 * the consuming site) that exposes window.KinGlyph and auto-renders every
 * element carrying data-kin-glyph on DOMContentLoaded.
 *
 * Consuming sites copy dist/kin-glyph.js into their own assets and emit:
 *
 *   <span data-kin-glyph
 *         data-size="72"
 *         data-mode="light"
 *         data-score="75.6" data-band="exemplar"
 *         data-agent-score="78" data-agent-band="agent-native"
 *         data-facets='{"discoverability":67.5, ...}'
 *         data-dims='{"spec_presence":true, ...}'></span>
 *
 * Nothing else is required. Re-render after a DOM update with
 * KinGlyph.renderAll(root).
 */
import fs from 'fs';

const src = fs.readFileSync('./kin-glyph.js', 'utf8').replace(/^export /gm, '');

const bundle = `/*! Kin Score glyph — the K'in sun.
 *  Generated from kin-glyph.js by build.mjs. Do not edit here.
 *  Canonical source: api-evangelist/kin-score/glyph/
 *  Spec: api-evangelist/kin-score/glyph/GLYPH.md
 */
(function (root) {
  'use strict';

${src}

  function parseJSONAttr(el, name) {
    const raw = el.getAttribute(name);
    if (!raw) return {};
    try { return JSON.parse(raw); } catch (e) { return {}; }
  }

  /* Facets accept either a keyed object or a COMPACT array in FACETS order:
       data-facets='[67.5,61.8,73.7,94.7,84.8,76.3]'
     The compact form exists because the apis.io listing payload carries every
     provider in the network — keyed objects doubled that file. */
  function readFacets(el) {
    const v = parseJSONAttr(el, 'data-facets');
    if (!Array.isArray(v)) return v;
    const out = {};
    for (let i = 0; i < FACETS.length; i++) out[FACETS[i].id] = Number(v[i]) || 0;
    return out;
  }

  /* Dimensions accept a keyed object or a COMPACT bitstring in DIMENSIONS
     order, '1' = satisfied:  data-dims='110100101010' */
  function readDims(el) {
    const raw = el.getAttribute('data-dims');
    if (raw && /^[01]+$/.test(raw.trim())) {
      const bits = raw.trim(), out = {};
      for (let i = 0; i < DIMENSIONS.length; i++) out[DIMENSIONS[i].id] = bits.charAt(i) === '1';
      return out;
    }
    return parseJSONAttr(el, 'data-dims');
  }

  /** Render one placeholder element in place. */
  function render(el) {
    if (el.getAttribute('data-kin-rendered') === '1') return;
    const p = {
      name:        el.getAttribute('data-name') || '',
      score:       parseFloat(el.getAttribute('data-score') || '0') || 0,
      band:        el.getAttribute('data-band') || null,
      agent_score: parseFloat(el.getAttribute('data-agent-score') || '0') || 0,
      agent_band:  el.getAttribute('data-agent-band') || 'human-only',
      facets:      readFacets(el),
      agent_dims:  readDims(el),
    };
    const size = parseInt(el.getAttribute('data-size') || '72', 10);
    const mode = el.getAttribute('data-mode') ||
      (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
    el.innerHTML = kinGlyph(p, {
      size: size,
      mode: mode,
      palette: el.getAttribute('data-palette') || 'facet',
      showRays: el.getAttribute('data-rays') !== 'false',
      coreFill: el.getAttribute('data-core-fill') || undefined,
    });
    el.setAttribute('data-kin-rendered', '1');
  }

  function renderAll(scope) {
    const nodes = (scope || document).querySelectorAll('[data-kin-glyph]');
    for (let i = 0; i < nodes.length; i++) render(nodes[i]);
    return nodes.length;
  }

  root.KinGlyph = {
    render: render,
    renderAll: renderAll,
    svg: kinGlyph,
    FACETS: FACETS,
    DIMENSIONS: DIMENSIONS,
    BANDS: BANDS,
    PALETTES: PALETTES,
    RAYS: RAYS,
    bandOf: bandOf,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { renderAll(); });
  } else {
    renderAll();
  }
})(typeof window !== 'undefined' ? window : globalThis);
`;

// Fail loudly rather than ship a bundle that cannot parse.
try {
  new Function(bundle);
} catch (err) {
  console.error('BUILD FAILED — bundle does not parse: ' + err.message);
  process.exit(1);
}

fs.mkdirSync('./dist', { recursive: true });
fs.writeFileSync('./dist/kin-glyph.js', bundle);
console.log('wrote dist/kin-glyph.js —', (bundle.length / 1024).toFixed(1) + 'KB (parses)');
