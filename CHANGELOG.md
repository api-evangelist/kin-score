# Kin Score — Changelog

The Kin Score rubric is versioned (`schema_version`). Each entry records what changed and why.
Published rubric snapshots live in [`rubric/`](rubric/). The operational rubric and scorer are
maintained in the `api-search` repository (`signals/_data/scoring.yml` + `signals/score.rb`); this
changelog and the snapshots here are the canonical public record.

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
