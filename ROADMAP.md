# Kin Score — Roadmap

The rubric is a living argument, versioned and iterated — especially now, as it is applied across
new sectors, until it stabilizes. This is the planned direction. Nothing here is a commitment to a
date; it is the queue of improvements, most-ready first. See [`CHANGELOG.md`](CHANGELOG.md) for what
has shipped.

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
- **Health — FHIR conformance.** Reward a published FHIR **capability statement**, US Core / EHDS
  profile conformance, and SMART-on-FHIR scopes.
- **Payments — PCI + SCA.** Reward PCI-DSS attestation/scope disclosure, strong customer
  authentication, and ISO 20022 message conformance.
- **Securities & market data — entitlement & licensing.** Reward machine-readable entitlement and
  redistribution terms, and MiFID II / exchange data-licensing disclosure.

Each ships as a check under `artifacts.regulatory.checks` with a `regime:` qualifier plus a matching
evaluator gated on the provider's matched regime.

**Resolve conformance against the catalogs.** The `reg_standards_conformance` check currently credits
any generic `Standard`/`Conformance` tag. With the [Standards](https://contracts.apievangelist.com)
and [Regulations](https://regulations.apievangelist.com) catalogs now carrying the actual
regime → standard → regulation graph, the check can resolve against it — crediting a
`banking_open_finance` provider for conforming to the standard *recognized for its regime* (OBIE, CDS,
FDX, Berlin Group), and carrying the regulation that applies to it. This turns the catalogs into
scoring inputs and closes the loop between the papers, the standards, the regulations, and the score.

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

---

<sub>Have a signal the score should measure — or shouldn't? The productive contribution is a public,
machine-checkable signal it missed. Open an issue on this repo.</sub>
