# Kin Score — Roadmap

The rubric is a living argument, versioned and iterated — especially now, as it is applied across
new sectors, until it stabilizes. This is the planned direction. Nothing here is a commitment to a
date; it is the queue of improvements, most-ready first. See [`CHANGELOG.md`](CHANGELOG.md) for what
has shipped.

---

## Status after 0.11.0 (2026-08-11) — SHIPPED AND PUBLISHED

**0.11.0 is live.** The weekly APIs.io rebuild on 2026-08-11 ran the held `--write` rescore and
published it across the catalog, so **published scores went from 0.9.1 straight to 0.11.0** — ten
rubric versions in one step. The "not yet applied" warning carried in every status block below is
now discharged.

**Band re-cut — anything quoted before 2026-08-11 is on the old rubric.**

| band | before (0.9.x) | after (0.11.0) |
|---|---|---|
| exemplar | 341 | **194** |
| strong | 1,207 | **902** |
| developing | 3,610 | **3,377** |
| thin | 3,843 | **4,151** |
| emerging | — | **6,148** |
| minimal | 11,100 | **11,628** |

Exemplar nearly halved and strong fell by roughly a quarter. Re-derive rather than reuse: any
paper, report or cohort figure produced before this date is on a different rubric.

**What 0.11.0 itself added:** a second conditional facet, `open_source` (weight 0.10), scoring the
maintainership surface an open-source product publishes on its own repository — read from a live
GitHub harvest, never from `common[]` pointers — and a generalisation of the conditional-facet math
from one hard-coded slice to N. It is **additive, not an exemption** (roadmap#39): exemption was
measured, shrinks the denominator, and cost WSO2 a band. Full detail in the CHANGELOG.

### Process failure worth recording

**0.11.0 shipped inside an unrelated commit and named itself nowhere.** The rubric bump, the new
facet, the generalised math and the scorer changes all rode in `a324bf8` — *"Delist Medidata
Solutions at the company's request"* — whose message does not mention 0.11.0. There was no
CHANGELOG entry and no ROADMAP entry, and the same was true of 0.9.4 through 0.10.5: **the public
record sat seven versions behind the engine while the rebuild published those numbers.**

That is the exact failure the standing rule exists to prevent — a published score must be traceable
to a published rubric. Entries for 0.9.4 → 0.11.0 and their rubric snapshots were backfilled
2026-08-12 from the commits, which were themselves well documented. The gap was in the public
record, not in the thinking.

**Guard for next time:** a rubric version that reaches `signals/_data/scoring.yml` without a
matching `## <version>` heading in CHANGELOG.md and a `rubric/scoring-<version>.yml` snapshot should
fail the pre-rebuild gate, the same way a build that would delete live pages does. Cheap to check,
and it is only ever noticed after the numbers are already public.

### Still open, carried forward

**The `LlmsTxt` alias false-credit was NOT resolved before the re-score.** 0.9.4 made
`LlmsText|LLMsText|LlmsTxt` readable, which credits a *declared pointer* where we have never
probed — reopening the 0.9.2 hole. Measured on the management cohort: 15 declared, 11 real, 2 soft
404s, 1 hard 404, 1 pointing at Slack's own llms.txt. **Four false credits in fifteen, now live in
published scores.** Two ways to close it, still Kin's call: harvest `llms/` artifacts so the probe
overrides the pointer (preferred, and it is the collection work the attribution block says is
ours), or drop the unprobed-pointer fallback entirely — honest, but it re-zeroes every unprobed
provider catalog-wide and that swing is unmeasured. Until one lands, **cite the probe, not a scored
llms.txt number.**

---

## Status after 0.9.3 (2026-08-10)

**0.9.3 closes the presence-vs-evidence sweep and makes the band gate disclose itself.**
`conformance_declared` now reads the artifact for a real assertion (57 providers lose a credit they
had not earned; reading both the `standards:` and `assertions:` spellings kept 30 others from being
zeroed wrongly), `llms_txt_published` requires an actual `.txt`, and `band_gated_from` names the band
a gate-demoted score would otherwise have earned. Full detail in the CHANGELOG.

**⚠ NOT YET APPLIED TO PUBLISHED SCORES.** Published scores are **0.9.1**; the engine is now
**0.9.3**, carrying the deferred 0.9.2 and 0.9.3 movement together. The `--write` rescore is still
held for the next APIs.io rebuild. Combined pending movement: **4,396** providers lose the
`.well-known` discoverability credit, **3,072** lose the agent `well_known_catalog` dimension, **57**
lose the conformance credit, **1** loses the llms credit, and **1,024** gain a `band_gated_from`
field without their score changing. **≥299 change band, every move downward, including 7 exemplar →
strong.**

### The presence-vs-evidence sweep is now CLOSED

The 0.9.2 entry asked for a deliberate audit rather than a fourth accident. It ran, and the answer is
that `well-known` was the outlier rather than the pattern:

| check | credited | falsely credited | status |
|---|---:|---:|---|
| `well_known_published` | 5,743 | **4,396** | fixed 0.9.2 |
| `conformance_declared` | 4,475 | **57** | fixed 0.9.3 |
| `llms_txt_published` | 6,966 | **1** | fixed 0.9.3 |
| `overlays_published` | 2,299 | **0** | clean, no change |

`well-known` was different for a reason worth keeping: probe artifacts record negative results *by
design*, so the directory exists whether or not anything was found. `conformance/`, `llms/` and
`overlays/` are filled with real content, which is why directory-presence happened to be a fair proxy
there. **The lesson generalises to "any artifact directory that can hold a recorded absence,"** not
to artifact directories at large.

### CLOSED — the published band contradicts the published range

Raised against the travel quartet under 0.6. **Resolved for the composite:** zero of 26,381 scored
providers carry a composite band that disagrees with its score, and the ranges quoted in the original
entry (45–59.9, 15–29.9) are pre-recalibration. The live remnant was on the *agent* axis, where the
gate legitimately demotes — and that is what `band_gated_from` fixes, by the same resolution the
original entry proposed: emit the gate as its own field so a label can never silently disagree with
the number beside it.

### REJECTED — `x-status` should diminish the score

The 0.6-era entry is right that `x-status` appears nowhere in `score.rb`, and **1,601 providers carry
one**. It does not follow that scoring it would improve anything, and the data says it would not:

- **681 of 706 `dead` providers already score `minimal`**; 37 of 38 `dormant` likewise.
- **Zero dead or dormant providers sit at Strong or Exemplar.**

A defunct company already scores at the floor, because it publishes nothing — the rubric reaches the
right answer through evidence rather than through a label. And the largest class is `acquired` (678),
where a penalty would be actively wrong: acquisition does not kill an API.

**What the measurement did surface is a data-quality problem.** `x-status` is not a controlled
vocabulary — roughly **100 distinct values** (`defunct`, `defunct-domain`, `defunct-brand`,
`acquired-defunct`, `defunct-or-acquired`, `deadpooled`…), including two entries where an entire YAML
mapping was stringified into the field: a Chapter 11 case record and an acquisition record. That is
worth normalising, and worth using for **listing and visibility** decisions rather than for score.
Carried forward as a catalog task, not a rubric one.

### OPEN — the reader audit, now measured

0.9.1 asked what else the reader cannot parse. Measured across the catalog:

| format | files | providers | providers with NO OpenAPI/AsyncAPI |
|---|---:|---:|---:|
| Protobuf / gRPC | 374 | 74 | **41** |
| Postman collection | — | — | **31** |
| WSDL | 45 | 10 | — |
| API Blueprint | 8 | 7 | — |
| RAML | 2 | 1 | — |
| GraphQL | 98 | 94 | 268 → **already read** |

**GraphQL is the control case and it passes:** 268 providers publish a GraphQL schema and no
OpenAPI, and not one scores zero contract quality — mean 46.8, max 74.1. The reader fix works when it
is implemented.

**The live population is 72 providers** — 41 gRPC-only and 31 Postman-only — scored at or near zero
contract quality while publishing a machine-readable contract. Examples: `aalyria`, `agibot`,
`celer-network` (`.proto`), and three Defense Department agencies whose only contract is a Postman
collection. That is real but an order of magnitude smaller than Swagger 2.0's 90 providers and 5,800
documents, so it is a fair next reader fix rather than an emergency. WSDL, RAML and API Blueprint are
long-tail and can ride along.

Still unmeasured from the 0.9.1 list: out-of-band auth schemes documented in prose
(`security_schemes_defined`), provenance markers missed on large documents, and the
capability-outside-the-contract cases in blockchain and data/analytics.

---

## Status after 0.9.2 (2026-08-10)

**0.9.2 — a well-known artifact is a probe result, not a publication.** A reader fix. The
`well-known/` artifact records what a live GET returned on every host in `apis.yml`, including the
entirely ordinary answer that every path 404s — and the better-behaved harvests say so outright:
Twilio's ends *"no WellKnown rating pointer is emitted because no catalog was found."*

The scorer read none of it. `well_known_published` was `repo_has?(slug, "well-known")` — does the
folder exist and hold a file — and `well_known_catalog` matched a `WellKnown` entry in `common:`.
Both credited the **existence of a record** rather than the **existence of a document**, which is the
one distinction the artifact was written to capture. No weight, point value, check, band or rule text
moved; the rule has always read *"well-known/ carries an api-catalog, security.txt, or a
protected-resource doc"*, and the code now reads the artifact for one.

Measured across `all/*/well-known/`: **5,875** providers carried the directory and were credited;
**1,345** actually serve a 2xx on a rubric-named `/.well-known/` path. **4,530** were credited
without evidence, including 132 empty directories and 202 whose only 200 was an HTML shell. On the
agent side, **2,169 of 3,265** `WellKnown` pointers had no served document behind them.

Written around two traps worth remembering: these artifacts also probe `/llms.txt`, `/openapi.json`
and live API endpoints, so "has a 200 somewhere" is not a discovery surface and the path must contain
`/.well-known/`; and a 200 with no saved `file:` whose note describes an HTML or SPA shell is a soft
404, which is exactly what Stripe's artifact records for `dashboard.stripe.com`. A declared pointer
still counts for a provider we have **never probed**, so a company genuinely serving a `security.txt`
is not scored to zero for our own missing artifact.

Found while scoring Solo.io for v1.3 of *The State of API Management*, where it would have broken the
report's headline finding that all five agentic primitives sit at absolute zero across the market.
That report published Solo.io at 80.8 / 59.5 with the credit withheld by hand; 0.9.2 makes that the
scorer's own answer — `--only=solo-io` returns exactly 80.8 composite, 81.5 discoverability, 59.5
agent readiness.

**⚠ NOT YET APPLIED TO PUBLISHED SCORES.** 0.9.2 is dry-run only. The `--write` rescore is held for
the **next APIs.io rebuild** so the engine change, the mass re-score and the site deploy land
together. **Published scores are currently 0.9.1** — the 2026-08-10 full refresh — while the engine
is 0.9.2.

When it runs, measured against the 26,381 stored score artifacts:

| effect | providers |
|---|---:|
| lose the 6-pt `well_known_published` credit | **4,396** |
| lose the 4-pt `well_known_catalog` dimension | **3,072** |
| change band (of 3,718 modelled) | **≥299** |

Composite falls **1.0–1.1** per affected provider, every delta negative and every band move downward:
167 emerging → minimal, 44 strong → developing, 43 developing → thin, 38 thin → emerging, and **7
exemplar → strong**. The Exemplar demotions are the ones to eyeball first — that band carries the
most public weight. Re-cut the bands afterwards.

**What this opens next.**

- **Audit the other presence-vs-evidence checks.** This is the third defect of one shape, after the
  soft-404 credit and the silent-zero paths: a check that asks whether a *file* exists where the
  rubric asks whether a *capability* is served. `conformance_declared` and `overlays` are both still
  `repo_has?` calls, and every artifact directory we fill by sweep rather than by harvest is a
  candidate. Worth a deliberate sweep rather than a fourth accident.
- **Emit no pointer when the probe finds nothing.** Twilio's harvest gets this right and Solo.io's
  does not, which is why 2,169 pointers resolve to a 404. The scorer no longer trusts them, but the
  `common:` block is still wrong as data — it advertises a surface the provider does not serve. Fix
  it at the emitter, then the pointer and the probe agree again.
- **A discoverability recalibration.** Removing 4,396 false credits pulls the facet's catalog mean
  down. Discoverability was already the facet that flattered everyone — it averaged 84.6 across 252
  organizations with not one provider at zero in eight markets. Once the rescore lands, that mean is
  worth re-reading to see whether the facet now discriminates or still needs a harder bar.

---

## Status after 0.9.1 (2026-08-04)

**0.9.1 — Swagger 2.0 is a contract.** A reader fix. A 2.0 document was dropped from the spec index
before any check ran, so a provider whose whole corpus is 2.0 scored as publishing nothing: 190 of a
3,024-file sample across 90 providers, Microsoft Azure the heaviest. Found through Oracle, where
harvesting 161 first-party OCI contracts *lowered* contract quality. The index gained ~5,800
documents and 203 providers.

Two fixes shipped in it, both in the reader rather than the rubric — no weight, point value, check
or band moved:

1. **`swagger:` is a contract declaration.** The index classifier recognised only `openapi:`, and
   every per-spec check read the 3.x container keys. `adapt_swagger_2` now presents a 2.0 document
   through `servers` (from `host`/`basePath`/`schemes`), `components.schemas` (from `definitions`)
   and `components.securitySchemes` (from `securityDefinitions`), leaving every original key in
   place. `openapi_3_0`/`openapi_3_1` still return false for 2.0 on purpose: an eleven-year-old
   specification version earns fewer points than the current one, but not zero contract.
2. **A declaration can arrive late in the document.** Both readers classified from a bounded head —
   4 KB in `score.rb`, 24 KB in `build_provenance.py`. A YAML mapping is unordered, and a publisher
   emitting keys alphabetically puts `basePath`, `consumes` and `definitions` ahead of `swagger`.
   Oracle does exactly that across 161 contracts, one of them 3.8 MB, so **153 of them counted as
   non-spec files**. Both readers now fall back to a bounded stream for a column-zero declaration,
   but only when the head is inconclusive *and* the file is spec-shaped — a 200-document sample
   classifies in 38 ms, so the index stays fast. Column-zero matters: a `swagger:` nested in a
   description or an example is not a declaration.

**✅ APPLIED — the rescore ran in the 2026-08-10 full refresh** (`signals`: "Full refresh 2026-08-10
— rebuilt from all/* (8 waves, 0 errors)"). Every published score now carries
`schema_version: 0.9.1`, on the provider pages and in the `all/*/kin/` artifacts alike. Movement was
concentrated in the ~203 providers who gained a readable corpus — Microsoft Azure (1,659 of 1,660
documents are 2.0) and Mastercard (165 of 208) the largest.

*Superseded note, kept for the record: this section previously read "NOT YET APPLIED — until then
every published score is 0.9," which was true when written on 2026-08-04 and stopped being true when
the refresh ran.*

**What this opens next.**

- **A spec-version signal worth reporting, not just scoring.** The catalog can now measure how much
  of the API economy is still on Swagger 2.0 versus 3.0 versus 3.1. That is a paper, and it is the
  kind of number nobody else can produce at this sample size.
- **Audit what else the reader cannot parse.** Swagger 2.0 and GraphQL were both found by accident,
  one release apart, and both after a provider was scored as contract-less while publishing a real
  contract. The remaining candidates are worth a deliberate sweep rather than a third accident:
  Protobuf/gRPC service definitions, WSDL, RAML, API Blueprint, JSON Schema-only surfaces, and
  Postman collections used as the primary contract. **Add the capability-outside-the-contract case
  to the same sweep:** blockchain and crypto returns `dry_run_mode` 0 of 285 leaders while
  transaction simulation is a chain primitive in daily use, and data and analytics returns a data
  plane that travels over JDBC and Arrow Flight rather than anything the spec describes. Neither is
  a market failure and both read as one. The sweep should decide, per dimension, whether an
  out-of-band capability documented in the artifact set satisfies it — the same question Oracle's
  prose-documented request signing raises for `security_schemes_defined`.
- **`securityDefinitions` is not the only way a contract states its auth.** Oracle's 161 documents
  declare none, because OCI request signing is described in prose. `security_schemes_defined` reads
  that as absent for a platform with a rigorous and fully documented signing scheme. Worth deciding
  whether an out-of-band scheme documented in the artifact set should satisfy the check.
- **Provenance markers are not reaching the indexer on large documents.** Oracle's harvested specs
  are stamped `method: harvested` / `first_party: true` inside `info`, and on an alphabetically
  ordered document `info` also falls outside the head window, so the marker is missed and the file
  records `unknown`. The reordering fix covers documents API Evangelist writes out; it does not
  cover a large provider-published document we store verbatim. The authorship scan wants the same
  treatment the declaration scan just got.
- **`FOUND_METHODS` still has no token a provider would reach for.** Captured in `scoring.yml`'s
  `provenance:` block since 0.8 and still open: our vocabulary describes how OUR pipeline obtained
  something, so a provider authoring its own artifact (`method: declared`) resolves to `unknown`.
  Nothing in the score currently rewards a provider for making its authorship legible.

---

## Status after 0.8 (2026-07-31)

Two releases landed on 2026-07-31, both out of the Standard Report research.

**0.6.1 — the asyncapi_events provenance gap.** `asyncapi_events` was the one graded-eligible
dimension missing from `provenance.applies_to`, so 6 points were awarded in full for event
surfaces API Evangelist authored. This is the item the section below predicted for 0.7; it shipped
early because *The AsyncAPI Standard* measured the underlying fact — zero `asyncapi/_original/`
archives across 25,574 providers against 6,776 for OpenAPI. 1,711 providers reclassified `derived`.

**0.7 — security defects the contract declares about itself.** Three `contract_quality` checks:
`oauth_flows_current` (775 contracts declare implicit, 72 password), `credentials_not_in_query`
(815 put the key in the URL), `oauth_scopes_enumerated` (only 15.3% enumerate any scope). All
framed as "no violation present" and vacuously satisfied where the mechanism is unused, because
N/A is handled per artifact class rather than per check.

### CLOSED in 0.8 — the provenance half-measure

**Shipped.** Every check in the `openapi` block is now provenance-graded via
`applies_to_artifact`. 318 providers fell, none rose, 187 changed band, and Yardi — the case the
section below is written around — went 57.7 → 49.6, Strong → Developing. The original text: `contract_present` is graded
by provenance; the other ~112 points of `contract_quality` are not, so a provider whose entire spec
corpus API Evangelist wrote still earns full credit for spec craftsmanship it had no part in. The
reasoning for holding it remains the reasoning given below — grading 132 points instead of 20 has a
blast radius that needs measuring on its own rather than riding along with other changes — but it is
now overdue rather than merely deferred, and it should be the whole content of the next release.

## Status after 0.6 (2026-07-28)

**The 0.6 batch shipped**, and it took most of this roadmap with it. Sections below that landed are
marked **`SHIPPED IN 0.6`** and kept rather than deleted — the evidence and the argument in each is
what a reader needs to judge whether the check was worth building, and several are cited in reports
that are still selling.

Shipped: contract-type-agnostic scoring · provenance grading · placeholder/template servers · the
regime-specific checks · the `broker` collision fix · the `telecommunications` and `energy_utilities`
regimes · broadened governance · machine discoverability · graded examples · the four spec-verified
agent dimensions · the Agent-Native band gate · `mandate_status` · the detector sanity pass · both
band recalibrations.

### The gap 0.6 exposed, and the top of the queue now

**Backfill `x-provenance` across the OpenAPI corpus.** Provenance grading works — and it can only see
what is marked. For MCP servers, agent skills, agentic-access contracts and conformance declarations
the enrichment pipeline stamps every artifact, so the grading there is complete and decisive. For the
**OpenAPI corpus, marker coverage is 2.6%: 2,278 of 87,612 specs.** Contract provenance is therefore a
*floor, not a census*, and the roadmap's own proof cases prove it — AT&T is caught (20 of its 23 specs
carry `x-generated-from: documentation`) and Yardi is caught only because its `apis.yml` carries an
index-level `x-provenance` block a human wrote by hand, while **Guidewire, Duck Creek and Verisk are
invisible**: their AE-authored specs declare plausible hosts and carry no marker at all.

This is collection work, not rubric work, and it is now the single highest-value thing that would
sharpen the release that just shipped. Two tractable parts:

1. **Stamp forward.** Every enrichment path that writes an OpenAPI should emit an `x-provenance` block
   with the same `method:` / `provider_published:` vocabulary the other artifact classes already use.
   Cheap, and it stops the gap growing.
2. **Stamp backward.** The 85,333 unmarked specs need classifying. A `_original/` counterpart is
   suggestive but not decisive (Yardi has one holding an AE-authored file). The reliable signal is
   whether the document was ever fetched from a provider host, which the harvest logs know and the
   spec does not.

Until then the honest position is the one the rubric states in print: `unknown` is credited in full,
because punishing providers for a gap in our own metadata would be a worse error than the one
provenance grading exists to fix.

#### Re-measured 2026-08-04, after 0.8 graded the whole `openapi` block

0.8 closed the half-measure below — every check in the `openapi` block is now provenance-graded. That
makes marker coverage the binding constraint on the entire facet rather than on 20 of 132 points, so
it was worth re-counting. **It has barely moved, and the affirmative marker is effectively unused:**

| `provenance.json` (generated 2026-08-04) | |
| --- | --- |
| OpenAPI specs indexed | **88,456** |
| marked `derived` | 2,795 (**3.2%**) |
| marked `first_party` | **28** |
| marked `conformance` | 0 |
| **`unknown` → credited 1.0** | **85,633 (96.8%)** |

Per provider, of the 7,168 holding at least one spec:

| state | providers | share | credit |
| --- | --- | --- | --- |
| `unknown` — no marked spec | **6,815** | **95.1%** | 1.0, gate never engages |
| `derived` — ≥75% marked | 349 | 4.9% | 0.25 |
| `mixed` | 4 | 0.1% | interpolated |

**So the gate that dropped 318 providers and rebanded 187 is reaching 4.9% of the corpus.** That is
not an argument against it — the 349 it catches are caught correctly. It is an argument that the
remaining 95% is unmeasured, and the facet now rests entirely on that.

**The proof case is a pair, and it is sharper than Yardi.** Yardi shows the gate working when a marker
exists. Segment and Stripe show what happens when it does not:

| | specs | `first_party` | `derived` | `unknown` | fetchable spec from the provider? |
| --- | --- | --- | --- | --- | --- |
| **Twilio Segment** | 23 | 0 | 0 | **23** | **No.** `api.segmentapis.com/openapi.json` → 401; `docs.segmentapis.com/openapi.json` → 404. The 23 refined specs plus 4 in `_original/` are AE-derived from documentation. |
| **Stripe** | 159 | 0 | 0 | **159** | **Yes.** Stripe publishes its OpenAPI. |

Both score identically on authorship. **The rubric cannot currently distinguish a corpus we wrote for a
provider that publishes nothing from a corpus the provider genuinely publishes** — because neither
carries a marker, and `unknown` resolves to full credit for both. Restating the balance deliberately:
the issue is not that AE authors contracts, which is intentional and raises the floor. The issue is
that **authorship is illegible in both directions**, so neither Segment's floor nor Stripe's frontier
can be read for what it is.

**The backfill levers were measured, and the cheap ones are not available:**

- **`openapi/_original/` is not a first-party proxy.** 6,807 of 7,479 providers with an `openapi/`
  directory hold a non-empty `_original/` archive (14,327 documents), which looks like a strong signal
  until you check a known case: Segment's `_original/` holds four documents that are *themselves*
  AE-derived. The archive records "a parent document was split", not "a provider published it". Same
  caution the Yardi note above already gives.
- **The fetch evidence was mostly not retained.** Only **333 of 26,281** providers still carry a remote
  (`http`) OpenAPI pointer in `apis.yml` that could be re-probed; 7,162 carry local paths only and
  18,786 carry no OpenAPI pointer at all. And of the remote pointers that do exist, roughly 80% 404 —
  so a failed fetch cannot be read as "never was first-party" either, only as "not verifiable now".

**Which makes "stamp forward" the whole of the tractable work, and it should be treated as blocking on
the enrichment side rather than as a scoring item.** Concretely: every path that writes or refines an
OpenAPI records the authorship it already knows at the moment it knows it — a harvested document gets
`first_party` plus the URL and status code it came from, a modeled one gets `derived` plus what it was
modeled from, and `refine-openapis` propagates the parent's marker onto every child it splits out.
Backward classification of the 85,633 stays a re-probe campaign against the surviving 333 plus
whatever the harvest logs can still reconstruct, and should be scoped as its own project.

**Two smaller items this surfaced:**

1. **`FOUND_METHODS` has no token for provider-authored.** Already noted under 0.9.1 and confirmed by
   the count above — `first_party: 28` across 88,456 specs is not a measurement, it is an unused code
   path. Until a provider can say "I wrote this" in a way the reader recognises, the gate has one
   populated state and one empty one.
2. **A `marker_coverage` figure belongs on the scorecard.** `provenance.json` already computes it
   (`marker_coverage: 3.2`). Publishing it per provider — "authorship known for N of M contracts" —
   makes the floor legible to a reader without moving anybody's number, and is the honest companion to
   crediting `unknown` in full.

**Provenance grades the PRESENCE award, not the DEPTH awards — and Yardi shows the difference.**
Grading `contract_present` caught Yardi correctly: all five of its specs are marked derived, and it
fell 62.9 → 56.9. But it is still **Strong**, because `contract_present` is 20 of the 132 points in
`contract_quality` and the other 112 — `info_complete`, `operations_summary_coverage`,
`operations_description_coverage`, `operationIds`, `response_coverage`, `components_reuse`,
`security_schemes_defined` — are still awarded in full for the quality of a document **API Evangelist
wrote**. We write good specs, so a provider we modeled thoroughly scores well on spec craftsmanship it
had no part in.

The fix is mechanically simple and was slated for 0.7. **It did not land there** — see "Status after 0.7" above. It is: apply the provenance multiplier to **every
check in the `openapi` artifact block**, not only to the presence check, so a derived corpus is graded
down across its whole contribution rather than at one point of entry. It was left out of 0.6
deliberately — the blast radius of grading 132 points instead of 20 needs measuring on its own rather
than riding along with nine other changes — but the current state is a half-measure and should be
described as one.

**A related asymmetry worth deciding on at the same time:** the depth checks are also where a derived
spec is most *useful* to a consumer. A thoroughly modeled OpenAPI with real descriptions and stable
operationIds genuinely helps an agent, whatever its provenance. That argues for grading depth down to
the `derived` floor rather than to zero — which is what the credit table already does, and is another
reason the change is a multiplier rather than a gate.

**Second: harvest the FHIR conformance surface.** Contract-type-agnostic scoring shipped, and
healthcare barely moved — **Epic went 35.6 → 33.0**, down, because the catalog holds no
CapabilityStatement for it. Only 22 statements exist across 11 providers. The rubric can now read
them; nothing has fetched them. Every conformant FHIR server serves one at a well-known path, which
makes this among the most tractable harvests available.

**Third: re-issue the seventeen affected reports.** See *Reports to re-issue after the batch* at the
foot of this file — that item is now live rather than anticipated. First movements measured against
the 0.5.1 baseline, for the providers those reports name: Yardi 62.9 → 56.9, ACORD 56.5 → 50.7,
AT&T 61.9 → 56.3, Guidewire 47.9 → 43.8, Majesco 51.5 → 47.4, Medplum 73.7 → 64.4. Agent readiness
moved further and in the same direction — Stripe 100.0 → 63.5, 8x8 90.4 → 61.0, Twilio 77.9 → 58.1,
Guidewire 53.8 → 36.0 — because that is where the derived artifacts were concentrated.

---

## Defect: the published band contradicts the published range

Found while reissuing the travel quartet against 0.6. **Seven of the sixty-four travel providers carry a
`band` that does not match their own score under the ranges the payload prints beside it.**

| Provider | Score | `band` | Printed range | Band the score implies |
|---|---|---|---|---|
| Cloudbeds | 42.1 | `developing` | 45–59.9 | thin |
| UK Civil Aviation Authority | 42.0 | `developing` | 45–59.9 | thin |
| HEDNA | 14.1 | `emerging` | 15–29.9 | minimal |
| On the Beach | 14.4 | `emerging` | 15–29.9 | minimal |
| Rex Airlines | 14.6 | `emerging` | 15–29.9 | minimal |
| Helloworld Travel | 13.0 | `emerging` | 15–29.9 | minimal |
| Porter Airlines | 14.9 | `emerging` | 15–29.9 | minimal |

Every one is a **promotion** — the label sits one band above the score — which is the signature of a
deliberate gate rather than a rounding error. If that is the 0.6 band gate doing intended work, the
`range` string travelling with it is wrong and should say so; if it is not, the boundary comparison is
off by one at both edges.

**This is not cosmetic.** The section pages render the label, the report band tables count it, and a
buyer reading *"Developing"* against a printed range of 45–59.9 next to a score of 42.0 has been given
two contradictory facts by the same payload. The travel reports band by score and note the discrepancy;
that is a workaround, not a fix.

Cheapest resolution: make the band a **computed function of the score plus any gate**, emit the gate as
its own field (`band_gated_from`), and have the payload print the effective range rather than the
nominal one. Then a label can never disagree with the number beside it.

---

## Count every machine-readable contract — contract-type-agnostic scoring
### `SHIPPED IN 0.6`

The single most important correctness fix the sector work surfaced, and it should land first.
`contract_quality` (0.25 — the heaviest facet) and `spec_presence` are effectively **OpenAPI-only**:
an OpenAPI or AsyncAPI counts, but a **FHIR CapabilityStatement, a GraphQL SDL, or X12 EDI
transaction sets do not**. That is a measurement artifact, not a judgment about the provider.
Scoring US healthcare made it concrete: **Epic reads `spec_presence: false`, `contract_quality: 22.6`
while serving a 59-resource FHIR R4 CapabilityStatement (plus STU3, DSTU2, and a smart-configuration);
1upHealth reads the same 22.6 on a 144-resource statement.** Medplum outscores them only because it
*also* ships a literal OpenAPI file. Entire FHIR-native, GraphQL-native, and EDI-native markets are
undercounted by roughly a band for a format the rubric simply declines to read.

The fix: make the contract facet format-agnostic. Detect `spec_type` for FHIR
CapabilityStatement/Conformance, GraphQL SDL, and X12, and grade `contract_quality`/`spec_presence`
on their real richness — FHIR resource + interaction count, GraphQL type/field count, X12 transaction
sets — the way OpenAPI paths/operations are graded today. This is a **base-facet** fix: it applies to
every provider regardless of regime, and is distinct from the health-regime FHIR-conformance check in
0.6 below. Because it moves the heaviest facet across a whole sector, it should ship **before the
healthcare numbers circulate widely**, with a band recalibration — expect Epic, Cerner, 1upHealth, and
the GraphQL players (Highnote, Semble, TELUS) to rise materially, correctly.

## Next up — 0.6: regime-specific regulatory checks
### `SHIPPED IN 0.6 — eleven regime-specific checks, each N/A outside its regime`

The 0.5 regulatory facet is deliberately **regime-agnostic** — it measures the common posture every
regulated regime expects (consent-scoped auth, security + disclosure, legal basis, standards
conformance). 0.6 sharpens it with checks that only award where a specific regime applies:

- **Banking & open finance — FAPI / PAR, and three more the banking reports earned.** Reward the
  FAPI security profile, pushed authorization requests (PAR), `private_key_jwt` client auth, and
  mTLS-bound tokens — the stack CDR/UK Open Banking/PSD2 actually mandate, beyond generic OAuth.
  Scoring the four national banking sectors (AU/UK/US/CA) surfaced three additional regime-specific
  signals worth adding: (1) **conformance to the *named* open-banking standard** — OBIE Read/Write,
  the DSB Consumer Data Standards, FDX, or Berlin Group NextGenPSD2 — not just a generic "Standard"
  tag; (2) a **published consent/authorization model**, since consent was the structural gap in every
  market (machine-readable consent ran in the single digits in sectors whose entire premise is
  consent); and (3) an **action/write surface** signal (payment initiation / VRP) that distinguishes
  an *actionable* regime from a read-only one — the UK scored 87% on idempotency where read-only
  Australia scored 0%. An agent that can act on an account is a different animal than one that can
  only read it, and the score should say so.
- **Health — FHIR conformance, and the consent surface missing everywhere.** Reward a published FHIR
  **CapabilityStatement** (with version + resource coverage), **US Core / USCDI** (or UK Core / AU
  Core / CA Baseline / EHDS) conformance, a served **`.well-known/smart-configuration`** with published
  **SMART-on-FHIR scopes**, **FHIR Bulk Data `$export`**, **CDS Hooks**, and — for payer / prior-auth —
  **Da Vinci** (CRD/DTR/PAS) and **CARIN Blue Button**. The structural finding across all four
  healthcare markets: the security *scopes* often exist, but the **smart-configuration is served almost
  nowhere and a FHIR `Consent` resource is exposed by essentially no one** — so the check must weight a
  *discoverable, consent-legible* surface, not the mere presence of scopes. The standards catalog now
  carries every one of these (smart-on-fhir, us-core, uscdi, da-vinci, carin-blue-button,
  fhir-bulk-data, cds-hooks) to resolve against.
- **Payments — PCI, SCA, and the safety primitives.** Reward PCI-DSS attestation / scope disclosure,
  **3-D Secure / strong customer authentication**, ISO 20022 message conformance, a published
  **decline-code** catalog, and **Confirmation of Payee / Verification of Payee** where the scheme
  provides it. Idempotency deserves *extra* weight inside this regime specifically — a retried charge
  that double-charges is the highest-stakes miss in the sector, and it ran at only 36–43% of leaders.
  (The catalog now carries 3-d-secure and confirmation-of-payee to resolve against.)
- **Securities & market data — entitlement & licensing.** Reward machine-readable entitlement and
  redistribution terms, and MiFID II / exchange data-licensing disclosure.
- **Insurance — conformance where a standard exists at all, and the certification signal.** The four
  insurance markets (US/UK/AU/CA, 155 organizations) produced the emptiest regime in the series: no
  mandate exists anywhere, so the check cannot reward compliance and must instead reward *voluntary*
  conformance. Three signals earned their place. (1) **Named-standard conformance** — ACORD (AL3,
  ACORD XML, NGDS, GRLC), CIECA BMS in auto physical damage, CSIO in Canada, and the Market Reform
  Contract / JMRC in the London Market — with the honest finding that ACORD is live inside a
  machine-readable contract at exactly one company worldwide, and CIECA has displaced it entirely in
  US auto. (2) **A certification signal**, because Canada has the only public, tiered insurance API
  certification programme in the world (CSIO) and it is invisible to the score today — its own table
  lists the country's largest P&C insurer as *Not Yet Rated* while smaller competitors hold higher
  tiers, which is exactly the kind of published signal the rubric should read. (3) **Consent**, which
  ran at 2.5% in the US and zero among every market's leaders, in the most personally-invasive data
  business in the economy. Weight consent heavily here: unlike health, no rule forces it, so its
  presence is a genuine differentiator rather than a compliance artifact.
- **Telecommunications — a regime that does not exist yet, and the CAMARA conformance check.** There
  is no `telecommunications` regime in `industry_regulatory` at all, so scoring 83 telecom
  organizations fired the conditional facet for only **7 of them**, via Government, Payments and
  Health. A sector supervised by the FCC, Ofcom, ACMA and the ITU currently has no regulatory layer.
  The regime should reward: **CAMARA conformance** (an `x-camara-commonalities` version, `/camara/`
  paths, and the specific APIs implemented against the 30 canonical definitions); **CIBA**, the
  Client-Initiated Backchannel Authentication flow CAMARA specifies for network authorization, which
  appeared in 3 of 19 standards repositories and was absent from both specs of the one exposure
  platform with a callable endpoint; **TM Forum Open API conformance**, held widely by carriers who
  publish no network API; and a **consent/CPNI-ePrivacy surface**, since the identity verbs operate
  on exactly the subscriber data those regimes restrict. The regulations catalog now carries the US
  Communications Act (with CPNI), the UK Communications Act 2003, the Australian Telecommunications
  Act, the ITU Constitution and the ePrivacy Directive to resolve against.

Each ships as a check under `artifacts.regulatory.checks` with a `regime:` qualifier plus a matching
evaluator gated on the provider's matched regime.

**Resolve conformance against the catalogs.** The `reg_standards_conformance` check currently credits
any generic `Standard`/`Conformance` tag. With the [Standards](https://standards.apievangelist.com)
and [Regulations](https://regulations.apievangelist.com) catalogs now carrying the actual
regime → standard → regulation graph, the check can resolve against it — crediting a
`banking_open_finance` provider for conforming to the standard *recognized for its regime* (OBIE, CDS,
FDX, Berlin Group), and carrying the regulation that applies to it. This turns the catalogs into
scoring inputs and closes the loop between the papers, the standards, the regulations, and the score.

Since the payments and healthcare series, the catalogs also carry the full **FHIR ecosystem** (SMART on
FHIR, US Core, USCDI, Da Vinci, CARIN Blue Button, Bulk Data, CDS Hooks, C-CDA), the **payment-scheme
standards** (3-D Secure, Confirmation of Payee), the **compliance frameworks** (HITRUST, ISO 27001, ISO
42001, SOC 2), and the first **healthcare regulations** (21st Century Cures Act, ONC certification,
CMS-0057-F, HIPAA, HITECH, TEFCA, PHIPA, NHS DSPT/DTAC, EU MDR) — so the health and payments regime
checks can resolve against a real regime → standard → regulation graph, exactly as banking already does.

## Provenance — provider-published vs. derived artifacts (the blocking fix)
### `SHIPPED IN 0.6 — complete for MCP/skills/agentic-access/conformance; 2.6% marker coverage on OpenAPI, see the status note at the top`

The clearest lesson from scoring four national banking sectors — roughly 260 institutions — is one the
rubric cannot yet see: **who published the artifact.** Agent-readiness credits the *presence* of an MCP
server, agent skills, or an agentic-access descriptor, but across all four markets nearly every one of
those artifacts is API-Evangelist-*derived*, not provider-*hosted*. Exactly one institution (Cash App,
in the US) runs a genuinely hosted MCP; NatWest's own manifest states plainly that it does not publish
one. Every banking report had to caveat this by hand — the agent-native badge was partly measuring my
enrichment, not the bank.

A candidate iteration reads the provenance the artifacts already carry — `method: derived / searched /
generated`, `published: false`, `url: null` — and grades on it:

- **Agent-readiness (mcp_server, agent_skills, agentic_access).** Full credit only for a
  provider-hosted / provider-published surface; partial credit for a groundable derived candidate. A
  real hosted MCP should outscore a one-adapter-away derivation.
- **Contract quality.** A provider-*served*, downloadable OpenAPI should outscore an
  API-Evangelist-*modeled* one — several US money-center "specs" are modeled from the FDX standard and
  public docs, not contracts the bank hands you, and the score should not treat them the same.

The effect is a score that measures what a provider actually publishes rather than what has been
derived on its behalf. Expect it to *lower* a number of agent-native scores — correctly — so it lands
with a band recalibration.

The payments and healthcare series confirmed this is a cross-sector pattern, not a banking quirk. Across
all six markets the genuinely provider-hosted MCP servers are a countable handful — Cash App, Elation,
Aidbox, Pinch, Moneris, Modulr, Spreedly, Bridge, Paxos — while nearly everything else labelled "MCP"
is an AE-derived candidate (`status: candidate`, `url: null`). Every report had to make that caveat by
hand. Grading on the provenance the artifacts already carry lets the score make it automatically.

**The insurance and telecom series moved this from important to blocking.** In sectors where few
providers publish anything, the derived artifacts stop being noise and start deciding the standings.
Both series' reports now commit *in print* to this fix, which makes it the highest-priority item on
this roadmap:

- **Insurance.** Five of the largest names in US insurance — Guidewire, Duck Creek, Majesco, Verisk
  and ACORD itself — contribute 45 OpenAPI paths between them and **API Evangelist wrote every one**;
  two point at literal `example.com` hosts. The original finding that "the vendor layer out-publishes
  the carriers by 17 points" turned out to be substantially an artifact of *which companies got
  modeled*. In the UK the distortion was worse: the data credits 14.3% of the cohort with an MCP
  server and **the real number is zero**, all 27 agent skills were generated by AE, and four providers
  (Ki, Zego, WTW, Ripe) sit at or near the top of the market on reconstructed specs — Ki's 102 paths
  recovered from a JavaScript bundle, Ripe's two being Umbraco CMS boilerplate.
- **Telecom.** **Zero of 28 aggregators publish an AsyncAPI**, yet ten score the credit for documents
  AE wrote. Seven would score an MCP credit for servers that do not exist — 8x8's own artifact states
  that the 312-tool catalog is a proposal, not an 8x8 product. Seven carriers hold only AE-written
  specs, including **AT&T's 23**, twenty of which carry `x-generated-from: documentation`. Worst of
  all for a public catalog: a regulator (ACMA) advertises five agent artifact types — MCP server, tool
  crosswalk, agent skills, agentic access, Arazzo — while publishing no OpenAPI at all, and the ITU's
  two specs carry a review stating verbatim that the ITU has not published, reviewed or endorsed them.

Provenance gating should therefore ship **first**, ahead of every other item here, and the affected
reports should be re-issued at v1.1 against the corrected numbers.

### A third provenance category energy surfaced: published by the provider, authored by someone else

The provenance work above splits artifacts two ways — **provider-published** versus
**API-Evangelist-derived**. Energy produced a third case that fits neither, and it is the dominant case
in a mandated market.

Three Ontario utilities publish the Green Button Alliance's ESPI specification. Four Australian retailers
publish the Data Standards Body's `cds-energy` and `cds-common` documents. Those artifacts are genuinely
hosted by the provider — nothing derived, nothing generated — and the provider did not write a line of
them. They are **conformance**, not authorship.

Crediting them identically to a first-party contract is defensible in a mandated sector and misleading
outside one. It is what makes AGL's `contract_quality` look like Stripe's for a document AGL implements
rather than designed. Both energy reports state it by hand; the rubric cannot see it.

The fix is small if provenance grading is being built anyway: record an artifact's **author** alongside
its **publisher**, and let the facet distinguish *wrote it*, *implements someone else's*, and *AE derived
it from prose*. Three states, not two. The distinction also feeds the standards catalog directly — an
organization implementing a standards body's specification is a conformance data point, which is
precisely what the certification directories in real estate and energy exist to record.

## The Agent Card — a provenance-proof signal, measured across the whole catalog

*Unlike most items on this roadmap, this one is not a proposal from a sector read. It is a completed
first-party measurement, run 2026-07-28 against every host the catalog knows about, and it should be
scored on the strength of that evidence.*

The A2A Protocol reached **1.0.0** under the Linux Foundation and defines an **Agent Card** — a
machine-readable manifest served at `/.well-known/agent-card.json` (RFC 8615) advertising an agent's
identity, capabilities, skills, endpoint and auth. A2A's own discovery documentation names three
adoption strategies, and the second is **"Curated Registries (Catalog-Based Discovery)"** — a central
service holding agent cards queryable by skill, tag and provider. That is a description of this
catalog, written by someone else.

**What the probe found.** Every absolute host recorded in `all/*/apis.yml` — Website, Portal,
MCPServer, Documentation, APIReference — was reduced to 22,341 unique hosts and fetched at the
canonical path, plus the pre-0.3 `/.well-known/agent.json` on any host that answered. No hosts were
invented. 20,185 were reachable.

**Sixty-four companies serve an agent card. That is 0.29%.** Graded against the A2A 1.0.0 `AgentCard`
object:

| Grade | n | Condition |
|---|---|---|
| **conformant** | 9 | `capabilities` an object, `protocolVersion` present, `skills` an array |
| **near-conformant** | 14 | right shape, missing `preferredTransport` / default modes |
| **flavored** | 41 | fails a hard structural check — an agent card in spirit, not in schema |
| *(legacy path)* | *15* | *still served at `/.well-known/agent.json`* |

Three findings, each with a direct consequence for the rubric.

**1. The format is fragmenting faster than it is spreading.** Fifty-five of sixty-four publishers
invented their own shape. `agentcard.sh` serves `capabilities` as an *array* of skill objects where
the spec defines an object of booleans, uses `supportedInterfaces` where the spec says
`additionalInterfaces`, and omits `protocolVersion` entirely. This is the *Graded signals, not bits*
argument arriving before the signal is even scored: a boolean `has_agent_card` would record the
catalog as 64 adopters of a standard that 41 of them are not following. **Score the grade, not the
presence.**

**2. The Agent Card is decoupling from A2A, and the score should not conflate them.** Several
*conformant* cards point `url` at an MCP endpoint. `pydantic.dev` declares `preferredTransport: MCP`
— which is not an A2A transport at all; the spec defines JSONRPC, GRPC and HTTP+JSON. `buddy.works`
and `superset.sh` both resolve to `/mcp`. Providers are adopting the Agent Card as a **discovery
manifest for MCP servers**, decoupled from A2A the wire protocol. The dimension to score is
*machine-readable agent discovery*; A2A conformance is a grade within it, not the container. A
dimension named `a2a_support` would be measuring the wrong thing on day one.

**3. It is the first agent signal that cannot be AE-derived — which makes it provenance-proof by
construction.** Every other agent-readiness dimension is vulnerable to the defect the provenance item
above exists to fix: `mcp_server`, `agent_skills` and `agentic_access` all credit artifacts this
pipeline frequently authored on the provider's behalf, and in insurance and telecom that distortion
decided the standings. **An agent card cannot be derived.** It is served from the provider's own
domain over the provider's own TLS, or it does not exist. The probe records an observed HTTP status
and a verbatim body; there is no path by which enrichment can manufacture one. In a rubric whose
highest-priority correction is *stop crediting our own work to providers*, a dimension that is
immune to that failure mode deserves weight out of proportion to its adoption rate.

**Implementation.**

- A new agent-readiness dimension — `agent_card`, graded rather than binary, awarding full credit for
  a conformant card, partial for near-conformant, and a floor for flavored. It sits naturally beside
  `well_known_catalog` (4) and `mcp_server` (12).
- **Probe both paths.** The legacy `/.well-known/agent.json` still carries 21% of everything found;
  a harvester that reads only the current path silently under-counts early adopters by a fifth.
- **Reject SPA shells.** 2,475 hosts returned 200 with non-JSON — the same false positive the
  `all/stripe/well-known/` harvest documented by hand, and the same one *Portal decay* warns about. A
  card counts only on a 200 that parses as a JSON object carrying real `AgentCard` shape.
- Re-run the probe on a schedule. At 0.29% this is a frontier signal, and the point of measuring a
  frontier is the second measurement.

**Corroboration, and a caution about the denominator.** Cloudflare's top-200k scan found *fewer than
15 sites in 200,000* carrying an MCP Server Card or API catalog — 0.0075%. This catalog returns
0.29%, roughly forty times that rate, because it probes API providers rather than the web at large.
Both numbers are right; they answer different questions, and the comparison belongs in any write-up
so nobody reads our rate as a contradiction of theirs. The honest limitation on ours: hosts came only
from URLs already in `apis.yml`, so a card served from an unlisted subdomain is invisible to this
run — the count is a floor, not a census.

## Agentic payment — x402, and the first provider in the catalog to ship it

*Claimed from the blind-spot list below, on the same grounds the Agent Card was: there is now a
measurement rather than a proposal. It is a much smaller one — a single provider — and the section
says so plainly.*

**The count is one.** A sweep of `type:` values across every `all/*/apis.yml` on 2026-08-06 returned
**zero** occurrences of x402, against 3,767 `MCPServer`, 1,380 `LlmsText` and 86 `AgentCard`.
IBANforge, profiled the same day out of `api-search/inbox#3`, is the first — and it was found by
reading a provider's submission, not by probing for x402, so the true catalog rate is unmeasured
rather than zero.

**What a shipped x402 surface actually looks like.** IBANforge, verified 2026-08-06:

| Surface | Detail |
|---|---|
| `/.well-known/x402` | `x402Version: 1`, Base L2 (`eip155:8453`), USDC, Coinbase CDP facilitator, `pay_to` address |
| Per-endpoint pricing | 5 endpoints priced $0.002–$0.02 USDC, each with an atomic amount and an `accepts` block |
| OpenAPI `securitySchemes` | an `x402Payment` scheme (`X-Payment` header) declared alongside `apiKey` |
| Operations | 6 of 18 declare `x402Payment` in their `security` |

**The provider has committed to the shape.** Told on 2026-08-06 which part of their implementation
the rubric would most likely read, IBANforge answered: *"the part you called load-bearing — the
`x402Payment` securityScheme carried on the operations, so the price is readable from the contract —
is the part we consider stable. If the check is built against that shape, it will keep holding."*
That is a provider volunteering a stability guarantee for a check that does not exist yet, which is
about as good as a design input gets. It does not bind them and it is n=1, but it removes the usual
objection that building against one implementation risks building against a moving target.

**The finding that matters for the rubric: x402 is readable from the contract, not only from a
well-known.** That is the difference between a dimension that needs its own fetcher and one that
falls out of spec parsing the rubric already does. A provider that prices per call in its OpenAPI has
stated a machine-actionable commercial term in the one document an agent is guaranteed to read — and
`commercial_clarity` currently has no way to see it. This is the cheapest version of the agentic
commerce dimension, and it should be built first, before any protocol-presence check.

**Cautions, mostly about not repeating known mistakes.**

- **Do not score the well-known's presence.** `/.well-known/x402` is a pointer, and *Scored pointers
  are never fetched* is an open defect against exactly that pattern. A priced operation in a parsed
  contract is evidence; a 200 on a discovery document is not.
- **A declared `x402Payment` scheme is not a working payment rail.** Nothing here settled a
  transaction. The honest ceiling on a contract-read signal is "the provider has stated a price,"
  which is worth points and is not the same claim as "an agent can pay."
- **One provider is not a baseline.** Adoption is unmeasured, so there is no band to cut against. The
  sweep this needs is the same shape as the Agent Card probe: fetch `/.well-known/x402` across the
  known host set and parse every spec for a payment-flavoured `securityScheme`, then decide weights
  against a real denominator. Until that runs, this section is a data point, not a rate.
- **Do not let x402 stand in for the whole family.** UCP, ACP and AP2 remain unread. x402 is first
  here only because a provider shipped it into view.

## Attention is a signal, and its absence arrives before the endpoint dies

Two related items. The first is small and overdue; the second is the one worth building.

### 1. `x-status` should diminish the score — it currently does nothing

37 providers in the catalog carry `x-acquired-by`, 25 carry `x-status: defunct`, and the rubric
reads none of it. So an acquired company whose endpoints have gone dark scores as a provider that
let its API rot, and a defunct one scores as a neglectful one. Same number, opposite meaning.

Diminish rather than zero. An acquired company's contract may still be live and still worth
calling; what has ended is the *stewardship*, and that is what the score should say. The
conventions and the observed vocabulary drift are documented in
`api-search/network/CATALOG-RELATIONSHIPS.md` — including the company-versus-surface split, which
matters here because `x-status: defunct` on the company and `x-api-status: dead` on the surface
should move different facets.

**This is a lagging, binary signal.** By the time a company is marked acquired the interesting
part happened eighteen months earlier. Which is the second item.

### 2. Communication cadence — the leading indicator nobody scores

**You can tell an API is losing steam long before anything 404s, and the tell is that the
provider stops talking about it.** Releases thin out. The changelog goes quiet. The blog moves on
to the company's newer product. The press releases stop mentioning the API. None of that breaks
a single endpoint, and all of it precedes the break by a year or more.

Every facet in this rubric measures an artifact's *existence*. Not one measures whether anyone is
still tending it. A spec published in 2019 and never touched scores identically to one revised
last month.

**The data is already here.** Across `all/*/blogs/`: **7,369 providers with at least one post,
199,492 posts, and 195,874 of them — 98% — carrying a date in the filename.** Cadence is
directly computable today, on a corpus that already exists for another purpose.

What to measure, and what not to:

- **Change in cadence, not volume.** A provider posting monthly for three years and then nothing
  for nine months is the signal. Raw volume just re-measures company size, which the score
  already leaks enough of.
- **Recency against the provider's own baseline**, so a quarterly publisher is not punished for
  being quarterly.
- **Where the talk went, not just whether it stopped.** A company that shipped forty posts last
  year and none of them mention the API is a different finding from one that stopped posting.
  That distinction is the actual expert read and it is the harder half.
- **Weight the API-adjacent surfaces above the corporate blog** — changelog and release notes
  first, developer blog second, press releases last. A press release is marketing; a changelog is
  maintenance.

**The trap, and it is the same one this rubric keeps walking into.** *Absence in our corpus is
not absence at the provider.* Blog harvest coverage is uneven — 15,223 `blogs/` directories exist
and only 7,369 have a post in them — and a provider we never successfully pulled would score as
one that went silent. That is roadmap#16's unfetched pointer and the shelled job corpora in a
third costume. **This check must be able to say "we did not look" as distinctly as "they stopped
talking", and must never convert the first into the second.** If the harvest state cannot be
established for a provider, the dimension is `unmeasured`, not zero.

Sequencing: land `x-status` first because it is a day of work and corrects a live wrong number.
Cadence needs the harvest-coverage question answered before a single point rides on it — but the
corpus is sitting there, and a *report* on cadence needs no rubric change at all. That is probably
the honest first move: measure it, publish the finding, and only score it once the measure has
survived contact with the catalog.

## A contract you cannot call — placeholder and template-only servers
### `SHIPPED IN 0.6 — `servers_resolvable`, 10,950 of 87,612 specs uncallable`

Distinct from provenance, and surfaced hard by telecom: a specification can be genuinely
provider-published, verbatim, and still be uncallable. **Every CAMARA server declaration in the entire
telecom stack is the template variable `{apiRoot}`, and every `openIdConnectUrl` is the CAMARA
placeholder pointing at `example.com`.** Across 19 standards and exposure repositories there was
exactly one absolute base URL. The line that framed the report — *you can download 351 specifications
and call none of them* — describes a condition the rubric currently scores as full `contract_quality`.

Insurance produced the same defect from the other direction: Majesco's specs declare
`api.majesco.example.com` and ACORD's declare `api.insurer-internal.example.com`.

The check is mechanically simple — parse `servers[].url` and flag documents whose only servers are
template-only (`{apiRoot}`, `{tenant}`, `{environment}`) or placeholder hosts (`example.com`,
`localhost`, `your-app.*`). Grade a spec with a resolvable production host above one without. A
caution learned the hard way while measuring this: `example.com` appears legitimately inside *examples*
and callback URLs in real specs, and a naive full-text grep over the catalog returned 4,320 false
positives. The check must parse the `servers` block specifically, and must handle unindented YAML list
items, which a first attempt silently missed.

## Reachable only through a channel

Telecom exposed a posture the rubric cannot express: **the capability is real, commercially launched,
and reachable only through a third party.** Twelve carriers launched CAMARA APIs commercially through
Aduna, EnStream, Jersey Telecom or TMT ID — BT/EE, Virgin Media O2, Three and Vodafone all on the same
day — and score identically to carriers that have done nothing. Rogers, Bell and TELUS reach the market
solely through their shared identity joint venture. That distinction is the single most important fact
in the sector and is invisible in the score.

This is not the same as gated access (already queued under *Self-serve vs. gated access*): the provider
here is not gating its own surface, it has **delegated the surface entirely**. A candidate signal
records whether a provider's capability is first-party callable, first-party gated, channel-only, or
absent — a four-state ladder rather than a bit. It would also correctly separate the two exposure
platforms that ostensibly do the same job: one publishes a contract, an absolute base URL and self-serve
signup; the other publishes no specification at all, every declared base URL null, onboarding behind a
login.

## Portal decay — a dead developer surface is not the same as none

Across the Australian and Canadian insurance cohort there were **more decommissioned developer portals
than live ones**. Suncorp's Bingle developer hosts are dangling CNAMEs pointing at dead load balancers;
Ensurance's API and developer hosts return HTTP 200 serving a default Bootstrap template; the
Co-operators still links a developer portal from live marketing that 404s, and its specification had to
be recovered from the Internet Archive; Canada Life's developer subdomain points at an Apigee host that
no longer resolves. In telecom, Three UK's developer subdomains are dangling wildcard DNS that have
never had a single Wayback capture.

Today a dead portal and no portal score the same. There is a reasonable argument the dead one should
score *worse* — it misleads an integrator and an agent alike, and an HTTP 200 serving an SPA shell or a
default template is a false positive that automated tooling will bank. The enrichment pipeline already
probes and records these states (`deadOrAbsentSubdomains`, `real: false`); the rubric should read them.

## Standards bodies are measured against the wrong yardstick

The CAMARA Project scores **27.9** while publishing the single most valuable public asset in its sector:
30 openly downloadable API definitions that the entire industry builds against. 3GPP, ETSI, MEF, GSMA
and TM Forum publish 351 provider-authored contracts between them and sell nothing. The rubric measures
*services* — operational transparency, commercial clarity, developer ergonomics — and a standards body
has none of those by design.

This is a scoring artifact rather than a finding, and it distorts any sector where bodies sit in the
same ranked list as vendors. The likely fix is a provider `kind` (standards body, regulator, market
infrastructure) that either scores against an appropriate sub-rubric or is excluded from band
comparison with commercial providers — the same argument that applies to regulators, who have now
out-published the industries they supervise in four separate sectors (FCC, Ofcom, ACMA, OSFI, the FCA).

**Energy supplies the first clean counter-example, and it is worth recording so the pattern is not
overstated.** Ofgem scores **26.7** — Emerging — below eighteen of the twenty-six organizations it
regulates, in a market where its own Data Best Practice Guidance is the reason the distribution networks
publish at all. A regulator can write the obligation that produces the sector's best data and publish
nothing itself. The pattern is "regulators frequently out-publish their industries," not "regulators
publish well."

The Australian contrast in the same quartet makes the point sharper: the AER scores 48.7 and the CDR
programme 55.1, both above their sector's 41.6 average, while the AEMC — which writes the rules — was
initially recorded as having no API at all until an undocumented one was found in its own JavaScript.
Three regulators, one market, three entirely different postures.

## Header Literacy — does the contract describe the wire? (proposed for 1.0)

The rubric knows about exactly two headers. `idempotency_key` and `rate_limit_headers` are the only
checks in `scoring.yml` that read a header name, and both sit inside other facets. Meanwhile a header
is the single most-used extension point in HTTP and the part of an API that a contract most often
fails to describe — which means an agent reading the contract cannot construct a correct request.

**The measurement that motivates it.** A pass over 119,030 specification files across all 26,641
providers in `all/`, extracting every `in: header` parameter and every `headers:` mapping key, then
case-folding per RFC 9110:

| | |
|---|---|
| Distinct header names declared | **5,074** |
| Declared by ≥25 providers | **67** |
| Declared by ≥100 providers | **9** |

Twenty-six thousand providers and a shared vocabulary sixty-seven headers wide. Four findings come
straight out of that distribution, and each one is a candidate check:

1. **Case fragmentation is rampant and nothing catches it.** Field names are case-insensitive
   (RFC 9110 §5.1), and the catalog spells `x-api-key` **seven different ways across 667 providers**;
   `apikey` six ways; `api-key` five; `Idempotency-Key` four. The rules catalog already
   lints this — `openapi-headers-hyphenated-pascal-case-error` — and it is enforced nowhere. Cheap,
   objective, and it moves real numbers.
2. **Lifecycle headers do not exist in practice.** `Deprecation` appears in **3** providers and
   `Sunset` in **6**, out of 26,641. The market's answer to "how will I know when this endpoint
   dies" is a blog post. This is the same defect *Change on the Agent Surface* argues from the MCP
   side, and it is measurable here at catalog scale.
3. **The de facto beat the standard 3.5:1.** `X-RateLimit-*` is declared by 96 providers, the
   RFC-track `RateLimit-*` by 27. A check that credits only the standard form would score the market
   as worse than it is; a check that credits both, and reports the split, is the honest one.
4. **Response headers are the blind spot.** Most contracts describe request headers and stop. What
   an agent needs mid-run — the rate-limit state, the correlation id to quote in a ticket, the
   deprecation warning — travels in the response, and `components.headers` is largely empty across
   the corpus.

**Proposed facet — `header_literacy`.** `headers_declared`, `headers_centralized` (uses
`components.headers` rather than repeating inline), `response_headers_documented`,
`correlation_header`, `deprecation_sunset_headers`, `conditional_request_headers` (`ETag`/`If-Match`
on mutable resources), `consistent_header_casing` (the fragmentation check), and one negative:
`auth_not_raw_parameter` — an `Authorization` header declared as an ordinary parameter instead of a
`securityScheme`, which is common and which breaks every generated client. The two existing header
checks move into this facet rather than being reinvented.

**Into the conditional regulatory layer.** Where a regime mandates headers, check the contract
declares them: open banking → the `x-fapi-*` family (95 providers declare `x-fapi-interaction-id`
today, so the signal is live, not hypothetical); CDR → `x-v`/`x-min-v`/`x-cds-client-headers`;
CMS/ONC → the FHIR async `Prefer`/`Content-Location` pair. This slots into the existing regime map
with no new machinery.

**The constraint that has to be written into the rubric text, not discovered later.** This facet
scores what a contract **documents**, never what a deployment **does**. The regime-mandated headers
are request headers that only a credentialed caller can observe. And the regulation-adjacent
*response* headers score zero from the contract for a structural reason, not a market one:
`Strict-Transport-Security` appears in 33 providers' specs, `Content-Security-Policy` in 4, and
`Sec-GPC`, `DPoP`, `Permissions-Policy` and `Clear-Site-Data` in **none** — because those are set at
the edge and nobody documents them in an OpenAPI. Scoring them from the contract would punish
providers for a convention that does not exist. They belong to a **separate edge-probe check**,
which is genuinely observable without credentials and which pairs naturally with the Security
Posture layer proposed below. Conflating the two would be `soft-404`-shaped false credit in a new
costume.

**Dependency.** 0.9.1 is still dry-run and its `--write` is held for the next APIs.io rebuild. This
lands after that, as 1.0, with bands recut afterwards. Backing catalog:
[headers.apievangelist.com](https://headers.apievangelist.com) and the `/headers/` section on
APIs.io.

## Standalone Security Posture layer (under consideration)

Security signals currently live across two facets (operational_transparency, commercial_clarity) and
the conditional regulatory facet. A candidate iteration promotes them into a **standalone Security
Posture score** — modeled on Agent Readiness (own score, own band, never merged into the composite):
domain security (TLS/HSTS/DMARC probes), a published VDP, `.well-known/security.txt`, a trust center,
and auth hardening. This would apply to **every** provider, not just regulated ones, and sit beside
the composite and agent-readiness as a third lens.

## Widen the regulatory applicability map
### `SHIPPED IN 0.6 — most-specific matching, plus the telecommunications and energy_utilities regimes`

`industry_regulatory` is tag-matched and extensible. As each new sector is scored, widen the regime
`tags` (and add regimes) so applicability keeps pace with the catalog — e.g. energy/utilities (smart
meter data access) and additional national open-banking regimes. The rule of thumb: keep tags specific
enough not to regulate APIs a regime doesn't actually cover.

**A confirmed misassignment to fix first — the `broker` tag collision.** `securities_market_data`
matches on the tags `broker`, `brokerage` and `exchange`, which insurance brokers, broker networks and
brokerage-technology vendors match cleanly. The result, measured across the insurance cohort: **16 of
35 UK, 10 of 20 Canadian and 7 of 20 Australian insurance organizations are scored against a
securities regime.** Beazley — a Lloyd's syndicate — is scored against MiFID; so are QBE, IAG,
Steadfast and PPL. The `insurance` regime already exists and is well-drawn; it is simply losing the
match. This is the cheapest high-impact correctness fix on the roadmap and should land with the 0.6
batch, with the affected providers re-scored.

**And a regime that is missing entirely — telecommunications.** Six regimes exist and telecom is not
among them, so 83 telecom organizations fired the conditional facet 7 times. See the telecom bullet
under 0.6 above for the checks it should carry.

## Weights follow the reader

As the primary API consumer shifts from human to agent, the **agent-native facets earn more weight**.
Discoverability (0.10 today) and the machine-readable-contract signals are the clearest candidates to
rise; the change is made in the rubric and re-derived against the catalog distribution, never ad hoc.

## Score history & trends from the kin/ artifacts

Each `--write` pass now dumps a durable snapshot to every provider's own repo at
`all/<slug>/kin/score-<timestamp>.yml`. The queued follow-on is to read that accumulating history back
into per-provider **trend** surfaces (movement, momentum, regressions) on APIs.io and
providers.apievangelist.com — a provider's Kin Score over time, sourced from its own repo.

## Band recalibration
### `SHIPPED IN 0.6 — composite 66/56/42/28/13, agent readiness 46/34/6`

Bands are cut against the observed distribution, not round numbers. After any material rubric change
(new facet, weight shift, regime), re-run `band_distribution.rb` and re-cut so no band is empty or
holds an uninformative 40% of the catalog.

**The Exemplar band is now empty across two consecutive quartets — 0 of 101 in real estate and 0 of 128
in energy, 229 organizations without one.** Insurance produced none either. Telecom produced exactly one
(Twilio, 75.6). That is not a calibration error on its own: these are genuinely sectors where nobody has
built an exemplary API program, and a band that correctly reports "nobody" is doing its job.

But it is worth watching for a specific reason. Six sectors in, the top of the scale is being exercised
almost exclusively by the horizontal technology cohort — payments, developer tools, communications — and
almost never by a vertical industry. If that holds through another two quartets, the honest read is that
**Exemplar is a band for API-first companies rather than for anyone operating an API**, and either the
label or the cut needs to say so. Re-run `band_distribution.rb` against the whole catalog after the 0.6
batch and check whether the top two bands are describing an industry or a business model.

## Self-serve vs. gated access as a readiness signal

Every provider carries an `access_model` (self-serve / partner-gated, public vs. private) that the
score does not yet read. The agentic thesis is that an agent shops and routes around anything it cannot
reach — a sales-gated or NDA-walled contract is, to that consumer, less ready than a self-serve one,
however good the underlying API. It is exactly what separates Epic's partner-gated production FHIR from
Medplum's self-serve signup, or Change Healthcare's gated surface from Stedi's, and it is invisible in
the score today. Add a self-serve-access signal — a reachable sandbox and a self-serve credential path
— as a graded input to developer ergonomics (or a small standalone dimension). Distinct from
provenance: provenance asks *who published* the artifact; access model asks *whether the consumer can
actually reach it*.

**Real estate measured this properly, and the result contradicts the assumption above.** The quartet
recorded an `access_gate` for all 67 newly researched organizations on a seven-value ladder —
`self-serve`, `application-approval`, `membership-required`, `licence-agreement`,
`broker-or-agent-only`, `partner-only`, `none-published`. Sorted by average composite the ladder does
**not** run monotonically with quality:

| access gate | n | avg |
|---|---|---|
| licence-agreement | 8 | **47.7** |
| self-serve | 4 | 47.6 |
| application-approval | 14 | 44.7 |
| broker-or-agent-only | 1 | 40.7 |
| partner-only | 15 | 37.2 |
| membership-required | 5 | 32.5 |
| none-published | 20 | 23.0 |

The most contractually locked tier has the **best** contracts, edging out self-serve; only the bottom
of the ladder behaves as expected. The design consequence is concrete: **do not fold access into
`developer_ergonomics` as a penalty.** A grading that docks gated providers would systematically
under-rate the best-engineered APIs in the sector. Access is an orthogonal axis and should be
*reported* beside the composite — the way agent-readiness is — not blended into it. The seven-value
enum above is the field-tested vocabulary; only four of 67 organizations were self-serve, and none of
those four were American.

**Energy replicated the inversion in a completely unrelated industry**, which promotes this from a
sector quirk to a property of the rubric. Across 95 energy organizations: `accredited-only` **48.6**,
`licence-agreement` **48.5**, `self-serve` **45.6**, `application-approval` 35.5, `partner-only` 34.6,
`none-published` 27.8, `customer-account-required` 26.5. The best-contracted data in Australian energy
sits behind ACCC accreditation — a legal status, not a signup. Two unrelated sectors, same shape:
**the better the contract, the harder the gate.** Note also that energy needed two enum values real
estate did not (`accredited-only`, `customer-account-required`) and did not need three that it did.
The vocabulary is sector-shaped; the axis is not.

## Broaden the base governance facet
### `SHIPPED IN 0.6 — declared conformance profiles and OpenAPI Overlays`

`governance` (0.12) is effectively a single check — a self-published Spectral ruleset in
`all/<slug>/rules/` — and it now scores ~0 across **all six sectors**: 63 of 79 US insurance
organizations at zero, 34 of 35 UK, 19 of 20 Canadian, and 66 of 83 in telecom. At its current weight
it barely discriminates. That is honest (almost nobody ships a public ruleset) but it under-uses
the facet. Broaden it to credit the other ways a provider demonstrates it has *internalized* standards
— Kin's actual definition of governance: a declared conformance profile (FHIR / FAPI / PCI), a
`conformance/` artifact, an OpenAPI Overlay, or a published lint / CI posture — resolved against the
standards catalog. This complements the regulatory-facet conformance check above and gives the base
facet real signal in sectors that have genuine conformance but no Spectral file.

**A caution from real estate, aimed directly at this item.** Crediting a declared conformance profile
is exactly the change real estate shows can inflate. RESO certification is real, independently tested,
publicly verifiable and industry-mandated — and it is worth **2.0 points** of measured difference
(certified 38.0, uncertified 36.0, n=67). All three certified organizations return **401** on the very
contract they are certified against. If this facet learns to read conformance claims, it must check
them against reachability in the same pass, or it will credit a badge for a document the consumer
cannot fetch.

**One boundary to hold while broadening it.** Telecom is full of organizations that have adopted an
external standard — CAMARA, TM Forum, GSMA Open Gateway — and score zero on governance, which makes it
tempting to credit adoption directly. That would be the wrong move and the telecom report argues
against it in print: adopting someone else's standard is not governance, governance is what you do to
yourself. The broadened facet should credit evidence a provider has *internalized* a standard — a
declared conformance profile, an overlay, a published lint or CI posture — not the bare fact of
membership in a programme.

## Graded signals, not bits — examples & compliance
### `PARTIALLY SHIPPED IN 0.6 — examples are graded by operation share; the capped compliance-attestation signal is not built`

Two signals carry almost no information as flat 0/1 bits:

- **OpenAPI examples** ran at ~0% across payments and healthcare — as a boolean it barely
  discriminates. Grade it by the *share* of operations carrying request/response examples (or a live
  mock server), so a provider that documents every operation outscores one with a single token example.
- **Compliance attestations** (SOC 2, HITRUST, ISO 27001/42001, PCI) recur across every trust center.
  Credit them — but as a *small, explicitly-capped* operational-transparency signal, documented as
  **not** a substitute for a machine-readable contract or a consent surface. The reports' recurring
  line — *compliant is not the same as usable* — belongs in the weighting, not just the prose.

## Certification is not reachability

Real estate is the only sector in the series with a **genuinely mandated** machine-readable contract —
NAR Policy Statement 7.90 requires association-owned MLSs to certify against the RESO Web API and Data
Dictionary — and measuring what that mandate bought produced the cleanest evidence yet that the rubric
credits the wrong half of a conformance claim.

**RESO-certified organizations average 38.0; uncertified average 36.0.** Two points, for the only
self-imposed machine-readable mandate in the API economy. The mechanism is not a defect in the standard:
all three certified parties are data resellers whose OData `$metadata` — the actual machine-readable
contract, the document the certification is *about* — returns **401** to any caller without an executed
MLS licence. The documentation portal is public and genuinely good. The contract is not fetchable.

This is a third distinct failure mode, and it needs separating from the two already on this roadmap:

| Condition | Spec exists | Host real | Contract fetchable |
|---|---|---|---|
| Placeholder servers (telecom) | yes | **no** — `{apiRoot}` / `example.com` | n/a |
| Channel-only (telecom) | often no | yes, third party's | n/a |
| **Certified-but-closed (real estate)** | yes | **yes** | **no — 401** |

The check is cheap and mechanical: attempt an unauthenticated fetch of the declared contract document
(`$metadata`, `openapi.json`, the discovery URL) and grade *published and anonymously fetchable* above
*published and 401*. It does not require judging whether the gate is legitimate — a licensed data
product is a perfectly reasonable business — only that the rubric stop recording an unfetchable
document as an equal contract.

Corroborating signal from the same cohort: across all 45 US organizations, **not one publishes a
specification for `mls`, `idx`, `media`, `openhouse` or `member`** — the mandated Data Dictionary's own
core resources. A vocabulary can be mandated, certified and free to read, and never appear as a public
contract.

### Travel: three states, and the industry treats them as one

Travel supplies far stronger evidence than real estate did, because IATA runs a tiered certification
programme and the tiers turn out to predict nothing. **Holding a certification, publishing a schema and
operating a reachable endpoint are three independent variables**, and every combination occurs:

| Provider | Certification | Schema published | Endpoint reachable | Score |
|---|---|---|---|---|
| Flight Centre | **NDC Level 4** — highest tier | no | no | 15.6 |
| WestJet | NDC Level 2 since **March 2017** | yes (17.2, 21.3/24.1) | **not live**, Q4 2026 stated | 40.7 |
| Transat | none claimed | NDC asserted, **Radixx SOAP shipped** | partial | 21.5 |
| Air Canada | NDC@Scale | yes (17.2 EDIST) | yes, behind certification + discretionary revocation | 49.9 |
| Qantas | NDC@Scale | no public endpoint or schema version | no | 35.6 |

Flight Centre is the extreme case: the industry's highest conformance credential, and `/terms`,
`/terms-of-use` and `/legal` all returning **404**. WestJet is the more instructive one — a **US$20–22
surcharge on non-NDC bookings is already in force** while the NDC channel it penalises you for not using
has not shipped nine years after certification.

Two consequences for the rubric:

- **Grade conformance in three states, not two.** 0.6 records `conformance: first-party | derived`,
  which answers *who authored the claim* and not *whether anything backs it*. Add `claimed` /
  `schema_published` / `endpoint_reachable`, and credit only the last one fully. The probe is the same
  unauthenticated fetch the real-estate item already proposes.
- **Check the governing documents resolve.** A terms, legal or API-licence URL that 404s is a
  `commercial_clarity` failure that the facet currently cannot see, and it correlated perfectly with the
  bottom of the travel table. One HEAD request per declared document.

## The rubric can reward a security failure

Knight Frank scores **36.4**, and a meaningful part of that comes from a live OpenAPI 3.0.1 served from
an **unadvertised, unauthenticated** production host that declares no `securitySchemes` and returns real
staff records — names, corporate email, direct-dial and mobile numbers — to any anonymous caller. The
company publishes no developer programme at all; its properly-built surface sits behind Azure AD B2C on
a different host. This is internal plumbing that was never meant to be a public product, and the rubric
counted it as `spec_presence` and `contract_quality`.

The score cannot currently distinguish **a published API** from **a leaked one**, and that gap points
the wrong way: the less careful a provider is, the more it can score. A candidate guard combines signals
the pipeline already collects — a spec that declares no security schemes, *and* returns data to an
anonymous request, *and* has no discoverable developer portal, *and* is served from a host that
advertises nothing — and flags rather than credits. Related to the Standalone Security Posture item
below, but distinct: that item asks how good a provider's security posture is; this one asks whether the
artifact should be scored as a product at all.

Handled in the research itself by excluding the person-search operations from the published profile's
agent skills and MCP tooling and naming the exposure in the report without naming any individual — but
that was an editorial decision made by hand, not something the rubric caught.

**Energy produced a second instance, which makes this a pattern rather than an anecdote.** JOLT, an
Australian EV charging network, serves a live AWS API Gateway whose one observable operation is called by
the company's own public website JavaScript using a **static API key hardcoded in that bundle**. The
research recorded the exposure and deliberately did not commit the key value. Same shape as Knight Frank:
a real, reachable, machine-readable surface that exists by accident rather than as a product, and which
the rubric would happily credit.

Two instances in two sectors, both caught by hand. The guard proposed above — no declared security
schemes, answers anonymously, no discoverable developer portal — would have flagged both.

## Unanimous zeros are either a finding or a bug — and the difference matters
### `SHIPPED IN 0.6 — the detector sanity pass runs on every scoring pass`

Canadian real estate scores **0.0 on governance across all fourteen organizations**, and three
agent-readiness dimensions are unanimous zeros in the same cohort: `rate_limit_signal` 0/14,
`asyncapi_events` 0/14, `idempotency` 0/14. US real estate is 0/45 on both `idempotency` and
`consent_identity`.

Some of those are real and are the most quotable findings in the reports. But two detection bugs have
already been caught by hand in this series — the placeholder-server scan that returned 4,320 false
positives and then 7 true ones before it was written correctly, and a CAMARA count that summed the wrong
YAML keys — and both looked entirely plausible until checked. A dimension that is *unanimously* zero
across a whole cohort is exactly the shape a broken detector produces.

Add a **detector sanity pass** to the scoring run: whenever a facet or dimension is zero for 100% of a
cohort above some size, emit it for review rather than silently reporting it. Cheap to build, and it
converts the catalog's most embarrassing failure mode into a routine check.

**It should also cover single-provider negatives, because two more turned up the same day the item was
written.** REA Group was recorded as publishing no OpenAPI; a reprofile found **nine** provider-published
OpenAPI 3.1.0 documents in a public Stoplight workspace, moving it 22.4 → 49.9 and inverting a headline
finding in a report that was already built. AEMC was recorded as having no API; the enrichment round
found an **entirely anonymous JSON API** serving the versioned text of the National Electricity Rules
(304 versions), Gas Rules (115) and Energy Retail Rules (65), discovered by reading routes out of the
organization's own production JavaScript bundle.

Both were confident negatives. Both were wrong in the same direction — *the agent did not find it, so it
concluded it did not exist.* A provider recorded as having no contract **in a tier where its peers
publish one** is exactly as suspicious as a 100%-zero cohort, and far more common. Flag it the same way.

## Discoverability is saturated and no longer discriminates
### `SHIPPED IN 0.6 — .well-known, llms.txt and a self-hosted index; facet mean 84.6 -> 61.2`

Across the real estate quartet `discoverability` averages **84.6** with **zero providers scoring zero in
any of the four markets** — 90.8 UK, 87.2 AU, 83.0 CA, 80.7 US. In the same cohort `governance` averages
**3.1** and `contract_quality` **29.0**.

**Energy reproduced it exactly**: 90.3 UK, 87.7 AU, 86.7 CA, 82.5 US, and again **not one provider at
zero in any market** — including thirteen US utilities that score 0.0 on every one of the twelve
agent-readiness dimensions and publish no contract at all. A facet that a completely absent developer
surface still scores in the eighties is not measuring what the rubric needs it to measure. Two sectors,
252 organizations, zero zeros.

A facet that nobody fails and almost everybody scores in the eighties is not carrying information. Its
current bar — a findable website, documentation, support, terms — is met by any company with a marketing
department, which in a 25,000-provider catalog is nearly all of them. Two candidate responses: raise the
bar (credit *machine* discoverability — `.well-known` catalogs, `llms.txt`, an APIs.json, a linked
OpenAPI — rather than human findability), or reduce its weight in favour of facets that do
discriminate. The first is more in keeping with the agentic thesis: for an agent, a beautifully
designed marketing site is not discoverability at all.

## Standards bodies, second data point

The *wrong yardstick* problem above now has a real-estate instance that sharpens it. **RESO scores
41.6** while authoring the only mandated machine-readable contract in the series, running the public
certification directory the whole market depends on, and — a correction to an earlier reading — operating
a **production MCP server** at `services.reso.org/mcp` plus an authenticated certification API and seven
first-party npm packages. The standards body has a better agent surface than most of the market it
certifies, and still lands mid-table because it has no commercial API product to be transparent about.

**NAR scores 34.6 with an agent-readiness of 72.1** — the widest composite/agent divergence in the
sector, and the same shape from the mandator's side. Both belong under whatever provider `kind`
treatment the earlier item settles on.

### Standards bodies, third data point — and the first one that is a spread

Travel gives the cleanest instance yet, because it contains **two standards bodies in the same industry**
and they are 33.6 points apart.

**IATA scores 21.5.** It authors NDC and ONE Record, runs accreditation, the BSP settlement system, the
ticketing resolutions and the PADIS code lists that every airline in the four-market study depends on,
and operates an Open API Hub. Agent readiness 4.7, human-only, no MCP server, no packaged skills.

**The OpenTravel Alliance scores 55.1** — a volunteer non-profit with a fraction of the budget,
publishing a free developer portal, royalty-free machine-readable code lists, a compiler CLI, generated
example payloads and one of only **four first-party MCP servers in the entire sixty-four-organization
cohort**.

The previous two data points argued that the rubric measures standards bodies against the wrong yardstick
because they have no commercial API product to be transparent about. **This pair refutes that as a
sufficient explanation.** Neither has a commercial API product. The spread between them is 33.6 points,
and it is entirely a difference in how each chooses to distribute its own specification. A `kind`
treatment that flattens both to "standards body" would hide the single most useful comparison in the
sector.

Whatever provider-kind adjustment lands, it must **preserve within-kind discrimination**. The correct
output here is not "standards bodies score mid-table"; it is "one of these two is reachable by a machine
and the other is not."

## Switchability — a third standalone lens

*Proposed, and deliberately parked. Not in 0.6, and not a new audience.*

**Positioning first, because it decides the design.** Procurement is *not* being adopted as an API
Evangelist audience — the readers stay who they are. Switchability is leverage applied **on behalf of**
those readers, aimed at the vendors selling into large organizations: *your enterprise buyers already
evaluate you this way, and here is what they see.* That is a materially different frame from building a
procurement product, and it keeps the lens pointed at the same people every other part of the score is
pointed at.

The composite answers **"is this a good API?"** — a builder's question. Agent Readiness answers **"can a
machine drive it?"** Neither answers the question an enterprise buyer puts to a vendor before signing:
**"if this goes wrong, what does it cost us to leave?"**

That question is orthogonal to quality, which is exactly why it is useful as leverage. A superbly
engineered, well-governed, agent-native API can be the most expensive thing in an estate to exit, and the
composite will rate it highly right up until the renewal. A vendor who scores well on the composite and
badly here has a concrete, unflattering, evidence-backed gap to close — and closing it is work that
benefits every consumer of that API, which is the point.

### Why standalone, and why it absorbs the access-model work

Three reasons not to make it a seventh base facet:

1. **It must stay liftable.** The argument only works if a vendor can be shown this number on its own,
   next to the composite, without it being diluted into a single figure they can explain away. Blending
   it into the composite would destroy the leverage and shift the composite's meaning at the same time —
   the overloading worth avoiding.
2. **The composite is full.** Six base facets plus the conditional regulatory facet is already at the
   limit, and the K'in sun glyph deliberately draws six rings — a seventh was considered and rejected.
3. **Divergence is the product.** The value of this lens is precisely where it *disagrees* with the
   composite. Yardi tops US real estate at 59.7 on a proprietary property-management platform; a
   procurement read of the same company looks very different. Merging the two destroys the signal.

It should also **absorb the access-model item above**, because entry and exit are one conversation.
*Access* asks "can I get in?" *Switchability* asks "can I get out?" Both are commercial rather than
technical, both are orthogonal to code quality, and the access data has already been shown not to belong
in `developer_ergonomics`. One lens, two halves.

### Candidate dimensions

Split by what is computable **today from artifacts already collected** versus what needs new detection.
Being honest about that split matters — this lens will be quoted in purchasing decisions.

**Computable now:**

| Dimension | Signal | Source |
|---|---|---|
| `standard_conformance` | implements a shared standard rather than a bespoke shape | `conformance/` — **3,669 providers already carry one**, resolved against the standards catalog |
| `second_source` | how many *other* catalog providers implement the same standard or resource shape | the 25,416-provider catalog + the refined per-resource OpenAPI filenames |
| `bulk_export` | a documented bulk export / dump operation | operation and tag scan across `openapi/` |
| `data_model_published` | schemas separable from the transport | `data-model/`, `json-schema/` |
| `wire_protocol_documented` | usable without a vendor SDK | `openapi/` present, not SDK-only in `packages/` |
| `deprecation_policy` · `versioning_policy` · `changelog` | will they break you, and will you hear about it | already collected for governance |
| `commercial_terms_published` | pricing and plans in machine-readable form | `plans/`, `rate-limits/` |
| `access_model` | the seven-value entry ladder | the `access_gate` field the real estate quartet field-tested |

**Needs new detection:**

| Dimension | Why it is hard |
|---|---|
| `identifier_portability` | requires distinguishing shared identifiers from proprietary keys |
| `contractual_lock_in` | minimum commitments, termination notice and exclusivity live in ToS prose, not artifacts |
| `escape_hatch` | self-host or open-source availability is only partly inferable from `SourceCode` pointers |

**`second_source` is the dimension nobody else can compute**, and it is the reason this lens belongs in
this catalog rather than in a consultancy's spreadsheet. Given 25,416 profiled providers, a resource
taxonomy and a standards catalog, the question *"if we drop this vendor, who else does this?"* is a
lookup. `find_similar_providers` and `compare_providers` already exist as MCP tools; this formalises what
they imply into a scored dimension.

### Bands

Mirroring Agent Readiness — own score, own bands, never merged:

| Band | Meaning |
|---|---|
| **Portable** | standard interface, real second source, documented exit |
| **Substitutable** | alternatives exist but migration is a project |
| **Sticky** | proprietary shape, weak exit path, few alternatives |
| **Captive** | no standard, no export, no second source, no published terms |

### What real estate already demonstrated

The sector that raised this makes the case concretely, and shows the two lenses genuinely separate:

- **CoreLogic publishes both the standard RESO UPI 2.0 and its own proprietary CLIP identifier.** Key
  your records on CLIP and leaving means re-keying your data estate; key them on UPI and you can move.
  Switching cost expressed as a field name — and invisible to every facet the score has today.
- **RESO conformance makes three certified distributors interchangeable at the contract level**
  (Trestle, Spark, MLS Grid) while all three are gated at the access level. High switchability, low
  accessibility, in the same providers. That combination is unrepresentable today and is exactly why the
  two halves need to sit in one lens with separate dimensions rather than collapse into a single number.
- **Britain's UPRN is the counter-example**: an identifier published under an open licence, which is why
  the UK market keys on it without anyone mandating that they do.

### What travel adds: a standard that *increases* switching cost

Real estate showed a proprietary identifier sitting *beside* a standard one — CoreLogic's CLIP next to
RESO UPI — and the buyer choosing which to key on. Travel shows something the lens does not yet
anticipate: **the standard itself minting the vendor key.**

IATA's NDC replaces the shared fare-and-availability model with an offer-and-order model, and the order
is identified by an airline-minted **`OrderID`**, with `OfferID` and `OfferItemID` beneath it. The
portable identifiers in air travel are the ones the industry collectively owns — IATA designators, PNR
record locators, agency accreditation numbers, PADIS code lists, ATPCO fare bases, EMD documents. **NDC
moved the primary booking record key out of that column and into the vendor column**, as a design
decision, in the standard that exists to reduce distribution lock-in.

This is the first instance in the programme of an interoperability standard raising switching cost
through its own design, and it breaks an assumption the lens currently rests on: that
`standard_conformance` is evidence of portability. Two corrections follow:

- **Score the identifier, not the conformance.** `identifier_portability` moves from *needs new
  detection* to **partly computable**: for a provider claiming a standard, check whether the standard's
  own primary record key is issuer-scoped. That is a property of the standard, resolvable once per
  standard in the standards catalog and then inherited by every conformant provider.
- **`standard_conformance` must not carry positive switchability weight on its own.** Travel's most
  common interface shape across forty researched organizations is **`standard-plus-proprietary` (13 of
  40)** — adopt the standard, then extend or gate it. Qantas is NDC@Scale certified and prices GDS
  bookings at A$11.50 per segment on EDIFACT and A$4.50 on Standard NDC while its own portal and an
  **invitation-only Premium NDC tier** carry no surcharge at all. The standard was adopted and converted
  into a channel-pricing instrument. Conformance without an access grade is not portability evidence.

### Field data the travel quartet already collected

Forty organizations, researched with the schema this lens specifies, which makes it a live calibration
set rather than a design exercise:

| `second_source` | n | | `interface_shape` | n | | `exit_path` | n | | `access_gate` | n |
|---|---|---|---|---|---|---|---|---|---|---|
| no alternative | **19** | | standard-plus-proprietary | **13** | | export on request | 19 | | commercial agreement | **13** |
| alternatives, w/ migration | 17 | | proprietary, undocumented | 9 | | none published | 13 | | accredited or licensed | 7 |
| few alternatives | 2 | | nothing published | 9 | | **bulk export documented** | **7** | | self-serve | 7 |
| **interchangeable** | **2** | | proprietary, documented | 6 | | not applicable | 1 | | none published | 6 |
| | | | **open standard** | **3** | | | | | partner-only / approval | 6 |

**Four of seven documented exit paths belong to regulators**, and three of forty organizations publish an
open standard — two railways on GTFS and OpenTravel itself. Not one airline, hotel group or GDS. If the
lens had existed, travel would be the first sector to land a **Captive** median.

### Cautions

- **v1 measures the technical switching cost, not the commercial one.** Minimum-term commitments,
  termination notice and exclusivity clauses dominate real procurement decisions and are not
  machine-readable. Say so on the page rather than letting a buyer assume otherwise.
- **Same standard is not the same capability.** Two providers conformant to one standard may not be
  substitutable in practice; `second_source` should be reported with the standard named, not as a bare
  count.
- **Conformance claims must be reachability-checked**, per *Certification is not reachability* above —
  otherwise this lens inherits exactly the inflation that made a mandated standard worth two points.
- **It will be gamed differently from the composite.** A vendor cannot easily fake a second source, but
  can claim a conformance profile. Weight the dimensions that are hard to assert and easy to verify.
- **Resist the pull toward a procurement product.** The obvious next step from a switchability score is
  a per-vendor exit-risk assessment sold to buyers — a different product, a different audience and
  different economics. That is a deliberate fork, not a natural extension, and taking it would change
  who API Evangelist serves. Recorded here so the decision stays explicit if it is ever made.

## What the rest of the field measures — a competitive read (July 2026)

*A landscape review, recorded here because three of its findings are concrete rubric changes and one is
a positioning decision. Nothing in this section is a commitment; it is the queue of what a competitor
already does better and what nobody does at all.*

Agent-readiness scoring stopped being a category of one somewhere around the end of 2025. The field now
sorts into four tiers, and only the first is a genuine peer:

| System | Unit scored | Input | Math | Corpus |
|---|---|---|---|---|
| **Jentic JAIRF** | one OpenAPI file | OpenAPI 3.x/2.x only, no live calls | weighted **harmonic** mean, hard gates | self-serve upload, **no leaderboard** |
| **Cloudflare Agent Readiness** | a website | HTTP probes | 16 signals / 5 layers, 0–100 | top 200k domains |
| **Treblle "AI Readiness"** | one OpenAPI file | OpenAPI | binary pass/fail badge, 5 checks | none |
| **Postman APIFlow-Bench** | **the model, not the API** | 467 synthetic tasks, 44,362 trials | 7 capability axes | n/a |
| **Elogic Agentic Commerce Index** | a commerce platform | hand research, evidence-graded | 8 weighted criteria | 14 platforms |

Survey instruments that share the name — Fivetran's and E3's *Agentic AI Readiness Index*, Hard2bit's
EU enterprise report — measure organizational data maturity from questionnaires and are not competitors
to an artifact-measured score. The GEO-flavoured website scanners (AgentScore, GEO Metrics, FirstShelf)
are marketing tools reading the same robots.txt Cloudflare reads.

**Jentic is the only system that should change what we build.** It is an Apache-2.0 specification on
GitHub, free CLI and web UI, on AWS Marketplace, developed with OpenAPI Initiative input, shipped
December 2025. Six dimensions across three pillars: Foundational Compliance (0.16), Developer
Experience & Tooling (0.18), AI-Readiness & Agent Experience (0.24), Agent Usability (0.20), Security
(0.12), AI Discoverability (0.10); five levels from *Not Ready* to *Agent-Optimized*. Its claims —
auditable, no self-attestation, no proprietary algorithm — are our claims, made by someone else, in a
published spec.

### Where the moat actually is, and where it is not

The moat is **the corpus, not the rubric**, and that distinction should drive the roadmap. Jentic scores
one uploaded file at a time with no public leaderboard, no comparison, no history. Cloudflare has scale
but reads websites, not APIs. Nobody else can answer *"how does this provider rank against the 9,000
others in its market, and which way is it moving?"* — which is the same argument the *Switchability*
lens makes for `second_source`, and it holds for the same reason.

Two structural advantages worth defending in print because they are not obvious:

- **JAIRF cannot see most of what matters, by construction.** From a single OpenAPI file it cannot know
  whether an MCP server exists, whether pricing is machine-readable, whether there is a sandbox, a
  status page, a portal or agent skills. Our `mcp_server` (12), `agent_skills` (5),
  `well_known_catalog` (4) and `agentic_access` (15) have no JAIRF equivalent, and `x-agentic-access` —
  action-class, consequence, human-in-the-loop escalation — has no equivalent anywhere in the field.
  **Provider-level scoring is the differentiator, not a rounding error.**
- **We already probe reachability; JAIRF explicitly does not.** The *contract-fetchability check*,
  *placeholder servers*, and *portal decay* items above put us ahead of a competitor that states it
  requires no live calls. That is a lead worth widening rather than quietly holding.

### The one criticism that lands: link presence is not spec analysis  `SHIPPED IN 0.6`

`scoring.yml` already carries four `planned_dimensions` — `idempotency_key_param`,
`rate_limit_headers`, `error_envelope`, `dry_run_mode` — that supersede link-based proxies with actual
spec parsing. **JAIRF ships that class of check today.** Per-operation `auth_coverage`,
`error_standardization` against RFC 9457/7807, pagination as a *ratio* of paginated GET resources,
`type_specificity`, `opid_quality`, `secret_hygiene`, `sensitive_handling`, and embedding-based
operation `distinctiveness` are all live in a public spec.

Today a provider earns the full 9 idempotency points for a documentation page titled *Idempotent
Requests*. That is the gap a reviewer will find first, it is the one criticism of us that is fair, and
the fix is already specified. **Promote the four planned dimensions into the batch** — this is the
highest-value item in this section and the cheapest to justify.

Note the same evidence cuts the other way on `pagination` and `distinctiveness`: neither exists in our
rubric at all, and both are computable from the refined per-tag OpenAPIs the catalog already carries.

### Compensation — additive scoring produces a false Agent-Native  `SHIPPED IN 0.6`

**New finding, not previously on this roadmap.** Agent Readiness is additive across 104 points, so
strengths cover for absent safety rails. The four largest awards plus examples — `spec_presence` (18),
`agentic_access` (15), `mcp_server` (12), `auth_clarity` (10), `openapi_examples` (7) — total **62 of
104** and clear the Agent-Native floor with `idempotency`, `error_semantics` and `rate_limit_signal`
all at **zero**. That is precisely the provider whose agent retries a payment twice, branches on
free-text errors, and backs off only after a 429. JAIRF's weighted harmonic mean makes that
configuration impossible: *no dimension compensates for another.*

The recommendation is **not** to adopt a harmonic mean — it would destabilise every score in the
catalog and force a recalibration for a problem that lives in one band. The proportionate fix is a
**band gate**: no provider reaches **Agent-Native** without `idempotency` **and** `error_semantics`.
Cheap, mechanically simple, defensible in a sentence, and it kills the worst false positive without
touching the arithmetic below the top band.

This is the same family of reasoning as JAIRF's structural gates (`FC < 40` caps at Level 0; hardcoded
secrets cap Security at 20) and as *The rubric can reward a security failure* above — a score that adds
up without ever refusing to award is a score that can be farmed.

### Two blind spots nobody on this roadmap has claimed

*One of these has since been claimed. **A third — agent discovery via the A2A Agent Card — has been
measured and moved to its own section above** (*The Agent Card*), where the finding that matters is
that no competitor in this table reads it either, and that it is the only agent signal in the rubric
that provenance gating cannot undermine.*

- **Agentic commerce protocols.** Elogic weights protocol support — **UCP, ACP, AP2, MCP** — at 25% of
  its index, and Cloudflare tracks **x402** and UCP as a fifth layer. The Kin Score does not read any of
  them. For a catalog whose thesis is that agents will transact, this is a visible hole, and it is
  arriving fastest in exactly the commerce-adjacent providers the catalog is thick in. A candidate
  dimension sits naturally beside `agentic_access`. **PARTIALLY CLAIMED — the x402 half has a first
  data point and its own section above** (*Agentic payment*), which argues the cheapest build is to
  read priced operations out of the contract rather than to probe for the protocol. UCP, ACP and AP2
  remain unclaimed.
- **The web layer Cloudflare just legitimised.** Markdown content negotiation via `Accept`, AI-specific
  `robots.txt` directives, RFC 8288 `Link` headers, sitemap quality. Our `consent_identity` gestures at
  this with **3 points** for AIPREF/Content-Signals/Web Bot Auth. This connects directly to
  *Discoverability is saturated and no longer discriminates* above: that item asks for a raised bar of
  *machine* discoverability, and Cloudflare has now published a field-tested vocabulary for exactly
  that, along with the adoption baseline to cut bands against — **4%** Content Signals, **3.9%** markdown
  negotiation, and **fewer than 15 sites in 200,000** carrying an MCP Server Card or API catalog. Those
  numbers are the strongest external evidence yet that machine discoverability discriminates where human
  findability does not.

### Provenance gating is now competitively load-bearing

The *Provenance* item above is already ranked blocking on correctness grounds. The landscape adds a
second reason: a funded competitor is publicly marketing **"no self-attestation, fully open to
inspection, Apache-2.0."** That is our differentiator too, and AE-derived artifacts scoring as
provider-published is the single finding that could be used to undercut it. Nothing about the priority
changes; the cost of being late does.

### Positioning — name the competition

The July 21, 2026 post *How the API Evangelist Rating System Differs From Other Agent-Readiness Scores*
makes the differentiation argument without naming a single competing system. That was defensible when
the alternatives were website scanners. It is no longer defensible against a published Apache-2.0
specification. A **crosswalk** — Kin Score ↔ JAIRF ↔ Cloudflare ARS, dimension by dimension, showing
where we are a superset and conceding the spec-parsing depth we owe — is stronger than abstract
framing, is the page that ranks for the search, and is the honest version of the argument. It should
follow the batch, so it can be written against the corrected numbers rather than promising them.

### Cautions

- **Do not chase JAIRF into single-file scoring.** Its per-spec depth is real, but adopting its unit of
  analysis would forfeit the provider-level signals that are the actual differentiator. Take the checks,
  not the scope.
- **Do not merge Agent Readiness into the composite to look more like a competitor's single index.**
  The separate axis is the design, per *Switchability* above.
- **Some of the field is not measuring what its name implies.** APIFlow-Bench scores *models*; the
  Fivetran/E3 indices score *organizations from surveys*. Any comparison written for publication should
  say so plainly rather than treating every "agent readiness index" as a rival, which would be both
  inaccurate and easy to rebut.

## Mandate status is the largest unmeasured effect in the catalog
### `SHIPPED IN 0.6 — `reg_mandate_verified`, credited only where a callable surface backs the claim`

Energy exists in this series to test whether a data mandate is replicable, and answering that produced
the single biggest effect any of these quartets has measured — on a variable the rubric does not read at
all.

Across the 95 organizations newly researched for the energy quartet, each was assigned a `mandate_status`
during research, on a deliberately ruthless enum where `live-implemented` required finding the actual
endpoint, register entry or standards-conformant surface:

| mandate status | n | avg composite |
|---|---|---|
| **live-implemented** | 46 | **42.2** |
| not-applicable | 32 | 36.6 |
| designated, not yet live | 3 | 35.9 |
| **live-claimed, unverified** | 8 | **30.4** |
| none at all | 5 | 30.2 |

**A verified mandate is worth about twelve points. A claimed one is worth less than having no obligation
at all.** That second row is the finding. An organization asserting compliance it cannot demonstrate
scores *below* an organization under no obligation — which means self-declared compliance is not merely
uninformative, it is **negative signal**, and any assessment that reads compliance pages instead of
calling endpoints will rank the field backwards at the top.

Compare RESO in real estate: a genuine, tested, industry-mandated certification worth **2.0 points**
(38.0 certified against 36.0 uncertified). Same question, two sectors, a six-fold difference in effect —
because one mandate came with a public register, conformant discovery endpoints and a certificate
authority, and the other came with a conformance badge.

### Why it belongs in the rubric rather than in the research notes

Three reasons:

1. **It is machine-checkable.** A CDR Register lookup, an anonymous call to
   `/cds-au/v1/discovery/status`, a Green Button Alliance certification row. These are the same class of
   probe the rubric already runs for `spec_presence`.
2. **It explains variance the composite currently attributes elsewhere.** Australian energy retailers
   cluster inside eight points of each other; the unmandated distribution networks spread across
   twenty-six. The mandate compressed the variance of the tier it touched, and the rubric records that
   as eight providers happening to be similar.
3. **The failure mode is already live in this catalog.** Two Ontario utilities present as Green Button
   compliant and could not be verified — one because its onboarding host returns HTTP 200 for *every*
   path including invented control paths, being a single-page-app catch-all. Without a verification
   state, that provider scores as compliant.

### And the mandate's *target* matters as much as its existence

Energy showed that "has a mandate" is too coarse a bit, because four markets mandated four different
things and got four different results:

- **Australia** mandated a **consumer data right** → 13 live consumer APIs, the only shared vocabulary in
  the series, agent-readiness 57.3.
- **Britain** mandated **smart-meter infrastructure** (the Smart Energy Code and the DCC) → *more* live
  mandates than Australia, four consumer APIs, and access by licensed-party status rather than credential.
- **Britain also** mandated **network open data** (Ofgem's Data Best Practice Guidance, "presumed open",
  via RIIO licence conditions) → the two highest agent-readiness scores in the entire study, 94.2, at
  regulated monopolies.
- **Ontario** mandated **adoption of an external standard** → three conformance implementations and two
  unverifiable claims.
- **The United States** mandated **wholesale transmission posting** in 1996 (FERC Order 889 / OASIS) and
  never mandated retail → system operators 48.3, utility retailers 29.8.

A regime field carrying *what was compelled* — consumer data, infrastructure, network data, a transaction
rail, a schema — would let the score say something the composite cannot: not whether a provider is
regulated, but whether the thing it was told to publish is the thing a developer needs.

**A cautionary note for the implementation.** This item was nearly written on a false premise. The UK
energy report originally claimed the distribution networks published superbly "and nothing required it,"
and that survived into a published PDF. Researching the regulations catalog surfaced Ofgem's Data Best
Practice Guidance — a real obligation, aimed at network data instead of customer data. **If the regime
map is built from what a sector says about itself, it will miss the obligations that are not called data
rights.** Build it from the instruments.

## Commercial clarity penalises mandated data

A narrower rubric defect, and energy is the clean demonstration.

`commercial_clarity` is the one facet where the United States **beats** Australia — **34.1 against
28.7** — in a market Australia leads overall by nine points and on agent-readiness by twenty-seven. The
reason is not quality. **CDR data has no price, no plan tiers and no self-serve signup by design**: you
reach it by becoming an accredited data recipient, not by paying. The mandate that produced the contracts
removed the commercial surface the facet looks for.

The same effect shows up wherever data is a public good rather than a product. Britain's open-data DNOs
publish under an open licence with no pricing page. Government data agencies — EIA, NESO — score the same
way.

**A third class, found 2026-08-06: the fee model is not the vendor's to publish.** Blockchain and
crypto scores `commercial_clarity` at 23.5 with 34.2% at zero, and the zeros split cleanly. The
infrastructure tier — RPC providers, custody platforms, data vendors — publishes plans and quotas like
any developer platform. Chains, protocols and DAOs have no price page because the fee is charged by the
network and set by the protocol, on-chain, in public. A base fee determined by [EIP-1559](https://standards.apievangelist.com/store/eip-1559/) is more transparent, more machine-readable and
more auditable than any pricing page in the catalog, and the facet reads it as an absent artifact.

The rubric currently reads *absence of a commercial surface* as a deficiency, when it is sometimes a
**regulatory outcome**, sometimes a **deliberate public-good posture**, and sometimes a **fee that
lives somewhere more legible than a web page**. The conditional-facet
machinery already exists for exactly this: the regulatory facet only applies to providers in a regime.
`commercial_clarity` needs the same treatment — either scored conditionally on whether the provider sells
API access at all, or rebalanced so that "free, open, no signup" stops reading as "no commercial clarity."

Left unfixed, the facet systematically flatters markets that monetise data access over markets that
mandate it — which is precisely backwards for a reader trying to find data they can actually reach.

## Two speeds inside one provider — consumer data versus market data

Real estate found that a certified contract can be unreachable. Energy found the adjacent problem: **one
organization can be wide open on one dataset and completely closed on another, and the composite averages
them into a single number that describes neither.**

The energy research recorded two independent booleans per organization — `consumer_data_api` (can a third
party obtain an individual customer's usage and billing data) and `market_data_open` (does the provider
publish grid or market data anonymously). Across 95 organizations they almost never coincide:

| | n |
|---|---|
| market data open only | 33 |
| consumer data only | 22 |
| **both** | **6** |
| neither | 34 |

**AEMO is the case that matters.** It tops the Australian market at 59.5 and does two jobs: it publishes
the national market data anonymously *and* operates the mandated CDR consumer gateway behind ACCC
accreditation. Same institution, two products, two access models, one score. A developer reading 59.5
learns nothing about which half they can reach.

This is the same structural complaint as *Certification is not reachability* and *Reachable only through
a channel*, arriving from a third direction, and together they point at one conclusion: **the composite
needs to stop being the only number.** Whether that becomes a per-dataset breakdown, an access-model axis
(see *Switchability*), or simply a reported split, the single-score summary is now demonstrably lossy in
three separate sectors.

## The score has no concept of corporate structure

Every provider is scored as a standalone organization. Real groups are not standalone, and when a parent
and a subsidiary are both profiled, the same API surface can be counted twice, split in half, or attributed
to the wrong entity — and the rubric has no way to know.

**The case that forced this into the roadmap.** REA Group was recorded as publishing no OpenAPI and scored
22.4. A reprofile found **nine provider-published OpenAPI 3.1.0 documents — every one of them from the
public Stoplight workspace of PropTrack, the valuation business REA owns.** REA moved to 49.9 and
agent-readiness to 74.0. PropTrack, profiled separately, still scores **22.2**.

One API surface. Read at the group level it is a strength; read at the child level it is an absence.
Neither number is wrong and neither is complete, and a reader comparing REA against Domain — nine tenths
of a point apart — is comparing a group total against a single company.

The same shape recurs across the catalog once you look for it:

*   **CoStar Group** owns Homes.com (22.2) and Apartments.com (16.9); the group's published surface is
    split across three profiles that each look thin.
*   **Kraken Technologies** (27.7) is the platform Octopus Energy (58.9) built, and EDF (53.5) licenses it.
    The technology's quality shows up in the licensees' scores and not the vendor's.
*   **Bridge Interactive** is the only US real estate organization publishing listings, open-houses and
    offices as separate contracts, and Zillow (28.2) owns it.
*   **Trestle** is CoreLogic's, and `all/corelogic` already carries a separate profile of the same company
    with its own harvested artifacts.

### What to do about it

The honest minimum is **disclosure rather than arithmetic**: record a provider's parent and children in
`apis.yml`, and surface the relationship on the page and in the listing payload so a reader comparing two
providers can see when one number is a group and the other is not. That is cheap, requires no scoring
change, and would have prevented the misreading in the Australian real estate report.

The harder question — whether a parent should inherit a subsidiary's artifacts, or a subsidiary should be
suppressed when its parent is profiled — should stay open. Both rules break somewhere. Inheriting makes
conglomerates look uniformly strong; suppressing loses the entity a developer actually integrates with.
**Disclose first, decide later**, and let the sector reports keep stating the relationship in prose the way
the real estate quartet had to.

Related to *Standards bodies are measured against the wrong yardstick* — both are cases where the unit of
analysis is wrong rather than the measurement.

## A discovery document that resolves to nothing

0.6 reworked discoverability to score machine-findability — `.well-known`, `llms.txt`, a self-hosted
index — and it worked: the facet mean fell from 84.6 to 61.2 and the facet discriminates again. Travel
exposed the next-order problem, and one market states it almost as an experiment.

**Australian travel publishes discovery documents at 64% — the highest reading in the travel quartet,
higher than the US, UK or Canada — and specifications at 9%, the lowest.**

The front door is built and there is nothing behind it. A provider currently earns `well_known_catalog`
for serving a discovery document regardless of whether anything it points at exists, resolves or is
fetchable. That is the same mistake `servers_resolvable` was built to fix one layer down, and it is now
the cheapest remaining source of inflation in the agent-readiness score.

**The check:** follow the discovery document one hop. Grade *present and resolving to a fetchable
contract* above *present*, and record *present but dangling* distinctly — it is a real signal, just not
the one currently being credited. The same probe answers the certification question above, so the two
items share an implementation.

Worth stating plainly because it will recur: **every convention the agentic web adopts becomes, within a
year or two, a thing that can be present and empty.** The rubric should assume that of each new signal
it adds rather than discovering it a sector later.

## Transaction safety should be weighted by what the API actually does

`idempotency` is asked of every provider identically, and the answer has been near-zero everywhere:
**0 of 64 in travel at full credit** — one partial across the whole quartet — 0 of 60 in US energy, 0 of
108 in headless.

Those zeros do not mean the same thing. Real estate's surfaces are largely read-only. Australia's
mandated CDR energy data is read-only by design. **Travel is not: the core operations are book, pay,
change, cancel and refund**, and a retried request without an idempotency key is a duplicated charge, a
duplicated seat, or a cancellation that fires twice. The industry built forty years of settlement
machinery — BSP, ARC, EMDs, ADMs — to reconcile exactly these failures after the fact, and published
almost no mechanism to prevent them at the interface. Three consumer-protection regimes in this
quartet — ATOL, the UK Package Travel Regulations, Canada's APPR — guarantee the traveller is made whole
*after* a failure and ask nothing of the interface that would prevent it.

**The proposal:** derive an operation class from the contract the provider already publishes — does it
expose non-idempotent writes, does it move money, does it mutate a resource a third party depends on —
and weight the transaction-safety dimensions (`idempotency`, `error_semantics`, `asyncapi_events`)
against it. A read-only data API should not be marked down for lacking an idempotency key. A booking API
should be marked down hard.

This is computable from `openapi/` today: POST/PATCH/DELETE share, payment-adjacent schemas, and the
`plans/` and `finops/` artifacts that already indicate whether money moves. It converts a dimension that
currently reads as a flat industry-wide zero into one that discriminates — and it makes the strongest
single build recommendation in the travel reports defensible in the rubric rather than only in the prose.

**The positive control arrived 2026-08-06, and it settles the argument.** Every market cited above is a
zero, which shows the dimension does not discriminate but not that consequence class is the reason.
Blockchain and crypto is the first market scored where the dimension goes the other way: **idempotency
at 5.9% of 1,120 companies against a whole-catalog 2.2%**, and 15.1% among the 285 leaders. Nothing
compelled it. There is no idempotency mandate in any crypto regime, the market's governance facet is
11.1 with 56% at zero, and it still publishes the safety property at nearly three times the catalog
rate.

Ranked by what a retry actually costs, the series now reads:

| Consequence of a duplicate request | Market | `idempotency` |
|---|---|---|
| Immediate, irreversible, denominated | Blockchain & crypto | **5.9%** |
| Physical, deferred, recoverable at cost | Supply chain | 1.2% |
| Clinical, deferred, recoverable at cost | Digital health | 1.3% |
| Read-only by design | US energy, US real estate | 0% |

That is the operation-class hypothesis measured rather than argued, and it strengthens the proposal in
two ways. It confirms the class is real and legible from outside. And it supplies the calibration
anchor the weighting needs: **5.9% is what a market looks like when the consequence is unmissable**, so
that is the bar an actionable API should be measured against, not the catalog's 2.2%.

The same market supplies the counter-case for the sibling dimension. `dry_run_mode` is **0 of 285
leaders** there, while transaction simulation — `eth_call`, testnets, provider simulation endpoints —
is a chain primitive in daily use. The capability is real and undescribed in any contract, which is
the reader-gap class in the 0.9.1 note rather than a market failure. Worth deciding whether a
documented simulation endpoint outside the spec should satisfy the dimension, or whether the honest
answer stays zero and the prose carries the nuance.

### Measured catalog-wide, and requested by a provider (2026-08-14)

The proposal above was argued from sector zeros. It is now measured across the whole catalog, and a
provider asked for it independently, which is the strongest form the argument comes in.

**We > Ultrarich** (`wegtultrarich`) wrote in on 2026-08-12: their surface is entirely `GET`, holds no
state and accepts no credential, and they score 0/4 dry-run, 0/6 typed events and 0/5 self-service
sign-up. Their framing is the one to keep — *"as it stands a read-only API and an API whose author
never considered agent safety are indistinguishable in the scoring"* — and they pointed at the 0.7
OAuth checks as the precedent already in the rubric: vacuously satisfied when the contract declares no
OAuth, read from the contract, no self-declaration.

**The shape of the catalog.** 553,510 operations across 7,326 providers with a refined OpenAPI. GET
47.6%, POST 31.5%, DELETE 8.9%, PUT 6.9%, PATCH 4.4%.

| shape | providers | share |
|---|---|---|
| mixed | 4,450 | 60.7% |
| write-heavy (>60% writes) | 1,330 | 18.2% |
| **read-only (100% GET/HEAD/OPTIONS)** | **943** | **12.9%** |
| write-only | 426 | 5.8% |
| read-dominant (<10% writes) | 177 | 2.4% |

**One provider in eight is entirely read-only**, so this is a cohort, not an exception to waive.

**The penalty, joined against current scores:**

| shape | n | agent readiness | Kin Score | dry-run | idempotency | events | error semantics | rate-limit |
|---|---|---|---|---|---|---|---|---|
| read-only | 938 | **32.6** | **40.2** | **0.0%** | 1.5% | 5.4% | 29.0% | **82.0%** |
| mixed | 4,613 | 38.6 | 46.2 | 1.4% | 6.7% | 24.5% | 47.4% | 76.2% |
| write-heavy | 1,750 | 38.6 | 46.5 | 0.6% | 7.8% | 26.4% | 46.4% | 73.8% |

Six points on both scores, concentrated in the three hazard dimensions. **Not one of the 938 read-only
providers publishes a dry-run mode** — zero, because there is nothing to preview.

**The control is the last column, and it is what makes this conclusive.** On rate-limit signalling —
which applies to a read-only API exactly as much as to any other — read-only providers are *better*
than everyone else, **82.0% against 76.2% and 73.8%**. This is not a weak cohort scoring badly across
the board and looking for relief. They are ahead where the dimension applies and at zero where it
cannot.

**Where the exemption must stop.** Read-only providers sit at **29.0% on error semantics against ~47%**.
That dimension applies to them in full — a GET still fails, and an agent still needs to read the
failure. Excusing it would convert a fair correction into a blanket waiver and hide a real gap.
Self-service sign-up is also held back: "no accounts by design" and "never built onboarding" are not
distinguishable from a contract, and inventing a predicate that cannot be checked is worse than the
zero.

**Auth does not track write share cleanly enough to build on yet.** Scopes: read-only 10.5%, mixed
26.5%, write-heavy 16.7% — it is *mixed* providers that publish the most, so "more writes therefore
more scopes" is not a line. The OAuth-granularity-versus-method-mix question needs its own measurement
before it becomes a rule.

## Documenting the whole lifecycle of what you let people create

The read-only conditional stops punishing providers for hazards they cannot have. Its complement is to
start rewarding providers for describing the hazards they *do* have — and almost nobody does.

Grouping the corpus by **resource** rather than path (REST splits one resource across `POST /things`
and `GET|PUT|DELETE /things/{id}`, so a path-level view scores that as two incomplete resources), then
asking of every resource you can create: does the provider also document how to read it back, change
it, and remove it?

**143,877 creatable resources across 7,300 providers.**

| For a resource you can CREATE | resources | share |
|---|---|---|
| create only — no read, no update, no delete | **91,437** | **63.6%** |
| create + 1 of 3 | 18,829 | 13.1% |
| create + 2 of 3 | 12,732 | 8.8% |
| **create + all three** | **20,879** | **14.5%** |

Per provider: mean **12.4%** of creatable resources expose the full lifecycle, **median 0.0%**, and
**3,609 of 6,245 providers (57.8%) do not document a single fully round-trippable resource.**

Nearly two thirds of everything you can create in this catalog is documented as create-and-forget. An
agent that creates something and cannot read it back cannot confirm the write landed, cannot correct
it, and cannot clean up after itself. That is a property of the contract, visible in the contract, and
it is invisible to contract quality today — the facet rewards having a spec, tagging it, describing
schemas and shipping examples, all of which a create-only surface scores full marks on.

**The check must reward completeness, never penalise incompleteness.** Three honest reasons a creatable
resource has no round trip: it is genuinely append-only (events, logs, audit records); the capability
exists and is undocumented; or the resource is managed elsewhere. Only the second is a deficiency and
none of the three is distinguishable from the spec. Cap the credit rather than scaling it linearly, or
the rubric starts rewarding CRUD-for-its-own-sake and marking down a well-designed API that
deliberately exposes no DELETE.

Both this and the read-only conditional derive from one `write_surface` extraction over
`openapi/`, so it is a single new fact feeding two changes. **Baseline for the band re-cut: 14.5% of
resources and a 0.0% median means this reads near-zero on day one**, which by the rule already recorded
above moves the whole catalog through the denominator. The re-cut is part of the change.

Tracked as roadmap#63; the governance defect the same provider found is roadmap#62.

## A contract that describes the platform is not a contract that describes the product

The rubric asks whether a machine-readable contract exists, whether it is complete, whether it is
callable and whether it is described. It never asks **what the contract covers**. A provider that
publishes an excellent OpenAPI for provisioning workspaces, rotating keys and listing jobs scores
identically to one that publishes the same quality of contract for the thing the customer actually
bought.

Data and analytics is the demonstration, and the numbers are not close. Reading the resources declared
across 4,819 refined specification documents, the most-published nouns in that market are `users` (52
providers), `jobs` (43), `search` (30), `authentication` (29), `projects` (23), `groups` (20) and
`workspaces` (18). **Of the 321 companies in its upper three bands, 181 declare a control-plane
resource and 32 declare query or SQL** — 10.0%. An agent can provision a workspace, schedule a job and
check its status across most of that market, and cannot ask it a question.

**The honest complication, which the check has to carry.** Analytical access has mature protocols of
its own — [JDBC](https://standards.apievangelist.com/store/jdbc/),
[ODBC](https://standards.apievangelist.com/store/odbc/),
[Arrow](https://standards.apievangelist.com/store/arrow/) Flight, the SQL wire protocols — and they
move a billion rows better than JSON over HTTP ever will. A warehouse whose primary read path is a REST
endpoint would be making a mistake. So this is not a penalty for choosing the right protocol. It is a
**coverage disclosure**: does the published contract set cover the provider's primary product surface,
or only its administration, and is the other path described anywhere a machine can find it?

That framing also explains a number the same report found and could not otherwise account for: MCP
adoption in data and analytics runs at **11.3% against a catalog 5.7%**, the highest of any market
scored. The vendors are bolting an agent interface across precisely the gap this check would measure.
Where the data plane cannot be a REST resource, an MCP tool becomes the way to let something ask a
question — which makes coverage and agent-readiness two views of one fact.

**Computable from what is already held.** Resource tokens from the refined one-per-resource filenames,
against the provider's own `description` and tags in `apis.yml`. The output is not a score penalty on
its own; it is a per-provider ratio — administration versus product surface — that can inform
`contract_quality` once calibrated, and that reads as a finding in its own right long before it is
weighted.

## Authentication is not authorization — delegated authority as a signal

`auth_clarity` asks whether a provider explains how to authenticate. Nothing asks what a credential is
then permitted to do. `oauth_scopes_enumerated` exists inside the OpenAPI block and the health regime
weights SMART scopes as consent-legibility, but there is no general signal for **delegated authority**:
can a customer — or an agent acting for one — read the boundary of the credential it holds?

Blockchain and crypto makes the case at its sharpest, because it is the market with the largest
irreversible blast radius per credential in the catalog. **Auth clarity 91.2% of leaders. Published
scopes 29 of 285 — 10.2%**, the lowest scope discipline measured this year. That market explains
thoroughly how to authenticate and rarely what the key may then do, and it does so while putting **36
companies in the Agent-Native band, 3.2% against a catalog 1.4%** — the highest rate recorded. It has
given agents the ability to act and not the ability to know their own limits.

The pattern is not confined there. Marketing and advertising publishes scopes at 29.5% while describing
consent at 3.1%; data and analytics at 16.8% while its products sit on top of an entire organization's
data estate. In each case the same question is unanswered: **read-only or read-write, spend-limited or
unlimited, address-restricted or open, time-boxed or permanent.**

**Where it belongs.** This fits the standalone **Security Posture layer** already under consideration
above — that section names auth hardening and does not name delegation. Delegated authority is the
better anchor for it, because it is the signal an agentic consumer needs and the one an enterprise
buyer already asks for in procurement. Candidate composition: scopes enumerated in the contract, scopes
discoverable at a well-known location, a documented revocation path, and any expression of limits a
credential carries. Scored as a lens rather than folded into the composite, on the Agent Readiness
model.

## Duplicate provider repos distort every cohort number the rubric produces

Not a rubric defect, and recorded here because the reports are where it surfaces.

Building the digital health cohort on 2026-08-05 found **65 companies carrying more than one
`all/<slug>/` repository** — `elation` and `elation-health`, `athena-health` and `athenahealth`, three
for Sword Health, five separate programme repos for NHS England. That is roughly **5% of a cohort**,
not the occasional one-off the retirement procedure was written for.

The scoring is correct in each case; the rollup is not. The thinner twin always scores lower, so
counting both double-counts the company **and** drags the cohort average down for a reason that has
nothing to do with the market, while inflating the Minimal band. Any published average, band
distribution or market comparison inherits the error.

Detection is cheap: group cohort slugs by a normalized key — strip non-alphanumerics, then strip a
trailing `health|healthcare|technologies|systems|group|inc|co|com|io|ai|app|labs` — and again by
normalized display name. Anything with two members is a candidate. The false pairs are real companies
and need eyes: Candid Health the billing platform against Candid Co. the aligner brand, Pearl Health
against Pearl the dental imaging company, Corti against Cortico. The report-time correction is a
published canonical map; the durable fix is the merge procedure, run at catalog scale rather than one
pair at a time.

## Vocabulary convergence is measurable, and it is the cleanest mandate effect yet

Across four sectors the catalog now holds a signal nobody is scoring: **whether the organizations in a
market ended up calling the same thing by the same name.**

- **Mandated Australian energy** — four retailers publish byte-identical `cds-energy` and `cds-common`
  documents. Three Ontario utilities share `green-button-espi`.
- **Unmandated US travel** — with *three* standards bodies in the market, the most-shared resource name
  in the entire 176-specification corpus is spelled **two different ways**: `bookings-api` at three
  providers and `booking-api` at two.
- **UK travel** — the entire shared vocabulary of the market is one entry, `webhooks-api`, at two
  providers.
- **Australian and Canadian travel** — one publisher each. Convergence is arithmetically undefined.

`mandate_status` already measures whether an obligation exists and whether a callable surface backs it.
**Vocabulary convergence measures what the obligation actually did to the market**, and it is a stronger
result than the composite delta because it cannot be produced by anything except a shared schema.

This is a **cohort-level metric rather than a per-provider dimension** — a provider cannot converge
alone — which makes it a natural fit for the sector pages and the report data bundles rather than the
score block. Compute it as the share of a cohort's resource names appearing in two or more providers,
reported with the standard named. It would let a Sector Report state *"this market converged and that one
did not"* as a measured figure instead of an observation.

## Reports drift from the catalog, and nothing was watching

A Sector Report is a snapshot. The catalog is continuous — enrichment, reprofiling and rescoring move
provider scores every day. Nothing in the pipeline noticed when a **selling** report started disagreeing
with the data behind it, and on 2026-07-27 that failed twice in one day.

**REA Group 22.4 → 49.9.** A reprofile found nine provider-published OpenAPI documents the bootstrap had
concluded did not exist. The Australian real estate report's headline finding — *"the market leader is
twenty-seven points behind its challenger"* — was not merely stale, it was **inverted**: REA finished
ahead of Domain. Caught before publication only because the papers repo happened to be unpushed.

**Five US real estate providers moved 3–4.6 points within hours of publication.** Yardi 59.7 → **62.9**,
which put an organization in the Strong band in a report that stated, twice, that the market had none.
The band distribution in §3 was wrong as printed.

A sweep of all eight real estate and energy reports then found **199 inline provider scores, 10 of which
disagreed with the live catalog** — six from drift, and four from a second failure class the sweep caught
by accident: **a report contradicting itself**, having written an agent-readiness score where a composite
belonged (AESO 60.6, ATCO 61.5, REALTOR.ca 41.9). Each of those reports stated the correct figure
elsewhere in the same document.

### The check

`papers/scripts/check_report_drift.py` re-extracts every inline provider score from a report and diffs it
against the live `providers-*.json` cohort. It distinguishes the two failure modes — a claimed value that
matches the provider's *agent* score is an authoring error, not drift — and exits non-zero so it can gate
a publish step. It is a hundred lines and it would have caught every one of the ten.

### What it implies for the reissue plan

The roadmap's *Reports to re-issue after the batch* item assumes drift matters at v1.1, when provenance
gating lands. It does not. **It matters daily**, and the gap between a report's numbers and the catalog's
is largest in the days right after a sector is built, because that is when enrichment and reprofiling are
still landing on those same providers.

Two consequences worth adopting:

- **Run the drift check before any publish, and on a schedule after.** The reports are living documents by
  design; that only works if divergence is detected rather than discovered.
- **Prefer computed figures over transcribed ones where the format allows.** Every one of the ten problems
  came from a number typed into prose. The band tables and facet tables — generated from the cohort JSON —
  drifted too, but were caught in the same pass because they are mechanical. Prose is where errors hide.

This is a publishing-pipeline item rather than a rubric item, but it belongs here because it is the
mechanism by which every other roadmap item eventually reaches a reader. A rubric correction that never
propagates to the artifacts is a correction that did not happen.

### The first reissue, measured (travel, 0.5 → 0.6)

The travel quartet was published on 0.5.1 hours before 0.6 shipped, and became the first live test of
the reissue plan. The drift check found **54 of 66 inline scores disagreeing with the live catalog**, and
the failures were not evenly distributed between cosmetic and structural.

Four findings **inverted** — not drifted, inverted:

- **"The OpenTravel Alliance tops US travel"** — false under 0.6. Oracle Hospitality leads at 55.9;
  OpenTravel is second at 55.1. A through-line in three of the four reports.
- **"Nothing in Canada reaches the Developing band"** — false. Air Canada 43.2 → **49.9**, because 0.6
  credits a contract that is not an OpenAPI. The market's second headline.
- **"Exactly one UK organization clears Developing"** — became two; Virgin Atlantic 39.6 → 46.6.
- **"Australian governance is 1.2 with ten of eleven at zero"** — became 7.7 with two zeros. The
  headline was largely a measurement artefact of the narrow governance facet, not a market fact.

Two things follow that the pre-0.6 version of this item did not anticipate:

- **A rubric release is a different failure class from daily drift, and it needs a different response.**
  Daily drift moves numbers. A rubric release moves *findings*, because the facets that changed are the
  ones the prose was written about. The drift checker catches the first automatically and only catches
  the second by accident — it compares scores, not claims. **Anything a report asserts as a superlative
  ("tops the market", "nothing reaches", "the only one") should be machine-checkable against the cohort
  and re-run on every rescore.** That is a small extension to the existing checker and it is the one that
  would have caught all four.
- **Report every figure with the rubric version that produced it.** The travel reissue carries
  *"Scored on Kin Score v0.6"* in the masthead and names v1.0's figure wherever the change is large
  enough to surprise a returning reader. Without that, a buyer who read v1.0 and re-reads v1.1 has no way
  to tell a market movement from a rubric movement — and in this batch it was almost entirely the latter.

**A useful positive result:** the findings that survived 0.6 unchanged are the ones grounded in absence
rather than in a facet. Australian contract quality of 5.8 with nine of eleven at zero did not move,
because nine organizations scored zero for having nothing to read and no rubric revision can change that.
**Absence is the most durable evidence in this catalog**, which is an argument for writing report
headlines against it wherever the data allows.

## Ship the next batch together

**Post-0.6 addendum — what travel added, and where it goes.** The band-label defect at the top of this
file is a **correctness bug, not a batch item**: seven of sixty-four travel providers carry a label that
contradicts the range printed beside it, it is visible on live section pages today, and it should be
fixed on its own rather than waiting for a release. Of the rest, three share one probe and should land
together — *certification in three states*, *governing documents that 404*, and *a discovery document
that resolves to nothing* are all one unauthenticated fetch per declared URL, and that same probe is
already specified for the contract-fetchability check in step (3). *Transaction safety weighted by
operation class* is spec-parsing work of the same kind as the `planned_dimensions` and rides with them.
*Vocabulary convergence* is not a score dimension at all — it is a cohort metric for the sector pages and
data bundles, and it can ship independently of any rubric release. The Switchability additions are
calibration input for that lens rather than new work: travel supplies forty organizations already
researched against its schema, and one correction — `standard_conformance` must not carry positive
switchability weight on its own.


Switchability is explicitly **not** in the 0.6 batch — it is a new lens with its own collection work and
its own audience, and it should follow the base-facet corrections rather than ride along with them.

These items are meant to land as **one coherent 0.6 release**, re-scored and band-recalibrated in a
single pass, rather than dribbled out check by check. Several move the same providers at once — a
FHIR-native EHR gains from the contract-type-agnostic fix, the health-regime checks, the broadened
governance facet, and the access-model signal simultaneously — so scoring them together avoids three
separate recalibrations and three rounds of headline-number churn. Sequence within the batch:
(1) **provenance grading and the placeholder-server check**, plus the contract-type-agnostic fix —
base-facet correctness, and provenance now leads because two published report series commit to it in
print; (2) the `broker`-collision fix and the new `telecommunications` regime, then the 0.6
regime-specific checks resolved against the catalogs; (3) access model including channel
reachability **and the contract-fetchability check**, parent/child disclosure, portal liveness, broadened governance, and the
graded example/compliance signals; then one recalibration and a full re-score and page/paper refresh.
The **detector sanity pass** should land first of all of these — it is a day's work and it guards every
other number in the batch, and energy gave it two more false negatives to justify it (REA Group, AEMC).
**`mandate_status` should join the 0.6 batch rather than wait**, because it is machine-checkable with
probes the pipeline already runs and it is the largest unmeasured effect in the catalog — twelve points
against RESO's two.

**Where the competitive read lands in this sequence.** Two of its items are batch-ready and two are
not. The **Agent-Native band gate** (`idempotency` **and** `error_semantics` required) belongs in step
(3) alongside the other gating work, and it must land *before* the recalibration since it moves the top
band. The **four `planned_dimensions`** — `idempotency_key_param`, `rate_limit_headers`,
`error_envelope`, `dry_run_mode` — are already specified in `scoring.yml` and are spec-parsing work of
the same kind as the placeholder-server check, so they ride in step (1) with it and share its parser.
Note the interaction: promoting these supersedes the link-based proxies that the band gate keys on, so
the gate should be written against the *superseding* dimensions where they have landed and the legacy
proxies where they have not. The **agentic-commerce dimension** and the **machine-discoverability
rework** are new collection work, not corrections, and should follow the batch rather than delay it —
the discoverability item in particular is better done once against Cloudflare's published adoption
baseline than guessed at now.

**The `agent_card` dimension was the exception and shipped ahead of the batch, in 0.5.1
(2026-07-28).** Every other item here is queued because the collection work has not been done;
that one's was finished — 22,341 hosts probed, 65 cards captured verbatim with their observed
HTTP status, graded three ways. It is additive (a new dimension; no existing dimension changes
meaning) and provenance-proof by construction, so it did not need to wait for the 0.6 batch.

**It did, however, need its own band recalibration — and that is a lesson worth generalising to
every remaining item on this roadmap.** The reasoning that it "moves almost nobody's band because
almost nobody publishes one" was wrong, and measurement caught it before release. Agent Readiness
is `earned / max`, so adding an 8-point dimension raised `max` from 104 to 112 and rescaled *every
provider in the catalog* by 104/112 — including the ~3,300-provider baseline plateau, which fell
from 48 to 44.6 and straight through the old 45 cut. Left alone, a dimension 99.7% of the catalog
does not participate in would have **demoted 3,726 providers**. Re-cut at the same valleys
(56/42/14), 15 providers moved, all upward, all of them publishers.

The general rule this establishes: **in a normalised score, adoption rate does not predict blast
radius — the denominator does.** Any future dimension added to Agent Readiness moves the whole
catalog whether or not anyone scores on it, so a band re-cut is part of the change, not a
follow-up. The same arithmetic applies to the four `planned_dimensions` when they are promoted.

**Reports to re-issue after the batch.** Provenance gating will move numbers in reports that are
already selling, and several of those reports name the providers that will fall. The **seventeen**
affected — the four insurance Sector Reports, the telecom Sector Report, the four banking reports that
first raised provenance, the four real estate reports and the four energy reports — should be re-issued
at v1.1 against corrected data rather than left to disagree with the live catalog. Energy will move
least: its enrichment ran 45% searched / 34% generated / 21% derived, the healthiest ratio recorded. Insurance, telecom and real estate
were all written to survive this: each names which providers rest on derived artifacts and predicts the
direction of the change.

One sequencing note the real estate quartet exposed: **provenance gating will hit markets unevenly, in
proportion to how little they genuinely publish.** Canada has the thinnest published surface of the four
(seven of fourteen organizations publish any contract), so AE-derived artifacts are a larger share of
what is being scored there, and its numbers will fall furthest. That is correct behaviour, but it means
the *cross-market* comparisons those reports draw — Canada last for the fifth consecutive sector — must
be re-verified after the batch rather than assumed to survive it.

---

<sub>Have a signal the score should measure — or shouldn't? The productive contribution is a public,
machine-checkable signal it missed. Open an issue on this repo.</sub>
