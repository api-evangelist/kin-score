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
| 0.6.1 | [`scoring-0.6.1.yml`](scoring-0.6.1.yml) | **Provenance gap fix.** `asyncapi_events` joins the provenance map — the one agent-readiness dimension that was awarding full credit for artifacts API Evangelist authored. 1,711 providers reclassified `derived`. |
| 0.6 | [`scoring-0.6.yml`](scoring-0.6.yml) | **The provenance release.** Authorship grading, callable-server check, contract-type-agnostic scoring (GraphQL + FHIR), four spec-verified agent dimensions, the Agent-Native band gate, eleven regime-specific checks, two new regimes, the `broker`-collision fix, broadened governance, machine discoverability, the detector sanity pass — and both band sets re-cut. |
| 0.5.1 | [`scoring-0.5.1.yml`](scoring-0.5.1.yml) | Graded `agent_card` dimension (A2A) + Agent Readiness band re-cut. |
| 0.5 | [`scoring-0.5.yml`](scoring-0.5.yml) | Conditional regulatory facet + industry_regulatory map. |
