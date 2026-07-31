# Kin Score — Changelog

The Kin Score rubric is versioned (`schema_version`). Each entry records what changed and why.
Published rubric snapshots live in [`rubric/`](rubric/). The operational rubric and scorer are
maintained in the `api-search` repository (`signals/_data/scoring.yml` + `signals/score.rb`); this
changelog and the snapshots here are the canonical public record.

## 0.8 — 2026-07-31

**The provenance half-measure, closed.** This is the item the roadmap slated for 0.7 and 0.7 did
not carry.

0.6 introduced authorship grading and applied it to `contract_present` — 20 of the 132 points in
`contract_quality`. The other 112 were awarded in full regardless of who wrote the document, so a
provider whose entire specification corpus API Evangelist authored still earned credit for
`info_complete`, `operations_summary_coverage`, `operations_description_coverage`, `operationIds`,
`response_coverage`, `components_reuse` and `security_schemes_defined` — spec craftsmanship it had
no part in. We write good specs, so a thoroughly modeled provider scored well on our work.

### One rule, not twenty entries

`provenance.applies_to_artifact` grades every check in a named artifact block, so the rubric stays
the single knob and no check id has to be listed twice. An explicit per-check entry in
`applies_to` still wins. `PROV_APPLIES` is expanded from both at load.

### It grades DOWN to the floor, not to zero — deliberately

The roadmap raised this and answered it: the depth checks are also where a derived spec is most
*useful*. A thoroughly modeled OpenAPI with real descriptions and stable operationIds genuinely
helps a consumer whatever its provenance. Credit is a multiplier (derived = 0.25), never a gate.

### Blast radius, measured before writing

Measured with `--snapshot` against the live catalog rather than estimated:

- **318 providers move. All 318 fall. None rise.** Only a corpus that is ≥75% derived is affected.
- **187 change band** (0.7% of the catalog): developing→thin 90, strong→developing 56,
  thin→emerging 24, **exemplar→strong 16**, emerging→minimal 1.
- Mean composite 22.72 → 22.61. Band shares moved ≤0.3 points, so the cuts were left alone and the
  documented shares updated.
- The canonical case from the roadmap: **Yardi 57.7 → 49.6, Strong → Developing.** Its whole spec
  corpus is ours, and it had been Strong on the strength of it.

Agent readiness is untouched — these are composite checks.

## 0.7 — 2026-07-31

**Security defects the contract declares about itself.** Three checks, all added to
`contract_quality`, all measured at scale across 14,195 as-published OpenAPI documents in
*The OAuth 2.0 Standard* and *The OpenID Connect Standard*, and none of them previously visible
to the rubric.

| Check | Points | What it catches |
|---|---|---|
| `oauth_flows_current` | 4 | A contract declaring the implicit or resource-owner-password grant. 775 and 72 in the corpus; both removed in OAuth 2.1. |
| `credentials_not_in_query` | 3 | An `apiKey` scheme with `in: query`. 815 in the corpus; the credential lands in logs, history and referrer headers. |
| `oauth_scopes_enumerated` | 4 | An `oauth2` scheme whose flows enumerate no scope. Only 15.3% of contracts enumerate any. |

### All three are framed as "no violation present"

N/A is handled per artifact **class**, not per check, so a check that simply returns false where
the mechanism is unused would penalise an API for declining to use OAuth. Each of these is
therefore vacuously satisfied by a contract that does not use the mechanism at all — they score
the PRESENCE of a defect, not the absence of a feature. A bearer-token API passes all three.
Both OAS 3 (`components.securitySchemes`) and Swagger 2.0 (`securityDefinitions`, single-string
`flow`) shapes are handled.

`oauth_scopes_enumerated` is deliberately distinct from `reg_oauth_scopes`, which sits on the
conditional regulatory facet and therefore reaches only regulated providers. Scope is how OAuth
expresses least privilege for everybody, and this check applies to everybody.

### Impact

- Composite mean 22.5 → 22.7. Bands drifted ≤0.5 points and none emptied or swelled, so the
  documented shares were updated and the cuts left alone.
