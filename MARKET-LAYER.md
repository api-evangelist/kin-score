# The Kin Score Market layer: design

Status: draft 1, 2026-10-12. Provisional and unweighted; not part of the composite or agent readiness.
Introduced in https://apievangelist.com/2026/10/12/the-kin-score-is-getting-a-third-dimension-the-market/
Changes land only on a weekly release and are recorded in the CHANGELOG.

## 1. What the layer measures

The Kin Score has two dimensions today: what a provider publishes (the composite) and how ready that
is for agents (agent readiness). Both look at the provider on its own. The Market layer reads the
provider **in its market**: who it integrates with, how deep those integrations go, and how the
market around it is structured.

It is a **standalone block**. It has its own number and its own position label. It is not folded
into the composite or agent readiness, and will not be until it has been stable across several
weekly releases.

## 2. The chain

Every point traces through a deterministic chain we can show:

    operation -> tag -> business capability -> workflow (Arazzo) -> integration -> market

- **Operations and tags** come from the provider's OpenAPI.
- **Capabilities** are the business units the market buys (the existing capability mapping).
- **Workflows** are Arazzo documents **we** generate. They are the instrument, not something the
  provider earns credit for publishing. A provider-published Arazzo goes through the same checks and
  wins where it is better.
- **Conversational overlays** phrase each workflow the way business stakeholders talk about it.
- **Integrations** are typed, evidenced edges between providers. Every integration is a market vote
  for the workflow it carries out.

## 3. Rules

1. **Breadth is not credit.** A provider's depth is the mean of its top 10 integrations. A long
   list adds nothing, and three deep integrations beat eighty shallow ones.
2. **Declaration is the provider's responsibility.** A provider that declares no integrations
   anywhere we can read is reported `undeclared`, with no number. We never infer integrations. The
   published rating is the incentive to declare.
3. **Attribution.** Every workflow that cannot be built records whose gap it is: the provider's
   contract, the partner's contract, or our catalog. Only gaps in the provider's own contract count
   against it.
4. **Deterministic first.** Where a market publishes its own structure (an app store, a regulator's
   register, an endpoint directory), we read it with a per-source adapter. No point depends on a
   model's judgement.
5. **Pinned instrument.** The generator, adapters and weights are versioned per weekly release, and
   change only on a release, measured.

## 4. Evidence: what an integration is worth as proof

| Evidence | Weight | Example |
|---|---|---|
| regulator register | 1.0 | listed in Australia's CDR Register, Open Finance Brasil, UK OBL directory |
| network directory | 0.9 | listed by a health information network itself (TEFCA RCE, CommonWell) |
| contract | 1.0 | named in a partner's spec (a payment-method, network or carrier enum) |
| standard / network directory | 0.9 | listed by a standards body or health network itself (CAMARA, TEFCA RCE, CommonWell) |
| own contract | 0.8 | declared in the provider's own spec (a channel enum it routes to) |
| partner-built | 0.9 | a partner's app in the provider's marketplace |
| provider-built | 0.8 | a connector the provider built and lists |
| claimed / workflow | 0.6 | named on the provider's own integrations page |
| marketplace / open-source node | 0.5 | an iPaaS connector listing |
| agent gateway | 0.4 | Composio, Monid, MCP gateways |
| iPaaS usage | 0.35 | what iPaaS users happen to pair it with |

## 5. Depth per integration

    depth = evidence x (floor + (1 - floor) x substance) x provider-guess factor

- **Substance (workflow integrations):** a valid Arazzo or preconfig that implements it (0.45),
  operations it really calls, saturating at 4 (0.25), steps spanning 2+ capabilities (0.20),
  event-driven (0.10). Floor 0.15: a declared, evidenced integration with nothing built still counts.
- **Non-workflow integrations** (payment method, network, rail, platform app, standard participant,
  coverage, compatible, embedded, core infrastructure) cannot be built as Arazzo and are not judged on
  it. Their substance is 0.5 plus 0.25 times a signal read from that one edge: API families maintained
  in a standard, operations available per covered system, platform certification. Never the number of
  edges. The cap keeps any such edge below a built workflow.
