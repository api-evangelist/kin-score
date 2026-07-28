# Kin Score for Sales Teams

*Working note — not part of the canonical rubric documentation. Thinking about who the score sells
to, and what it does once it gets there.*

Two entirely different sales teams can use the Kin Score, and the plays barely overlap. A third one
is mine.

---

## 1. Sales teams *at* an API provider — selling their own API

The score turns "our API is great" into a number somebody else published.

- **Proof in the deck.** A Kin Score band plus the facet breakdown is external, versioned, and not
  marketing copy. It plays the same role a SOC 2 badge plays: a buyer-side shortcut that ends an
  argument instead of starting one.
- **Battlecards.** Head-to-head against the two competitors who show up in every deal
  (`compare_providers`). If you win on developer ergonomics and governance, that's a slide. If you
  lose, sales finds out before the prospect says it out loud.
- **Objection pre-emption.** The checks map almost one-to-one onto what a technical evaluator asks in
  weeks two and three of a deal — auth clarity, error semantics, rate limits, VDP, terms, changelog.
  Running gap analysis on yourself is a pre-mortem of every deal-blocking question you're going to
  get.
- **Agent readiness as a wedge.** The sharpest one right now. Agent Readiness is standalone, and only
  a sliver of the catalog is agent-native. A provider scoring well there can make a claim nobody else
  in their category can make yet — "an agent can drive this API safely" — and there is no other
  scoreboard for it.
- **Regulated deals.** The conditional regulatory facet gives banking, health, payments, insurance,
  and government sellers a compliance-adjacent number to lead with in procurement, where the
  conversation is already about posture rather than features.

## 2. Sales teams selling *into* API providers — devtools, gateways, docs, security, DX

Here the score is a prospecting and lead-scoring engine, and commercially this is the bigger story.

- **Territory scoring.** Tens of thousands of scored providers across six bands. The ICP isn't
  "companies with APIs," it's "companies scoring roughly 30–55" — enough of an API program to have a
  budget, weak enough to have real pain.
- **The gap *is* the opening line.** Gap analysis produces a named, specific deficiency per account.
  A docs vendor opens on the developer-ergonomics facet. An API security vendor opens on a missing
  VDP and thin auth. That's a cold email that isn't cold.
- **Trigger events.** Movers and rating history: a provider whose score just jumped shipped
  something; one that slid broke something. Both are timing signals, which is the thing outbound
  actually lacks.
- **Whitespace by segment.** Industry, area, and region gap analysis tells a rep which vertical is
  systematically underserved. That's a campaign, not a lead.

## 3. My own sales

The score is already the demand-gen layer for API Evangelist services: score → gap → assessment →
sector or portfolio report. The paid-assessment-around-an-Agent-Readiness-read shape is the
repeatable motion. The score is what makes the assessment feel objective rather than consultative
opinion.

---

## The caution before any of this ships

The moment a sales team puts a Kin Score on a slide, somebody asks *who produced that OpenAPI?*
Today the rubric still credits API Evangelist-derived artifacts as though the provider published
them. That provenance gating has to land before the score is used as an external sales asset —
otherwise a competitor discredits the number, and by extension the brand.

A score that can be contested is the point. A score that can be *dismissed* is the failure mode.

---

## Open questions

- Is "Kin Score for Sales" a page, a service, a paper, or all three?
- Does the provider-side use imply a badge or embed — and does a badge invite gaming?
- Is the buy-side (segment 2) a data licensing conversation rather than a content one?
- Which lands first: agent readiness as the wedge, or the regulatory facet in procurement?
