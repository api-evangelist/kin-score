# The K'in Sun — the Kin Score glyph

The canonical visual mark for a Kin Score. **This directory is the source of truth.** Every site that
draws a Kin Score draws it from here; nothing re-implements the geometry.

K'in is the Mayan word for sun, and for day.

---

## The design

**Core — six concentric rings, one per Kin Score facet.** Each ring fills clockwise from twelve
o'clock to that facet's score. **Ring colour is the facet's own fixed hue** — colour encodes *which
facet this is*, never how well it scored. Arc length carries the score.

That is the Apple Activity model: Move/Exercise/Stand are always red/green/blue however well you did.
It is also what keeps the glyph colourful for every provider. The alternative — colouring rings by the
band each facet landed in — was built, tested and rejected: a provider scoring uniformly high comes
out near-monochrome, which is exactly backwards for a mark meant to read as a sun.

**Rays — fourteen triangles around the outside, one per agent-readiness dimension.** Solid and full
length when the dimension is satisfied, solid but **short (55%)** when it is only partially credited,
hollow outline when it is not satisfied at all. The ray count follows the rubric: twelve at 0.4,
thirteen when `agent_card` shipped in 0.5.1, fourteen at 0.6 with `dry_run_mode`. Geometry is
parametric on `DIMENSIONS.length`, so adding a dimension needs no layout work — but the ray *does*
have to be added here, and for two days after 0.5.1 it was not, leaving the sun silently a ray short
of the score it was illustrating.

**The three-state ray is new in 0.6**, and it exists because seven of the fourteen dimensions can now
land on partial credit — four graded on evidence (`documented`, `partial`), three graded on
authorship (`derived`, `mixed`), plus the agent card's own conformance ladder. A derived MCP server
should not draw the same ray as a running one. Partial is encoded as **length, not opacity or hue**:
opacity does not survive greyscale, print or forced-colors, and the point of the silhouette is that
it reads at a glance. A stubby ray says *there, but not all the way there* in any rendering. The
tooltip states the grade verbatim — "MCP Server: derived" is a different fact from "MCP Server:
satisfied", and telling the two apart is the entire purpose of 0.6.

**The composite band** is stated as text under the number, because it left the rings when they took
facet hues. Below ~96px the number and band label drop and the core becomes a band-coloured dot — the
glyph degrades to a silhouette that still reads.

## The palettes

`facet` is the shipped palette. The other two exist for comparison and are kept because the reasoning
is worth preserving.

| Palette | Ring colour means | Status |
|---|---|---|
| **`facet`** | which facet | **shipped** |
| `ordinal` | which band (one hue, 38° traverse) | ranks without a legend, survives greyscale, but monochrome for uniform providers |
| `bright` | which band (distinct hues) | light passes with reliefs; **dark fails** — no five hues in that column are mutually separable |

### Facet hues (shipped)

Slots 1–6 of the design system's validated categorical theme. Validated `--pairs adjacent`:
**ALL CHECKS PASS in both light and dark.**

| Facet | Light | Dark |
|---|---|---|
| Discoverability | `#2a78d6` | `#3987e5` |
| Contract Quality | `#eb6834` | `#d95926` |
| Governance | `#1baf7a` | `#199e70` |
| Operational Transparency | `#eda100` | `#c98500` |
| Developer Ergonomics | `#e87ba4` | `#d55181` |
| Commercial Clarity | `#008300` | `#008300` |

### Ray gold

A warm ramp of its own, keyed to the agent-readiness band, so the rays read as sunlight rather than as
more of the core palette. Deliberately held apart from every ring hue — nothing in the facet set is
warm-gold, so a ray can never be mistaken for a facet. **The ramp brightens with readiness.**
Validated `--ordinal`: ALL CHECKS PASS on both surfaces.

```
light  #a94900 → #bd6800 → #cf8700 → #dea800   (human-only → agent-native)
dark   #b45600 → #d07e0b → #e9a738 → #ffd060
```

`#dea800` is as bright as gold goes on the light surface — the 2:1 contrast floor is the only thing
stopping it, and a brighter attempt measured 1.84:1 and failed.

## Where it appears — the fixed anatomy

Both **apievangelist.com** and **apis.io** use the same two layouts. Do not invent a third.

**Provider detail pages** — a thin band, ONE ROW, in fixed proportions:

```
|<------ 25% ------>|<---------------- 50% ---------------->|<------ 25% ------>|
|      sun glyph    |  score · band pills · one-line read    |     Kin mark      |
```

The proportions *are* the anatomy. Both the sun and the Kin mark scale to fill their column — the SVG
carries a `viewBox`, so `width: 100%; height: auto` is all it needs; the mark is an `<img>` treated the
same way. Render the sun at `data-size="170"` so it stays crisp at column width, and cap each with a
`max-width` (170px sun / 150px mark) so neither explodes on an ultrawide screen. On narrow screens the
row holds — only the caps tighten.

The middle column stacks internally: score and pills on the first line, the one-line read beneath. That
is still one row for the band as a whole.

**Provider listing rows** — the sun on the **far right** of the row, after the scores.

**The apis.io home-page quick list shows the overall score alone — no sun.** That is deliberate: it is
a search-results list, and a glyph per result is noise where the number is the answer.

## Using it

Copy `dist/kin-glyph.js` into the site's assets, load it once, and emit a placeholder. The script
renders every `[data-kin-glyph]` on `DOMContentLoaded`.

