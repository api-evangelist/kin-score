# Kin Score — Roadmap

The rubric is a living argument, versioned and iterated — especially now, as it is applied across
new sectors, until it stabilizes. This is the planned direction. Nothing here is a commitment to a
date; it is the queue of improvements, most-ready first. See [`CHANGELOG.md`](CHANGELOG.md) for what
has shipped.

---

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

**Provenance grades the PRESENCE award, not the DEPTH awards — and Yardi shows the difference.**
Grading `contract_present` caught Yardi correctly: all five of its specs are marked derived, and it
fell 62.9 → 56.9. But it is still **Strong**, because `contract_present` is 20 of the 132 points in
`contract_quality` and the other 112 — `info_complete`, `operations_summary_coverage`,
`operations_description_coverage`, `operationIds`, `response_coverage`, `components_reuse`,
`security_schemes_defined` — are still awarded in full for the quality of a document **API Evangelist
wrote**. We write good specs, so a provider we modeled thoroughly scores well on spec craftsmanship it
had no part in.

The fix is mechanically simple and should land in 0.7: apply the provenance multiplier to **every
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
  dimension sits naturally beside `agentic_access`.
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

The rubric currently reads *absence of a commercial surface* as a deficiency, when it is sometimes a
**regulatory outcome** and sometimes a **deliberate public-good posture**. The conditional-facet
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

## Ship the next batch together

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
