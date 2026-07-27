# Kin Score — Roadmap

The rubric is a living argument, versioned and iterated — especially now, as it is applied across
new sectors, until it stabilizes. This is the planned direction. Nothing here is a commitment to a
date; it is the queue of improvements, most-ready first. See [`CHANGELOG.md`](CHANGELOG.md) for what
has shipped.

## Count every machine-readable contract — contract-type-agnostic scoring

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

## A contract you cannot call — placeholder and template-only servers

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

## Standalone Security Posture layer (under consideration)

Security signals currently live across two facets (operational_transparency, commercial_clarity) and
the conditional regulatory facet. A candidate iteration promotes them into a **standalone Security
Posture score** — modeled on Agent Readiness (own score, own band, never merged into the composite):
domain security (TLS/HSTS/DMARC probes), a published VDP, `.well-known/security.txt`, a trust center,
and auth hardening. This would apply to **every** provider, not just regulated ones, and sit beside
the composite and agent-readiness as a third lens.

## Widen the regulatory applicability map

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

Bands are cut against the observed distribution, not round numbers. After any material rubric change
(new facet, weight shift, regime), re-run `band_distribution.rb` and re-cut so no band is empty or
holds an uninformative 40% of the catalog.

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

## Broaden the base governance facet

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

## Unanimous zeros are either a finding or a bug — and the difference matters

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

## Discoverability is saturated and no longer discriminates

Across the real estate quartet `discoverability` averages **84.6** with **zero providers scoring zero in
any of the four markets** — 90.8 UK, 87.2 AU, 83.0 CA, 80.7 US. In the same cohort `governance` averages
**3.1** and `contract_quality` **29.0**.

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

### The one criticism that lands: link presence is not spec analysis

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

### Compensation — additive scoring produces a false Agent-Native

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
reachability **and the contract-fetchability check**, portal liveness, broadened governance, and the
graded example/compliance signals; then one recalibration and a full re-score and page/paper refresh.
The **detector sanity pass** should land first of all of these — it is a day's work and it guards every
other number in the batch.

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

**Reports to re-issue after the batch.** Provenance gating will move numbers in reports that are
already selling, and several of those reports name the providers that will fall. The **thirteen**
affected — the four insurance Sector Reports, the telecom Sector Report, the four banking reports that
first raised provenance, and the four real estate reports — should be re-issued at v1.1 against
corrected data rather than left to disagree with the live catalog. Insurance, telecom and real estate
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
