# Proposal — Kin Score 0.16.0: grade a declaration below a probe

**Status: PROPOSAL. Nothing in `scoring.yml` or `score.rb` has been changed.**
Written 2026-08-27 for [roadmap#13](https://github.com/api-evangelist/roadmap/issues/13).

## The problem, measured

Across all 27,318 scored providers on rubric 0.15.1, the 556 rubric points divide like this:

| evidence class | checks | points | share |
|---|---:|---:|---:|
| FIELD — self-written frontmatter | 41 | 232 | 41.7% |
| DECLARED — pointer/file presence only | 40 | 169 | 30.4% |
| PARSED — real spec content | 28 | 143 | 25.7% |
| **VERIFIED — provenance / liveness** | 2 | 12 | **2.2%** |

**401 of 556 points (72.1%) are satisfiable by writing text about yourself.**

The consequences are visible in the distribution, not just in theory:

- `corr(composite, declared artifact-type breadth)` = **+0.842**; `corr(composite, actual API count)` = **+0.272**
- `shopify` — 213 APIs, 1,298 operations — scores **86.6**. `xquik-api` — 3 APIs, 127 operations — scores **90.7**.
- `xquik-api` is the **only provider in the catalog with five or more perfect facets**. It has six of eight. Every other provider in the top fifteen has zero to three.

**The honest caveat:** artifact breadth and real quality genuinely correlate. A provider publishing a changelog, a status page and plans usually *is* better run, so +0.842 alone does not prove gaming. What does is the combination — 2.2% verified, one provider holding six perfect facets, and that provider outranking platforms with three orders of magnitude more surface.

## The change

Five checks award full points for a pointer that nothing ever fetches. Two of them (`change_log_present`, `status_page_present`) are literally `has_type(p, "…")` — a string in a list is worth six points.

Exact counts from the 0.15.1 checks artifacts:

| check | facet | pts | providers earning it | points held |
|---|---|---:|---:|---:|
| `llms_txt_published` | discoverability | 4 | 6,486 (23.7%) | 25,944 |
| `change_log_present` | operational_transparency | 6 | 3,567 (13.1%) | 21,402 |
| `status_page_present` | operational_transparency | 6 | 3,149 (11.5%) | 18,894 |
| `well_known_published` | discoverability | 6 | 2,510 (9.2%) | 15,060 |
| `overlay_published` | governance | 4 | 3,030 (11.1%) | 12,120 |

**93,420 rubric points are currently awarded catalog-wide on declaration alone, from these five checks.**

**Proposed:** grade them the way authorship is already graded — a probed pointer earns full marks, a declared-but-unfetched pointer earns partial (0.4 suggested). No new infrastructure: `build_provenance.py` already emits a `_method` marker and already covers 13,618 providers. It covers four artifact classes (`openapi`, `plans`, `rate_limits`, `agentic_access`); these five are simply not in it.

**Second clause, which is what actually stops the 6/8 case:** no facet reaches 100.0 on declaration alone — require at least one PARSED or VERIFIED check to carry a facet to full marks.

## The band re-cut — NOT modelled here, and why

Adding or regrading a dimension rescales everyone, and the re-cut is part of the change rather than a follow-up. **I attempted to model it from the persisted artifacts and the model does not hold.** Recording why, so the next attempt does not repeat it:

1. **Partial credit is not a constant.** `score.rb:3038` computes it as `frac * credit` — the share of specs passing times a provenance multiplier — so it varies per check *and* per provider. Assuming 0.5 made the model *raise* 5,533 composites under a credit *reduction*. That is impossible, and the impossibility is what exposed the assumption.
2. **The exactly-solvable subset is biased.** Restricting to providers with no partial checks makes `F = E/(E+M)` exact, but those 12,168 providers have a mean composite of **9.0** against the catalog's **21.3** — they are the low scorers, because a provider with nothing partial is a provider with little. A re-cut fitted on them is meaningless.
3. What the reconstruction *did* validate: for unregulated providers it reproduces the published composite to a mean absolute error of **0.02**. The residual error is entirely the conditional regulatory blend (regulated mean error 1.72–2.03), which the base-only reconstruction omits by construction.

**So the re-cut needs a real scorer run.** The safe procedure, given that [`--only` does not scope kin writes](https://github.com/api-evangelist/roadmap) — a scoped run with no `--write` still stamped 27,302 repos:

```
cd api-search/signals
ruby -c score.rb
ruby score.rb --dry-run=providers/_providers/xquik-api.md --no-kin   # regraded facets
ruby score.rb --dry-run=providers/_providers/shopify.md   --no-kin   # a big surface must not fall
ruby band_distribution.rb                                            # then re-cut
```

`--no-kin` is not optional here.

## Sequencing

- 0.15.1 is frozen and unshipped in another working tree. This waits for it.
- The release checklist applies in full: snapshot to `rubric/scoring-0.16.0.yml`, CHANGELOG entry, `rubric/README.md` row, ROADMAP status, then `bin/sync-rubric-docs.py --check` clean **before** any scoring pass.
- The rubric paper needs a prose revision, not just regenerated tables — this changes what the score *means*, which is the part a reader cites.

## Why this is a product defect, not a governance concern

The 2026-08-27 trust-framework decision settled that the rating is a **product**, with reproducibility as the constraint that replaces role separation. A published rubric that can be topped by writing files is reproducible *and* gameable. Under the product framing that is a defect in the thing being sold, which sharpens this issue rather than softening it.