- 25,574 providers re-scored, 0 errors. Agent-readiness untouched — these are composite checks.
- Adding 11 points to the OpenAPI denominator means most providers gain (they pass vacuously or
  genuinely) while contracts carrying a deprecated flow or a query-string credential lose ground
  relative to their peers. That is the intended discrimination.

## 0.6.1 — 2026-07-31

**Provenance gap fix.** 0.6 introduced authorship grading so the rubric would stop crediting a
provider for artifacts API Evangelist wrote on their behalf. One dimension was left out of the map,
and it was the one where derived work is most common.

### `asyncapi_events` is now provenance-graded

`provenance.applies_to` covered `mcp_server`, `agent_skills`, `spec_presence`, `agentic_access`,
`contract_present` and `conformance_declared` — but not `asyncapi_events`, so its 6 points were
awarded in full whether the provider published an AsyncAPI document, merely documented some
webhooks, or had an event surface written for them here.

This was found while researching *The AsyncAPI Standard*, which measured the underlying fact: across
25,574 providers there are **zero** `asyncapi/_original/` archives — the directory the pipeline uses
for anything harvested verbatim — against 6,776 for OpenAPI. No provider in the catalog publishes an
AsyncAPI document we harvested. The 723 documents that exist were authored here from provider
webhook and streaming documentation.

### The indexer had to learn the class first

`signals/build_provenance.py` did not emit an `asyncapi` provenance class at all, and the obvious fix
was wrong in an instructive way. Reading the artifact header the way MCP and skills are read
classified **966 providers as first-party**, because those records say `method: searched` — which
here means *API Evangelist searched for and found the provider's event documentation*, not *the
provider published AsyncAPI*. One such record cites `source: …/openapi.yaml (Webhooks tag)`.

`index_asyncapi` now requires evidence of something the provider actually did: an `_original/`
archive, or a `source:` resolving to an AsyncAPI specification file rather than to documentation.
Result: **1,711 providers `derived`, 0 first-party** — which matches the measured reality.

### Impact

- Agent-readiness falls for providers holding an authored event surface. A representative case drops
  **29.5 → 25.5** as the 6-point dimension is credited at 0.25.
- Providers with no `asyncapi/` artifact are unchanged; `unknown` still carries full credit.
- Composite scores are untouched — `asyncapi_events` is an agent-readiness dimension only.
- The dimension now renders as `asyncapi_events: derived` rather than `true`, matching how
  `mcp_server` and `agent_skills` already report.

Three Market Reports resting on the old figure were corrected to v1.1 on the day the gap was found,
before this fix shipped.

## 0.6 — 2026-07-28

**The provenance release.** The largest correctness batch in the rubric's history, landing the
queue eight sector quartets accumulated. Both band sets are re-cut; 8.8% of the catalog
changes composite band and every one of them moved because its evidence changed.

### 1. Provenance grading — the rubric can finally see who wrote the artifact

Through 0.5.1 the score credited an artifact's **presence** and could not see its **author**.
The API Evangelist enrichment pipeline authors artifacts on a provider's behalf and stamps
each one `method: derived|generated` / `status: candidate` as it writes it. The score read
none of it, so work done *about* a provider scored as work done *by* one.

Measured across the catalog on 2026-07-28, this was not a nuance:

| Artifact class | AE-authored | Provider-published | derived |
|---|---:|---:|---:|
| Agentic-access contracts | 6,383 | 5 | **99.9%** |
| Agent skills | 2,018 | 256 | 88.7% |
| MCP servers | 1,882 | 1,164 | 61.8% |
| Conformance declarations | 1,881 | 1,903 | 49.7% |

**1,679 providers listed an `MCPServer` in their index on the strength of a candidate with
`url: null`** — earning the third-largest agent-readiness award, and a developer-ergonomics
award, for a server nobody can connect to.

