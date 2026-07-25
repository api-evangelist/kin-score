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

## Provenance — provider-published vs. derived artifacts (from the four banking reports)

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
meter data access), telecom (number portability, lawful intercept posture), and additional national
open-banking regimes. The rule of thumb: keep tags specific enough not to regulate APIs a regime
doesn't actually cover.

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

## Broaden the base governance facet

`governance` (0.12) is effectively a single check — a self-published Spectral ruleset in
`all/<slug>/rules/` — and it scores ~0 across banking, payments, and healthcare, so at its current
weight it barely discriminates. That is honest (almost nobody ships a public ruleset) but it under-uses
the facet. Broaden it to credit the other ways a provider demonstrates it has *internalized* standards
— Kin's actual definition of governance: a declared conformance profile (FHIR / FAPI / PCI), a
`conformance/` artifact, an OpenAPI Overlay, or a published lint / CI posture — resolved against the
standards catalog. This complements the regulatory-facet conformance check above and gives the base
facet real signal in sectors that have genuine conformance but no Spectral file.

## Graded signals, not bits — examples & compliance

Two signals carry almost no information as flat 0/1 bits:

- **OpenAPI examples** ran at ~0% across payments and healthcare — as a boolean it barely
  discriminates. Grade it by the *share* of operations carrying request/response examples (or a live
  mock server), so a provider that documents every operation outscores one with a single token example.
- **Compliance attestations** (SOC 2, HITRUST, ISO 27001/42001, PCI) recur across every trust center.
  Credit them — but as a *small, explicitly-capped* operational-transparency signal, documented as
  **not** a substitute for a machine-readable contract or a consent surface. The reports' recurring
  line — *compliant is not the same as usable* — belongs in the weighting, not just the prose.

## Ship the next batch together

These items are meant to land as **one coherent 0.6 release**, re-scored and band-recalibrated in a
single pass, rather than dribbled out check by check. Several move the same providers at once — a
FHIR-native EHR gains from the contract-type-agnostic fix, the health-regime checks, the broadened
governance facet, and the access-model signal simultaneously — so scoring them together avoids three
separate recalibrations and three rounds of headline-number churn. Sequence within the batch:
(1) the contract-type-agnostic fix and provenance grading (base-facet correctness); (2) the 0.6
regime-specific checks resolved against the catalogs; (3) access model, broadened governance, and the
graded example/compliance signals; then one recalibration and a full re-score and page/paper refresh.

---

<sub>Have a signal the score should measure — or shouldn't? The productive contribution is a public,
machine-checkable signal it missed. Open an issue on this repo.</sub>
