# Kin Score cards

The share image for a provider. One 1200×630 PNG per scored provider, built around the
K'in sun: the sun itself, the provider's name, the composite and its band, agent readiness,
and all six facet values.

Before this existed, sharing a provider page produced nothing useful. On
providers.apievangelist.com the `og:image` was the provider's *own logo* — a square asset
declared as 1200×630, so it rendered letterboxed and said nothing about API Evangelist. On
apis.io it was one generic site card, identical across every provider page. The single most
valuable thing on the page never left the page.

**One card serves both sites.** The white strip carries the butterfly lockup and the KIN
SCORE wordmark and names no domain, so a card can never contradict whichever site it was
shared from.

## The URL contract

```
https://kinlane-images.s3.amazonaws.com/shared/kin-score/cards/<slug>.png
```

`<slug>` is the provider slug — the same slug that is the page slug on both sites. Stable
forever: a rescore **rewrites the object in place** rather than minting a new path.

That is a deliberate trade. LinkedIn, X and Slack cache OG images hard and key that cache on
the URL, so a rescore will *not* refresh cards already scraped by those platforms. Versioned
URLs would fix that and break every link ever shared, which is worse. A stale card in
someone's old LinkedIn post is a smaller problem than a dead one.

Only **scored** providers get a card, and nothing advertises a card it does not have.

| Page | Guard |
|---|---|
| Provider detail (both networks) | `page.score` — the page holds its own score |
| API detail (both networks) | `site.data.kin_cards[page.provider_slug]` |

An API detail page carries `provider_slug` and no score of its own, so it cannot guard on
itself. `emit-index.mjs` writes that index from the PNGs that actually exist and copies it
into `api-search/apis/_data/` and `api-evangelist/apis/_data/`. Unindexed provider, or
unscored provider: the site card, because an `og:image` at a 404 is worse than a generic one.

**apis.io was not wired until 2026-08-19.** This file claimed both sites emitted the URL
while only providers.apievangelist.com did; every apis.io provider page still shared one
generic site card. The wiring lives in `api-search/network/_shared/_layouts/default.html`
(copied to all 36 sites) and `api-evangelist/apis/_includes/head.html`.

## Where the numbers come from

`api-search/providers/_providers/*.md` frontmatter — what `score.rb --write` actually writes.
Not the built site, and not apis.io's badge shard: either would make a card lag a rescore by
a full rebuild.

The sun is **not drawn here.** It comes from [`../glyph/kin-glyph.js`](../glyph/kin-glyph.js),
the source of truth every surface draws from, so a card can never disagree with the provider
page or an embedded badge. `verify-cards.mjs` proves that continuously (below).

## Running it

```sh
npm install

node build-cards.mjs                     # every scored provider, changed cards only
node build-cards.mjs --only stripe,twilio # named providers
node build-cards.mjs --force              # re-render everything (after a layout change)
node build-cards.mjs --limit 50 --jobs 4  # a sample
node build-cards.mjs --dry-run            # report what would change

node verify-cards.mjs --all               # every card vs the live badge shard
./upload-cards.sh --dry-run               # what would go to S3
./upload-cards.sh                         # publish
```

Cards land in `dist/cards/` (gitignored — ~4 GB). `manifest.json` records a fingerprint of
each provider's scored inputs, so a re-run after a rescore renders only what moved rather
than all 26.5k.

**A rescore refreshes the cards on its own.** `api-search/network/scripts/rebuild.sh cards`
runs render → verify → index → upload, and it is a step of `rebuild.sh all` and of
`apis-io-aws/scripts/refresh-all.sh` (phase 1b), placed straight after the data build because
it reads the frontmatter `score.rb` just wrote — not the built site. `SKIP_CARDS=1` skips it.

Both gates check the result: `pre-sync-gate.sh` check 10 and `ae-gate.sh` check 7 fail a
deploy whose card index is missing, and warn when it holds under 90% of the catalog.

Run it by hand only for a partial refresh — `./rebuild.sh cards --only stripe,twilio`, or the
three commands directly. Nothing on either site needs rebuilding for new BYTES to go live:
the URL is stable, so an upload is the publish. A site rebuild is needed only when the SET of
carded providers changes, since that moves the index the API pages read.

## Things that will bite

- **`build-cards.mjs` is both a CLI and a module.** The CLI is gated on the file being the
  entry point, not on `isMainThread` — on `isMainThread` alone, `verify-cards.mjs` importing
  `extract` silently kicked off a full 26k-card build.
- **Frontmatter is scanned, not parsed.** A full YAML parse of 26,926 files averaging 13 KB
  (one is 1.3 MB) costs minutes for four keys. `extract()` matches **column-0 keys only** —
  that is what keeps `- name:` inside `api_specs:` from being read as the provider's name.
  `verify-cards.mjs --all` is what proves the shortcut is safe; it currently passes on all
  26,570.
- **Six composite bands, not five.** `minimal · thin · emerging · developing · strong ·
  exemplar`. `thin` is 4,114 providers and is easy to leave out of a colour map, where it
  fails silently into the fallback colour.
- **Delisted providers are excluded explicitly**, from `api-search/network/_data/delisted.yml`.
  Six delisted slugs still have provider files and one of them (`tronald-dump`) still carries
  a score block — without the filter it would get a card.
- **resvg resolves no external hrefs.** The butterfly is inlined as a data URI. Anything
  pointing at a file or a URL renders as nothing, with no error.
- **Text is rasterized against whatever fonts the host has.** resvg loads system fonts, and
  the cards ask for `Helvetica,Arial,sans-serif` — present on macOS, where these are built.
  Building on a box without them silently substitutes a different face, which shifts every
  measurement `textWidth()` made. Build on a Mac, or bundle a font first.
- **SVG has no auto-fit and resvg exposes no text measurement.** Name sizing runs off an
  advance-width estimate in `textWidth()`, deliberately biased wide — overestimating shrinks
  text that would have fit, underestimating runs it off the card. Names reach 77 characters
  against a 99th percentile of 35, so the layout tries one line, then two, then packs words
  greedily and ellipsizes.
