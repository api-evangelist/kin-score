# Kin Score — What the Rubric Has Surfaced

The [roadmap](ROADMAP.md) records what the rubric gets wrong and what it should do next. This
document records the other half: **what applying one instrument consistently across many markets has
revealed that no single measurement could.**

That distinction matters. A score applied to one provider is a scorecard. The same score applied to
2,272 companies across ten markets, on the same rubric, in the same month, is a comparison — and
almost everything below exists only because the comparison is possible.

Written 2026-08-15 from the ten market reports listed at the end. Every figure is reproducible from
the artifacts those companies publish themselves.

---

## The measurement

| market | reported on | Kin | AR | OpenAPI | MCP | events | Arazzo |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Revenue software | 517 | 53.8 | 48.0 | 58% | 46% | 29% | **0** |
| Marketing | 814 | 49.1 | 42.7 | 51% | 37% | 24% | **0** |
| US healthcare | 75 | 38.9 | 30.6 | 57% | 28% | 31% | **0** |
| Creator economy | 191 | 52.8 | 43.0 | 88% | 27% | 23% | **0** |
| Government | 63 | 48.6 | 40.5 | 95% | 17% | 13% | **0** |
| HR and workforce | 170 | 50.3 | 38.5 | 90% | 16% | 24% | **0** |
| Climate and energy | 96 | 50.2 | 39.3 | 98% | 14% | 11% | **0** |
| Gaming | 66 | 50.5 | 37.0 | 86% | 12% | 14% | **0** |
| Weather and geospatial | 115 | 49.5 | 36.9 | 97% | 11% | 10% | **0** |
| IoT | 165 | 51.0 | 40.3 | 87% | 10% | 23% | **0** |

Two production models are mixed here and the difference matters when comparing. Revenue, marketing
and healthcare are **cohorts** — hand-built rosters, every company re-profiled to current before
measurement. The other seven are **industry sections** — read from the catalog as it stands,
reported on their upper three bands. Cross-model comparisons of absolute levels are not
like-for-like; comparisons within a model are.

---

## 1. A mandate produces exactly what it names, and nothing adjacent

**The strongest cross-market finding, and it required five markets to see.**

| market | the mandate | what it produced | what it did not |
| --- | --- | --- | --- |
| US healthcare | HIPAA → X12 EDI, since 1996 | clearinghouses handling the highest transaction volume in American healthcare | no MCP, no event surface among the three largest |
| US healthcare | Cures Act → FHIR, since 2020 | FHIR endpoints at EHR vendors and hospitals | 28% MCP, 0 workflows |
| Government | open-data policy | **95% contract publication**, the highest of any market | 17% MCP, 13% events |
| Climate | CSRD → XBRL tagging | machine-readable *filings* | 14% MCP; no emission, inventory, scope or factor resource anywhere in the market |
| Marketing | OpenRTB (de facto) | a machine-to-machine bid stream at millisecond latency | the lowest external programmability in that cohort |

Each of those was written as a finding about its own market. Together they are a finding about
mandates: **the instrument compels an artifact and gets that artifact.** Open-data policy asked for
publication and got the best publication rate measured. It did not ask for operability and got none.

**This is only visible with one rubric across many markets.** Any single report reads as a story
about that industry.

### The corollary: the accessibility layer is where programmability lives

Every mandate produced a second class of vendor whose product is the mandate's own accessibility, and
in every case that layer outscores the incumbents it sits in front of.

- **X12** → Stedi, Candid Health publish MCP servers; Availity, Change Healthcare, Waystar publish none
- **FHIR** → Particle Health, Aidbox, Medplum, Flexpa publish; Epic, Cerner, MEDITECH, Allscripts do not
- Interoperability, which *is* that layer in healthcare, leads every other area in that cohort

The control case is **creator economy**: no mandate at all, and the highest programmability of any
industry section measured. Nothing to comply with, only customers to serve.

## 2. Zero of 2,272 companies describe a workflow

Across ten markets, every production model, every level of regulation and every degree of maturity:
**not one Arazzo workflow.** Against 51–98% publishing a machine-readable contract.

The rubric can measure this because it looks for the artifact rather than for intent. A market that
publishes contracts at 98% and workflows at 0% has made itself **agent-readable without making
itself agent-executable** — a distinction that does not appear in any vendor's own description of
itself.

Every report found the same shape and named a different sequence: eligibility → prior authorization
→ claim in healthcare; collect → map → allocate → audit for Scope 3 emissions; onboarding in HR;
provisioning → credential rotation → staged firmware rollout in IoT; the asset pipeline in gaming;
produce → publish → attribute → reconcile in the creator economy. **All of them exist as prose in
implementation guides. None exists as an executable artifact.**

## 3. The upper band converges, and the composite is not where markets differ

The seven industry sections measured like-for-like span **48.6 to 52.8** on the Kin median — a
4.2-point spread across government, gaming, IoT, HR, climate, weather and creator economy.

That is the more useful result than any single median. **Industries do not differ much in how good
their best companies are. They differ enormously in which dimensions those companies satisfy.** MCP
adoption across the same seven markets ranges 10% to 27% — a 17-point spread on a 4-point composite
spread.

The practical consequence: a composite alone tells a buyer very little across industries. The facet
and dimension breakdown is the comparison that carries information, which is why every market report
leads with the artifact table rather than the score.

## 4. Convergence without governance, in three unrelated markets

The rubric reads resource names off refined contracts, which makes an unplanned pattern visible.