```html
<script src="/assets/js/kin-glyph.js"></script>

<span data-kin-glyph
      data-size="76"
      data-palette="facet"
      data-name="Twilio"
      data-score="75.6" data-band="exemplar"
      data-agent-score="78" data-agent-band="agent-native"
      data-facets='{"discoverability":67.5, ... }'
      data-dims='{"spec_presence":true, ... }'></span>
```

After a client-side DOM update call `KinGlyph.renderAll(root)`. For a raw string (build-time
rendering, PNG pipelines) import the module and call `kinGlyph(provider, opts)`.

**Both attributes must be valid JSON.** In Liquid, guard every value with `| default: 0` (facets) or
`| default: false` (dimensions), or a missing key emits nothing and the JSON breaks.

## Build

```
node build.mjs        # -> dist/kin-glyph.js   (the distributable, parse-checked)
node make-demo.mjs    # -> demo.html           (self-contained comparison page)
```

`build.mjs` refuses to write a bundle that does not parse. That guard exists because an escaped
apostrophe once shipped a page whose script died silently — the CSS rendered and nothing drew.

## Consuming sites

| Site | Asset | Detail | Listing |
|---|---|---|---|
| apievangelist.com/providers | `assets/js/kin-glyph.js` | `_layouts/provider.html` | `_includes/company-listing-rated.html` |
| apis.io/providers | `assets/js/kin-glyph.js` | `_layouts/provider.html` | `network/_includes/band-list.html` |
| **apis.io/badge/\*** | `lambdas/badge/kin-glyph.mjs` (ESM source, not the bundle) | — | — |

**When the glyph changes:** edit `kin-glyph.js`, run `node build.mjs`, then copy `dist/kin-glyph.js`
into each site's `assets/js/`. There is no package registry step — it is a deliberate copy, and the
header of the generated file names this directory as the source. The badge service takes the **ESM
source** rather than the browser bundle, because it composes `kinGlyph()` server-side; refresh it the
same way, with a `cp` into `apis-io-aws/lambdas/badge/kin-glyph.mjs`.

## Off-site — the embeddable badge

A fourth consumer draws the sun on **other people's websites**: `apis.io/badge/*` renders it as a
standalone SVG a provider pastes onto their own site, and it redraws from the live score. That
context takes away hover, script, and every external resource, so the badge composes the glyph
rather than extending it — and it is why `theme=auto` exists there and not here. The contract is
[`../EMBED.md`](../EMBED.md); the service is `apis-io-aws/lambdas/badge/`.

One rule this file's rules imply, restated because the badge is where it bites: **a ray added to the
rubric but not to `DIMENSIONS` disappears from every embedded badge on every customer site at once**,
silently, until the shard is rebuilt. The badge shard imports `FACETS`/`DIMENSIONS` from here for
exactly that reason, and the index builder warns on any facet or dimension it cannot place.

## Data requirements

The glyph needs the facet breakdown and the agent dimensions, not just the composite:

- **Provider frontmatter** already carries `score.facets` and `agent_readiness.dimensions` on both
  sites — nothing to add.
- **Listing payloads** must carry them too. `network/scripts/build_listings.py` was extended to emit
  `facets`, `agent_dims`, `agent_score` and `agent_band` per row for exactly this reason. Watch the
  payload size: `provider_bands.yml` covers every provider in the network.
- The AE section listings already carry both in `providers/_data/companies-*.json`.

### The compact encoding

Facets ride as a positional **array** in `FACETS` order; dimensions as a positional **string** in
`DIMENSIONS` order. Keyed objects doubled `provider_bands.yml` from 13.9 to 28.2 MB; compact brought
it to 17.7. `FACET_ORDER` / `DIM_ORDER` in `build_listings.py` **must** stay in sync with `FACETS` /
`DIMENSIONS` here — the encoding is positional, so reordering either is a breaking change.

The dimension string was a bitstring through 0.5.1 and is a **trit string** from 0.6:

| char | means |
|---|---|
| `0` | not satisfied |
| `1` | satisfied, full credit |
| `2` | **partial credit** — graded on evidence (`documented`, `partial`) or on authorship (`derived`, `mixed`) |

`1` deliberately keeps its old meaning, so an encoding written before 0.6 still renders correctly
rather than silently demoting every satisfied dimension to a stub. Keyed objects may instead carry the
grade verbatim — `"mcp_server": "derived"`, which is what provider frontmatter emits — and
`rayState()` normalizes either form.

## Known limitations

- **A radial mark is an identity glyph, not a measuring instrument.** Equal values read as different
  arc lengths on different rings, because arc length grows with radius. Fine for recognition and gist;
  pair it with the table or the numbers wherever comparison matters.
- **Ring identity needs hover** — you cannot tell which ring is Governance without the tooltip. Every
  ring and ray carries `data-kind` / `data-label` / `data-value` / `data-band` plus a `<title>`, so
  the native tooltip and screen readers both work. Anywhere without hover (a PDF, a social card) needs
  a legend.
- **The seventh facet, `regulatory`, is conditional and is not drawn.** Seven rings is too many.
- **Canvas rendering has no tooltips** — a bitmap has no nodes to hover. That is a consequence of the
  renderer, and one of the reasons SVG is the shipped implementation.

## Why raw SVG

Three implementations were built and compared (see `NOTES.md`). SVG won on the deciding argument:
Kin Scores are computed at build time and consumed by Jekyll sites, so the glyph wants to be a string
a build step can emit — and a 90KB runtime to draw six arcs and fourteen triangles is not a trade worth
making. D3 earns its place the moment there is an explorer to animate. Canvas only if bulk PNG
generation becomes a bottleneck.
