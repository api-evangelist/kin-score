# Kin Score — Changelog

The Kin Score rubric is versioned (`schema_version`). Each entry records what changed and why.
Published rubric snapshots live in [`rubric/`](rubric/). The operational rubric and scorer are
maintained in the `api-search` repository (`signals/_data/scoring.yml` + `signals/score.rb`); this
changelog and the snapshots here are the canonical public record.

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
