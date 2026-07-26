# The K'in sun — Kin Score glyph exploration

Local exploration only. Nothing here is wired into apis.io, the providers site, or the papers.

**To view:** open `standalone.html` — it is fully self-contained and works straight from `file://`.

(`index.html` is the ES-module version and needs a server: `python3 -m http.server 8080`. A module
`import` and a `fetch` are both blocked on `file://`, which is why the first cut rendered the text and
none of the drawings. `standalone.html` is generated from the same source by `node make.mjs`, so the
two cannot drift.)

## The design

- **Core** — six concentric rings, one per Kin Score facet, each filled clockwise from twelve o'clock
  to its score, and coloured by the **band that facet's score lands in**. Apple's Activity rings, with
  the band ladder doing the colouring.
- **Rays** — twelve triangles around the outside, one per agent-readiness dimension, solid when the
  dimension is satisfied and hollow when it is not. Ray colour is the provider's agent band.
- Twelve rays around a circle is a happy accident of the data: the agent score has exactly twelve
  dimensions, so they sit at a clean 30°, and the result reads as a sun. K'in is the Mayan word for
  sun, and for day.

## Library comparison

All three implementations in `index.html` draw the identical glyph, so you can switch between them
and compare. What each is actually good for:

| | Raw SVG (`kin-glyph.js`) | D3 | Canvas |
|---|---|---|---|
| Dependencies | none | ~90KB runtime | none |
| Build-time render | yes — returns a string | no, needs a DOM | no |
| Scales to any size | yes | yes | needs DPR handling |
| Accessibility | `<title>` per mark, free | same, manual | none — a bitmap |
| Bulk PNG export | via rasteriser | awkward | best |
| Transitions / interaction | manual | best in class | manual |

**Recommendation: raw SVG for production, D3 for exploration, Canvas only if bulk PNG becomes a
bottleneck.**

The deciding argument is *where this renders*. Kin Scores are computed at build time by `score.rb`
and consumed by Jekyll sites — so the glyph wants to be a string a build step can emit into a page,
which is exactly what `kinGlyph()` returns. There is no interaction to animate in a listing row, and
a 90KB runtime dependency to draw twelve triangles and six arcs is not a trade worth making. D3
earns its place the moment you want an explorer — brushing across the catalog, animating a provider's
score history from the `kin/` artifacts — and `d3.arc().cornerRadius()` is genuinely nicer than
stroke-dasharray for that.

Two libraries I looked at and rejected:

- **Chart.js** — a doughnut chart can be coerced into concentric rings, but the twelve external
  triangles have to be a custom plugin drawing on the canvas anyway, at which point Chart.js is
  contributing a legend and tooltips you then have to switch off.
- **ECharts / Vega-Lite** — both can express this declaratively, and both are heavier than the entire
  rest of the page. Vega-Lite in particular fights custom mark geometry.

The stroke-dasharray trick is worth noting: drawing each ring as a `<circle>` with
`stroke-dasharray="<arc> <rest>"` and `stroke-linecap="round"`, rotated -90°, gives you rounded
data-ends and needs no arc-path maths at all. It is why the SVG implementation is shorter than the
D3 one.

## What changed after looking at the render

Three fixes came from rasterising and actually looking, not from reasoning:

1. **The centre number collided with the innermost ring.** Dark ink on a dark-blue arc — unreadable
   exactly for the providers scoring best. Fixed with a surface-coloured core disc.
2. **Zero facets were drawn as a dashed overlay** on top of the empty track. A provider with four
   zeros (AT&T, Manulife) ended up looking *textured* rather than empty. The track alone already says
   "measured, nothing here", so the overlay went.
3. **Six thin rings read as a spiral.** Widened the gap and thickened the rings by shrinking the core
   and the ray band.

## The palette finding — worth acting on beyond this glyph

The six bands are **ordinal** — an ordered ladder from Minimal to Exemplar. Ordered data takes a
single-hue ramp, light→dark.

The band colours currently in production on `providers.apievangelist.com` are a **rainbow**
(`#d1f7e0` green, `#cfe2ff` blue, `#fff3cd` yellow, `#ffe0c2` orange, `#f8d7da` red, `#e9ecef` grey).
Run through the dataviz validator as an ordinal ramp, that fails four checks:

```
[FAIL] Lightness monotone   out of order
[FAIL] Adjacent ΔL          steps too close
[FAIL] Light-end contrast   #fff3cd at 1.05:1 vs surface
[FAIL] Single hue           hue spread 113°
```

A reader cannot tell from the colours alone whether yellow outranks orange. The ramp used here passes
on both surfaces:

```
light  #5ebcdc → #3999c5 → #1575ae → #005295 → #002e7b   (emerging → exemplar)   ALL CHECKS PASS
dark   #234f99 → #3173b4 → #4897cd → #65bbe6 → #87dfff                            ALL CHECKS PASS
```

