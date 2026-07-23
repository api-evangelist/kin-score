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

The Kin Score has three parts. Only the first is the headline 0–100 composite.

### 1. The composite — six base facets

Six facets, each scored 0–100 from artifact checks, combined by weight into the composite. The
weights sum to 1.0 and are the argument the score is making about what matters.

| Facet | Weight | The question it asks |
|-------|:------:|----------------------|
| **Contract quality** | 0.25 | Is there a machine-readable contract at all? (OpenAPI/AsyncAPI/JSON Schema/JSON-LD) |
| **Developer ergonomics** | 0.20 | Can a human get started? (docs, portal, SDKs, auth clarity, real description) |
| **Commercial clarity** | 0.20 | Can they tell what it costs and how to sign up? (plans, pricing, terms) |
| **Operational transparency** | 0.13 | Will it tell you when it changes or breaks? (status, changelog, rate limits, deprecation) |
| **Governance** | 0.12 | Is anyone minding a standard? (Spectral rulesets, vocabulary) |
| **Discoverability** | 0.10 | Can an agent find you without being told where to look? (apis.yml, tags, identity) |

Checks on artifact types a provider doesn't ship are **N/A** — excluded from that facet's
denominator — so a facet is never depressed for a kind of artifact the API legitimately doesn't have.

### 2. The regulatory facet — conditional (schema 0.5+)

A **seventh facet that applies only to providers in a regulated industry**, matched by tags via the
`industry_regulatory` map (banking & open finance, securities & market data, health, payments,
insurance, government — extensible). It measures the consent, security, legal, and
standards-conformance posture a regime demands: consent-scoped OAuth/OIDC scopes, a published
security + vulnerability-disclosure posture, terms/privacy as legal basis, and evidence of
conformance to the industry's data standard.

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

A separate 0–100 score (its own bands, its own twelve dimensions) measuring how safely an autonomous
**agent** — not just a human — can drive the API: machine-readable contract, agentic-access contract,
MCP server, auth clarity, idempotency, stable error semantics, rate-limit signal, event contracts,
agent skills, well-known catalog, consent/identity. It is **never merged into the composite** — the
two are correlated but distinct, and are displayed side by side.

## The bands

The composite maps to a band, calibrated to the observed catalog distribution (not round numbers):

| Band | Composite | Meaning |
|------|:---------:|---------|
| **Exemplar** | 70+ | Adopt-ready today, human or agent. |
| **Strong** | 60–69.9 | Solid; a facet or two short of exemplary. |
| **Developing** | 45–59.9 | The basics exist, with real, nameable gaps. |
| **Thin** | 30–44.9 | A contract may exist but the surrounding experience is bare. |
| **Emerging** | 15–29.9 | More than an index entry, but mostly links rather than artifacts. |
| **Minimal** | 0–14.9 | Index entry only; little a machine can act on. |

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
agent_readiness:
  score: 84.6
  band: agent-native
```

## Versioning

The rubric is a living argument and is versioned (`schema_version`). Published snapshots live in
[`rubric/`](rubric/); the full history is in [`CHANGELOG.md`](CHANGELOG.md). Current: **0.5**.

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
