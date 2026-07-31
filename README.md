<p align="center">
  <img src="https://kinlane-images.s3.amazonaws.com/shared/api-evangelist-logos/api-evangelist-logo-butterfly.png" alt="API Evangelist" width="200" />
</p>

<h1 align="center">Kin Score</h1>
<p align="center"><em>The API Evangelist rating system — a public, versioned, machine-checkable readiness score for APIs.</em></p>

---

The **Kin Score** is the API Evangelist rating: a 0–100 composite that answers one question —
*how ready is this API to be discovered, understood, adopted, and operated, by a developer today and
an agent tomorrow, without a sales call?* Every input is a **public, machine-checkable signal** a
provider chose to publish or chose to leave out. No human quietly adds or removes points; the score
is reproducible and citable.

It is computed across the API Evangelist network and surfaced on [APIs.io](https://apis.io) and
[providers.apievangelist.com](https://providers.apievangelist.com). This repository is the **canonical
documentation** of the scoring system — its schema, its versions, and its changes. The operational
rubric and scorer live in the `api-search` repository; the versioned snapshots here are the published
record.

## The model

The Kin Score has three parts. Only the first is the headline 0–100 composite. Cutting across all
three, from 0.6, is **provenance** — the question of who published the artifact being scored.

### 0. Provenance — who published it (schema 0.6+)

Through 0.5.1 the rubric credited an artifact's **presence** and could not see its **author**. That
was a real defect, not a nuance. The API Evangelist enrichment pipeline authors artifacts on a
provider's behalf — modeled OpenAPI, candidate MCP tool catalogs, generated agent skills, derived
agentic-access contracts — and marks each one as it writes it. The score read none of those marks, so
work done *about* a provider scored as work done *by* one. Measured across the catalog:

| Artifact class | API Evangelist authored | Provider published | derived |
|---|---:|---:|---:|
| Agentic-access contracts | 6,383 | 5 | **99.9%** |
| Agent skills | 2,018 | 256 | 88.7% |
| MCP servers | 1,882 | 1,164 | 61.8% |
| Conformance declarations | 1,881 | 1,903 | 49.7% |

Three authorship states now grade the award:

| State | Meaning | Credit |
|---|---|---:|
| **first-party** | the provider wrote it and serves it | 1.00 |
| **conformance** | the provider serves it; a standards body wrote it | 0.75 |
| **derived** | API Evangelist authored it on their behalf | 0.25 |
| *unknown* | no marker either way | 1.00 |

`derived` keeps a floor rather than scoring zero: a groundable derived candidate is a real, fetchable
artifact one adapter away from working. It is simply not evidence *about the provider*, so it can
never outrank the real thing.

**`conformance` is a third state because two states were not enough.** Three Ontario utilities publish
the Green Button Alliance's ESPI specification; four Australian retailers publish the Data Standards
Body's `cds-energy` documents. Those are genuinely provider-hosted and the provider did not write a
line of them. Crediting them identically to a first-party contract is defensible in a mandated market
and misleading outside one.

**The honest limitation.** Only artifacts *this pipeline* authored carry a marker, so `unknown` is
credited in full — scoring it as derived would punish providers for a gap in our own metadata. For MCP,
skills, agentic-access and conformance the marking is essentially complete. For the **OpenAPI corpus it
is 2.6%** (2,278 of 87,612 specs), so contract provenance is a **floor, not a census**. Every score
carries its own `provenance.contracts.marker_coverage` so a reader can weigh it, and backfilling
`x-provenance` across the corpus is the highest-value item on the roadmap.

### 1. The composite — six base facets

Six facets, each scored 0–100 from artifact checks, combined by weight into the composite. The
weights sum to 1.0 and are the argument the score is making about what matters.

| Facet | Weight | The question it asks |
|-------|:------:|----------------------|
| **Contract quality** | 0.25 | Is there a machine-readable contract at all — **in any format** — and can you call it? (OpenAPI, AsyncAPI, **GraphQL SDL, FHIR CapabilityStatement**, JSON Schema, JSON-LD) |
| **Developer ergonomics** | 0.20 | Can a human get started? (docs, portal, SDKs, auth clarity, real description) |
| **Commercial clarity** | 0.20 | Can they tell what it costs and how to sign up? (plans, pricing, terms) |
| **Operational transparency** | 0.13 | Will it tell you when it changes or breaks? (status, changelog, rate limits, deprecation) |
| **Governance** | 0.12 | Is anyone minding a standard? (Spectral rulesets, **declared conformance profiles, overlays**, vocabulary) |
| **Discoverability** | 0.10 | Can an **agent** find you without being told where to look? (apis.yml, tags, identity, **`.well-known`, llms.txt, a self-hosted index**) |

Checks on artifact types a provider doesn't ship are **N/A** — excluded from that facet's
denominator — so a facet is never depressed for a kind of artifact the API legitimately doesn't have.

**Two facets were rebuilt in 0.6 because measurement showed they had stopped discriminating.**
`discoverability` averaged 84.6 across 252 organizations in two sector quartets with *not one provider
scoring zero in any of eight markets* — including thirteen US utilities that publish no contract at
all. A bar met by any company with a marketing department is not a bar. It now credits **machine**
discoverability rather than human findability. `governance` had the opposite problem: effectively a
single check (a self-published Spectral ruleset), scoring ~0 across all six sectors measured. It now
also credits a declared conformance profile and a published OpenAPI Overlay — evidence a provider has
*internalized* a standard. The boundary it holds: **adopting someone else's standard is not
governance.** Joining CAMARA or TM Forum earns nothing here; governance is what you do to yourself.

**Contract quality became format-agnostic in 0.6.** It was OpenAPI-only, which meant entire
FHIR-native, GraphQL-native and EDI-native markets read as having no contract. Epic served a
59-resource FHIR R4 CapabilityStatement and scored `spec_presence: false`, `contract_quality: 22.6`.
That was a measurement artifact, not a judgment about Epic. It also now grades whether the contract is
**callable**: 10,950 of 87,612 specs in the catalog declare only a placeholder host (`example.com`) or
a bare template variable (`{apiRoot}`), and 834 providers hold no spec with a resolvable host at all.

### 2. The regulatory facet — conditional (schema 0.5+)

A **seventh facet that applies only to providers in a regulated industry**, matched by tags via the
`industry_regulatory` map — **eight regimes** as of 0.6: banking & open finance, securities & market
data, health, payments, insurance, **telecommunications**, **energy & utilities**, government. It
measures the consent, security, legal, and standards-conformance posture a regime demands:
consent-scoped OAuth/OIDC scopes, a published security + vulnerability-disclosure posture,
terms/privacy as legal basis, and evidence of conformance to the industry's data standard.

**Eleven regime-specific checks landed in 0.6**, each N/A outside its own regime — a payments company
is never measured against FHIR, a hospital never against PCI. Each resolves against the provider's
`conformance/` artifact matched to its regime's declared `standards:` list, which makes the
[Standards catalog](https://standards.apievangelist.com) a scoring input: FAPI/PAR for open banking,
a served `.well-known/smart-configuration` for health, PCI + SCA for payments, entitlement terms for
market data, CAMARA conformance for telecom, third-party certification, a published consent model, an
action/write surface, and **`reg_mandate_verified`**.

That last one is the largest unmeasured effect the catalog has found. Across 95 energy organizations,
a **verified** mandate — an actual endpoint, register entry or conformant discovery document — was
worth about twelve points of composite, while a **claimed** one scored *below* organizations under no
obligation at all. Self-declared compliance is not merely uninformative, it is **negative signal**, so
a compliance claim with no callable surface behind it earns nothing here.

**Regime matching is most-specific-wins, not first-declared (0.6).** The old behaviour was a confirmed
bug: `securities_market_data` claimed the bare tags `broker`, `brokerage` and `exchange`, so 16 of 35
UK, 10 of 20 Canadian and 7 of 20 Australian insurance organizations were scored against MiFID II —
Beazley, a Lloyd's syndicate, among them. Every regime is now scored by tag-hit count, tie-broken on a
declared `specificity`, with the ambiguous tags demoted to `weak_tags` that count only when nothing
else matched.

It is folded into the composite **only when a regime applies**, taking a fixed 0.15 slice while the
six base facets scale to the remaining 0.85:

```
base       = Σ(base_weight × facet)                       # six facets, weights sum to 1.0
regulated  → composite = 0.85 · base + 0.15 · regulatory
otherwise  → composite = base                             # unchanged; a weather or maps API is never
                                                          #   judged against a regime that doesn't apply
```

So an unregulated provider's score never moves for this facet; a regulated provider that ignores its
regime takes a real, visible hit, and one that publishes a strong posture is rewarded.

### 3. Agent Readiness — a standalone layer

A separate 0–100 score, with its own bands and its own **fourteen** dimensions, measuring how safely
an autonomous **agent** — not just a human — can drive the API: machine-readable contract,
agentic-access contract, MCP server, auth clarity, idempotency, stable error semantics,
request/response examples, rate-limit signal, typed event surface, agent skills, well-known catalog,
consent/identity, A2A agent card, dry-run mode. It is **never merged into the composite** — the two
are correlated but distinct, and are displayed side by side.

**Four dimensions are verified in the contract, not inferred from a link (0.6).** Idempotency, error
semantics and rate-limit signalling used to be credited from a documentation page — a provider earned
nine points for publishing something titled *Idempotent Requests*. They are now graded: **`verified`**
(full credit) when the behaviour appears in the OpenAPI itself, **`documented`** (half) when only a
link asserts it. `dry_run_mode` is new and has no proxy at all: it is read from the contract or not
scored.

**No provider reaches Agent-Native without idempotency AND stable error semantics (0.6).** The score
is additive, so strengths used to cover for absent safety rails — a provider could clear the top band
with every rail at zero, which describes exactly the API whose agent retries a payment twice and
branches on free-text errors. A band gate now refuses that. Of 1,210 providers scoring above the
Agent-Native cut, **895 are demoted by it**.

## The bands

Cut against the observed catalog distribution, at its valleys — never at round numbers. Re-derived
after any material rubric change with `signals/band_distribution.rb`.

| Band | Composite | Meaning |
|------|:---------:|---------|
| **Exemplar** | 66+ | Adopt-ready today, human or agent. |
| **Strong** | 56–65.9 | Solid; a facet or two short of exemplary. |
| **Developing** | 42–55.9 | The basics exist, with real, nameable gaps. |
| **Thin** | 28–41.9 | A contract may exist but the surrounding experience is bare. |
| **Emerging** | 13–27.9 | More than an index entry, but mostly links rather than artifacts. |
| **Minimal** | 0–12.9 | Index entry only; little a machine can act on. |

| Agent band | Score | Meaning |
|---|:---:|---|
| **Agent-Native** | 46+ | The provider built it, and the safety rails are there. |
| **Agent-Ready** | 34–45.9 | Contract and auth in place; the rails mostly are not. |
| **Agent-Aware** | 6–33.9 | Partial machine surface an agent would trip over. |
| **Human-Only** | 0–5.9 | A developer can integrate it; their agent cannot. |

Both sets were **re-cut in 0.6**, which is part of the change rather than a follow-up to it. Two
rules the catalog has taught, both the hard way:

1. **In a normalised score, adoption rate does not predict blast radius — the denominator does.**
   Agent Readiness is `earned / max`, so adding a dimension rescales *every* provider whether or not
   anyone scores on it. In 0.5.1 an 8-point dimension that 99.7% of the catalog does not participate
   in would have demoted 3,726 providers, and measurement caught it before release.
2. **A correctness fix should not change what a rung means.** 0.6 moved the composite down a mean of
   1.92 points, so the cuts moved with it and the band shares are within a point of 0.5.1's. The 8.8%
   who did change band changed because their *evidence* changed.

Each score also carries a week-over-week **trend** (rising ≥ +5, falling ≤ −5, flat). A number
without a direction is half the story.

## Reading a score

The scored output is written as a `score:` block (plus a sibling `agent_readiness:` block) in each
provider's record. See [`schema/score-block.schema.json`](schema/score-block.schema.json) for the
full shape. A regulated provider additionally carries a `regulatory:` sub-block naming the matched
regime and its facet score.

```yaml
score:
  composite: 50.8
  band: developing
  facets:
    discoverability: 100.0
    contract_quality: 62.2
    governance: 0.0
    operational_transparency: 31.6
    developer_ergonomics: 60.9
    commercial_clarity: 44.7
  regulatory:            # present only for regulated industries
    applies: true
    regime: Banking & Open Finance
    regime_id: banking_open_finance
    score: 61.0
    matched_via: tags    # or `weak_tags` — see the regime-matching note
  provenance:            # 0.6+ — who published what is being scored
    mcp: first-party
    skills: derived
    agentic_access: derived
    conformance: first-party
    contracts:
      total: 42
      derived: 0
      marker_coverage: 0.0    # % of this provider's specs carrying a provenance marker
      callable: 88.1          # % whose servers[] resolve to a real host
agent_readiness:
  score: 51.8
  band: agent-native
  dimensions:
    spec_presence: true
    mcp_server: first-party   # a graded/provenance dimension records its STATE,
    agent_skills: derived      #   not `true` — "derived" is a different fact
    idempotency: verified      #   from "the provider runs one"
    error_semantics: documented
    agent_card: conformant
```

**Read the `provenance` block before quoting the number.** A strong `contract_quality` built on specs
API Evangelist modeled is a different fact from one built on specs the provider serves, and
`marker_coverage` tells you how much of that the score could actually see.

## The mark — the K'in sun

Every Kin Score has a visual form: **the K'in sun**. Six concentric rings, one per facet, each filled
to its score and coloured by *which facet it is*; **fourteen** triangular rays around the outside, one
per agent-readiness dimension — solid at full length when satisfied, solid but **short** when only
partially credited (a *derived* MCP server should not draw the same ray as a running one), hollow when
not. K'in is the Mayan word for sun, and for day.

The seventh, conditional `regulatory` facet is deliberately **not drawn**: seven rings is too many,
and the regulated cohort reads it from the `regulatory:` block instead.

The glyph lives in [`glyph/`](glyph/) — **that directory is the source of truth**, and
[`glyph/GLYPH.md`](glyph/GLYPH.md) is its spec: the palettes and why each was chosen, the fixed
anatomy on detail pages and listings, the data every consuming site has to supply, and the
limitations. Nothing re-implements the geometry; sites copy `glyph/dist/kin-glyph.js` and emit a
placeholder.

```
node glyph/build.mjs      # -> glyph/dist/kin-glyph.js  (parse-checked)
node glyph/make-demo.mjs  # -> glyph/demo.html          (self-contained comparison)
```

## Versioning

The rubric is a living argument and is versioned (`schema_version`). Published snapshots live in
[`rubric/`](rubric/); the full history is in [`CHANGELOG.md`](CHANGELOG.md), and where it's headed is
in [`ROADMAP.md`](ROADMAP.md). Current: **0.7**.

Every scoring pass also dumps a durable per-provider snapshot into that provider's own repo at
`all/<slug>/kin/score-<timestamp>.yml`, so a provider accumulates its Kin Score history over time.

## What the score refuses to measure

Traffic, revenue, or logos (lagging, private, gameable); subjective code taste (no human scoring);
and whether the API is "good" — only whether it is **legible**: discoverable, contracted, priced,
operable, and — where a regime applies — compliant.

## Related

- **Live scores:** [APIs.io](https://apis.io) · [providers.apievangelist.com](https://providers.apievangelist.com)
- **The methodology, explained:** [The API Rating Rubric, Explained](https://papers.apievangelist.com/papers/the-api-rating-rubric-explained/) (API Evangelist paper)
- **Sector reports** built on the score: [papers.apievangelist.com](https://papers.apievangelist.com)

---

<sub>© API Evangelist · Kin Lane · The Kin Score is published openly so it can be cited and
contested. If you disagree with a score, the productive move is "here's the public signal it missed" —
if the signal is real and machine-checkable, that's a bug worth fixing.</sub>