The ramp **traverses 38° of hue**, cyan → deep indigo, rather than sitting on a single blue. 40° is the
ceiling the ordinal check allows before a ramp stops reading as ordered, so this takes nearly all the
available headroom: adjacent bands are genuinely distinguishable, and monotone lightness still carries
the ladder. Generated in OKLCH (`scratchpad/ramp.mjs`) rather than hand-picked, so the lightness steps
and hue traverse are exact.

`Minimal` sits deliberately **off** the ramp in neutral grey, because it means *nothing here* — the
palest step would imply a small amount of something.

## Two palettes, toggled in the page

`Bright hues` is the alternative to the ordinal ramp, and the page ships both so they can be compared
directly. The trade is real and worth stating plainly:

| | Ordinal ramp | Bright hues |
|---|---|---|
| Tell two bands apart | harder | **easy** |
| Know which band outranks which | **from colour alone** | needs the legend |
| Greyscale / print | **survives** | collapses |
| Light surface | ALL PASS | passes with two reliefs |
| Dark surface | ALL PASS | **fails** |

The bright set is `#e34948` red → `#eda100` yellow → `#1baf7a` aqua → `#2a78d6` blue → `#4a3aa7`
violet, drawn from the design system's validated categorical theme rather than picked by eye.

Three measured findings shaped it:

- **Orange is absent from both palettes.** Red↔orange measures ΔE 7.1 for *normal* vision, against a
  floor of 15 — they genuinely look alike side by side. Orange↔amber was worse still at 9.1. This was
  the first thing that failed when the obvious red/orange/yellow/green/blue ramp was tested.
- **The light set passes with two documented reliefs**: CVD separation sits in the 6–8 warn band
  (aqua↔red 6.9), and yellow and aqua fall below 3:1 against the surface. Both require secondary
  encoding, which this glyph happens to have twice over — arc length already encodes the same value the
  colour does, and every mark carries a hover label.
- **The dark set fails and cannot be fixed by re-picking.** No five hues in that column are mutually
  separable at all-pairs: blue↔violet 1.9 (protan), magenta↔aqua 1.6, magenta↔red 7.8. Every
  combination tried failed. The dark bright palette in the page is the least-bad option, offered for
  comparison rather than for use.

The honest recommendation is the ordinal ramp for anything shipped — it is the only one that ranks
without a legend, survives greyscale, and passes on both surfaces — with bright hues reserved for a
light-mode context where a legend is always present and telling bands apart matters more than ranking
them.

Changing the production band colours is a bigger decision than this prototype (they appear on every
listing, every report, and the social cards), so it is flagged, not done.

## The rays have their own gold

The sun's rays take a warm gold ramp of their own, keyed to the agent-readiness band, so they read as
sunlight rather than as more of the core palette. It is deliberately held apart from every ring hue —
nothing in `FACETS` is warm-gold — so a ray can never be mistaken for a facet.

```
light  #a94900 → #bd6800 → #cf8700 → #dea800   (human-only → agent-native)   ALL CHECKS PASS
dark   #b45600 → #d07e0b → #e9a738 → #ffd060                                 ALL CHECKS PASS
```

The ramp **brightens with readiness**: the readier a provider, the more luminous its sun. On the light
surface `#dea800` is as bright as gold can go — the 2:1 contrast floor is the only thing stopping it
going further, and a first attempt at a brighter set failed at 1.84:1. On dark it opens right up to
`#ffd060`.

## Readable without colour

The unsatisfied rays carry a heavier, darker outline (`rayOff`, ~1.25px at listing size, scaling with
the glyph) rather than the pale ring-track colour they started with. Desaturate the whole glyph and it
still reads: the sun's silhouette is intact, solid-versus-hollow rays are unambiguous, and the band
ladder survives as lightness. That is the monotone-lightness rule paying for itself — a rainbow ramp
would collapse into indistinguishable greys.

## Hover

Every ring and ray carries `data-kind` / `data-label` / `data-value` / `data-band` hooks, and the demo
page attaches one delegated listener that reads them — so the tooltip survives every redraw and works
across the SVG and D3 implementations. Canvas gets no tooltip, because a bitmap has no nodes to hover;
that is a real difference between the implementations rather than an oversight.

The `<title>` element on each mark stays regardless — it gives a native tooltip and is what a screen
reader announces.

## Known limitations

- **A radial mark is an identity glyph, not a measuring instrument.** Equal values read as different
  arc lengths on different rings, because arc length grows with radius — the outer facet always looks
  bigger than an inner facet with the same score. Apple's rings have the same flaw. That is acceptable
  for recognition and gist, and it is why `index.html` also renders the plain table.
- **A high scorer still reads close to monochrome**, though far less than on the single-hue ramp.
  Twilio's facets all land in the top two bands, so its rings are indigo and deep blue with the
  variation carried by arc length. Arguably correct — "strong across the board" — but worth knowing.
  Providers with a genuine spread (Socotra: an exemplar ring beside a thin one) now show it clearly.
- **Ring identity needs hover.** You cannot tell which ring is Governance without the tooltip. A
  legend or a static key would be needed anywhere the glyph appears without hover, e.g. in a PDF.
- The seventh facet, **regulatory**, is conditional and is not drawn. Where it applies it would be a
  seventh ring, which starts to be too many.
