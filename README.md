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

The Kin Score has four parts. Only the first is the headline 0–100 composite; **Agent Readiness** and
**Accountability** are standalone scores displayed beside it, never blended into it. Cutting across
all of them, from 0.6, is **provenance** — the question of who published the artifact being scored.

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

<!-- kin-score:facets:start -->
| Facet | Weight | Checks | The question it asks |
|-------|:------:|:------:|----------------------|
| **Contract Quality** | 0.25 | 40 | Is there a machine-readable contract at all — in any format — and can you call it? |
| **Developer Ergonomics** | 0.20 | 13 | Can a human get started — docs, portal, SDKs, auth clarity, a real description? |
| **Access Clarity** | 0.20 | 9 | What does it cost, what are you permitted to do, and how do you get in? |
| **Operational Transparency** | 0.13 | 9 | Will it tell you when it changes or breaks? |
| **Contract Governance** | 0.12 | 6 | Is anyone holding the contract itself to a standard? |
| **Discoverability** | 0.10 | 12 | Can an agent find you *without being told where to look*? |

**89 base checks.** Plus 22 more in the two conditional facets, for 111 in total.
<!-- kin-score:facets:end -->

Checks on artifact types a provider doesn't ship are **N/A** — excluded from that facet's
denominator — so a facet is never depressed for a kind of artifact the API legitimately doesn't have.

**Two facets were renamed in 0.12, and the renames are not cosmetic.** `governance` became
**Contract Governance**, because it scores artifacts describing a *contract* and never measured how
an organisation governs itself — the standalone `accountability` layer now does that, and one word
could not carry both. `commercial_clarity` became **Access Clarity**, because for a free statutory
interface or a provider whose own OpenAPI says *"No authentication, no registration, no rate limit,
no quota"*, the word *commercial* described nothing; 14 of the facet's 38 points were never
commercial. **Both key names are emitted side by side through 0.12.x** — they are schema, not labels,
and appear in ~27,300 files including data bundles inside sold reports. The old keys drop at 1.0.

