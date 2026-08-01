<p align="center">
  <img src="https://kinlane-images.s3.amazonaws.com/shared/api-evangelist-logos/api-evangelist-logo-butterfly.png" alt="API Evangelist" width="150" />
</p>

<h1 align="center">Embedding a Kin Score</h1>
<p align="center"><em>Put the K'in sun on your own site. It stays current on its own.</em></p>

---

Every scored provider has a badge. Copy the snippet from your provider page on
[APIs.io](https://apis.io) or [API Evangelist](https://providers.apievangelist.com), paste it on your
site, and you are done — the badge is rendered from your **current** Kin Score every time it loads.
When you publish an OpenAPI you were missing and the score moves, the badge moves with it. There is
nothing to re-paste, no key, and no account.

The score behind it is already public on your provider page. The badge is the same fact in a shape
you can put in a footer.

## Get the snippet

The builder for one provider, with every shape, theme and format:

```
https://apis.io/badge/{your-slug}/
```

Or take it straight off your profile — both provider pages carry an **Embed this score** block right
under the rating breakdown.

## The shapes

| | URL | Use it for |
|---|---|---|
| **Sun** | `https://apis.io/badge/{slug}.svg` | A sidebar, a footer, a trust strip. The mark on its own. |
| **Card** | `https://apis.io/badge/{slug}/card.svg` | Both scores plus your name, when the badge has to explain itself. |
| **Flat** | `https://apis.io/badge/{slug}/flat.svg` | A README, next to your build and coverage badges. |

Parameters: `theme=auto|light|dark` (default `auto`), `size=48..512` (sun), `width=280..600` (card).

`auto` follows **your visitor's** light/dark setting — the badge ships both and switches with a media
query, so it never lands as a white square on a dark site. The flat pill takes no theme on purpose:
every other badge in a README is a fixed dark-slate pill, and the one that inverts with the reader's
OS setting is the odd one out.

Below about 96 pixels the sun drops the number and the band label and becomes a silhouette with a
band-coloured core. That is the design, not a degradation — see [`glyph/GLYPH.md`](glyph/GLYPH.md).

## The HTML

```html
<!-- Kin Score · API Evangelist -->
<a href="https://apis.io/providers/twilio/"
   title="Twilio on APIs.io — API discovery and ratings">
  <img src="https://apis.io/badge/twilio.svg"
       alt="Twilio Kin Score — API readiness rating by API Evangelist"
       width="150" height="150" loading="lazy">
</a>
```

Keep the `<a>` and keep the `alt`. They are what make the badge a citation rather than a picture: the
link is plain HTML that any crawler sees without running JavaScript, and because the image is the
link's only child, the `alt` text **is** the anchor text. The `width`/`height` stop the badge from
reflowing your page as it loads.

**Notice the `alt` does not contain your score, on purpose.** You paste this once and keep it, while
the image behind it keeps re-rendering from your live score — so a number written into the alt would
drift out of step with the badge sitting next to it, and a screen-reader user would be told a figure
that no longer matches what everyone else sees. The number lives in the picture, which updates. If
you are templating the snippet yourself, `/badge/{slug}.json` gives you both strings:
`embed_alt_text` for HTML you keep, `live_alt_text` for anything you regenerate.

The `href` deliberately carries no tracking parameters. We do not need them — the badge request tells
us which page it was embedded on — and a clean URL is a better link for both of us.

### README

```markdown
[![Kin Score](https://apis.io/badge/twilio/flat.svg)](https://apis.io/providers/twilio/)
```

GitHub proxies images through its own cache, so a re-score can take a little longer to appear in a
README than on your own site.

Already standardised on shields.io? There is an endpoint for that, so your Kin Score badge matches
the rest of your row exactly, style parameters and all:

```
https://img.shields.io/endpoint?url=https://apis.io/badge/twilio/shields.json
```

### Interactive

The static badge cannot have tooltips — an `<img>` has no nodes to hover. This upgrades it in place
to inline SVG so every ring and every ray gets a label:

```html
<a class="kin-score-badge" href="https://apis.io/providers/twilio/">
  <img src="https://apis.io/badge/twilio.svg" alt="…" width="150" height="150">
</a>
<script src="https://apis.io/badge/twilio/embed.js" async></script>
```

It is an upgrade, never a replacement. Block the script and you still have the badge, the link and
the alt text.

## The data behind it

```
https://apis.io/badge/{slug}.json
```

The full score — composite, band, all six facets, all fourteen agent-readiness dimensions with their
grades verbatim, trend, when it was scored and on which rubric version — plus every snippet, ready
to paste. CORS is open, so a static-site generator can read it at build time and template the badge
itself rather than hard-coding one.

## Freshness

Badges cache at the edge for an hour and revalidate in the background. A re-score reaches every embed
within about an hour, with no work from you.

Which means the number can go **down**. That is the deal: it is a rating, not a logo. If you want it
to only go up, the rubric is public and every input is a signal you control — your provider page
itemises exactly which checks you are failing and what each is worth.

## Rules of use

- **Anyone may embed anyone's badge.** The score is public. This is also why the card carries
  "KIN SCORE · API EVANGELIST" — a rating has to say who computed it.
- **Do not modify the badge.** Recolouring it, cropping the wordmark off the card, or hosting a
  copy that no longer updates turns a live rating into a claim about a moment that has passed. Link
  to ours; that is what it is for.
- **Do not present the badge as a certification or an endorsement.** It is a computed readiness
  score. [API Evangelist certification](https://developer.apievangelist.com/) is a separate,
  explicit thing.
- **`schema.org` markup is offered, with a caveat.** The builder can emit a `Rating` block
  attributed to API Evangelist as the author, which is the honest form. Search engines discount
  review data that appears on the reviewed party's own page, so add it because it is true, not
  because it will win you stars.

## For the record

The badge service is `apis-io-aws/lambdas/badge/` — routes, caching, and the reasoning behind the
snippet's exact shape are documented in its README. The mark itself is
[`glyph/GLYPH.md`](glyph/GLYPH.md); the rubric that produces the number is
[`README.md`](README.md) and [`rubric/`](rubric/).
