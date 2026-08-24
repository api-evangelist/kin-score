# Rubric snapshots

Versioned snapshots of the Kin Score rubric. Each `scoring-<version>.yml` is the published record of
that rubric version — the facet weights, the artifact checks and their points, the output bands, the
standalone Agent Readiness block, and (0.5+) the conditional `regulatory` facet and
`industry_regulatory` applicability map.

**Source of truth:** the operational rubric and scorer are maintained in the `api-search` repository
(`signals/_data/scoring.yml` + `signals/score.rb`). These snapshots are published here on each
version bump so the score stays citable and its history auditable. See [`../CHANGELOG.md`](../CHANGELOG.md).

| Version | File | Notes |
|---------|------|-------|
| 0.12.2 | [`scoring-0.12.2.yml`](scoring-0.12.2.yml) | **The first 0.12.x that moves points.** `auth_clarity` graded by scheme class — bound 1.00 / negotiable 0.75 / bearer 0.35 — because the IETF agent-auth draft calls a static API key an antipattern for agent identity, and the dimension was paying it the same ten points as OIDC. Plus the well-known soft-200 filter now honours all seven ways the harvest records a miss instead of only the note text: 1,521 credited holdings withdrawn across five frontier targets. |
| 0.9.1 | [`scoring-0.9.1.yml`](scoring-0.9.1.yml) | **Swagger 2.0 is a contract.** A reader fix, not a rubric change — no weight, point value or band moved. The scorer classified a spec by looking for `openapi:` and every check read the 3.x container keys, so a 2.0 document was dropped from the spec index before a single check ran and a provider whose whole corpus is 2.0 scored as publishing no contract at all: 190 of a 3,024-file sample across 90 providers. The index gained ~5,800 documents and 203 providers. |
| 0.9 | [`scoring-0.9.yml`](scoring-0.9.yml) | **`asyncapi_events` renamed `event_surface_described` and widened.** A webhook can be described in OpenAPI: 125 providers use the 3.1 `webhooks` object (87) or `callbacks` (39) against zero publishing AsyncAPI. Adds `provenance.first_party_when` so a multi-class dimension grades against the class that actually satisfied it. 100 false negatives corrected, 19 false positives restored to first-party. |
| 0.8 | [`scoring-0.8.yml`](scoring-0.8.yml) | **The provenance half-measure closed.** Every check in the `openapi` block is provenance-graded, not just `contract_present` — 132 points instead of 20. 318 providers fall, none rise. |
| 0.7 | [`scoring-0.7.yml`](scoring-0.7.yml) | **Security defects the contract declares about itself.** Three new contract_quality checks: deprecated OAuth grants, credentials in the query string, and OAuth scope enumeration for every provider rather than only regulated ones. |
| 0.6.1 | [`scoring-0.6.1.yml`](scoring-0.6.1.yml) | **Provenance gap fix.** `asyncapi_events` joins the provenance map — the one agent-readiness dimension that was awarding full credit for artifacts API Evangelist authored. 1,711 providers reclassified `derived`. |
| 0.6 | [`scoring-0.6.yml`](scoring-0.6.yml) | **The provenance release.** Authorship grading, callable-server check, contract-type-agnostic scoring (GraphQL + FHIR), four spec-verified agent dimensions, the Agent-Native band gate, eleven regime-specific checks, two new regimes, the `broker`-collision fix, broadened governance, machine discoverability, the detector sanity pass — and both band sets re-cut. |
| 0.5.1 | [`scoring-0.5.1.yml`](scoring-0.5.1.yml) | Graded `agent_card` dimension (A2A) + Agent Readiness band re-cut. |
| 0.5 | [`scoring-0.5.yml`](scoring-0.5.yml) | Conditional regulatory facet + industry_regulatory map. |