- **Revenue software**: account, contact, campaign, opportunity, activity — the CRM object model,
  arrived at independently by hundreds of companies, governed by nobody
- **HR and workforce**: employee, company, candidate, department, jobs — the same shape, and HR Open
  Standards has published exactly those schemas since 1999 with close to no adoption
- **IoT**: jobs, groups, secrets — platform concepts every vendor invented separately, while eleven
  protocol standards governed the layer beneath them

Three markets, no coordination, identical outcome: **the industry converges on a shared vocabulary
and nobody governs it, so migration cost lives exactly where no specification reaches.**

## 5. Contract quality and agent adoption may move in opposite directions

Across the seven section-model markets, **corr(contract quality, MCP adoption) = −0.74**.

**This is a hypothesis, not a finding.** n = 7, and the contract-quality range is only 3.6 points
(60.1–63.7) against a 17-point MCP range, so the correlation is carried by a narrow spread. It is
recorded here because it is testable and because the mechanism is plausible: the markets with the
best contracts are the oldest ones, and age produces good documentation habits *and* a large
installed base with no reason to adopt a new interface layer. Weather and geospatial has the best
contracts measured and the second-lowest MCP; creator economy has the lowest contract quality of the
seven and by far the highest MCP.

If it holds as more markets are measured, it inverts a natural assumption — that mature API
practice predicts agent readiness. **Add markets before believing it.**

## 6. What the rubric surfaced about itself

Every market has been a test of the instrument, and each produced a defect the rubric could not have
found by inspection. These are filed in the public
[API Evangelist road map](https://github.com/api-evangelist/roadmap):

| # | from | what it revealed |
| --- | --- | --- |
| [#63](https://github.com/api-evangelist/roadmap/issues/63) | weather and geospatial | the safety dimensions assume writes; 43% of that market is >90% GET, and the best-governed market in the series scores near the bottom |
| [#65](https://github.com/api-evangelist/roadmap/issues/65) | US healthcare | two records of one company scoring inversely to their contract evidence — the score may credit pointer *presence* rather than resolution |
| [#66](https://github.com/api-evangelist/roadmap/issues/66) | US healthcare | name-collision duplicate detection, a third signal the slug and prefix sweeps both missed |
| [#67](https://github.com/api-evangelist/roadmap/issues/67) | government | commercial clarity is close to meaningless for a free statutory interface |
| [#68](https://github.com/api-evangelist/roadmap/issues/68) | IoT | a call that reflashes a device is not a call that sends an email — safety dimensions need consequence weighting |
| [#69](https://github.com/api-evangelist/roadmap/issues/69) | HR and workforce | the rubric measures whether you publish a contract, not whether it conforms to a standard that already exists for your market |
| [#70](https://github.com/api-evangelist/roadmap/issues/70) | gaming | deliberate closure is indistinguishable from neglect, and in some markets closure is rational |

And one in the other direction, from **creator economy**: at 27% MCP adoption and 25% packaged agent
skills, the agent-readiness dimensions **stop discriminating**. They were built to detect a leading
edge that at least one market has now crossed, and the next version needs finer-grained checks —
what an MCP server exposes, whether it is authenticated, whether it is a genuine agent surface or a
re-labelled REST API.

**A market report that produces no instrument finding was probably not read closely enough.**

## 7. Presence is not provenance — the discipline the measurement forced

The most consequential correction was not to a facet but to what counts as evidence. Six times, a
number about to be published turned out to be API Evangelist's own generated work reported back as
the market's:

| artifact | what it actually held | claimed → real |
| --- | --- | --- |
| `mcp/` | candidate servers derived from the provider's own OpenAPI | 112 companies falsely credited |
| `mcp/` | `status: none` — a searched artifact recording an *absence* | 37 more |
| `security/` | our own DNS and TLS scan of their hosts | 99% → excluded |
| `agentic-access/` | `method: generated`, 222 of 224 | 43% → excluded |
| `well-known/` | an index written even when every path 404s | 100% → 52% |
| `asyncapi/` | 128 files carrying `asyncapi_published: false` | 50% → 29% |
| `arazzo/` | every one derived by the pipeline | 3% → **0%** |

The rule that came out of it: **an artifact counts only when its own provenance says someone went and
looked at what the provider publishes.** Anything `generated` or `derived` is ours. Every market
report now carries a *we hold / they publish* table so the gap is auditable rather than silently
corrected.

The same discipline applies inside the score: the engine records provenance in the agent-readiness
dimension value, so `agentic_access: derived` must not read as satisfied. Counting derived artifacts
as unmet moved that dimension from 57% failing to 90% in the revenue cohort — and stopped 173
companies being told they had shipped something the pipeline shipped for them.

---

## The reports behind this

Cohort model, fully re-profiled: **Revenue** (517) · **Marketing** (814) · **US healthcare** (75).

Industry sections, catalog as-is, upper three bands: **Government** (63 of 850) · **IoT** (165 of
861) · **HR and workforce** (170 of 869) · **Climate and energy** (96 of 1,002) · **Gaming** (66 of
679) · **Creator economy** (191 of 843) · **Weather and geospatial** (115 of 495).

All are published at [papers.apievangelist.com](https://papers.apievangelist.com), and each ships a
machine-readable data bundle so the research can be interrogated directly rather than taken on
trust.

**None of them is finished.** A market report is a starting point — it quantifies a market at a
moment, and the value compounds through what it teaches about the market, about the instrument, and
about where the boundary of the market actually sits. This document is where that second thing
accumulates.