Three authorship states now grade the award — `first-party` 1.00, `conformance` 0.75,
`derived` 0.25, `unknown` 1.00 — applied to `contract_present`, `mcp_server`, `agent_skills`,
`agentic_access`, `conformance_declared` and their ergonomics siblings. `conformance` exists
as a third state because energy forced it: three Ontario utilities publish the Green Button
Alliance's ESPI spec and four Australian retailers publish the DSB's `cds-energy` documents —
genuinely provider-hosted, and the provider wrote not a line. `derived` keeps a floor rather
than scoring zero because a groundable candidate is a real artifact one adapter from working;
it simply can no longer outrank the real thing.

**The limitation, stated rather than hidden.** Only artifacts this pipeline authored carry a
marker, so `unknown` is credited in full — scoring it as derived would punish providers for a
gap in our own metadata. For MCP, skills, agentic-access and conformance the marking is
effectively complete. For the **OpenAPI corpus it is 2.6%** (2,278 of 87,612 specs), so
contract provenance is a **floor, not a census**. Every score now carries its own
`provenance.contracts.marker_coverage`, and backfilling `x-provenance` across the corpus is
the top item on the roadmap. Index-level `x-provenance` in `apis.yml` is read as authoritative
for a whole repository, which is what catches the hand-curated cases — Yardi's six specs
among them.

### 2. A contract you cannot call

`servers[].url` is now parsed and graded (`servers_resolvable`, 5 pts). A resolvable production
host outscores a placeholder (`example.com`) or a bare template (`{apiRoot}`). **10,950 of
87,612 specs are uncallable as published, and 834 providers hold no spec with a resolvable host
at all.** Every CAMARA server declaration in the telecom stack is `{apiRoot}`; Majesco declares
`api.majesco.example.com` and ACORD `api.insurer-internal.example.com`.

The care this needed: a templated host that still carries a real domain —
`https://{region}.api.acme.com`, or Yardi's `https://{server}.yardi.com/{clientUrl}/webservices`
— **passes**. Only a host that is nothing but substitution variables, or a known placeholder
domain, fails. A "contains a brace" test would have failed a large share of callable
multi-region specs, and a full-text grep for `example.com` over the catalog returns 4,320 false
positives because real specs use it in their *examples*.

### 3. Contract-type-agnostic scoring

`openapi_present` becomes **`contract_present`**, satisfied by an OpenAPI, AsyncAPI, **GraphQL
SDL** or **FHIR CapabilityStatement**. `spec_presence` in Agent Readiness follows. New graded
checks for GraphQL (SDL, type depth, docstring coverage) and FHIR (CapabilityStatement,
resource coverage), both N/A when the provider has no such surface.

Entire FHIR-native, GraphQL-native and EDI-native markets were undercounted by roughly a band
for a format the rubric declined to read: Epic served a 59-resource FHIR R4 CapabilityStatement
and scored `spec_presence: false`, `contract_quality: 22.6`. The GraphQL cohort is the clearest
beneficiary — grafast, pothos, envelop, graphql-code-generator, basehub and agility-cms all
rise 10.7 points. *Honest caveat:* only 22 CapabilityStatements are held across 11 providers,
so this corrects the rubric but cannot yet correct the healthcare sector — harvesting
statements is collection work that has to follow.

### 4. Spec-verified agent readiness

The three link-based proxies become **graded**: `verified` (1.0) when the behaviour is in the
contract, `documented` (0.5) when only a provider-level link asserts it.

- `idempotency` — an `Idempotency-Key` header on mutating operations, checked against the
  operation's own parameters *and* the path item's shared ones.
- `error_semantics` — one error schema `$ref`-ed across at least two distinct error responses.
- `rate_limit_signal` — `X-RateLimit-*` / `RateLimit` / `Retry-After` in response headers,
  including shared `components.responses`.
- `openapi_examples` — graded by the **share** of operations carrying examples, replacing a
  boolean that fired on the string `example:` appearing anywhere.

Plus a new dimension, **`dry_run_mode`** (4 pts): a destructive operation exposing
`dry_run` / `simulate` / `preview` / `validate_only`. Fourteen dimensions now.