- **Provider guesses:** each workflow step we had to guess because of the provider's own contract
  costs 0.1, floored at half.
- **Provider depth:** mean of the top 10, averaged over at least 3, so a single strong edge reads as
  thin rather than deep.

## 6. Position: depth is read within it

A provider's integration mix sets its position, and depth is compared within a position: platforms
against platforms, aggregators against aggregators.

| Position | Rule (share of integrations) | Reads as |
|---|---|---|
| coverage | >= 50% coverage | reaches banks or customer sites through a standard (aggregators, EHR vendors) |
| regulated | >= 50% contract or register | participates through the standard or partners' contracts |
| gravity | >= 40% partner-built | other companies invest to build on it |
| core | >= 35% provider-built | builds the connectors its customers need |
| long-tail | >= 60% iPaaS | the long tail, reached through Zapier, n8n, Make |
| list | >= 60% own-page claims | a long list on its own page, mostly unevidenced |
| mixed | none dominates | |
| undeclared | nothing declared | no number |

## 7. Structural sources, per market

Each market publishes its structure somewhere different, and the layer reads it there.

| Market | Structure lives in | Adapters |
|---|---|---|
| payments | partners' contracts | contract-enum detection (payment methods, networks, rails) |
| e-commerce / CRM | platform app stores | AppExchange, HubSpot, BigCommerce, Zoho, Shopify, Square, WooCommerce, commercetools |
| open banking | regulators' registers, aggregator coverage | CDR Register, Open Finance Brasil, UK OBL; TrueLayer, Tink, Token.io |
| accounting | ledger app stores, connector coverage lists | Xero, FreshBooks, NetSuite; Codat, Rutter, Merge |
| HR / payroll | HR platform app stores, connector coverage lists | ADP, Workday, UKG, Paychex (AppDirect), Greenhouse, BambooHR; Finch, Merge, Kombo |
| shipping | aggregators' carrier enums, carrier directories | Shippo, Karrio, shipcloud; 17TRACK |
| telecom network APIs | the standards body's own records | CAMARA landscape and API-repo maintainers |
| communications (CPaaS) | providers' channel enums, notification layers' provider enums | per provider spec |
| healthcare (FHIR) | EHR endpoint directories, network directories, EHR partner directories | Epic, Oracle Health endpoint bundles; TEFCA QHINs (RCE) and CommonWell members/products; eClinicalWorks partner directory. Not machine-readable: Carequality directory (credentialed), TEFCA participants (credentialed), athenahealth Marketplace (403) |
| iPaaS / agents (all markets) | connector catalogs | Zapier, n8n, Make, Composio, Monid |

Nine markets so far show four shapes: **open markets** integrate through workflows, **regulated
markets** through standards, **platform markets** through app stores where partners invest to build,
and **coverage markets** through aggregators that publish who they reach. Coverage also makes visible
companies that declare nothing themselves, so a provider's own declarations and who covers it are
reported separately.

## 8. Two modes

- **Bedrock** markets are measured by depth and structure, as above.
- **Frontier** markets are measured by movement between dated snapshots of the integration graph:
  entrants, declared compatibility (`relationship: compatible`), convergence on a shared API shape,
  integration velocity, declaration rate, and demand. The first frontier market is typed decision
  models (TypeSafe System One and OpenAI Decisions), published 2026-10-12.

## 9. What a provider can do

- Declare integrations and partnerships in a form a machine can read: a marketplace with a public
  listing API, a partners page with stable links, or an `integrations` entry in `apis.yml`.
- Publish a contract that names partners where they belong (payment-method and network enums,
  webhook event types).
- Publish Arazzo for the workflows you support. We will validate it and use it where it beats ours.
- Dispute any edge through the normal correction path. Every edge cites its evidence.

## 10. Open questions before any weight

- Calibration of the weights against expert reads of each market.
- Inbound vs outbound: reported beside the score, not folded in yet.
- Vote baselines: universal apps (Sheets, Gmail, Notion) dominate iPaaS pairing and need a lift baseline.
- Frontier metrics need at least four weekly snapshots before a trajectory is published.