**What Contract Governance does NOT read (0.12, roadmap#62).** These checks read what a ruleset
*declares*, never the result of running it. Spectral is not executed against the provider's own spec.
The facet text through 0.11 described lint outcomes, which was reported and confirmed as a defect.
Outcome-based linting is a separate artifact class and is not in this release.

### 1b. Applicability — `na`, and it leaves the denominator

Since 0.12 a check can be **`na`** and drop out of the denominator entirely rather than scoring zero
inside it. Applicability is derived per provider into `all/0-working/applicability.json`, from
evidence and never from a sector label.

- **`write_surface`** — **1,008 of the 7,579 providers holding a contract (13.3%) are entirely
  read-only.** `dry_run_mode`, `idempotency` and `reversibility_documented` are `na` for them: every
  request to a read API already *is* a dry run, a GET is idempotent by definition, and there is
  nothing to reverse.
- **`commercial_surface`** — **212 providers have none by design.** Five derived signals must all
  hold. Keyed on evidence: one of them is a German *UG*, a private company rather than a public body,
  and only the evidence catches that.
- **`event_surface_described` is deliberately NOT gated.** A read-only API can publish webhooks —
  5.4% already do — and excusing it would be the blanket excuse the original proposal warned itself
  it could become.

The control that makes this defensible rather than charitable: on rate-limit signalling, which
applies to a read-only API exactly as much as to any other, read-only providers score **better** than
everyone else — 82.0% against 76.2% and 73.8%. Ahead where the dimension applies, and at zero only
where it cannot.

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

A **conditional facet that applies only to providers in a regulated industry**, matched by tags via
the `industry_regulatory` map — **nine regimes** as of 0.12: banking & open finance, securities &
market data, health, payments, insurance, telecommunications, energy & utilities, **education &
research**, and government. It
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

**It is scored against its own regime's peers, not against itself (0.12, roadmap#34).** Through 0.11
the facet was folded in relative to the provider's own base, which systematically dragged down every
provider correctly identified as regulated — the rubric was penalising companies for being in a hard
industry:

```
0.11:  composite = base + w · (regulatory − base)          # drags every regulated provider down
0.12:  composite = base + w · (regulatory − regime_mean)   # zero at the peer mean
```

A provider **at** its regime mean scores exactly `base`; above its peers it gains, below it loses,
and the systematic penalty disappears by construction. The means are **frozen per rubric version**
rather than computed live, so a score stays reproducible from a published snapshot.

<!-- kin-score:regime-means:start -->
Measured at rubric 0.12.0 on 2026-08-18, across 8,991 regulated providers:

| Regime | Mean | | Regime | Mean |
|---|---:|---|---|---:|
| Securities & Market Data | 35.2 | | Insurance | 27.2 |
| Payments | 32.5 | | Government & Public Sector | 21.7 |
| Banking & Open Finance | 31.1 | | Energy & Utilities | 19.4 |
| Telecommunications | 29.5 | | Health | 18.7 |
| Education & Research | 27.6 | | | |
| *All regulated* | *24.9* | | | |
<!-- kin-score:regime-means:end -->

One consequence, paid for the hard way: re-centring subtracts a constant, so the composite can leave
0–100 and is now **clamped**. A near-zero base in a regime whose mean is 30.8 computes to −3.6, and a
full catalog run crashed on exactly that, because nothing sits below `minimal`'s floor of zero.

### 2b. Open Source Surface — the second conditional facet (0.11+)

<!-- kin-score:conditional-facets:start -->
| Conditional facet | Weight | Checks | Applies when |
|---|:---:|:---:|---|
| **Regulatory Posture** | 0.15 | 18 | The provider's tags match one of **nine regulated regimes** |
| **Open Source Surface** | 0.10 | 4 | The product itself is open source *and* we hold a live repository read |
<!-- kin-score:conditional-facets:end -->

Open Source Surface asks one question: does the repository publish the maintainership surface a
consumer needs in order to **depend** on it — a vulnerability-disclosure path, a documented
contribution route, a published release history, a stated code of conduct. A closed-source company
with no `CONTRIBUTING.md` is not deficient, it is differently shaped, so the facet never applies to
it. Neither does it apply where the repository could not be read: **unreadable is not missing.**

Conditional facets generalised to N in 0.11. Each applicable one takes a fixed slice while the base
facets scale to the remainder:

```
composite = (1 − Σwᵢ) · base + Σ(wᵢ · facetᵢ)
```

which reduces exactly to the single-conditional form, so no unregulated, closed-source provider
moves. `open_source` keeps the 0.11 relative-to-base form: it has never been checked for the same
uncalibrated drag the regime re-centring fixed, and the math is identical, so it is deliberately
left alone rather than "fixed" on an assumption.

### 3. Agent Readiness — a standalone layer

A separate 0–100 score with its own `schema_version`, its own bands and its own dimensions,
measuring how safely an autonomous **agent** — not just a human — can drive the API. It is **never
merged into the composite**: the two are correlated but distinct, and are displayed side by side.

Unlike the composite, a missing contract here is a **real deficiency, not N/A** — an API with no
machine-readable contract cannot be driven by an agent at all, so every dimension stays in the
denominator.

<!-- kin-score:agent-dimensions:start -->
| Dimension | Points | What it asks |
|---|:---:|---|
| **Machine-Readable Contract** | 18 | Is there an OpenAPI contract to drive at all? |
| **MCP Server** | 12 | Is there a live Model Context Protocol surface — *probed*, not pointed at? |
| **Agentic Access Contract** | 10 | Are operations classified by action-class, consequence and escalation? |
| **Machine-Readable Auth** | 10 | Can auth be negotiated without reading prose? |
| **Idempotency** | 9 | Can an agent retry without double-charging a card? |
| **Stable Error Semantics** | 8 | Can an agent branch on errors, or only on free text? |
| **A2A Agent Card** | 8 | Is there an agent discovery manifest at the well-known path? |
| **Request/Response Examples** | 7 | Can an agent learn a payload shape before its first call? |
| **Rate-Limit Signaling** | 7 | Does it surface live rate-limit state in response headers? |
| **Documented Reversibility** | 6 | Can the action be taken back, and within what window? |
| **Typed Event Surface** | 6 | Is the webhook/event surface described by a contract? |
| **Delegated User Identity** | 6 |  |
| **Registration Without a Human** | 6 |  |
| **Agent Skills** | 5 | Are operating instructions packaged, not inferred? |
| **Protected Resource Metadata** | 5 |  |
| **Agentic Commerce Surface** | 5 |  |
| **Well-Known Catalog** | 4 | Is there an RFC 9727 `api-catalog` linkset? |
| **Dry-Run / Simulate Mode** | 4 | Can a destructive operation be rehearsed before it commits? |
| **Consent & Bot Identity** | 3 | AIPREF / Content-Signals / Web Bot Auth — the frontier signals. |

**19 dimensions, 139 points**, normalised to 0–100.
<!-- kin-score:agent-dimensions:end -->

**`reversibility_documented` is the 0.12 addition**, and it was preferred over a consequence
multiplier on dry-run and idempotency for a reason that holds up: a multiplier needs whole markets
classified by hazard, while this measures something no dimension covered and needs no such
classification. It is what an agent needs *before* it acts — dry-run lets it rehearse and idempotency
stops it double-firing, but neither says whether the action can be taken back. Graded:
`documented` for a reversal operation in the contract, `verified` when a window is stated too. A
window with no reversal operation behind it earns nothing — that is a policy sentence, not a
capability. Measured 2026-08-18 across the 7,579 providers holding a contract: 1,353 (17.8%) expose a
reversal operation, 343 (4.5%) document a window, 171 (2.3%) do both.

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

### 4. Accountability — a standalone layer, declared not yet scored

A third layer (`schema_version` 0.1, `scored: false`) asking a question neither of the others can:
**who is answerable for this organisation's use of a technology, and what must happen before it is
deployed.** It is separate from Contract Governance on purpose — that separation is the whole reason
for the 0.12 rename. Contract Governance measures artifacts about a contract; this measures
organisational posture. Domains: `ai`, `data`, `security`, `access` — only `ai` is active.

Nine checks: a policy that **resolves** (a status code, not a link), is versioned with an approval
date and review cycle, has a named **role** owning it (DPO, CISO, Chief Trust Officer, SIRO), a
senior accountable officer, a standing body with a named chair, a **mandatory** impact assessment
before deployment, scoping against a **named regulation** rather than generic ethics language — and a
**proportionality clause**: the policy must contemplate *not* deploying. That last one is the check
that stops this becoming a hype index. A ranking that cannot rank restraint above enthusiasm is not
measuring governance.

Two constraints are built in before a single score is published:

- **Every check is tiered.** Tier 1 is machine-checkable catalog-wide; Tier 2 is researched and runs
  only on a profiled cohort. **A Tier-1-only organisation is never ranked against a Tier-2 one**, and
  every published score carries its tier — because cohorts enriched to different depths measure our
  coverage as much as they measure the market.
- **Every check carries an attribution class** naming whose gap a zero is: `catalog` (we can satisfy
  it alone), `index` (their surface, our pointer — probe first), `language` (published, not in a
  language we read), `authwall` (published, behind SSO or a customer portal), `frontier` (only the
  organisation can produce it). A zero in `language` or `authwall` is **our** research gap and may
  never be reported as an institutional finding.

Bands are placeholders until a real cohort is scored: **Governed**, **Owned**, **Provisioned**,
**Declared**, **Undeclared**.

## The bands

Cut against the observed catalog distribution, at its valleys — never at round numbers. Re-derived
after any material rubric change with `signals/band_distribution.rb`.

<!-- kin-score:bands:start -->
| Band | Composite | Share of catalog | What it means |
|------|:---------:|:----------------:|---------------|
| **Exemplar** | 66.5+ | 1.0% | Reference-quality API operations across every facet — a rich contract, published governance, transparent operations, and machine-readable commercial terms. |
| **Strong** | 54.3 – 66.4 | 3.8% | Solid contracts, transparent operations, and an easy start. |
| **Developing** | 39.3 – 54.2 | 13.3% | Real signal across most facets with visible, nameable gaps. |
| **Thin** | 26.2 – 39.2 | 15.9% | Limited machine-readable signal and partial portal coverage. |
| **Emerging** | 11 – 26.1 | 24.0% | More than an index entry, but the surface is still mostly links rather than artifacts. |
| **Minimal** | 0 – 10.9 | 41.9% | Index entry only; little beyond a description and a link. |
<!-- kin-score:bands:end -->

<!-- kin-score:agent-bands:start -->
| Band | Score | Share | Meaning |
|---|:---:|:---:|---|
| **Agent-Native** | 38.7+ | 1.1% | Built to be driven by agents, and the provider built it — a contract, a real agent surface the provider itself publishes, and the safety rails the band gate now requires: idempotency AND a stable error envelope. |
| **Agent-Ready** | 28.6 – 38.6 | 9.6% | An agent can drive the core surface. |
| **Agent-Aware** | 5.1 – 28.5 | 26.1% | Partial machine-readable surface. |
| **Human-Only** | 0 – 5 | 63.1% | Little an agent can consume without a human first reading the site. |
<!-- kin-score:agent-bands:end -->

**`Emerging` was split out of `Minimal`**, and it is the most useful band on the list. A quarter of
the catalog was being told "you publish nothing" when it had a portal, some common links, perhaps a
spec — and was one well-targeted afternoon from moving a full band.

**The 0.11 re-cut was severe.** `exemplar` nearly halved (341 → 194 providers) and `strong` fell by a
quarter (1,207 → 902) in the single rebuild that took published scores from 0.9.1 to 0.11.0. Any
band, share or cohort statistic quoted from before **2026-08-11** is on an older rubric — re-derive
it rather than reusing it.

Both sets have been **re-cut with the rubric**, which is part of the change rather than a follow-up
to it. Two rules the catalog has taught, both the hard way:

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
    governance: 0.0             # emitted side by side with its 0.12 name...
    contract_governance: 0.0    #   ...until the old keys drop at 1.0
    operational_transparency: 31.6
    developer_ergonomics: 60.9
    commercial_clarity: 44.7
    access_clarity: 44.7
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
    reversibility_documented: na   # read-only surface — LEFT the denominator,
    dry_run_mode: na               #   which is not the same fact as a zero
    agent_card: conformant
```

**Read the `provenance` block before quoting the number.** A strong `contract_quality` built on specs
API Evangelist modeled is a different fact from one built on specs the provider serves, and
`marker_coverage` tells you how much of that the score could actually see.

## The mark — the K'in sun

Every Kin Score has a visual form: **the K'in sun**. Six concentric rings, one per facet, each filled
to its score and coloured by *which facet it is*; **fifteen** triangular rays around the outside, one
per agent-readiness dimension — solid at full length when satisfied, solid but **short** when only
partially credited (a *derived* MCP server should not draw the same ray as a running one), hollow when
not. K'in is the Mayan word for sun, and for day.

The two conditional facets — `regulatory` and `open_source` — are deliberately **not drawn**: eight
rings is too many, and the cohorts they apply to read them from the `regulatory:` and `open_source:`
blocks instead.

The glyph lives in [`glyph/`](glyph/) — **that directory is the source of truth**, and
[`glyph/GLYPH.md`](glyph/GLYPH.md) is its spec: the palettes and why each was chosen, the fixed
anatomy on detail pages and listings, the data every consuming site has to supply, and the
limitations. Nothing re-implements the geometry; sites copy `glyph/dist/kin-glyph.js` and emit a
placeholder.

```
node glyph/build.mjs      # -> glyph/dist/kin-glyph.js  (parse-checked)
node glyph/make-demo.mjs  # -> glyph/demo.html          (self-contained comparison)
```

### Embedding it

A provider can put their own sun on their own site. `https://apis.io/badge/{slug}/` builds the
snippet; the badge renders from the **live** score, so it stays current without being re-pasted.
Three shapes (sun, card, README pill), light and dark, plus the score as JSON. The contract — the
shapes, the parameters, the freshness guarantee, and what may and may not be done with the mark — is
[`EMBED.md`](EMBED.md).

The badge is also how the score travels: each embed is a plain, followed link from the provider's own
site back to the profile the number came from.

### Sharing it

Every scored provider also has a **card** — a 1200×630 share image carrying the sun, the name, the
composite and its band, agent readiness, and all six base facet values. It is the `og:image` on that
provider's detail page on both apis.io and providers.apievangelist.com, so sharing the page anywhere
shows the score rather than a cropped logo or a generic site card.

```
https://kinlane-images.s3.amazonaws.com/shared/kin-score/cards/<slug>.png
```

Built by [`cards/`](cards/) from provider frontmatter, drawing the sun from `glyph/` like everything
else. One card serves both sites, so it names no domain. [`cards/README.md`](cards/README.md) has the
URL contract, the refresh procedure after a rescore, and the caching trade-off behind the stable URL.

## Versioning

The rubric is a living argument and is versioned (`schema_version`). Published snapshots live in
[`rubric/`](rubric/); the full history is in [`CHANGELOG.md`](CHANGELOG.md), and where it's headed is
in [`ROADMAP.md`](ROADMAP.md).

<!-- kin-score:version:start -->
Current: **0.14.0** — published 2026-08-23.
<!-- kin-score:version:end -->

A score is only interpretable against the rubric that produced it, so `schema_version` is stamped on
every score block and every published snapshot is frozen and kept.

### Keeping the documents aligned

The tables above, the ones in the [paper](https://papers.apievangelist.com/papers/the-api-rating-rubric-explained/),
and the version stamps on both are **generated from the frozen snapshot** rather than maintained by
hand:

```
python3 bin/sync-rubric-docs.py            # rewrite every generated block
python3 bin/sync-rubric-docs.py --check    # report drift, exit 1
python3 bin/sync-rubric-docs.py --diff     # --check, plus the diff
```

It reports three kinds of drift. **Block** and **version** drift it fixes. **Source** drift it will
not: if the working rubric in `api-search/signals` differs from the frozen snapshot while still
declaring the same `schema_version`, behaviour has changed under a released version number and the
next scoring pass will stamp scores with a version that does not describe them. That is the failure
0.11.0 shipped as — inside an unrelated commit, named nowhere — and fixing it is a release decision
(bump, freeze, changelog), never a rewrite. **Run `--check` before any scoring pass and after any
rubric change.**

Every scoring pass also dumps a durable per-provider snapshot into that provider's own repo at
`all/<slug>/kin/score-<timestamp>.yml`, so a provider accumulates its Kin Score history over time.

## What counts as public — and why the gate is the point

The score reads **only what a member of the public can reach with a browser and no credentials**.
A company's own site, its developer portal and documentation, the specifications it publishes for
public use, its public repositories, and its public status, pricing and changelog pages. Nothing is
obtained by breaching a system, defeating an access control, or using credentials of any kind —
**including credentials we have legitimately been granted**. Where API Evangelist holds a sandbox key
issued by a provider, the score still reads only what answers anonymously.

So an API behind a partner agreement, a signed developer contract, a sales call or a
customer-sponsored integration is **out of scope by design**. It is not scored as a failure and it is
not evidence of a defect. It simply cannot earn credit, because nothing about it can be verified by
anyone else — and a rating nobody can reproduce is not a rating.

**That boundary is the entire argument, not a limitation of it.**

The score is comparative. When a provider gates something, the finding is not "you are hiding
something" — it is that **a direct competitor published the same thing openly, and is legible to
every developer and every agent evaluating that market while you are not.** Where a whole cohort
gates a capability, that is a sector finding worth writing up. Where one company gates what its peers
publish, that is a question its own customers will eventually ask.

The fix is always the same and always available: **publish it.** Not a partnership, not a purchase,
not a negotiation with us — a public URL. Every point on this rubric can be earned by a provider
deciding to open something up, on their own timetable, without telling us. That is the intended
response, and the reason the whole rubric is published rather than sold.

When a provider says "but we do have that, it's just in our partner program," both things are true at
once: they are right about the capability, and the score is right that the public cannot reach it.
The profile should record the capability plainly so the company is not misrepresented, and the score
should keep counting only what is open.

## What the score refuses to measure

Traffic, revenue, or logos (lagging, private, gameable); subjective code taste (no human scoring);
and whether the API is "good" — only whether it is **legible**: discoverable, contracted, priced,
operable, and — where a regime applies — compliant.

## What the rubric has surfaced

A score applied to one provider is a scorecard. The same score applied across many markets is a
comparison — and the comparison is where the instrument earns its keep.

[**FINDINGS.md**](FINDINGS.md) records what applying this rubric consistently across 2,322 companies
in eleven markets revealed that no single measurement could: that a mandate produces exactly what it
names and nothing adjacent; that **zero of those 2,322 companies describe a multi-step workflow**
against 51–98% publishing a contract; that three unrelated markets converged on a shared vocabulary
nobody governs; that the standards which actually got adopted are the narrow ones that removed a
concrete cost, while the broad well-designed ones did not; and that the upper band of every industry
measured sits within four points of every other, so the composite is not where markets actually
differ.

It also records what each market taught the rubric about itself — every one produced a defect that
inspection alone would not have found, and those are queued in [`ROADMAP.md`](ROADMAP.md).

## Related

- **Live scores:** [APIs.io](https://apis.io) · [providers.apievangelist.com](https://providers.apievangelist.com)
- **What the rubric has surfaced:** [FINDINGS.md](FINDINGS.md)
- **The methodology, explained:** [The API Rating Rubric, Explained](https://papers.apievangelist.com/papers/the-api-rating-rubric-explained/) (API Evangelist paper)
- **Sector reports** built on the score: [papers.apievangelist.com](https://papers.apievangelist.com)

---

<sub>© API Evangelist · Kin Lane · The Kin Score is published openly so it can be cited and
contested. If you disagree with a score, the productive move is "here's the public signal it missed" —
if the signal is real and machine-checkable, that's a bug worth fixing.</sub>