Grading rather than replacing is deliberate — superseding the proxies outright would zero every
provider with a documented behaviour and no published spec, a different error from the one
being fixed. This closes the one criticism a published competitor (Jentic's Apache-2.0 JAIRF)
can fairly make: a provider used to earn nine points for a page titled *Idempotent Requests*.

### 5. The Agent-Native band gate

**No provider reaches Agent-Native without `idempotency` AND `error_semantics`.** Agent
Readiness is additive, so strengths covered for absent safety rails: contract + agentic-access
+ MCP + auth + examples cleared the floor with every rail at zero — precisely the provider whose
agent retries a payment twice and branches on free-text errors. **1,210 providers score above
the Agent-Native cut; the gate demotes 895 of them.** A dimension satisfied at the `documented`
half-credit still passes: the gate asks whether the rail exists, not how well it is evidenced.

A weighted harmonic mean would also fix this and would destabilise every score in the catalog
for a problem that lives in one band. The gate is the proportionate version.

### 6. Regime fixes — a confirmed bug, and two missing regimes

**Regime matching is now most-specific-wins rather than first-declared.** `securities_market_data`
claimed the bare tags `broker`, `brokerage` and `exchange`, which insurance brokers match
cleanly, and 16 of 35 UK, 10 of 20 Canadian and 7 of 20 Australian insurance organizations were
being scored against MiFID II — Beazley, a Lloyd's syndicate, among them. Every regime is now
scored by tag-hit count, tie-broken on a declared `specificity`; the ambiguous tags are demoted
to `weak_tags` that count only when nothing else matched. Verified: Beazley, QBE, IAG, Lloyd's
and Hiscox all now resolve to `insurance`; Cboe stays `securities_market_data`; PPL Corporation
correctly moves to `energy_utilities`.

**Two regimes added.** `telecommunications` (FCC/CPNI, Ofcom, ACMA, ITU, ePrivacy) — 83 telecom
organizations previously fired the conditional facet seven times, via Government, Payments and
Health. `energy_utilities` (CDR Energy, Green Button/ESPI, Smart Energy Code, Ofgem Data Best
Practice, FERC Order 889). They now match 703 and 621 providers.

**Eleven regime-specific checks**, each N/A outside its regime and each resolved against the
provider's `conformance/` artifact matched to its regime's declared `standards:` list — which
turns the Standards catalog into a scoring input. Named-standard conformance, FAPI/PAR, consent
model, write surface, SMART-on-FHIR configuration, PCI+SCA, entitlement terms, third-party
certification, CAMARA conformance, and **`reg_mandate_verified`** — the largest unmeasured
effect in the catalog, where a *verified* mandate is worth ~12 points of composite while a
*claimed* one scores below having no obligation at all. Self-declared compliance is negative
signal, so a claim with no callable surface behind it earns nothing.

`reg_certification_signal` is credited **only alongside a resolvable contract**, because RESO
certification is real, independently tested, industry-mandated — and worth 2.0 measured points,
since all three certified organizations return 401 on the very contract they are certified
against.

### 7. Two facets rebuilt because they had stopped discriminating

**Discoverability** averaged 84.6 across 252 organizations in two quartets with *not one
provider at zero in any of eight markets*, including thirteen US utilities publishing no
contract at all. Its bar was human findability, which any company with a marketing department
clears. It now also credits **machine** discoverability: a `.well-known` surface (6), an
`llms.txt` (4), and a **self-hosted** APIs.json index (4). The facet mean falls to 61.2.

**Governance** had the opposite problem — effectively one check, scoring ~0 across all six
sectors measured (63 of 79 US insurance organizations at zero, 34 of 35 UK, 66 of 83 in
telecom). It now credits a declared conformance profile (6, provenance-graded) and a published
OpenAPI Overlay (4). The boundary it holds: **adopting someone else's standard is not
governance.** Joining CAMARA or TM Forum earns nothing; governance is what you do to yourself.

### 8. The detector sanity pass

Every scoring run now flags facets and dimensions that are unanimously zero across the catalog,
signals so saturated they no longer discriminate, and **providers with a strong developer
surface and no contract found** — the shape of a missed harvest rather than a company without
an API. Two detector bugs had already been caught by hand in this series, and both looked
plausible until checked; two confident negatives (REA Group, recorded as publishing no OpenAPI
while serving nine, and AEMC, recorded as having no API while serving 304 versions of the
National Electricity Rules) were wrong in the same direction — *the agent did not find it, so
it concluded it did not exist*. The first run flags **24 reprofile candidates**.

### Bands re-cut — both sets

**Composite 70/60/45/30/15 → 66/56/42/28/13.** 0.6 is a correctness release, not a change in
ambition: a provider that published nothing different should not change band because the rubric
learned to read authorship. The batch moved the composite by a mean of −1.92, so the cuts move
with it, and the re-cut preserves what each rung means (exemplar 1.1% → 1.0%, strong 3.8% →
4.1%, developing 13.4% → 13.7%, thin 15.0% → 15.0%, emerging 22.5% → 23.5%, minimal 44.2% →
42.6%). 2,239 providers change band — 8.8%, against 13.8% if the old cuts were left alone.

**Agent Readiness 56/42/14 → 46/34/6**, each cut at a real feature of the re-scored
distribution: 6 is the valley above the no-signal floor, **34 sits above the collapsed
enrichment plateau** (34–36 holds 244 against 2,084 at 30–32), 46 is the shoulder of a >50%
drop. Agent-native falls from 6.1% to 1.2%, and that *is* the finding — most of the old cohort
was agent-native on artifacts API Evangelist wrote.

### Also

- New `signals/build_provenance.py` builds `signals/_data/provenance.json`; run it before
  every scoring pass.
- `score.rb --snapshot=PATH` dumps the full result set without touching a provider file, so
  bands can be cut against the new distribution rather than the one already shipped.
- Scored output carries a `provenance:` block; the `kin/` artifact and the glyph carry it too.
- **The K'in sun gains two rays** (14 total) — `agent_card` shipped in 0.5.1 and was never
  drawn — and a **three-state ray**: solid at full length, solid at 55% for partial credit,
  hollow when unsatisfied. The compact listing encoding becomes a trit string; `1` keeps its
  old meaning so pre-0.6 payloads still render correctly.

## 0.5.1 — 2026-07-28

**Added the A2A Agent Card to Agent Readiness, and re-cut its bands.**

Additive and standalone: the composite, the six base facets and the conditional regulatory
facet are untouched. No provider's composite score moves.

- New **`agent_card` dimension** (8 points) in the standalone Agent Readiness score. The
  provider serves a machine-readable agent discovery manifest at the A2A well-known path,
  `/.well-known/agent-card.json` ([RFC 8615](https://www.rfc-editor.org/rfc/rfc8615)),
  advertising its identity, capabilities, skills, endpoint and auth.
- **The first *graded* dimension in the rubric.** Every other dimension is a bit; this one is
  scored against the [A2A 1.0.0](https://a2a-protocol.org/latest/specification/) `AgentCard`
  object on a three-step scale — `conformant` 1.0, `near-conformant` 0.6, `flavored` 0.25.
- **Agent Readiness bands re-cut, 60/45/15 → 56/42/14.** Mandatory, not cosmetic: the score is
  `earned / max`, so a new dimension raised `max` from 104 to 112 and rescaled every provider's
  score by 104/112. At the old cut points that arithmetic alone would have **demoted 3,726
  providers (14.6% of the catalog)** for publishing nothing different — the baseline plateau
  falls from 48 to 44.6, just under the old 45 line. The cuts are re-derived at the same valleys
  in the rescaled distribution. Net effect: **15 providers change band, every one of them
  upward, and every one because it publishes an agent card.**
- Scored output now records the **grade**, not a boolean: `dimensions.agent_card: conformant`.

**Motivation.** A survey of the catalog on 2026-07-28 — every absolute host recorded across
25,622 providers, reduced to **22,341 unique hosts** and fetched at the canonical path plus the
pre-0.3 `/.well-known/agent.json` — found **65 providers serving an agent card, and only 10
conformant.** Fifty-five invented their own shape: `capabilities` as an array where the spec
defines an object, `supportedInterfaces` where the spec says `additionalInterfaces`, no
`protocolVersion` at all. A boolean would have recorded 65 adopters of a specification 41 of
them are not following, which is why this dimension grades.

Two findings shaped the weighting. First, the Agent Card is **decoupling from A2A**: several
conformant cards point at MCP endpoints, and one declares `preferredTransport: MCP`, which is
not an A2A transport. What is being scored is machine-readable agent *discovery*; A2A
conformance is a grade within it, not the container. Second, and the reason it outweighs
`agent_skills` despite 0.29% adoption — **an agent card cannot be derived.** It is served from
the provider's own host or it does not exist. Where `mcp_server`, `agent_skills` and
`agentic_access` can all credit an artifact API Evangelist authored on a provider's behalf —
the provenance defect that distorted the insurance and telecom sector reports — this dimension
is provider-published by construction and immune to it.

## 0.5 — 2026-07-23

**Added a conditional regulatory facet.**

- New **`regulatory` facet** (weight 0.15), **conditional** — it enters the composite only for
  providers in a regulated industry, matched by tags via the new **`industry_regulatory`** map.
  When it applies, the six base facets (whose weights sum to 1.0) scale to the remaining 0.85 and
  regulatory takes a fixed 0.15 slice; when it does not apply, the composite is the base six-facet
  score, **unchanged from 0.4**. Unregulated providers do not move.
  ```
  regulated  → composite = 0.85 · base + 0.15 · regulatory
  otherwise  → composite = base
  ```
- New **`industry_regulatory`** applicability map seeding six regime families — **banking & open
  finance** (CDR, UK Open Banking, PSD2, 1033, FDX), **securities & market data** (MiFID II,
  SEC/FINRA, data licensing), **health** (HIPAA, FHIR, 21st Century Cures, EHDS), **payments**
  (PCI-DSS, card rules, ISO 20022), **insurance** (NAIC, open insurance, IDD), and **government**
  (FedRAMP, eIDAS, open-data standards). Applicability is tag-based and extensible.
- New **regulatory checks** (regime-agnostic in 0.5): consent-scoped authorization (OAuth/OIDC
  scopes), authentication model documented, security posture published, vulnerability-disclosure
  program, terms of service, privacy policy, compliance/certification disclosure, and data-standard
  conformance. Regime-*specific* checks (e.g. FAPI for open banking, a FHIR capability statement for
  health) are the intended next iteration.
- Scored output now carries a **`regulatory:`** sub-block (`applies`, `regime`, `regime_id`,
  `score`) for regulated providers.

**Motivation.** The API Evangelist sector reports on Australian banking and market data surfaced a
gap: in a regulated space, the consent, security, and compliance posture a regime demands is core to
readiness, and an API that ignores it should score lower — but a weather or maps API should never be
judged against a regime that doesn't apply to it. A conditional facet captures both.

## 0.4 — 2026-07-17

- Six-facet composite: contract_quality (0.25), developer_ergonomics (0.20), commercial_clarity
  (0.20), operational_transparency (0.13), governance (0.12), discoverability (0.10).
- Standalone **Agent Readiness** score (twelve dimensions, own bands), never merged into the
  composite.
- Bands re-cut against the observed catalog distribution (2026-07-15 snapshot, 8,956 providers):
  split the old undifferentiated 0–29 `minimal` bucket into `minimal` (0–14.9) and `emerging`
  (15–29.9) at the real valley in the distribution; expressed `exemplar` as an open-ended 70+ floor.
- Checks on absent artifact types treated as N/A (excluded from the facet denominator) rather than
  scored as zero.

---

<sub>Rubric versions are snapshots of a living argument. Weights, points, regimes, and bands are
tunable and are re-derived against the catalog distribution after any material change.</sub>
