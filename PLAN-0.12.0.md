# Kin Score 0.12.0 — Plan (DRAFT, for review)

**Status: proposal. Nothing here is implemented.** No change to `signals/_data/scoring.yml`,
`score.rb`, or any provider page. This is the review draft; once settled it folds into
[`ROADMAP.md`](ROADMAP.md) and the shipped half lands in [`CHANGELOG.md`](CHANGELOG.md).

Written 2026-08-17 against the 33 open `area:scoring` issues in `api-evangelist/roadmap` and the
University Kin Score add-on proposal in `research/universities/kin-score/`.

> **Read §9b for the cadence.** All fifteen items ship as **one release, 0.12.0** — ordered
> internally, modelled per-change, one band re-cut, one rebuild. August's weekly increments are then
> **0.12.x corrections surfaced by cohort runs** across more schools and industries. **1.0 is the
> freeze**, gated on the population settling rather than on a feature list.

---

## Decisions settled 2026-08-17

| # | decision | Kin's call |
|---|---|---|
| 1 | `na` vs vacuous satisfaction for inapplicable checks | **`na`** — leaves the denominator, matching the regulatory facet. Still modelled before commit; see the #39 warning in §4. |
| 2 | Does a **declared** posture score above silence (#70) | **Yes — conditional on a reliable, consistent definition of "declared."** That definition is §3a. If §3a does not hold up under measurement, this does not ship. |
| 3 | Publish the AE-vs-provider share beside the composite (#64 pt 7) | **Yes.** Promoted from an open question to release item 10. |
| 4 | Regulatory facet — floor, or compare regulated providers only to each other (#34 pt 4) | **Compared only to each other.** Re-centred on a published regime mean; the drag goes to zero by construction. §6b. |
| 5 | `commercial_clarity` | → **`access_clarity`** |
| 6 | `regulatory` | → **`regulatory_posture`** |
| 7 | Standards conformance — inside the regulatory facet, in contract quality, or its own | **Its own conditional facet, `standards_conformance`.** §6c C. |
| 8 | The standalone layer's name | **`accountability`** — names the property, not the artifact. §6c D. Band *Accountable* → **Owned**. |
| 9 | Does the composite stay published for universities | **Yes — it is the foundation.** Most will fail; most depend on vendor APIs. Steer toward an owned portal and programme *just like any other enterprise*. §5, "Owned capacity". |
| 10 | Does `contract_governance` keep weight 0.12 after losing two checks | **Yes.** Consequence in §1: the facet goes 48 → 33 points and `rules_present` becomes 30% of it. |
| 11 | `accountability.domains` ships `ai`-only, other domains unverified | **Accepted as a starting point.** Evolve as `data` / `security` / `access` get read. |

**All open decisions are now settled.** Full facet inventory: **§6c**.

Decision 1 carries a live consequence: **`na` shrinks the denominator and can lower the score of the
provider asking for it** (#39 measured WSO2 losing nine points and a band). The modelling gate in §9
stands regardless of which mode was chosen — it now measures the cost of `na` rather than choosing
between modes.

---

## The thesis

**0.11.0 measured more. 0.12.0 measures the right thing about the right party.**

Read as a set, the 33 open issues are not 33 defects. They are one claim the rubric makes and can no
longer support: *this number describes what this provider did.* Three other things are inside it.

| what leaks in | evidence |
|---|---|
| **what we collected** | governance is **87.5% AE-authored points** (#35); 6.1 points of cross-cohort spread was our own enrichment history |
| **what a vendor emitted on their behalf** | 6 of 6 agent cards in US payments are one docs platform's template (#36); **58% of `mcp/` artifacts are ours** (#59); **46% of university API artifacts sit on a domain the institution does not own** — Yonsei's score is ranking Elsevier |
| **whether our reader parses their format** | WSDL, gRPC, SCIM, FHIR (#19, #11, #69) |

0.12.0 does four things about that, and nothing else:

1. **Separates the two things called "governance"** and fixes the one that is broken.
2. **Adds an applicability layer** so the rubric stops scoring providers on questions their contract
   already answers as inapplicable.
3. **Adds a disclosure axis** so *published*, *authwalled* and *unpublished* stop collapsing into
   one zero.
4. **Adds an `operator` field** so a vendor-emitted artifact is recorded as the vendor's.

Items 2–4 are each independently required by both the roadmap and the university research. That
convergence is the main argument of this plan.

---

## 1. The naming collision — two things are called "governance"

This is the reconciliation the university proposal forces, and it is the cleanest change in the
release.

### What the facet actually contains today

From `score.rb` (lines 1193–1215), the `governance` facet (weight 0.12) is nine checks:

`rules_present` · `rules_substantial` · `low_error_density` · `zero_errors` ·
`balanced_severities` · `vocabulary_published` · `conformance_declared` · `overlay_published`

Every one is about a **machine-readable artifact describing a contract**. Not one is about how the
organization governs itself. The facet is `contract governance` and always has been.

### What the university proposal's Facet A contains

`ai_policy_published` · `ai_policy_versioned` · `ai_policy_owner_named` · `ai_accountable_officer` ·
`ai_standing_body` · `ai_impact_assessment` · `ai_proportionality_clause` · `ai_regulation_scoped`

Every one is about **how the organization decides, who is answerable, and what must happen before a
thing is deployed**. Not one touches a contract.

**The overlap is zero. They collide only on the word.** Shipping a second facet called Governance
would have produced a provider page with two Governance numbers measuring unrelated things — which
is the disclosure defect #41 names, reproduced inside the rubric itself.

### Proposed

| today | 0.12.0 | change |
|---|---|---|
| `governance` (0.12, in composite) | **`contract_governance`** (0.12, in composite) | rename + fix #62. **No math change.** |
| — | **`accountability`** (standalone layer) | new, never in the composite |

The rename is free: `scoring.yml` facets carry only `weight`/`label`/`description`, and the label is
the only public surface. Do it in the same release as the #62 fix so a provider reading the facet
twice sees one coherent change.

### And fix `contract_governance` while renaming it — #62

A provider verified this in code and is waiting on an answer. The facet's own description in
`scoring.yml` reads *"Outcomes of Spectral linting"* — and the checks read **declarations**:

- `zero_errors` is **unearnable by any ruleset that declares an error-severity rule** — i.e. every
  ruleset with teeth.
- `balanced_severities` pays 3 points for declaring `warn` and `info`.
- Together, **the scoring-optimal ruleset is one that can never fail a build.**
- `rule_count` is `len(rules_list)`, so `extends: ["spectral:oas"]` — the correct engineering
  choice — counts 9 where 50 execute, and `rules_substantial` wants 20.

**Recommendation: declaration, stated honestly.** Running Spectral against ~26k providers' own specs
with their own rulesets is a real build cost and belongs in its own artifact, not an inline step.
So for 0.12.0:

1. Drop `zero_errors`. As a declaration predicate it is incoherent and it rewards toothlessness.
2. Rewrite `low_error_density` or drop it — same reason.
3. Resolve `extends` and count the effective ruleset for `rule_count`; or lower the threshold.
4. **Reword the facet description** so nobody reads it as a lint result.
5. Say which model on the rating page. That was the reporter's actual ask — *"I'd rather not
   restructure ours until I know which model I'm optimizing against."*

Outcome-based linting stays on the roadmap as a separate artifact class, not as a 0.12.0 item.

### Weight stays at 0.12 — DECIDED, and one consequence to see

Dropping `zero_errors` (5 pts) and `low_error_density` (10 pts) removes **15 points, all from the
`rules` provenance class**, which is AE-authored. The facet goes 48 → 33 points:

| | before | after |
|---|---:|---:|
| facet total | 48 | **33** |
| AE-authored (rules 33 / vocab 5 / overlay 4) | 42 | **27** |
| **AE share** | **87.5%** | **81.8%** |
| `rules_present` as a share of the facet | 20.8% | **30.3%** |

The AE share falls slightly, which is the right direction. **But `rules_present` — satisfied by the
presence of a Spectral ruleset that we wrote for 4,516 of 5,785 providers — becomes 30% of the
facet.** Holding the weight at 0.12 concentrates the facet onto its single most AE-authored check.

That is not an argument against the decision; it is an argument for release item 10. **Publishing the
authorship split is what makes a facet this concentrated defensible.**

---

## 2. `accountability` — the blueprint is enterprise-general

Kin's read is right: **the university needs look unique and mostly are not.** Facet A transposes to
any enterprise without changing a check. What changes is the disclosure surface, not the blueprint.

| university check | enterprise reading | who publishes it today |
|---|---|---|
| `policy_published` | an AI / acceptable-use / data-handling policy resolves | universities, banks under supervision, SaaS trust centers |
| `policy_versioned` | version + approval date + review cycle | rare everywhere |
| `policy_owner_named` | a named role owns it (DPO, CISO, Chief Trust Officer, SIRO) | rare everywhere |
| `accountable_officer` | a senior accountable officer exists | public bodies, regulated firms |
| `standing_body` | a standing governance body with a named chair | public bodies, large enterprises |
| `impact_assessment` | a **mandatory** pre-deployment assessment (DPIA, AI impact, security review) | regulated firms |
| `proportionality_clause` | the policy contemplates **not** deploying | almost nobody |
| `regulation_scoped` | scoped against a **named** regulation, not generic ethics language | EU-exposed firms |

The Open University's principle 5.8 — *"keep AI use proportionate"* — is the only institutional text
in the university research that treats **not deploying as a valid outcome**. That check is the whole
reason this layer is not a hype index, and it is exactly as meaningful for a commercial vendor.

### Why standalone, not a third conditional facet

0.11.0 generalised the conditional-facet math from one hard-coded slice to N, so a third conditional
facet is now cheap to add. **It should still not be one, for three reasons:**

1. **It would read near-zero catalog-wide on day one.** Per the standing rule, a new dimension moves
   every provider through the denominator whether or not anyone scores on it — so a full band re-cut
   rides along, on a facet nobody can yet satisfy. That is the #63 `lifecycle_documented` lesson.
2. **Most of it is Tier 2.** `impact_assessment`, `standing_body`, `proportionality_clause` are
   researched, not harvested. They cannot run at 26,568 providers.
3. **Blending repeats the exemption mistake.** #39 measured it: making commercial checks `na` for
   open source moved the cohort mean 41.9 → 42.0 and **cost WSO2 nine points and a band.**

So: `accountability:` sits beside `agent_readiness:` in `scoring.yml`, standalone, with its
own `schema_version`, bands, and an explicit tier on every published score. **Nothing is removed from
the composite.**

### Tier discipline, carried over verbatim

- **Tier 1** — machine-checkable, runs catalog-wide: policy URL + document metadata, probed status
  codes, gateway liveness, named-regulation string match.
- **Tier 2** — researched, runs only on a profiled cohort: ownership, assessment process,
  proportionality, equity of access.
- **A Tier-1-only organization is never ranked against a Tier-2 one**, and every published score
  carries its tier.

That rule is the fix for #35 (cohorts enriched to different depths) stated as a scoring constraint
instead of a caveat. It should apply to the composite too, not just this layer.

---

## 3. The disclosure axis — "the public nature of it will vary"

This is the piece that makes one blueprint work across sectors, and it is required by four roadmap
issues independently of universities.

A governance artifact has three states, and today they are one zero:

| state | meaning | attribution |
|---|---|---|
| `published` | public URL, fetched, status code recorded | scoreable |
| `authwalled` | exists, behind SSO / customer portal / NDA | **ours** — never reported as absence |
| `language` | published, not in a language we read | **ours** — never reported as absence |
| `refused` | edge serves a browser and 403s an identified crawler | **ours** — never reported as absence |
| `unpublished` | no evidence either way | reportable as absence |

`language` and `authwall` were **earned by the university research** — Yonsei's generative-AI
guideline exists only on the Korean surface; NYU's Private GenAI pilot is behind institutional SSO.
Three of five profiled institutions hit one or the other. They are not university-specific: a German
public body, a Japanese vendor and any SaaS Trust Center behind a login are the same shape.

`refused` is **#28**, already open, with TIBCO and SAP measured (200 to a browser, 403 to an
identified crawler) and makeBIMI stuck in the queue for three days for exactly this reason.

### And the positive case — #70

A stated posture must score **above** silence. A company that publishes *"we do not offer
programmatic access to live game state, and here is why"* has made a decision; one that publishes
nothing has not. Take-Two at **7.1** and a company that never thought about it are currently the same
number.

The university proposal already solved this design problem, and its solution should be adopted
verbatim as the general rule:

> `no_tool_is_a_valid_answer` — **scored 0, recorded always.** Not providing GenAI is a posture, not
> a gap; never a penalty on its own.

Generalised: **record the posture, never penalise the absence, and credit the statement.** That is
one construct closing #70, #67, #28 and the university layer's non-hype constraint together.

---

## 3a. What counts as "declared" — the definition decision 2 depends on

Kin's condition on #70: *yes, if we can define declared in a reliable, consistent way.* This is that
definition. **If it does not survive the measurement in §3a.5, #70 does not ship.**

A declaration is the **cheapest thing in the rubric to produce** — cheaper than an OpenAPI, a status
page, a ruleset, anything. #13 already recorded a provider going **14.0 → 84.9** by working the
rubric. So this check carries more gaming risk than any check ever added, and the definition has to
be built against that rather than around it.

### 3a.1 The governing rule: score the artifact, never the prose

The rubric's whole method is that evidence is machine-readable, first-party, at a conventional
address, and probed. A declaration earns credit **only where it meets that same bar.** A paragraph on
a web page saying "we don't offer an API" is not evidence and is not scored — reading it would mean
interpreting corporate prose, which the AI Claim Index explicitly refuses to do (#38) and which
cannot be done consistently across 26,568 providers or across languages.

### 3a.2 Four evidence tiers, in descending reliability

| tier | evidence | why it is reliable | credit |
|---|---|---|---|
| **D1 · deployed** | `robots.txt` directives naming AI/agent user-agents; edge behaviour toward an identified agent | **it is the policy, not a claim about it.** Cannot be written without being enforced | full |
| **D2 · in-contract** | an explicit posture value in `x-agentic-access` / the agentic-access artifact — including `none` / `closed` | lives in the contract, versions with it, unambiguously first-party | full |
| **D3 · typed + probed pointer** | a `ProgrammaticAccessPolicy` / `AgentPolicy` type in `common[]`, fetched, status-checked, content floor, soft-404 rejected | same bar as every other index-class check | partial |
| **D4 · prose on a page** | a paragraph stating a position | not machine-checkable, not consistent across languages, not distinguishable from marketing | **none** |

D1 is the strongest and is available today for every provider on the catalog. **A `robots.txt` that
disallows GPTBot / ClaudeBot / CCBot is a machine-readable statement of agent posture that the
provider is actually enforcing.** It is not a claim; it is the deployed decision. It also connects
this check to the `agent-differential-audit` work rather than duplicating it.

D2 is #70 option 1 stated precisely: **promote `agentic_access` from binary present/absent to carrying
a stated value.** #70 measured it missing at **98% in gaming** — almost nobody is making the decision
explicitly even where they have plainly made it implicitly. That is the gap this check exists to
close.

### 3a.3 Five hardening rules, each one closing a failure mode already measured

1. **Structural fingerprint, always.** Hash every declaration with names and descriptions stripped;
   any hash appearing under **more than one provider** grades `platform`, not `first-party` (#36's
   method, already prototyped). This is the load-bearing rule: *the moment one docs platform or CMS
   ships a boilerplate posture file, every customer acquires one on the same day and the dimension
   stops discriminating between anyone.* #36 is exactly that event, already observed once.

2. **Cap the credit below the thing it substitutes for.** A declaration is **better than silence and
   worse than shipping.** It converts a zero into partial credit; it never reaches the value of the
   artifact it stands in for. Anything else makes writing a sentence competitive with building a
   surface.

3. **Reconcile against deployed behaviour, and treat a contradiction as a finding.** A provider
   declaring "no programmatic access" while running a public API earns **nothing** and is recorded as
   a discrepancy. Stated-policy-vs-deployed-behaviour reconciliation is the
   `agent-differential-audit` method; it applies here unchanged.

4. **Provider-authored only.** Anything carrying `method: generated` / `derived` is excluded. **1,356
   `apis.yml` descriptions mention AI and they are ours** (#38) — scoring prose we wrote measures our
   writing. Same trap as 0.6's `agentic_access`, where 99.9% of artifacts were AE-generated.

5. **A declaration cannot buy an exemption from checks that apply.** It earns only where the
   applicability layer (§4) already says the question is inapplicable. Take-Two declaring closure
   earns on hazard and commercial dimensions; it earns nothing on contract quality or error semantics
   if it does ship a contract. **You cannot declare your way out of a gap.**

### 3a.4 What it deliberately does not do

- **It does not read sincerity.** Two counts and a state, never a judgement (#38's rule).
- **It does not classify markets as excused.** #70 option 2 was rejected in the issue itself as
  risking excusing neglect wholesale. The predicate is per-provider evidence, not sector.
- **It does not reward volume.** One clear declaration scores the same as five. Same rule as the
  university layer's non-hype constraint — the Open University with one tool and a versioned policy
  must outrank five vendor tools and no policy.

### 3a.5 The measurement that decides whether this ships

Before any of it is written into `scoring.yml`, three numbers. **This is a gate, not a validation
pass** — a bad result kills the check rather than tuning it.

| question | method | kill condition |
|---|---|---|
| Is D1 reliable at scale? | fetch `robots.txt` catalog-wide, parse AI/agent user-agent directives, count distinct postures | if it is near-universal or near-absent it does not discriminate |
| Is D2 real or is it ours? | census `agentic_access` artifacts by `method:`, split provider-authored from generated | if provider-authored is ~0, there is nothing to score yet |
| **Is D3 already templated?** | structural-fingerprint every candidate declaration; measure the share whose hash appears under >1 provider | **if the platform share is high, D3 does not ship** |

The third is the one most likely to fail, and it is the one that matters. #36 found **6 of 6** agent
cards in a cohort were one template. If posture declarations arrive the same way, D3 is measuring
docs vendors and must be dropped, leaving D1 and D2 — which is a smaller check and still an honest
one.

**Baseline expectation:** `agentic_access` is missing at 98% in gaming, so this reads near-zero on day
one across most of the catalog. Per the standing rule, that still moves every provider through the
denominator, and the band re-cut in §9 covers it.

---

## 4. The applicability layer — stop asking questions the contract already answered

Five issues (#70, #67, #63, #68, #62 pt 2), **three independent providers raising it unprompted**
(We > Ultrarich, i6eal, one other), and two whole-market natural experiments:

- **Weather & geospatial** — highest contract quality (63.7) and governance (43.2) measured anywhere;
  `dry_run_mode` missing at **100%**; **43% of the cohort is ≥90% GET**.
- **Government** — better contracts than any commercial market measured; worst-but-one on commercial
  clarity.
- **Catalog-wide** — **1 provider in 8 is entirely read-only**, carrying a ~6-point penalty on
  hazards it cannot have, while scoring **82.0% on rate-limit signalling against 76.2%/73.8%** for
  everyone else. Ahead where the dimension applies; zero where it cannot.

### One derived record, not four special cases

```
all/<slug>/kin/applicability-<ts>.yml
```

| fact | derived from | gates |
|---|---|---|
| `write_surface` | method counts in refined OpenAPIs | dry-run, idempotency, typed events (#63, #62) |
| `commercial_surface` | no auth scheme **+** no plans **+** no rate-limits **+** no signup/pricing pointer **+** all-reads | commercial-clarity substitution (#67) |
| `disclosure_surface` | §3 above | every index-class check (#28, #70) |
| `delivery_model` | **already derived** by `derive-delivery-model.py` | publication only (#41) |

#67's comment made the decisive correction and it must survive into the build: **the predicate is not
"government."** i6eal is a German UG, not a public body, and it states its own posture in its
OpenAPI `info.description` — *"No authentication, no registration, no rate limit, no quota."* A facet
keyed on sector misses it; one keyed on **no commercial surface by design** catches it. One detector,
not two.

### The decision this forces, and it is not obvious

`na` and vacuous satisfaction move scores in **opposite directions**, and the rubric currently uses
both — 0.7's OAuth checks are vacuously satisfied; the regulatory facet leaves the denominator.

**`na` shrinks the denominator and can lower the score of the provider asking for it.** #39 measured
exactly this. Read-only providers pass `rate_limit_signal` at 82% — higher than anyone — and some of
that credit is AE-authored. Exempting them may take it away.

**Every applicability change must be modelled before commit.** Not "estimate the delta" — run it.

### The counterweight

An applicability layer only removes checks. That makes the instrument shorter and easier to work
(#13). It needs paired additive work, and the issues already argue the cheapest three:

| check | facet | baseline today | why now |
|---|---|---|---|
| `lifecycle_documented` | contract_quality | **14.5%** of creatable resources round-trip; **median provider 0.0%**; 57.8% document not one | rewards describing the hazards you **do** have. Reward-only, never penalise — absence of a documented DELETE is not absence of DELETE. |
| `examples_published` | contract_quality | orphan | #71 — a provider wired the pointer in good faith and it is read by **no check** |
| domain-standard conformance | conditional | unmeasured | #69 — **SCIM and FHIR only.** Two standards is a release; six is a program. |

---

## 5. The `operator` field — three programs converged on one artifact

This is the strongest single argument in the plan, because three unrelated investigations demanded
the same field within four days of each other.

| finding | what it saw |
|---|---|
| **#36** (US payments) | 6 of 6 `.well-known/agent-card.json` are **one docs platform's template**, served first-party, `provider.organization` carrying the *docs site's* title. Orum's reads `Developer Docs`. |
| **#59** (catalog-wide) | **58% of `mcp/` artifacts are ours**, derived from the provider's OpenAPI. In programmable-marketing this credited **112 of 816 companies** with a server we wrote — MCP adoption overstated by **84% relative**. |
| **University baseline** | **46% (139/300)** carry API artifacts on a domain the institution does not own. **37 of Yonsei's 38 APIs are Elsevier Pure.** Yonsei ranks 16 points above Columbia because the score is ranking Elsevier. |
| **#64** (design) | authorship has **three** dimensions, not two — and **26 of 32 artifact classes record none of them** |

**Same defect, three cohorts, one field.**

```yaml
operator: institution | vendor | consortium | community | api-evangelist
source_authorship:   # whose substance
artifact_authorship: # who produced the file in the repo
vendor: <name>       # when operator: vendor
```

Two rules carry over from the university proposal and both are load-bearing:

1. **It does not discount vendor surfaces.** Buying Elsevier Pure and turning it on is a real act.
   Hiding it repeats the open-source exemption mistake. It **splits** them, so a report says
   *"Yonsei's API surface is Elsevier's, deployed"* instead of *"Yonsei outperforms Columbia."*
2. **Never infer authorship from absence.** Unmarked credits in full — the existing default, and it
   must survive the change.

Detection is cheap and already prototyped: #36's structural-fingerprint method (hash the document
with names and descriptions stripped; flag any hash appearing under more than one provider) plus
#64's generator-extension sweep (**670 of 7,790 providers carry a tooling signature — 8.6%**).

**Scope for 0.12.0:** record the field and publish the split. **Do not move scores on it yet** —
#59's `has_mcp` change (full credit for a probed `live`/`gated` endpoint, partial for `local-stdio`,
none for a derived candidate) is the right change and it wants its own measured release.

### Owned capacity — the direction the field is for

**Kin, 2026-08-17, settling whether the composite stays published for universities:**

> *Yes, that is the foundation. Most will fail. Most depend on vendor APIs for libraries, etc. Some
> are full blown programs. We should steer towards owned portal and program just like any other
> enterprise as it allows them to abstract away vendors and own their own capacity.*

This makes `operator` a **remediation axis**, not bookkeeping. Three things follow.

**1. It resolves the composite question by rejecting its premise.** The worry was that publishing
*"Harvard: 20.6, emerging"* misleads. It does not — a university running on Elsevier Pure, Dataverse,
Ex Libris and Figshare genuinely does have a thin owned surface, and saying so **is** the finding.
*"Just like any other enterprise"* is the same move as §2: the university case is not special, it is
the general case with a different disclosure surface.

**But it resolves only half.** Two different statements sit inside a 20.6:

| | whose | resolved? |
|---|---|---|
| *publishes little of its own* | theirs — the finding Kin wants | **yes** |
| *we never harvested them* | **ours** — #35 measured 8.2–22.1 composite points per provider | **no** |

The university baseline has hard instances of the second: **CORE at 5.7** — a 400M-record scholarly
API, explicitly *our* collection gap; **NYU, the Open University and BITS Pilani are not providers at
all**, three of five profiled institutions; **109 of 300 agent-readiness scores carry our own
`agentic_access` artifact**, 23 landing on an identical 41.0.

**So decision 9 is licensed by decision 3.** Publishing the composite for a cohort that mostly fails
is defensible *because* the authorship split ships beside it. If item 10 slips, this should slip with
it.

**2. Vendor dependency is a catalog-wide measure, not a university one.** *"Just like any other
enterprise"* generalises the finding, and the evidence is already there:

| cohort | vendor-mediated surface |
|---|---|
| universities | **46%** carry artifacts on a domain the institution does not own |
| US payments | **6 of 6** agent cards are one docs platform's template (#36) |
| catalog | **58%** of `mcp/` artifacts are ours (#59); **8.6%** of providers with an `openapi/` dir carry a tooling signature (#64) |

A commercial vendor whose entire developer surface is a hosted ReadMe instance is in the same
position as Yonsei on Elsevier Pure. **`operator` measures owned capacity across the whole catalog.**

**3. The tension with rule 1 above, and how it resolves.** *"Do not discount vendor surfaces"* and
*"steer towards owned"* are not contradictory, but they need an explicit resolution:

> **Never subtract for vendor. Add for owned.**

Same shape as the `open_source` decision (#39: additive, never an exemption) — now precedent twice
over. A provider keeps full credit for a deployed Elsevier Pure surface *and* gets a separate reading
of how much of its surface it operates itself. Nobody loses points; the distinction becomes visible
and rankable.

**Live question this opens, and it is not settled here:** does owned capacity **score** in 0.12.0, or
only report? The plan above says record-and-publish, no score movement. *"Steer towards"* could mean
either. **Recommend report-only in 0.12.0** — the field has never been populated at scale, and scoring
an unmeasured field is the mistake #61 exists to prevent.

**Where the steer actually lands is the Personalized Checklist**, which already exists as a paper
type: *you operate 1 of 38 catalogued APIs; here is what to publish, in what order.* Sequencing
matters — a small college is told to publish an `apis.yml` and an `llms.txt`, not to build ZotGPT.

**A prediction worth testing:** the university baseline max is Monash at **47.4**, with nobody
reaching Strong. UC Irvine — ZotGPT, API keys, budget controls, token observability, multi-model, and
sold on to other institutions — is the one *"full blown program"* in the research and is profiled only
second-hand. **If owned capacity discriminates, UCI should be the first university in Strong.** That
is a cheap, falsifiable test of this whole direction, and it argues for pulling the UCI profile
forward.

---

## 6. Where the university research already re-derived the roadmap

Not a bolt-on. Working one cohort of 300 non-commercial organizations independently found **eight**
defects already open against the commercial catalog. That is the strongest available evidence that
the roadmap's diagnoses are structural rather than cohort-specific.

| university finding | already open as | status |
|---|---|---|
| 46% of artifacts on a domain the institution does not own | **#52** ownership check (STEP 0c), **#65** | STEP 0c is prompt-level, unenforced; never run catalog-wide |
| 119 of 300 scored against the **wrong regulatory regime** via tag brush | **#34** — 11 payments providers escaped a regime entirely; `Credit Cards` does not match `cards` | open |
| `data.open.ac.uk` returns **200 everywhere and 503 on an actual SPARQL query**; Yonsei's `llms.txt` redirects to `/error.html` with a 200 | **#27**, soft-404 rule, **#37** | #27 is **live in published scores** |
| 109 of 300 agent-readiness scores carry **our** `agentic_access` artifact; 23 land on an identical 41.0 | **#35**, **#64** | partially fixed (12,214 artifacts stamped `generated`) |
| CORE — a 400M-record scholarly API — catalogued at **5.7 minimal** | **#29** class (unprobeable/uncollected), **#54** | open |
| `no_tool_is_a_valid_answer` | **#70** — deliberate closure vs neglect | **the university draft solved it first** |
| `language` + `authwall` attribution classes | **#28** — refused ≠ absent | open |
| Tier 1 / Tier 2, never rank across tiers | **#35** — record enrichment depth as a published figure | open |

Two of these — `no_tool_is_a_valid_answer` and the `language`/`authwall` classes — are **better
stated in the university draft than in the roadmap issue**, and this plan adopts the university
wording as the general rule.

### The `education` regime is a second instance of #34, not a special case

119 of 300 universities are scored against **Government & Public Sector** because a tag brushed it.
FERPA, UK GDPR in an education setting, the EU AI Act, UGC and Korea's PIPA are not in
`industry_regulatory` at all.

Ship the `education` regime (`specificity: 3`, so it beats `government` on a multi-tag match, per the
0.6 most-specific-wins rule that fixed the insurance-broker collision) **as part of the #34 fix, not
before it.** #34's general fixes — normalise tag matching, stop letting an untagged provider silently
opt out of a regime, publish which regime applied per provider — are what stop the next cohort
repeating this. Landing `education` alone treats the symptom.

**Open question carried forward, unresolved:** is `education` one regime or several? FERPA, UK GDPR +
the Equality Act, the EU AI Act, UGC and PIPA are not one posture, and a single regime may repeat the
`government` mistake at smaller scale.

---

## 6a. Standards and regulatory compliance — where they sit, and the coupling that is wrong

Read in code rather than from the issues, and **#69 is materially misstated in its own issue.** The
machinery it asks for already exists and is populated. The defect is somewhere else.

### What is already built

Standards and regulatory compliance are scored in **three** places today:

| surface | facet | checks |
|---|---|---|
| **Regime-agnostic obligation** | `regulatory` (0.15, conditional) | `reg_oauth_scopes`, `reg_authentication_documented`, `reg_security_disclosure`, `reg_vulnerability_disclosure`, `reg_terms_of_service`, `reg_privacy_policy`, `reg_compliance_published`, `reg_standards_conformance` |
| **Regime-specific conformance** (0.6, each `na` outside its regime) | `regulatory` | `reg_named_standard_conformance`, `reg_fapi_profile`, `reg_consent_model`, `reg_write_surface`, `reg_smart_configuration`, `reg_pci_sca`, `reg_entitlement_terms`, `reg_certification_signal`, `reg_camara_conformance`, **`reg_mandate_verified`** |
| **Contract-level conformance** | `governance` → `contract_governance` | `conformance_declared`, `overlay_published`, plus `fhir_capability_statement` / `fhir_resource_coverage` in `contract_quality` |

And `reg_named_standard_conformance` **already resolves a provider's `conformance/` artifact against a
`standards:` list declared on its regime** — 8 regimes carrying ~60 named standards:

| regime | standards |
|---|---|
| `banking_open_finance` | obie · uk-open-banking · cdr-banking · consumer-data-standards · fdx · berlin-group-nextgenpsd2 · fapi · fapi-2 |
| `health` | **fhir · smart-on-fhir · us-core · uscdi** · da-vinci · carin-blue-button · fhir-bulk-data · cds-hooks · c-cda · hl7-v2 · dicom |
| `payments` | pci-dss · 3-d-secure · iso-20022 · confirmation-of-payee · emv · psd2-sca · open-payments |
| `telecommunications` | camara · tm-forum-open-api · gsma-open-gateway · ciba · 3gpp · mef · etsi |
| `insurance` | acord · acord-al3 · acord-xml · ngds · grlc · cieca-bms · csio · market-reform-contract |
| `energy_utilities` | green-button · espi · cds-energy · smart-energy-code · ieee-2030-5 · openadr |
| `securities_market_data` | fix-protocol · mifid-ii · iso-20022 |
| `government` | **dcat · ckan** · eidas · fedramp · open-data-charter |

The comment in `score.rb` states the intent plainly: *"turns the standards catalog into a scoring
input and closes the loop between the papers, the standards, the regulations and the score."*

### The correction to #69

#69's table claims US healthcare (FHIR / US Core) and government (DCAT, CKAN) are **not scored**.
**Both are.** FHIR is scored twice — through the `health` regime *and* through dedicated
`fhir_capability_statement` / `fhir_resource_coverage` checks in `contract_quality`. DCAT and CKAN are
in the `government` regime's list.

The rows #69 gets right are HR (SCIM), IoT (Sparkplug, WoT, oneM2M) and marketing (OpenRTB, IAB TCF)
— and **what those three share is that they are markets with no regulatory regime.**

### The actual defect: a standard is only reachable through a regime

**Standards conformance is 100% coupled to regulatory posture. There are eight regimes, therefore
eight doorways, and a market gets standards scoring only if it happens to be regulated.**

SCIM is not a regulation. Sparkplug is not a regulation. OpenRTB is not a regulation. They are
interoperability standards in unregulated markets, and there is no path for them into the rubric —
not because the machinery is missing, but because the only key is a regime.

That is the procurement question #69 correctly identifies: *"does this vendor speak the standard my
other vendors speak"* is asked in HR, IoT, dev tools, AI, retail and logistics exactly as much as in
banking. Today it can only be answered in banking.

### Three collisions to reconcile — the same shape Kin caught on governance

1. **Conformance is scored in two facets.** `conformance_declared` (contract_governance),
   `reg_standards_conformance` and `reg_named_standard_conformance` (regulatory). Three checks, one
   underlying artifact, split across facets by an accident of when each shipped.
2. **`ai_regulation_scoped` (university Facet A, 5 pts) and `reg_ai_act_scope_statement` (proposed
   education regime, 6 pts) are the same check in two layers.** Resolution: *scoping institutional AI
   use against a named regulation* is organizational posture → it belongs in
   `accountability`, and `reg_ai_act_scope_statement` is dropped from the education regime.
   `reg_student_data_policy` (FERPA governing the **API surface**) genuinely is regulatory-facet
   material and stays.
3. **"Standard" means two different things.** A *mandate* you must satisfy (PSD2, CDR, FHIR under US
   rules) and an *interoperability convention* you may adopt (SCIM, OpenRTB, Sparkplug). The rubric
   currently models only the first and reaches the second by coincidence.

### And #34's penalty direction now interacts with decision 1

The regulatory facet averages **37.4 against a base of 44.6**, so it **lowers the composite for 38 of
57 regulated providers** — mean −1.06, Plaid −4.9. **Being correctly identified as regulated is a
penalty; thin tagging is a reward.** Braintree keeps its full score by carrying no tags at all.

Kin's decision 1 was **`na`**, and the regulatory facet is the existing precedent for `na` — its
regime-specific checks already leave the denominator outside their regime. So expanding `na`
catalog-wide through the applicability layer compounds with a facet whose `na` behaviour is already
producing an inverted incentive. **The modelling step in §9 must measure both together, not
separately.**

### What 0.12.0 should do about it

**Do not add a standards facet.** The machinery exists; decouple it from the regime instead.

| # | change | why now |
|---|---|---|
| S1 | **Split the `standards:` list off the regime** into an industry→standards map that does not require a regime. `reg_named_standard_conformance` becomes `standard_conformance`, keyed on industry. | Unblocks SCIM, Sparkplug, OpenRTB without inventing regimes for unregulated markets |
| S2 | **Seed it with SCIM and FHIR only** (#69's own recommendation). FHIR is already wired; SCIM is the new one and the highest-value. | Two standards is a release; six is a program |
| S3 | **Reuse `standards/_store/*.md` as the registry** (#69 pt 2) rather than a fourth hand-maintained list. What is missing is a machine-readable conformance signature per standard. | The catalog already holds the specifications; the Standard Report program already reads them |
| S4 | **Consolidate the three conformance checks** onto one artifact read, with the facet split stated rather than accidental | Collision 1 |
| S5 | **Fix #34's matcher** (normalise case/plural/compounds; stop letting untagged silently opt out; publish which regime applied) and land `education` on top of it | Already release item 6; the education regime depends on it |
| S6 | **Keep `reg_mandate_verified` exactly as it is** — evidenced, not claimed | It is the best check in the facet and the model for S1 |

**S6 deserves the emphasis.** `reg_mandate_verified` requires a resolvable endpoint or register entry
before crediting a mandate, on the finding that *a claimed-but-unverifiable mandate scored **below**
organizations under no obligation at all.* Self-declared compliance is negative signal. That is the
same claim-vs-callable gap the Standard Report program is built on, and **`standard_conformance` must
inherit the rule**: a provider naming SCIM in marketing copy earns nothing; a provider serving a SCIM
`/Users` endpoint with the schema earns.

---

## 6b. The regulatory penalty — the floor, and why calibration beats it

**DECIDED (reaffirmed 2026-08-17): regulated providers are compared only to each other.** The
regulatory facet is **re-centred on the regime mean** — a provider is measured against its own regime,
never against the catalog. This section works out the mechanics and records what a floor would have
done instead.

```
composite = base + 0.15 · (reg − regime_mean)
```

A provider **at** its regime mean contributes zero delta and scores exactly `base`. Above its peers it
gains; below its peers it loses. **The −1.06 systematic drag goes to zero by construction**, because
the mean of `(reg − regime_mean)` within a regime is zero by definition.

`regime_mean` is a **published constant per rubric version**, snapshotted in
`rubric/scoring-0.12.0.yml` alongside the bands — not recomputed live. That is what keeps peer
comparison stable and auditable: a provider's score never moves because someone else joined the
catalog, and *publish an artifact → get rescored* still holds.

### The math, and why the drag is structural

From `score.rb`:

```
composite = (1 − Σwᵢ)·base + Σ(wᵢ · facetᵢ)
```

With `regulatory` alone at w=0.15 that rearranges to the form that matters:

```
composite = base + 0.15·(reg − base)
```

**The conditional facet adds when `reg > base` and subtracts when `reg < base`.** Catalog figures:
`reg` mean **37.4**, `base` mean **44.6** →

```
0.15 · (37.4 − 44.6) = −1.08
```

#34 measured the actual mean effect at **−1.06**. The arithmetic and the measurement agree, so this is
understood rather than suspected: **the drag is not a bug in the checks, it is the blend applied to two
scales that were never calibrated against each other.**

### What a floor is

A floor clamps the downside of that delta term. Three variants:

| variant | formula | effect |
|---|---|---|
| **Hard floor at base** | `base + 0.15·max(0, reg − base)` | regulatory can only ever **add**. Pure bonus. |
| **Soft floor** | `base + 0.15·max(−D, reg − base)` | bounded downside; `D` caps what regulation may cost |
| **Floor at the regime mean** | `base + 0.15·(reg − regime_mean)` | you are measured against your regime, not against the catalog |

### Why the hard floor is the wrong answer, in this rubric specifically

**A facet that can never cost anything holds nobody to anything.** The regulatory facet exists to hold
regulated providers to a *higher* bar; a one-way ratchet turns it into a participation award.

That is the identical pathology Kin already approved fixing this release: `zero_errors` is unearnable
by any ruleset with teeth, so the scoring-optimal ruleset is one that **can never fail a build**
(#62). Shipping a hard floor would remove one can-never-fail construct and add another. **Rejected on
internal consistency.**

The soft floor is defensible but `D` is arbitrary, and it treats the symptom.

### Kin's choice, implemented two ways — one of them is a trap

**(a) Within-regime percentile / z-score.** Replace `reg` with the provider's rank inside its regime
cohort. It does remove the drag. It also costs four things:

- **It destroys absolute meaning.** If no bank in the catalog implements FAPI, the top bank still
  scores well. A facet built to expose regulated-market gaps would start concealing them.
- **It is not comparable across regimes.** A payments 60 and a health 60 stop meaning the same thing —
  reintroducing the exact disclosure defect #41, #34 pt 3 and #35 are all about.
- **It is unstable.** A provider's score moves when the cohort changes, without them doing anything.
  That breaks the remediation contract that makes the Kin Score legitimate: *publish an artifact, get
  rescored* (#38's argument for why the score is not an accusation).
- **Thin cohorts are noise.** #13 already flags that topping a thin cohort is easy;
  `securities_market_data` carries far fewer providers than `payments`.

**(b) Re-centre on the published regime mean — ADOPTED.** `base + 0.15·(reg − regime_mean)`. This is
literal peer comparison: the reference point *is* the regime. It removes the drag exactly, and because
`regime_mean` is a versioned published constant rather than a live computation, it avoids every one of
(a)'s four costs — the absolute check-level evidence survives, the constant is auditable, and no
provider's score moves without their own action.

### The finding underneath: the facet is not penalising regulation, it is un-recalibrated

Every base facet has been recalibrated against what the catalog actually does — `discoverability` went
from 84.6 to 61.2 in 0.6 for exactly this reason, and the composite bands were re-cut in 0.6 and again
in 0.11.0. **The regulatory facet's internal scale never has been.**

Its checks — `reg_fapi_profile`, `reg_smart_configuration`, `reg_camara_conformance`,
`reg_mandate_verified` — are hard, near-frontier checks that almost nobody passes. **37.4 is a
property of the check set, not a fact about regulated providers.**

Calibrating it *is* "compared only to each other" — but the comparison is baked into a **published,
versioned scale** set once per rubric release, not into a live ranking that moves under a provider's
feet. Stable, auditable, and remediable, which the percentile is not.

### Worked example — Plaid, from #34's published figures

`composite 71.3`, `if unregulated 76.2` → `base = 76.2`, and solving `0.85·76.2 + 0.15·reg = 71.3`
gives **`reg = 43.5`**.

The regime mean is **37.4**. So Plaid sits **+6.1 above the average regulated provider on regulatory
posture — and loses 4.9 composite points for it.** Under a calibrated scale Plaid *gains*. That
swing, on a provider that is demonstrably better than its peers at the thing being measured, is the
clearest statement of the defect available.

### The guard — calibrate the facet, never the checks

Recalibration must not reach the check level. If a whole regime genuinely is failing, that failure has
to stay visible.

- **Facet score** — calibrated, so the blend is fair.
- **Check-level pass rates** — **raw, always.** This is where market-wide failure shows up, it is what
  the Market Reports publish, and it must never be normalised away.

Without that split, calibration would hide the finding the reports exist to make.

### Still required, and calibration does not fix it

**#34 pt 2 — an untagged provider silently opts out of its regime.** Braintree, Fireblocks, Socure and
WEX carry **no tags at all** and keep their full base score; `discover` is tagged `Credit Cards` and
the payments regime matches `card`/`cards`. **Thin tagging remains a reward no matter what scale the
facet is on.** That is the matcher fix (S5), and it is a separate change that has to land in the same
release or calibration just redistributes the inversion.

### Deferred

Per-standard detection beyond SCIM and FHIR; X12/EDI; a `standards_modernity` read (how current is the
version a provider conforms to); and whether `open_source` — the second conditional facet, added in
0.11.0 — carries the same uncalibrated-scale problem. **Nobody has checked, and the math is
identical.** Worth measuring during the §9 modelling step rather than assuming it is clean.

---

## 6c. Facet inventory after 0.12.0 — for naming review

### Base facets — in the composite, weights sum to 1.0

| # | 0.11.0 id | 0.12.0 id | weight | measures | naming verdict |
|---|---|---|---:|---|---|
| 1 | `discoverability` | `discoverability` | 0.10 | can it be found — `.well-known`, llms.txt, self-hosted index | unchanged |
| 2 | `contract_quality` | `contract_quality` | 0.25 | the contract itself + `lifecycle_documented`, `examples_published` | unchanged |
| 3 | `governance` | **`contract_governance`** | 0.12 | rulesets, vocabulary, conformance, overlays | **RENAME** — resolves the collision with institutional governance |
| 4 | `operational_transparency` | `operational_transparency` | 0.13 | changelog, status, rate limits, deprecation | unchanged |
| 5 | `developer_ergonomics` | `developer_ergonomics` | 0.20 | portal, docs, reference, getting started, SDKs | unchanged |
| 6 | `commercial_clarity` | **`access_clarity`** | 0.20 | what it costs, what you may do, how you get in | **RENAME — approved 2026-08-17** |

### Conditional facets — fold in at a fixed weight when applicable

| # | 0.11.0 id | 0.12.0 id | weight | applies when | naming verdict |
|---|---|---|---:|---|---|
| 7 | `regulatory` | **`regulatory_posture`** | 0.15 | a regime matches | **RENAME — approved 2026-08-17**; now **regime-relative** (§6b) |
| 8 | `open_source` | `open_source` | 0.10 | OSI licence + product repo | unchanged |
| 9 | — | **`standards_conformance`** | 0.10? | the provider's industry has a domain standard | **NEW — approved 2026-08-17 as a separate conditional facet** |

### Standalone layers — never in the composite

| id | status | measures |
|---|---|---|
| `agent_readiness` | existing, 14 dimensions | can an agent drive it |
| **`accountability`** | **NEW — schema only, unscored in 0.12.0** | who is answerable, and what must happen before a thing ships |

All four names approved 2026-08-17. Rationale for each in the decisions below.

---

### ⚑ The four naming decisions

**A · `commercial_clarity` → `access_clarity`.** This is the same defect as the governance collision
and I think it is as important. For a free statutory interface, a public-interest open data API, or
i6eal — *"No authentication, no registration, no rate limit, no quota"* — the word **commercial** does
not describe what is being measured. #67 option 1 substitutes the checks (terms of use, licensing
clarity OGL/CC-BY/public-domain, stated availability commitment, whether access requires
registration); a neutral facet name lets the applicable checks vary while the facet stays one thing.

The alternative is to keep `commercial_clarity` and add a second conditional facet for the
non-commercial case — which doubles the facet count and asks a reader to compare two differently-named
numbers. **Recommend the rename.** Cost: `commercial_clarity` appears in published reports and papers,
so it is a rename with downstream text to update.

**B · `regulatory` → `regulatory_posture`.** Cosmetic, aligns the id with the label already published
on the rating page. Do it now or never — it is free in this release and awkward later.

**C · `standards_conformance` as a new conditional facet — I have changed my recommendation from
§6a.** §6a said *"do not add a standards facet, decouple it from the regime instead."* Decoupling still
needs a home, and the three options are:

| option | problem |
|---|---|
| keep it inside `regulatory_posture`, keyed on industry | an unregulated HR company would have a *regulatory* facet applied to it. Wrong semantics, wrong word. |
| checks inside `contract_quality` | moves contract_quality's scale for every provider in the catalog |
| **its own conditional facet** | adds weight — but `na` for markets with no domain standard is *exactly* conditional-facet semantics, and 0.11.0 already generalised the math to N |

**Recommend the third.** It also keeps the distinction §6a argues for visible in the structure: a
*mandate you must satisfy* (`regulatory_posture`) and an *interoperability convention you may adopt*
(`standards_conformance`) are different things and should not share a facet.

**D · The standalone layer — `accountability`. APPROVED 2026-08-17.**

Kin asked: *"so what do we name? Policy?"* — close, and it names the wrong half.

**Why `policy` is not it, in three parts:**

1. **Half the checks are not about a document.** `accountable_officer`, `standing_body`,
   `impact_assessment` measure *apparatus and process* — who is answerable, and what must happen
   before a thing ships. A provider could publish an immaculate policy and score half the layer.
2. **It invites the exact misreading the layer exists to resist.** The non-hype constraint is
   explicit: *"a policy PDF that exists is not a governed institution; a policy PDF with a version
   number, an approval date, a named owner and a review cycle is evidence."* Naming the layer after
   the artifact is presence-not-provenance in the title bar.
3. **It collides with four existing checks in three other facets** — `deprecation_policy`
   (operational_transparency), `privacy_policy` (access_clarity), `reg_privacy_policy`
   (regulatory_posture), `os_security_policy` (open_source). A facet named `policy` sitting above four
   `*_policy` checks that live somewhere else is a reader trap.

**`accountability` names the property rather than the artifact**, and it is what every check is
actually asking. Verified clean: **zero occurrences** of `accountab*` anywhere in `score.rb` or
`scoring.yml`.

The provider-page test — three numbers side by side, read correctly by a provost, a CISO and a VP
Engineering:

| | |
|---|---:|
| Kin Score | 51.7 |
| Agent Readiness | 38.6 |
| **Accountability** | **24.0** |

| candidate | verdict |
|---|---|
| **`accountability`** | **recommended.** Names the property. No collision. Reads correctly across all three audiences. |
| `institutional_governance` | accurate, but *institutional* reads academic/public-sector — the opposite of the enterprise-general point |
| `organizational_governance` | accurate and neutral, but puts **governance** in two facet names where one is in the composite and one is not. Similar names, different status, is a reader trap. |
| `governance_posture` | pairs nicely with `regulatory_posture` — same objection as above |
| `policy` | see the three objections |
| `oversight` | close, but the word already appears **3× in `scoring.yml` meaning "an accidental omission"** — the opposite sense |

**Consequence, now in effect:** the placeholder band ladder needs one change, since *Accountable* would
collide with the layer name. Bands are explicitly uncalibrated placeholders, so this is free:

`Governed` · ~~`Accountable`~~ → **`Owned`** · `Provisioned` · `Declared` · `Undeclared`

*Owned* is the better word anyway — it is what `policy_owner_named` and `accountable_officer`
actually establish.

**Whatever the name, the scope resolution stands.** The university Facet A checks are all AI-scoped
(`ai_policy_versioned`, `ai_impact_assessment`, `ai_proportionality_clause`); the *blueprint* is not.
Versioned policy, named owner, accountable officer, standing body, mandatory pre-deployment
assessment, proportionality and named-regulation scoping apply to a data, security or access policy
just as well. **Name it for the blueprint, and make the policy domain a field rather than baking it
into check names.**

```yaml
accountability:
  standalone: true
  domains: [ai, data, security, access]     # v1 populates `ai` only
  checks:
    policy_published:      # reads whichever domain is in scope
    policy_versioned:
    policy_owner_named:
    accountable_officer:
    standing_body:
    impact_assessment:
    proportionality_clause:
    regulation_scoped:
```

That makes it extensible without a rename later, and it is why `institutional_ai` (the university
draft's name) is the wrong choice — it would need renaming the first time a data-governance policy is
scored. Alternatives still on the table: `organizational_governance`, `institutional_posture`.

---

### One structural risk nobody has examined

**Conditional weights are uncapped.** `score.rb` computes `total_w = active.sum{…}` and
`composite = (1 − total_w)·base + …` with **no ceiling**. Today the worst case is regulatory +
open_source = 0.25. Adding `standards_conformance` makes it **0.35 — a provider matching three
conditionals has only 65% of its composite decided by the six base facets.**

0.11.0 generalised the math to N conditionals and did not bound N. That is fine at three and is not
fine indefinitely. **Recommend a stated cap on Σwᵢ in this release**, before a fourth conditional
makes it a live defect rather than a design note.

---

## 7. Release contents

### Ships in 0.12.0

| # | item | issues closed / advanced | moves scores? |
|---|---|---|---|
| 1 | Rename `governance` → `contract_governance`; fix `zero_errors`, `low_error_density`, `extends` counting; reword the facet | **#62** | yes, small |
| 2 | Applicability record (`write_surface`, `commercial_surface`, `disclosure_surface`) + `na`/vacuous decision | **#63, #67, #70, #62 pt 2**, part of **#68** | **yes, materially** |
| 3 | Disclosure states: `published` / `authwalled` / `language` / `refused` / `unpublished` | **#28**, part of **#70, #67** | yes |
| 4 | `operator` + `source_authorship` / `artifact_authorship`, recorded and published; **not scored** | **#36, #59, #64** (record half) | no |
| 5 | `lifecycle_documented` + `examples_published` | **#71**, **#63** comment | yes, near-zero baseline |
| 6 | `#34` regime fix + `education` regime (S5) | **#34** | yes |
| 6b | **Decouple standards from regimes** — industry→standards map, SCIM + FHIR, `standards/_store` as registry, conformance checks consolidated (S1–S4, S6) | **#69** | yes |
| 6c | **Re-centre `regulatory_posture` on the published regime mean**; check-level pass rates stay raw | **#34 pt 4** | yes — drag goes to 0 by construction |
| 6d | Facet renames (§6c) + a stated cap on Σ conditional weights | naming coherence; unexamined structural risk | no |
| 7 | `accountability:` **schema and Tier-1 checks only**, standalone, unscored until a cohort exists | university Facet A; frames **#64 pt 7** | no |
| 8 | Publish `delivery_model` on provider pages and in the API response | **#41** (the stalled half) | no |
| 9 | **Declared posture** — D1/D2 (+D3 if §3a.5 clears it), capped, fingerprinted, reconciled | **#70** | yes, near-zero baseline |
| 10 | **Publish the three-way authorship share** beside the composite | **#64 pt 7**, **#35** | no |
| 11 | **Band re-cut — composite AND Agent Readiness** | mandatory consequence of 2 + 5 + 6 + 9 | — |
| 12 | **`needs_work` state** — `reason` + `owner`, never adjusts the composite (§9a.6) | **#29**, **#56**, makes decision 9 honest | no |
| 13 | **Probe-gate `examples_published`** at wiring time | **#71** without inheriting **#16** | no |
| 14 | **Provider page redesign** — third score panel, renamed facets, authorship share, delivery model, disclosure states | release blocker: scoring waits for the rebuild | no |
| 15 | **Regenerate the 118 report data bundles** | facet renames are schema, not prose | no |
| 16 | **WSDL + gRPC/Protobuf readers** — sweep first, then read | **#19, #11** | yes, upward only |
| 17 | **Full 32-class authorship backfill** — makes item 10 a real figure, not a floor | **#64** | no |
| 18 | **`has_mcp` reads `deployment.mode` + probe** — full for probed `live`/`gated`, partial `local-stdio`, none derived | **#59** | **yes, downward** |
| 19 | **`reversibility_documented`** — #61 was its only blocker and #61 is in | **#68** | yes (agent readiness) |

### Item 10 — what publishing the share actually requires

Decision 3 is **yes**, and most of the data exists: the `attribution:` block has shipped since 0.9.4,
and #35 already measured `catalog`-class points per provider across three cohorts — **8.2 (API
Management) / 17.1 (US Payments) / 22.1 (US Banking)**.

Item 4's `operator` field turns it from two-way into **three-way**, which is #64's actual finding:
**provider-published · vendor-emitted · API-Evangelist-produced**. Those are the same publishable
artifact, which is why they belong in one release.

**The caveat that has to ship with the number, or it misleads in exactly the way it exists to
prevent:** marker coverage is thin — **4.2% on `openapi`**, and **26 of 32 artifact classes carry no
authorship marker at all** (#64). Unmarked credits in full by design, so a published share today is a
**floor on the AE contribution and understates it**. The figure must be labelled as a floor and carry
its marker coverage, the same way a cohort statistic must carry its `n`.

Nobody else in the field publishes anything like this. It is also the honest resolution of §10.

### The gate — must land before any `--write`

Not the release. The precondition for it being trustworthy.

1. ~~**#12 — flip canonical spellings toward APIs.json 0.21.**~~ **MEASURED 2026-08-17 — the issue is
   stale and the flip must NOT be done.** See §9c.
2. **#27 — the `LlmsTxt` false credit is live now.** Four wrong credits in fifteen, published in
   0.11.0. ROADMAP still says *cite the probe, not a scored llms.txt number*.
3. **#54 + #53 — the band files are not a reliable roster.** 14 providers scored and in no band file
   (one a **67.0 Exemplar**); 191 duplicate names across 12 live cohorts, some split across bands
   (`digits-com` 66.5 / `digits-financial` 5.0).
4. **#61 — verify the `dry_run_mode` detector.** You cannot make a dimension conditional without
   knowing the detector works. 0.27% against a 9.2% keyword hit rate is a 30× spread, and the number
   is already quoted publicly.
5. **The 0.11.0 process guard.** Fail the pre-rebuild gate if `scoring.yml` carries a version with no
   matching `## <version>` CHANGELOG heading and `rubric/scoring-<version>.yml` snapshot. 0.11.0
   shipped inside a delisting commit and named itself nowhere.
6. **#71 pt 3 — the orphan-pointer test.** Assert both directions: every type in `properties.yml` is
   read by ≥1 check, every type a check reads exists in the vocabulary. Cheap, and it would have
   caught `Examples` and `GitHubRepository` without a provider finding them by accident.

### Deferred — REVISED, because the band re-cut sets the boundary

> *"I just want to get it all in this release."* — Kin, 2026-08-17

The earlier deferred list was built for a phased release. With one release it needs a different rule,
and the band re-cut supplies it:

> **Anything that moves scores is cheaper before the band re-cut than after. Anything that does not
> move scores can wait without costing anything.**

Deferring a score-moving change does not save work — it **forces a second band re-cut**, and a second
round of published churn on providers and badges. So the line is drawn on score movement, not on
effort.

**PULLED IN — score-moving, therefore cheaper now (items 16–19):**

| item | issues | why it must ride the re-cut |
|---|---|---|
| **WSDL + gRPC/Protobuf readers** | #19, #11 | **purely additive** — only raises providers currently scored as contract-less. Swagger 2.0 recovered **203 providers** when the reader learned to see it. Adding contract types after the cut means cutting twice. Do #19's sweep first, then the reader. |
| **Full 32-class authorship backfill** | #64 | decision 3 publishes the authorship share, and coverage is **4.2% on `openapi`, 26 of 32 classes unmarked** — so the published number is a floor needing a heavy caveat. Backfilling makes it a real figure instead of a disclaimer. |
| **`has_mcp` reads `deployment.mode` + probe** | #59 | **58% of `mcp/` artifacts are ours**; MCP adoption overstated by **84% relative** in one cohort. The evidence is already collected and all 3,601 manifests are already backfilled. Leaving it out publishes a known-wrong figure through the re-cut. |
| **`reversibility_documented`** | #68 | #61 lands in this release, which was its only blocker. New dimension → moves agent readiness → wants the same re-cut. |

**STILL OUT — genuinely blocked on data or scope, not on will:**

| item | issues | what actually blocks it |
|---|---|---|
| Outcome-based Spectral linting | #62 opt 2 | ~26k Spectral runs and **a new artifact class that does not exist**. The declaration fix in §1 is the honest interim and it ships. |
| Domain standards beyond SCIM + FHIR | #69 | per-standard detection is bespoke work **per standard** — SCIM and FHIR are a release, seven more are a programme |
| **`accountability` scoring** | university layer | **blocked on data, not effort.** Needs the five hand-drafted `ai-posture.yml` files, then ~50 orgs before `band_distribution.rb` can cut a band. The schema ships; the number cannot. |
| AI Claim Index | #38 | standalone by design, **never folded into the composite** — so it does not touch the re-cut, and the speaker gate is an unbuilt spike |

**Only two of these are refusals.** `accountability` scoring is blocked on evidence that does not
exist yet, and the AI Claim Index does not affect the band cut either way. The other two are scope
calls that can be revisited without a second re-cut, because neither moves a published score today.

### Not in this release, tracked as catalog work

#53, #54, #58, #56, #52, #65, #29 are **catalog and pipeline defects, not rubric changes** — but
items 2, 3 and 4 of the gate depend on them. They need an owner separate from the rubric work.

---

## 8. Decisions — all settled 2026-08-17

**Eleven decisions, all made.** The table at the top of this document is the record; this section
carries only what each one leaves behind.

| # | decision | what it still owes |
|---|---|---|
| 1 | `na` for inapplicable checks | model the downside — `na` can lower the score of the provider asking for it (#39) |
| 2 | declared posture scores above silence | **conditional.** §3a.5 is a kill gate — a failed fingerprint census drops D3 or the whole check |
| 3 | publish the AE-vs-provider share | label it a **floor**; marker coverage is 4.2% on `openapi`, 26 of 32 classes unmarked |
| 4 | regime-relative regulatory comparison | `regime_mean` must be snapshotted per rubric version, not computed live |
| 5 | `commercial_clarity` → `access_clarity` | downstream text in published reports and papers |
| 6 | `regulatory` → `regulatory_posture` | none — cosmetic |
| 7 | `standards_conformance` as its own conditional facet | its weight is unset; and Σ conditional weights needs the cap in item 6d |
| 8 | `accountability` | band *Accountable* → **Owned** |
| 9 | composite stays published for universities | **licensed by #3.** If item 10 slips, this slips with it |
| 10 | `contract_governance` holds 0.12 | `rules_present` becomes 30% of the facet — see §1 |
| 11 | `accountability.domains` ships `ai`-only | evolve; the enterprise-general claim rests on domains nobody has read yet |

### What is genuinely still unknown

Not decisions — measurements nobody has taken. All three sit in the §9 modelling step.

1. **Does `open_source` carry the same uncalibrated drag as `regulatory`?** The blend math is
   identical and the facet was added in 0.11.0 without a distribution check. It may have been costing
   open-source providers points since the day it shipped, in the exact way #34 found for regulated
   ones.
2. **What does `na` cost, catalog-wide?** #39 measured it on one 36-provider cohort. Nobody has run it
   at scale, and decision 1 applies it everywhere.
3. **Do the eight `accountability` checks read against a non-AI policy domain?** Decision 11 accepts
   this as a starting point; the enterprise-general claim in §2 rests on it being true.

---

## 9. Sequencing

```
GATE          #12 spellings → #27 llms → #53/#54 rosters → #61 detector → process guard → #71 test
   ↓
MEASURE       §3a.5 declaration gate — robots.txt census · agentic_access provenance census
              · structural fingerprint of every candidate declaration.  KILLS #70 if it fails.
   ↓
MODEL         ONE RUN PER SCORE-MOVING CHANGE, IN ISOLATION → record each delta → then the
              combined pass. Same scorer, different flags; produces the per-change attribution
              table for the CHANGELOG (§9b). Must include the #39 downside (whose credit leaves
              with the check) and the existing regulatory `na` inversion (#34: −1.06 mean).
              No --write.
   ↓
BUILD         contract_governance rename + #62 · applicability record · disclosure states
              operator field · lifecycle_documented + examples_published · #34 + education regime
              · declared posture (D1/D2, D3 only if it cleared) · three-way authorship share
   ↓
FRAME         accountability schema, Tier 1 only, standalone, unscored
   ↓
RE-CUT        band_distribution.rb on a full snapshot — COMPOSITE **and AGENT READINESS**
              (3 of 14 dimensions go `na` for 12.9% of the catalog) → recalibrate → then --write
   ↓
PUBLISH       apis.io rebuild — INCLUDING the provider-page redesign, which is a blocker not a
              follow-on. CHANGELOG entry + rubric/scoring-0.12.0.yml snapshot FIRST.
   ↓
AFTER         regenerate the 118 report data bundles (or ride the September reset — §9a)
```

**Milestone above this one:** a **stable spec release in September** that resets every
`kin/score-*.yml`. 0.12.0 is an August iteration release underneath it. See §9a.

**The MEASURE step is new and it is a gate, not a validation.** #70 was approved conditionally; if
the fingerprint census says declarations are already templated, D3 drops or the whole check does. It
runs before MODEL because a dropped check changes what has to be modelled.

Standing rules that apply and are not negotiable here:

- **Scoring waits for the apis.io rebuild.** No bare `score.rb --write`.
- **A band re-cut is part of this change, not a follow-up.** Items 2, 5 and 6 each move the whole
  catalog through the denominator.
- **Any figure quoted before the re-cut is on a different rubric.** 0.11.0's re-cut halved Exemplar
  (341 → 194); this one will move things too.
- **A second report rescore is owed** once #53/#54 are fixed — `rescore_reports.py --all
  --with-uncapped` then `audit_report_claims.py --all`.

---

## 9b. The August cadence — and what 1.0 actually gates on

> *"I have a lot more schools and industries to run this against in August. We will probably increment
> version each week if we are doing well. 1.0 would be the goal of September — I'd prefer to get it
> done before, but we'll see."* — Kin, 2026-08-17

### CORRECTION — the four-week ladder was wrong. Ship 1–4 as one release.

An earlier draft of this section cut the fifteen items into four weekly versions. **Kin pushed back —
*"why not just do 1–4 now?"* — and he is right.** The ladder was solving a problem that a single
release does not have, and it created three real costs the monolith avoids:

| | four weekly releases | one release |
|---|---|---|
| band re-cuts | **4×** (composite + agent readiness each time) | **1×** |
| apis.io rebuilds | 4 | 1 |
| **published score churn** | providers and badges move **four times in a month** | **once** |
| bundle regeneration | risks repeat passes | **once** |
| CHANGELOG entries + rubric snapshots | 4 | 1 |

The bundle argument I used to justify renames-in-week-1 only holds **if there are multiple releases**.
With one release the regeneration happens once regardless — so that argument was circular, and gap 8
(badges move silently, accepted) is four times worse under the ladder than under the monolith.

### What is genuinely sequential is a build order, not a calendar

The real dependencies are short, and all of them fit inside one pass:

```
#12 canonical spellings ──────────────► before any --write (the issue says so)
#53 / #54 roster fixes ───────────────► before a rescore can be trusted
#61 dry_run detector verified ────────► before applicability gates a hazard dimension
#34 matcher fix ──────────────────────► before the education regime lands on it
§3a.5 fingerprint census ─────────────► before #70 ships at all
```

None of those are weekly. They are an ordering **inside** the release, and §9 already encodes it.

### Attribution without four releases

The one thing the ladder bought was gap 5 — knowing which change moved what. **That is recoverable in
the MODEL step for far less than four release cycles:** run the scorer once per score-moving change in
isolation, record each delta, then run the combined pass. It is the same scorer with different flags,
and it produces a per-change attribution table for the CHANGELOG that four releases would have given
by accident.

**Cheaper, and it produces a better artifact** — a published table of what each change cost, rather
than four separate release notes a reader has to diff.

### So: one release now, and 1.0 is the freeze

The version numbering resolves cleanly once the ladder is dropped:

| | |
|---|---|
| **0.12.0** | **All fifteen items, one build, one re-cut, one rebuild.** Ship it, then run the August cohorts against it. |
| 0.12.x | Corrections the cohort runs surface — this is what the weekly increments actually are |
| **1.0** | The **freeze**: bands cut against a settled population, artifacts reset, vocabulary and math declared stable |

Weekly increments stop being planned feature drops and become what they should be — **fixes found by
running the instrument**, which is how every roadmap entry between #63 and #70 arrived in the first
place.

**And it improves the reports answer.** Under the ladder I recommended holding all report publication
until 1.0, because a report published in week 2 would be obsolete by week 4. With one release,
**reports can publish in August as soon as 0.12.0 lands** — every August cohort sits on one rubric,
`build_bundle.py`'s single-rubric guard is satisfied, and only a 1.0 rescore is owed rather than four.
That is a direct argument for the monolith that the ladder was costing.

### The cadence makes one waived gap sharper, though

**The process guard (gate item 5) moves from hygiene to load-bearing.** 0.11.0's failure — the public
record sitting **seven versions behind the engine** while the rebuild published those numbers —
happened at a *slow* pace. At weekly, the record drifts faster and nobody notices until a provider
asks why their score moved.

A version reaching `scoring.yml` without a matching `## <version>` CHANGELOG heading and a
`rubric/scoring-<version>.yml` snapshot must fail the pre-rebuild gate. **Under a weekly cadence this
is the only thing keeping the rubric auditable**, and it should ship in week 1 rather than being
listed as a gate item.

### The cohort runs are the test suite

*"A report that produces no instrument finding was probably not read closely enough"* is already the
program's rule, and every roadmap entry between #63 and #70 came from a market report rather than from
inspection. So the weekly loop is not *build → ship*, it is:

```
run a cohort → it surfaces a defect → that defect is next week's increment → re-run
```

Which means the ladder above is a **best guess at what the cohorts will surface**, not a commitment.
Weeks 3 and 4 should be expected to change as schools and industries come in.

### The one real decision the cadence forces: do reports publish during August?

The cohorts being run are the same work that produces Market Reports. Under weekly increments:

- a report published in week 2 is on a rubric that is **obsolete by week 4**
- `build_bundle.py` already **refuses a cohort containing more than one rubric version**
- all 48 reports needed a full rescore at 0.11.0; that is 4–5 rescores across August

**Recommend: run the cohorts for instrument findings, hold report publication for 1.0.** The cohort
work does its actual job — surfacing defects — without generating twenty more reports that need
rescoring four times. Cost: no report revenue in August from the new cohorts.

### What 1.0 gates on, and it is not a feature list

1.0 is a **stability commitment**: the vocabulary stops moving, the math stops moving, the evidence
classes stop moving, and the bands are cut against a population that will not shift underneath them.

**Bands are the binding constraint on the date.** They are cut from a measured distribution — so
adding 300 universities at a mean of 26.6, then more industries, then more schools, moves the
distribution every time. **1.0 cannot be cut until the August cohort expansion stops.**

That is the honest answer to *"before September?"*: not gated on how much building gets done, but on
**when the population settles**. If the cohort runs finish mid-August, a late-August 1.0 is real. If
schools and industries are still landing on 1 September, 1.0 waits — and cutting bands against a
moving population would be the one mistake that makes every published number wrong at once.

**Also pulled into scope by a 1.0 target:** the ROADMAP parks Header Literacy as *"proposed for 1.0"*,
along with other 1.0-marked items. Naming September as 1.0 dates them.

---

## 9c. EXECUTION LOG — measured findings that changed the work

### #12 is stale. Schema **0.22** already fixed it, and the flip must NOT be done.

Measured 2026-08-17 against the real schemas rather than the issue text.

**There is a `schema_0.22.yml`** (`commons/api-json/spec/`, written 2026-08-11) that nobody in the
plan or the issue accounted for. The type vocabulary has been growing fast:

| schema | type alternatives | providers declaring it |
|---|---:|---:|
| 0.19 | 43 | 8,621 |
| **0.20** | 59 | **17,122** |
| 0.21 | 128 | 238 |
| **0.22** | **238** | ~0 |

**All six of #12's named inversions now PASS under 0.22 — both spellings:**

| rubric canonical | 0.22 | pipeline variant | 0.22 |
|---|---|---|---|
| `LLMsTxt` | **PASS** | `LlmsText` | PASS |
| `SignUp` | **PASS** | `Signup` | PASS |
| `AgentSkill` | **PASS** | `AgentSkills` | PASS |
| `SDK` | **PASS** | `SDKs` | PASS |
| `Postman` | **PASS** | `PostmanCollection` | PASS |
| `Deprecation` | **PASS** | `DeprecationPolicy` | PASS |

**0.22 absorbed 25 of the 47 canonical types that failed 0.21** — including every one of the above.
The schema moved toward the rubric, which is the correct direction: the rubric reflects what the
pipeline actually emits.

> **So flipping the canonical spellings would move the rubric AWAY from the current schema.** #12's
> recommendation was right on 2026-08-11 and is wrong today. **Do not do it.**

### What is actually left, and it is small

Of 80 canonical types the scorer reads, **22 still fail 0.22 — and 10 of those have zero instances in
the catalog.**

| type | instances | providers | disposition |
|---|---:|---:|---|
| `Code Samples` | 81 | 18 | **normalise → `CodeExamples`** (already legal under 0.22) |
| `ContentSignal` | 67 | 67 | register — real 0.7-era vocabulary |
| `APIKeys` | 44 | 12 | register |
| `Certification` | 36 | 27 | register |
| `Standard` | 32 | 16 | register |
| `Licensing` | 32 | 25 | register |
| `API Keys` | 17 | 12 | **normalise → `APIKeys`**, then register |
| `Accreditation`·`Consent`·`AIPREF`·`FAPI`·`HTTPMessageSignatures` | 1 each | 1 each | register or drop |
| `Entitlements`·`Certified`·`MutualTLS`·`Redistribution`·`ConsentModel`·`ContentSignals`·`WebBotAuth`·`PAR`·`api-catalog`·`DataLicense` | **0** | **0** | **orphans — the scorer reads types nothing writes** |

**The ten zero-usage types are gate item #71 from the other direction.** #71 asks for a bidirectional
orphan test; #71's known instances were *pointers nothing reads*. These are *checks reading pointers
nothing writes*. Same test catches both, and it just found ten more.

### The real defect is the declared version, not the spellings

**17,122 providers declare `specificationVersion: '0.20'`**, which fails **63 of 80** canonical types.
Only 238 declare 0.21 and essentially none declare 0.22. **The catalog validates against a schema two
to three versions behind the one that fixes it.**

So #12's work becomes:

1. ~~flip canonical spellings~~ — **cancelled, would regress**
2. **bump `specificationVersion` to 0.22 catalog-wide** — mechanical, and it is the actual fix
3. **normalise two format variants** — `Code Samples` → `CodeExamples`, `API Keys` → `APIKeys`
4. **register the ~6 real types** in a 0.23 — schema reaches SchemaStore, so this is Kin's call
5. **resolve the 10 orphans** — register or remove from the scorer; fold into #71

**Note for the scorer:** it already reads every variant inline (`t == "API Keys" || t == "APIKeys"`,
`%w[Examples CodeExamples].include?(t) || t == "Code Samples"`). **Scoring is not broken; validation
is.** So the fix belongs in the data and the schema, not in more `||` chains in `score.rb`.

**Trap avoided:** `api-catalog` appears in `score.rb` in two unrelated roles — as a `common[].type`
(line 1239) *and* as the `.well-known/api-catalog` **document filename** (lines 943–1052, 1702–1707).
Only the first is a pointer type. A blind rename would have broken RFC 9727 linkset detection.

### #71 — the orphan test is built, and it corrects #56

`api-search/signals/test_vocabulary.py`. Tests four directions across the four places a pointer
type has to agree — `properties.yml`, `score.rb`, `scoring.yml` aliases, and the APIs.json schema.
`--gate` exits non-zero on direction C; `--usage` ranks findings by how many providers are affected.

**Getting it right took five read paths.** Missing any one turns a scored type into a false orphan,
which matters because this report tells providers what is worth wiring:

| path | level |
|---|---|
| `has_type(p, "X")` | provider `common[]` |
| `%w[A B].include?(t)` | provider, multi-type |
| `t == "X"` | provider, inline |
| **`canon(pr["type"]) == "X"`** | **API-level `apis[].properties[]` — easiest to miss** |
| `repo_has?(slug, "dir")` | artifact directory |

Two self-inflicted false-positive classes were found and fixed while building it: **456 unfilled
vendor-capability stubs** (`42CrunchAudit`, `ApiwizTesting` — `tags: []`, "Needs a description.",
never meant to score) and **24 types scored through a frontmatter rollup** rather than the pointer.
Counting either would have buried ~40 real findings under ~700 false alarms.

### Two false findings the test produced, and what killed them

A first pass reported `License` (1,181), `GitHubRepository` (975) and `Idempotency` (653) as orphans
worth wiring. **Checking before wiring killed all three**, and both reasons are worth carrying:

**A sixth read path — regex.** `score.rb` line 1666 reads
`common_types(p).any? { |t| t =~ /idempoten/i }`. **`Idempotency` is already scored**, at the
`documented` tier of a graded dimension. A string-literal extractor cannot see a regex match, so the
test invented an orphan. Fixed; the test now compiles regex read paths too.

**Deliberate non-reading is a decision, not drift.** The `open_source` facet **refuses** to read
`common[]`, and `score.rb` says why at length:

> *"A pointer records that WE wired something; the harvest records that the PROVIDER published
> something. Scoring the pointer would dock a provider for catalog work we had not got to — the
> two-sided attribution failure these cohort passes exist to catch."*

So `License` and `GitHubRepository` are unread **by design**, and wiring them would reintroduce
exactly the failure the facet was built to avoid. The test now carries a `DELIBERATELY_UNREAD` map
with the reason for each, so a decision never re-surfaces as a defect.

### What survives — direction A, ranked by providers affected

| type | providers wiring it | artifact class authorship |
|---|---:|---|
| `Lifecycle` | 4,872 | **381 marked, 0 first-party** |
| `Conventions` | 4,445 | **1,020 marked, 0 first-party** |
| `DataModel` | 3,493 | **3,264 marked, 0 first-party** |
| `Components` | 1,030 | **10 marked, 0 first-party** |
| `ToolCrosswalk` | 762 | ours by construction |

Directions B (31 read-but-unregistered), C (22 read-but-invalid), D (277 registered-but-invalid) as
measured in the #12 entry above.

### The conclusion, and it reframes #71

**Across all four classes: zero files marked `first-party` or `harvested`. Every marked file is
`generated` or `derived` — ours.**

So wiring them would credit providers for artifacts **API Evangelist wrote** — the identical mistake
0.10.2 and 0.10.3 corrected for `plans`, `rate-limits`, `rules`, `json-schema` and `vocabulary`.

> **#71 assumed unread means wasted provider effort. For an AE-authored artifact class, unread is
> CORRECT.** The test says what is unread; only authorship says which of those *should* be read.

**Therefore direction A is not actionable until #64 lands.** That is a real dependency the plan did
not have: **#71's remediation is gated on the authorship backfill (release item 17)**, not on the
test. The test is still worth having — it is the drift alarm #71 asked for, and it caught three
would-be mistakes in its first run, including two of mine.

### The one finding that does survive — and it de-escalates #56

**`Website` appears nowhere in `score.rb`. 23,093 providers wire it; zero checks read it.**

#56 states: *"The score reads a live 200 from `forgeglobal.com` as the company's own web presence, so
discoverability is credited to a page the company does not publish."* **That is not what happens.**
The venue-listing problem is real data hygiene worth fixing, but it **costs zero points**.

**#56 should be reclassified from a scoring defect to a catalog defect, and it does not gate the
re-cut.**

### The pre-rebuild guard is built and negative-tested

`api-search/signals/test_rubric_record.py`. Asserts three things agree before a rebuild may
publish: `scoring.yml`'s `schema_version`, a `## <version>` CHANGELOG heading, and a
`rubric/scoring-<version>.yml` snapshot **that matches the live file**.

The second half of the third check is deliberate. **A snapshot that exists but has drifted is worse
than a missing one — it looks like provenance and is not.** That is the presence-is-not-evidence
rule the rubric applies to everyone else, turned on us.

**Negative-tested**, because a gate nobody has seen fail is the `zero_errors` pathology this release
is fixing. Snapshot removed → exit 1 with the right message; restored → exit 0.

Current state passes: engine 0.11.0, CHANGELOG entry present, snapshot matches. **The 0.11.0
backfill genuinely worked** — snapshots run complete from 0.5 through 0.11.0, contrary to a first
impression that they stopped at 0.9.4.

### #27 — the swing is measured, and it is ~8% of what the issue feared

#27 and the ROADMAP both record option 2 as blocked because *"it re-zeroes every unprobed provider
catalog-wide and that swing has not been measured."* Measured 2026-08-17:

| | providers |
|---|---:|
| catalog | 26,861 |
| **earn `llms_txt_published` via a real harvested artifact** | **7,988** |
| **earn it via the unprobed-pointer FALLBACK** | **1,046** |
| total earning the check | 9,034 |

**The fallback is 11.6% of earners and 3.9% of the catalog — not "every unprobed provider."** The
harvest is already 88% done. That changes the decision entirely:

- **Option 1 (harvest) is now a bounded job of ~1,000 providers, not 26,861.** It was never the
  catalog-scale campaign it looked like.
- **Option 2 (drop the fallback) would strip a credit from 1,046 providers, and on #27's own sample
  rate (4 false in 15) roughly three-quarters of them are serving a real llms.txt we simply never
  fetched.** That is the collection failure the attribution block exists to prevent us publishing as
  a provider failure.

**Option 1, and it is running.** `harvest_llms.py` fetches each of the 1,033 declared pointers and
applies four rejections, each from a rule already paid for elsewhere:

| verdict | rule it comes from |
|---|---|
| `soft-404` — a 200 serving `text/html` | `soft-404-false-credit`; 2 of #27's 15 |
| `thin` — under the 50-byte floor | `llms_txt_present?` already applies it |
| `not-llms` — no `#`/`>` structure | a page, not a file |
| `foreign-host` — not on the provider's own registrable domain | #16's "own registrable domain only"; #52 STEP 0c. This is #27's Envoy Gateway → `envoyproxy.slack.com` case |

A pass writes the verbatim artifact. **A rejection writes nothing and is recorded** — an honest
absence is a valid measurement, and it converts a false credit into a true zero with a fetched URL
and a status code behind it.

#### Result — #27 is CLOSED

1,033 pointers fetched:

| verdict | n | share |
|---|---:|---:|
| **`ok`** — real llms.txt, artifact written | **782** | **75.7%** |
| `soft-404` — 200 serving HTML | **185** | 17.9% |
| `unreachable` | 55 | 5.3% |
| `not-llms` | 7 | 0.7% |
| `http-error` | 3 | 0.3% |
| `thin` | 1 | 0.1% |
| **false credits confirmed** | **251** | **24.3%** |

**24.3% against #27's hand-sample of 4-in-15 (26.7%).** The sample was accurate; the issue's estimate
of the rate was right and only its estimate of the *population* was wrong.

`foreign-host` returned **zero**. #27's Envoy Gateway → `envoyproxy.slack.com` case did not recur at
scale, so that failure mode is real but rare. Recorded so nobody over-builds for it.

**Writing the artifacts alone would NOT have closed the bug**, and this is the part worth keeping.
The check is:

```ruby
llms_txt_present?(slug) || (!repo_has?(slug, "llms") && has_type(p, "LLMsTxt"))
```

For a rejected provider nothing was written, so `!repo_has?` stayed **true** and the fallback kept
firing. **A harvest that only records successes cannot close a false-credit bug** — the absence has
to be written down too.

So each of the 251 got `all/<slug>/llms/<slug>-llms-probe.yml` carrying the fetched URL, status,
content-type and verdict. That makes `repo_has?` true (fallback suppressed) while carrying no `.txt`
(so `llms_txt_present?` stays false) — **a true zero with evidence behind it.** Same posture as the
`well-known` probe artifacts, which record negative results by design.

| | before | after |
|---|---:|---:|
| earn via a real artifact | 7,988 | **8,770** |
| earn via the unprobed fallback | 1,046 | **16** |
| total earning `llms_txt_published` | 9,034 | **8,786** |
| **net credit change** | | **−248** |

**248 providers lose a credit they were not entitled to; 782 now hold evidence instead of an
assumption.** The residual 16 are pointers whose `type:`/`url:` pairing the harvester's regex did not
match — a known, bounded remainder, not an unknown.

**This is the first score-moving change of 0.12.0 and it moves scores DOWN.** It joins #59's MCP
correction as the second downward pressure landing in the same band re-cut.

### #54 — ROOT CAUSE FOUND, and it is three mechanisms, not one

#54 asked whether it shares a root cause with #47 (a helper broke 19 `apis.yml` files and `build.py`
silently dropped a provider) and recorded it as *"not established."* **Established: it does not.**

**All 28 unbanded providers' `apis.yml` parse cleanly.** #47's mechanism is absent. The symptom has
three separate causes:

#### 1 · Twenty-five providers have no `.git` directory — this is the main one

`providers/scripts/build-listing.py`, `company_slugs()`:

```python
if not os.path.isdir(os.path.join(path, ".git")):
    continue          # <- silent, no bucket, no count
```

A directory with an `apis.yml` but no `.git` is **scored by `score.rb`**, gets a
`_providers/<slug>.md` page **with a correct band in its frontmatter**, and is then dropped here
without a word. 26 of the 28 had a correct band sitting in the page all along.

**The check contradicts the function's own docstring**, which says exactly two things disqualify a
repo — delisted, or no `apis.yml` — and then explains that *"keying on `apis.yml` is what
`build-providers.py` and `build-sections.py` already do; this makes the listing agree with them."*
The `.git` requirement is what makes it **dis**agree.

Catalog-wide: **26,861 directories carry an `apis.yml`; 26,836 also carry `.git`; 25 do not.** Those
25 are the drop, and they include **`gs1` (23.9)** — a named headline in the published Supply Chain
report — alongside Alphabet, AMD, Toyota, UnitedHealth, Cigna, Centene, TJX, CSX and Altria.

It also connects a condition already recorded and never linked to scoring: the git-state inventory's
**"31 non-git"** repos. The inventory knew; nothing joined it to the band files.

**Fixed so it can never be silent again.** `company_slugs()` now collects the non-git drops and
prints a boxed warning naming every one. Verified firing: `WARNING: 25 SCORED providers excluded for
having no .git directory.`

**Left for Kin, deliberately:** whether to `git init` the 25 (they should be real repos anyway, for
recoverability) or to keep the `.git` requirement as a deliberate rule. **Not done unasked, because
25 fresh repos with no remote would land in tonight's `all/*` commit and push.**

#### 2 · `spot-ai` — scored, has `.git`, has `apis.yml`, and has no provider page at all

The only one of the 28 with no `_providers/spot-ai.md`. A different failure, one step earlier in the
chain, and plausibly a remnant of the `flexera`/`spot` repo-rename collision.

#### 3 · Three never rescored at 0.11.0 — and the fourth is a false alarm

| provider | composite | rubric | last scored |
|---|---:|---|---|
| `modal` | **67.0** | 0.9.1 | 2026-08-06 |
| `deel` | 60.8 | 0.9.1 | 2026-08-06 |
| `factorial` | 30.8 | 0.9.1 | 2026-08-06 |

**A 67.0 Exemplar is still absent**, unchanged since #54's comment. But #54's comment names a
**fourth**, `tronald-dump` — and it is in `network/_data/delisted.yml`. **Its absence is the
delisting guard working correctly, not a defect.** Three, not four.

#### The timing proof that rules out simple build lag

26,567 providers scored at **06:45** today. Band files rebuilt at **10:08**, three hours later, with
26,541. The build ran *after* the scoring and still dropped them — so this was never staleness.

### #61 — the detector IS too narrow, but only 2.1×. The finding survives.

#61 asked for a verdict between three outcomes before 0.27% gets quoted again. Measured across
**95,117 specs in 7,581 providers** with an `openapi/` directory.

The check, verbatim (`score.rb:544`, `:637`): at least one **mutating** operation carrying a
**parameter whose name matches exactly**:

```ruby
DRY_RUN_PARAM_RE = /\A(dry[_-]?run|simulate|preview|validate[_-]?only|test[_-]?mode)\z/i
```

That is the right semantics — a request-level flag, not a sandbox environment. **#61's outcome 3
(detector too loose) is ruled out.**

| widening | providers | share |
|---|---:|---:|
| **live detector as written** | **80** | 1.06% |
| + vendor-prefixed param (`X-Dry-Run`) | **0** | 0.00% |
| + unanchored param (`dryRunMode`, `previewOnly`) | +27 | 0.36% |
| + `requestBody` property, exact match | +36 | 0.47% |
| + `requestBody` property, loose | +37 | 0.49% |
| **union of all widenings** | **171** | **2.26%** |
| | **2.1×** | |

**Verdict: outcome 1, modestly.** The detector is too narrow and the true figure is roughly double —
not the 30× the 9.2% keyword sample raised as a possibility. #61 predicted that itself: *"most of
those hits will be a sandbox environment… `sandbox` in particular is a near-certain false friend."*
Confirmed.

**A hypothesis of mine that the data killed.** I flagged that `RATELIMIT_HEADER_RE` anticipates the
`x-` vendor prefix one line above while `DRY_RUN_PARAM_RE` does not, and predicted that asymmetry was
costing detections. **It costs exactly zero — not one provider names the parameter `X-Dry-Run`.** The
asymmetry is real and harmless. Recorded so nobody re-derives it.

**The real gap is the request body.** The detector scans `parameters` only, and the dominant modern
pattern is `{"dryRun": true}` in the JSON body — worth +36 on its own, the largest single widening.

#### What this means for the release

1. **The published finding stands.** *"Anything which constrains or accounts for what an agent may
   actually do falls off a cliff"* survives at 2× the original number. Quote **~0.5%** rather than
   0.27%, and say the detector reads request-level flags.
2. **The applicability layer can proceed.** `dry_run_mode` is genuinely rare, not an artifact — so
   making it `na` for read-only providers is measuring a real absence of hazard, not papering over a
   blind detector. **This was the gate on §4 and it is now cleared.**
3. **Widen the detector in this release** — add `requestBody` schema properties and drop the anchors.
   It is additive, it moves ~91 providers up, and per §7's rule a score-moving change is cheaper
   before the band re-cut than after.

Sibling check worth doing in the same pass: `idempotency` reads `IDEMPOTENCY_PARAM_RE = /idempoten/i`
against **parameters only** too, so it has the identical request-body blind spot, and it is one of the
three dimensions §4 is about to gate.

### #62 — CLOSED. The facet is 48 -> 33 points and the reporter's case now passes.

A provider read the Governance facet closely enough to find that its checks measure a ruleset's
**declarations** while the facet text describes lint **outcomes**. They ran the lint themselves and
mutated their spec once per rule to prove the pass was not vacuous. They were right.

**Dropped `low_error_density` (10 pts) and `zero_errors` (5 pts).** Both read declared severities.
Spectral is never executed against the provider's spec, so neither could measure what its own text
promised. As declarations they were incoherent and mutually contradictory: `zero_errors` was
unearnable by any ruleset declaring an error-severity rule -- every ruleset with teeth -- while
`balanced_severities` paid 3 points for declaring warn and info. **The scoring-optimal ruleset was
one that could never fail a build.**

`balanced_severities` is KEPT. With `zero_errors` gone it no longer contradicts anything, and as a
statement about ruleset design it is coherent: a ruleset where everything is an error can express
refusal but not guidance.

**`rules_substantial` now counts what the ruleset ENFORCES.** `build.py` never captured `extends:`,
so a ruleset doing `extends: [spectral:oas]` plus a focused handful was measured on the handful.
It now records `extends`, `inherited_rule_count` and `effective_rule_count`, against a table of what
each base actually executes (`spectral:oas` 41, `spectral:asyncapi` 27, `spectral:arazzo` 15). An
unrecognised base contributes **0**, so the count can understate a ruleset but never inflate one.

The reporter's own ruleset, measured:

| | |
|---|---:|
| authored rules | 9 |
| inherited from `spectral:oas` | 41 |
| **effective** | **50** |
| `rules_substantial` (>=20) | **FAIL -> PASS** |

Which is exactly their argument: *"inlining 41 rules I didn't write in order to be measured on the 9
I did."*

**Facet total: 48 -> 33 points, weight held at 0.12** per the decision. As predicted in section 1,
`rules_present` goes from 20.8% to 30.3% of the facet.

**Scale, and the honest caveat.** 2,234 rulesets in the catalog use `extends`. In a 2,000-file
sample, **557 would newly pass `rules_substantial`** -- a large upward move. But most of those
rulesets are **ours**: 4,516 of 5,785 name their own generator. `rules_substantial` is already wired
into `provenance.applies_to` for the `rules` class, so AE-generated rulesets grade down and the
composite effect is damped well below the raw count. **Verified still wired after the edit.** The
per-change modelling step must report this one net of provenance, or it will read as a much bigger
gift than it is.

**Still open, deliberately:** outcome-based linting. Running Spectral across ~26k providers' own
specs is a real build cost and wants its own artifact class. Until it exists the facet measures
declaration -- and now its description says so, which was the reporter's actual ask: *"I'd rather not
restructure ours until I know which model I'm optimizing against."*

### Applicability layer — derived, wired, and it found our own artifacts suppressing it

`all/0-working/applicability.json`, one derived file following the `open-source-surface.json`
precedent so a computed observation never lands inside `all/<slug>/` looking like provider work.

**write_surface, across 26,861 providers:**

| shape | n | share of the 7,579 with a readable contract |
|---|---:|---:|
| no-contract | 19,285 | — |
| mixed | 4,594 | 60.6% |
| write-heavy | 1,377 | 18.2% |
| **read-only** | **1,008** | **13.3%** |
| write-only | 440 | 5.8% |
| read-dominant | 157 | 2.1% |

**13.3% against roadmap#63's 12.9%** — independently reproduced on a fresh derivation.

**The finding: our own artifacts were suppressing the commercial-surface detector by 2.75x.**

First run flagged **77** providers as having no commercial surface by design. Checking why the
obvious cases were missing turned up this: of the 1,008 read-only providers, **142 failed on
`plans/` or `rate-limits/` alone — and 135 of those 142 artifacts are marked `generated` or
`derived`. Ours.**

`plans/`, `rate-limits/` and `finops/` are catalog-authored at scale — one cohort sits at 100%
coverage from a single bulk sweep. **An artifact we wrote cannot be evidence that the provider has a
commercial model**, and counting it suppressed the exact finding the fact exists to make. Same class
as the governance facet scoring AE-written rulesets as provider governance.

Corrected: **77 -> 212**, 2.8% of providers with a contract. Unmarked artifacts still count as the
provider's, matching the standing rule that absence of a marker is credited in full — conservative in
the right direction, since it can only *understate* how many providers have no commercial surface.

**Validated against the cases that motivated it:**

| provider | shape | commercial | verdict |
|---|---|---|---|
| **i6eal** | read-only, 83 ops | **absent-by-design** | the motivating case, caught |
| Open-Meteo | read-only | present-or-unknown | correct — its `plans/` is unmarked and names real Standard/Professional/Enterprise tiers |
| We > Ultrarich | read-only | present-or-unknown | gets the hazard `na`, not the commercial substitution |
| Stripe | mixed | present-or-unknown | correct |

#### What is gated, and what deliberately is not

**Hazard dimensions — `na` for read-only, leaving the denominator** per the decision.
`dry_run_mode` (every request to a read API already is a dry run) and `idempotency` (a GET is
idempotent by definition — the guarantee is in the method).

**`event_surface_described` is NOT gated, against roadmap#63's own proposal.** A read-only API can
legitimately publish webhooks — "new data is available" is a normal thing for a read surface to
announce, and 5.4% of read-only providers already do. Excusing it would be the blanket excuse the
issue warned its own proposal could become.

**Commercial checks — `na` where all five signals hold.** `plans_present`, `plans_multiple`,
`pricing_link`, `sign_up_present`, `finops_mapped` — **24 of `access_clarity`'s 38 points.** The
remaining 14 — terms of service, privacy policy, compliance, trust centre — stay, because they ask
what you are PERMITTED to do and who is accountable, which applies to a free statutory interface
exactly as much as to a SaaS product. **That split is the whole argument for the rename.**

Both gates fail **closed**: no derivation, or no readable contract, and the check scores normally.
Inapplicability is never inferred from missing evidence.

#### A bug caught before it shipped

The first implementation of roadmap#34's `undetermined` state returned a new hash shape from
`regulatory_regime_for`. **Eight call sites treat `nil` as "not regulated" and one derives `applies:`
from it — so that would have switched the regulatory facet ON for every untagged provider in the
catalog.** Reverted to a separate `regime_undetermined?` predicate; the return contract is untouched.

### standards_conformance — the measurement kills the facet. It ships as a CHECK.

Section 6c C recommended a new conditional facet. **Measuring the evidence base killed it, on two
independent grounds.**

#### 1 · A conditional facet triggered by conformance CAN ONLY EVER BE PASSED

This is the decisive one and it is a design error, not a data problem.

A conditional facet applies only where its trigger fires. If the trigger is *"this provider ships a
recognised domain standard"*, then every provider the facet applies to **passes it by construction**.
It could never subtract. That is a pure bonus facet — **the exact `zero_errors` pathology removed
from governance three items ago in this same release**, reintroduced under a new name.

A facet has to be able to cost something, or it is a participation award. The applicability question
that WOULD make it a real facet — *"does this provider's market have a domain standard it is not
implementing?"* — needs an industry→standards map with real coverage, and that map does not exist.

#### 2 · The evidence base is ~2%, not the market-wide signal roadmap#69 assumed

Document-level signatures across every OpenAPI in the catalog — schema URNs and protocol markers,
never prose mentions:

| standard | providers |
|---|---:|
| OData | 89 |
| **SCIM** | **60** |
| ActivityPub | 10 |
| OpenRTB | 4 |
| Sparkplug | 2 |
| oneM2M · Web of Things · HR Open | **0** |

**~165 providers of the 7,579 holding a contract — about 2%.** roadmap#69 called domain-standard
conformance *"the single most useful interoperability signal in the market"*, and in principle it is
right. In this catalog, today, almost nobody ships one detectably.

Three of the standards the issue names have **zero** detectable adoption. Weighting a facet at 0.10
on that would be building instrument for evidence that is not there.

#### 3 · And FHIR was already covered — twice

Section 6a established this and it survives: FHIR is scored through the `health` regime's standards
list AND through dedicated `fhir_capability_statement` / `fhir_resource_coverage` checks in
contract_quality. **The plan's "seed with SCIM and FHIR" would have made FHIR a third scoring path
for the same fact.** The genuinely uncovered standard was only ever SCIM.

#### What ships instead

A **reward-only check in `contract_quality`**, small points, no `na` gating — the same posture as
`lifecycle_documented`: credit documented conformance, never penalise its absence. Detection is
document-level evidence, inheriting `reg_mandate_verified`'s rule that a claim with nothing callable
behind it earns nothing. A provider naming SCIM in marketing copy gets nothing; one declaring
`urn:ietf:params:scim:schemas:...` in its contract earns.

Verified real before building on it: ActivTrak declares
`urn:ietf:params:scim:schemas:extension:activtrak:2.0:Group`, which is conformance evidence rather
than a mention.

**The industry→standards map is still the right long-term shape** — section 6a's finding that a
standard is reachable only through a regulatory regime stands, and it is why SCIM was invisible to a
non-education provider. But it becomes a facet when the adoption exists to measure, not before.
Recorded as deferred with the reason, so the next pass does not re-litigate it from the issue text.

### Interface styles — a new axis, raised mid-build and worth having

**Kin, 2026-08-18:** *"We probably should start identifying API patterns like RPC somewhere. REST.
We do GraphQL. We do MCP. These are all patterns and we should probably be identifying everything a
provider offers and consider in rubric."*

Raised out of the `lifecycle_documented` work, and it is the same class of fact as `write_surface`:
**something the contract already answers that the rubric was inferring.**

**It gives an existing roadmap finding somewhere to live.** roadmap#70's second-order note has been
sitting unactionable since it was filed: *"gaming's taxonomy puts `rpc` in the top resources... the
rubric is shaped by HTTP request/response, so a market with a legitimate architectural reason to use
something else is being measured partly on the wrong axis."* Slack is that finding in a different
market, found from the other end.

#### Two layers, and the second is the one nothing had

**1 · Declared surfaces** — which contract classes exist at all. Already on disk:

| surface | providers |
|---|---:|
| openapi | 7,674 |
| **mcp** | **4,170** |
| asyncapi | 2,247 |
| graphql | 1,120 |
| grpc | 124 |
| wsdl | 11 |

**2 · HTTP style INSIDE the OpenAPI — `rest` vs `rpc-http`.** This is the new layer, and *"has an
`openapi/`"* tells you nothing about it. Slack and Stripe both have one; only one is
resource-oriented. Derived from path SHAPE — share of paths carrying a parameter segment, share
answering only POST, share whose last segment is a dotted method name (`/chat.postMessage`).

#### RECORDED, NOT SCORED in 0.12 — and that is deliberate

Same posture as `operator`. **A provider is not better for being REST.** An RPC, event-driven or
streaming surface can be exactly right for its market, and scoring style would repeat the mistake
this exists to fix. What it unlocks is knowing WHICH CHECKS APPLY — which is the applicability
layer's entire job.

It is also a new axis surfaced mid-build, and 0.12 already carries a band re-cut. Deriving it now and
scoring it in 0.13 keeps an unmeasured scoring change out of a release that has enough of them.

#### What it would unlock once scored

| today | with `interface_style` |
|---|---|
| `lifecycle_documented` counts Slack's 121 RPC methods as creatable resources | RPC providers leave the denominator; the catalog percentages stop understating REST coverage |
| roadmap#70's gaming/RPC finding is prose in an issue | a fact on the record, per provider |
| roadmap#11 (gRPC) and #19 (WSDL) are "formats we cannot read" | **`grpc/` 124 and `wsdl/` 11 providers are already on disk** — the readers have a measured population to justify them |
| `contract_quality` assumes request/response | checks can be gated by style the way hazard dimensions are gated by `write_surface` |
| a multi-surface provider looks the same as a single-surface one | breadth of interface styles becomes reportable in its own right |

**The gRPC and WSDL counts are the immediately useful part.** roadmap#19's own first step is *"count
first — Swagger 2.0 went from 'one provider looked odd' to 203 providers; do the counting before the
weighting."* That count now exists: **124 providers hold a `grpc/` artifact and 11 hold WSDL.** Small,
but no longer unknown — and it sizes the reader work honestly rather than on an anecdote.

### #70 — the kill gate RAN. D2 is dead, D1 survives, and the check ships smaller.

Decision 2 approved a declared posture scoring above silence **conditional on section 3a.5
clearing**. It ran. The condition did its job.

#### D2 — FAILED. There is nothing provider-authored to score.

`agentic_access` was #70's own preferred vehicle: *"promote it to carry a stated-closure value
rather than being binary present/absent."* Census of all **6,654** artifacts:

| `method:` | n | |
|---|---:|---:|
| **generated** | **6,627** | **99.6%** |
| searched | 17 | 0.3% |
| derived | 5 | 0.1% |
| probed | 4 | 0.1% |
| declared | 1 | 0.0% |

**Eighteen artifacts in the entire catalog are provider-authored.** And posture-shaped keys are
almost non-existent — 8 artifacts carry anything resembling one.

Section 3a.5's kill condition for D2 was stated in advance: *"if provider-authored is ~0, there is
nothing to score yet."* It is 0.3%. **D2 does not ship.**

This is 0.6's finding recurring exactly — that release found `agentic_access` at 99.9% generated —
and it is the trap roadmap#38 named: scoring prose we wrote measures our writing, not theirs.

#### D3 — moot. With no declarations, there is nothing to fingerprint.

#### D1 — SURVIVES, and it is the tier that was always strongest.

`robots.txt` directives naming AI user-agents. Sampled 400 providers, 337 with a usable host:

| verdict | n | |
|---|---:|---:|
| robots.txt exists, no AI directive | 226 | 67.1% |
| unreachable | 62 | 18.4% |
| **names an AI user-agent** | **39** | **11.6%** |
| no robots.txt | 10 | 3.0% |

Agents named: GPTBot 34 · Google-Extended 33 · CCBot 32 · Applebot-Extended 30 · Bytespider 30 ·
ClaudeBot 29 · Meta-ExternalAgent 26 · anthropic-ai 20 · PerplexityBot 16 · cohere-ai 15.

**11.6% discriminates.** It is not near-universal and not near-absent, which were the two ways
section 3a.5 said D1 could fail. Extrapolated, roughly **2,600 providers** in the catalog have made a
machine-readable, ENFORCED decision about agent access.

D1 is also the tier with the strongest epistemics, and this measurement confirms why: **a robots.txt
directive is not a claim about policy, it is the policy.** It cannot be written without being
enforced, which is exactly what the other three tiers could not guarantee.

#### What #70 ships as

**D1 only.** A provider whose `robots.txt` names AI user-agents has stated a position — whether that
position is allow or disallow — and a stated position scores above silence. Take-Two at 7.1 and a
company that never thought about it stop being the same number.

Smaller than the four-tier design in section 3a. That is the kill gate working as intended: it was
written to shrink or stop the check on evidence, and it did both.

---

## 9a. Gaps — what this plan was not considering (found 2026-08-17)

Eleven decisions are settled and the release is coherent. These are the things **nobody had raised**,
found by asking what a rubric release owes beyond the rubric. Ordered by how badly each would bite.

### Dispositions — Kin, 2026-08-17

| # | gap | call |
|---|---|---|
| 1 | renames break 118 sold bundles | **Regenerate. Expected, not a concern.** |
| 2 | `examples_published` credits 404s | **Probe-gate it** (recommendation accepted) |
| 3 | Agent Readiness band re-cut | **Add it** → now in §9 |
| 4 | history breaks at the rename | **Accepted** — see the September milestone below |
| 5 | no per-change attribution | **Accepted risk.** August is a rapid-iteration window |
| 6 | no "not scoreable" state | **Build one — a state that says it needs work.** Design below |
| 7 | provider page is a redesign | **Expected. Do the work.** |
| 8 | badges move silently | **Accepted** |
| 9 | remediation queue blocked | **Accepted** |
| 10 | runtime unbudgeted | **Do the work** |
| 11 | ratings MCP response shape | **As-is. No versioning.** |

### ⚑ The September milestone — new, and it reframes this release

> *"I will likely reset all `kin/score` in September with the first stable release of the spec. Goal
> is to rapidly iterate in August."* — Kin, 2026-08-17

This was not in the plan and it changes how 0.12.0 should be read:

- **0.12.0 is an August iteration release, not the stable one.** The bar is *move fast and stay
  honest*, not *get it final*. That is why gaps 4, 5, 8 and 9 are accepted rather than fixed.
- **Gap 4 dissolves.** Facet history does not need migrating if every `kin/score-*.yml` is reset at
  the stable release anyway.
- **Gap 1 has a sequencing choice.** Regenerating 118 report bundles for the rename in August and
  again at the September reset is two passes. **Worth deciding whether the bundle regeneration rides
  the September reset instead** — the rename can ship in the rubric before the bundles catch up, as
  long as the stale key is documented.
- **It gives the deferred list a date.** WSDL, gRPC, outcome-based linting, the full 32-class
  authorship backfill and `accountability` *scoring* were all deferred to "0.13". They are really
  deferred **to the stable release**, which is a firmer target and should be named as such.

**Open, and worth settling early:** is the September stable release **1.0**? The ROADMAP already
parks Header Literacy as *"proposed for 1.0"*, so a 1.0 target would pull that and the other
1.0-marked items into scope rather than leaving them undated.

### 1 · The facet renames break 118 sold data bundles — MEASURED

The renames were costed as *"downstream text in published reports."* That is wrong by an order of
magnitude. **`commercial_clarity` and `governance` are not prose in the reports — they are schema.**

```
$ head -1 reports/state-of-creator-economy-apis/bundle/data/scores.csv
provider,name,facet,score,cohort_avg,delta_vs_avg

$ cut -d, -f3 …/scores.csv | sort -u
commercial_clarity
contract_quality
developer_ergonomics
discoverability
governance
operational_transparency
```

| | |
|---|---:|
| report data bundles carrying the facet keys | **669 files** |
| **distinct reports whose sold bundle carries them** | **118** |

These are **paid deliverables** — `scores.csv`, `providers.csv`, `market-stats.json`,
`data-dictionary.md` — and reports are a **one-year subscription**, so buyers have live access and
will re-download. A rename silently changes the schema of something people bought.

**Options, none free:**

| | |
|---|---|
| carry both keys for one release | bundles get a duplicate column; ugly but non-breaking |
| version the bundle schema and regenerate all 118 | the honest fix; real work |
| don't rename | **rejected** — `commercial_clarity` is the wrong word for a third of the catalog |

**This does not change the decision. It changes the cost, and it has to be scoped before the rename
is scheduled.** Recommend: regenerate with a `schema_version` on the bundle, and a one-line note in
the data dictionary naming the old key.

### 2 · `examples_published` ships a check that credits 404s on day one

#71's `examples_published` reads `common[].type` for `Examples`. **#16 is not in this release** —
scored pointers are still never fetched. Avalara had **three dead pointers worth 8 points**, and its
own `llms.txt` advertised 12 more 404s.

So 0.12.0 would add a new pointer-satisfied check to a rubric with a known, unfixed defect in exactly
that mechanism. **Internal inconsistency in this release.** Three ways out: probe-gate
`examples_published` at wiring time (the `probe-index-coverage.py` bar already exists and 60 pointers
were wired that way), pull the check to 0.13, or pull #16 forward. **Recommend probe-gating it** —
it is one new check, not a catalog-wide sweep.

### 3 · Agent Readiness needs its own band re-cut, and nobody said so

The applicability layer makes `dry_run_mode`, `idempotency` and `event_surface_described` **`na` for
read-only providers — 12.9% of the catalog.** Agent Readiness has **its own bands** (46/34/6, cut in
0.6) and **its own gate** (`band_gated_from`, 1,024 providers).

Every "band re-cut" in this plan means the **composite**. Changing three of fourteen dimensions'
denominators for one provider in eight moves the agent-readiness distribution too, and its bands were
calibrated when those dimensions were scored zero rather than excluded. **Add an agent-readiness
re-cut to §9, or the layer publishes on a stale calibration.**

### 4 · Historical score artifacts do not survive the rename

Every `all/<slug>/kin/score-*.yml` carries `governance:` and `commercial_clarity:` blocks. After the
rename, **a trend join across the boundary silently returns nothing** for those two facets — no error,
just an absent series.

*"Score history & trends from the `kin/` artifacts"* is already a ROADMAP item, and `score.rb` already
emits `previous_composite` and a delta. The composite survives; **two facets lose their history at the
rename unless the old keys are migrated or aliased in the reader.** Cheap now, expensive once more
history accumulates.

### 5 · No per-change attribution — the 0.11.0 traceability failure in a new shape

**Eight or more score-moving changes land together** (items 1, 2, 5, 6, 6b, 6c, 9, 11). The modelling
step as written produces *one aggregate delta*, so the answer to *"why did this provider drop a band"*
will be *"0.12.0."*

That is the same class of failure as 0.11.0 shipping inside a delisting commit: the numbers were
right and the record could not explain them. **Recommend: model each score-moving change
independently first, then combined, and publish the per-change deltas in the CHANGELOG.** There is no
regression fixture set today — twenty providers spanning bands and shapes, with frozen expected
outputs, would make every future release attributable.

### 6 · "Not scoreable" has no state, and decision 9 needs one

Decision 9 publishes the composite for a cohort where **most will fail**. That is right. But *failing*
and *not measurable* are different, and the rubric cannot say the second:

- **#29** — `broadcom` scores 45.3 with **no host in the index that any probe can reach**
- **#56** — nine providers tagged defunct, `Website` pointing at a stock-listing page
- **CORE at 5.7** — our collection gap, published as their score

Delisted and restricted providers are already `UNRATED`. Nothing covers *listed, live, and
unmeasurable*.

**DECIDED: build a state that says the record needs work.** Kin's framing is better than
`not_scoreable` — this is a **work-queue state**, not a suppression state. The score still publishes;
the record says what is missing and, crucially, **whose job it is**.

```yaml
needs_work:
  reason: no_resolvable_host        # what is wrong
  owner: catalog                    # whose job — catalog | provider
  detected: '2026-08-17'
  detail: "no Website, Documentation or DeveloperPortal in common[]; website: empty"
```

| `reason` | `owner` | instance |
|---|---|---|
| `no_resolvable_host` | **catalog** | `broadcom` — 45.3, and no probe can reach it (#29) |
| `never_enriched` | **catalog** | CORE at 5.7; NYU, the Open University and BITS Pilani are not providers at all |
| `defunct` | **catalog** | the nine tagged defunct in #56, `Website` pointing at a stock listing |
| `venue_as_website` | **catalog** | the 17 in #56 |
| `authorship_ours` | **catalog** | score rests overwhelmingly on AE-authored artifacts (#64) |
| `vendor_only_surface` | **provider** | 46% of universities; Yonsei's 37-of-38 Elsevier Pure |
| `no_owned_surface` | **provider** | Kin's steer — an operator with no institution-operated API |

**`owner` is the load-bearing field, and it reuses machinery that already exists.** The `attribution:`
block already splits recoverable points into `catalog` (ours), `index` (theirs, our pointer) and
`frontier` (only they can produce it). `needs_work.owner` is the same distinction made
*per-record* instead of per-point.

**Three things it unlocks:**

1. **It makes decision 9 honest.** *"Most will fail"* is publishable when every failure states whose
   gap it is. A university at 20.6 with `owner: catalog, reason: never_enriched` is our backlog. One
   at 20.6 with `owner: provider, reason: vendor_only_surface` is the finding.
2. **It is a queryable work queue**, not a flag. `owner: catalog` is the enrichment backlog and the
   harvest list; `owner: provider` is the Personalized Checklist input and the outreach list.
3. **It is the honest version of the steer.** *"Steer towards owned portal and program"* becomes a
   named state on a record rather than a sentiment in a report.

**Rule that has to survive:** `needs_work` **never** suppresses or adjusts the composite. It sits
beside it, the way `band_gated_from` names a demotion instead of hiding it. Anything else recreates
the silent-zero class this whole release is built against.

### 7 · The provider page is a redesign, and it is on the critical path

Scoring waits for the apis.io rebuild, so **UI is a release blocker, not a follow-on.** 0.12.0 adds or
changes: two renamed facets, a new conditional facet, a **new standalone layer** beside Kin Score and
Agent Readiness, the three-way authorship share, `delivery_model`, and disclosure states on
index-class checks.

That is a third score panel plus two new labelled dimensions on a page that already runs ~2,650 lines.
Nobody has scoped it, and #61 records that provider pages are long enough that a truncated read fails
*silently and plausibly*.

### 8 · Badges move under providers with no notice

`EMBED.md`: *"the badge is rendered from your **current** Kin Score every time it loads … When you
publish an OpenAPI you were missing and the score moves, the badge moves with it."*

That is the right design for improvement and it cuts both ways. **0.11.0 halved Exemplar (341 → 194).
Anyone who embedded a badge as an Exemplar may have silently become Strong on someone else's
website.** 0.12.0 will move numbers again, including downward.

**Recommend a pre-rebuild notice to embedded-badge providers**, and — separately — that
`band_gated_from`'s honesty precedent extends here: a badge whose band changed in a rubric release
should be able to say so.

### 9 · The remediation queue is blocked on this release

Standing rule: **scoring waits for the apis.io rebuild, no bare `--write`.** Every provider awaiting a
rescore waits for 0.12.0 — including makeBIMI, open since 2026-08-14, and everything behind the inbox
process. The plan has a six-item gate, a measurement gate and a modelling step in front of it.

**Either state an ETA, or define a carve-out** for provider-initiated rescores that do not depend on
rubric changes. Right now a provider who does the work we asked for waits on our release cycle, which
inverts the push-work-back-to-the-provider posture.

### 10 · Runtime cost is unbudgeted

Outcome-based Spectral linting was deferred *because of build cost*. Nothing costed what was kept:

- **§3a.5** — a `robots.txt` census across ~26,568 providers
- **applicability** — re-reading every refined OpenAPI for method counts (**553,510 operations**)
- **fingerprint census** — every candidate declaration and artifact class
- **#16 probe-gating**, if item 2 above is adopted

Each is defensible. Together they are a real wave, and the enrichment work has cost and wave-sizing
discipline that this plan does not apply to itself.

### 11 · The ratings API and MCP tools change shape

`get_provider_rating`, `get_rating_rubric`, `get_rating_history`, `find_ratings` and
`find_rating_movers` are **live tools with dogfood consumers**. A facet rename changes response keys
for every one of them, and `get_rating_rubric` publishes the rubric itself. No response versioning is
considered anywhere in this plan.

---

## 10. What this release does not fix, stated plainly

The meta-finding stands after 0.12.0: **the composite measures what is on the table about a provider —
theirs and ours together.** Items 4 and 8 make that *visible*; they do not make it stop being true.
The honest resolution is decision 3 above — publish the split — and it is a positioning choice, not
an engineering one.

Second: `accountability` ships as a **schema with no scores in it**. That is deliberate —
five profiled institutions is a hypothesis, not a calibration, and the five-band sort (Governed /
Owned / Provisioned / Declared / Undeclared) has not survived contact with a sixth. But it
means the university research gets a frame in 0.12.0 and a number no earlier than 0.13.

Prerequisites the university layer still carries, none of which this plan resolves: harvest NYU, the
Open University and BITS Pilani (three of five profiled institutions **are not providers**); fix the
CORE entry; probe the index-class zeros before reporting zero MCP servers across 300 universities.
