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
| 0.5 | [`scoring-0.5.yml`](scoring-0.5.yml) | Conditional regulatory facet + industry_regulatory map. |
