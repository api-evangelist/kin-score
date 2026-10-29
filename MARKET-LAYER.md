# The Kin Score Market layer: design

Status: draft 1, 2026-10-12; design signed off by Kin 2026-10-29. Provisional and unweighted; not part of the
composite or agent readiness.
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
6. **Directory listings of a protocol are report only (2026-10-14).** A provider's listing in the official
   MCP Registry (edges with partner `mcp`) is a frontier signal, read like a shape vote: shown on the provider
   as "registered MCP server", in its own integration-mix mode `agent-registry`, and excluded from depth,
   position shares and the own/covered declaration until it holds across four weekly snapshots. The
   agent-tools market reads it on its frontier timeline instead. Publisher-vetting badges (Procore security
   review, Olo partner tier, Clover Editor's Pick, Toast Featured, "Reviewed by Blackbaud") stay their own
   signal at weight 0.

## 4. Evidence: what an integration is worth as proof

| Evidence | Weight | Example |
|---|---|---|
| regulator register | 1.0 | listed in Australia's CDR Register, Open Finance Brasil, UK OBL directory |
| contract | 1.0 | named in a partner's spec (a payment-method, network or carrier enum) |
| standard / network directory | 0.9 | listed by a standards body or health network itself (CAMARA, TEFCA RCE, CommonWell). Signed off 2026-10-29: kept below a regulator register because the body maintains its own list |
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
  in a standard, operations available per covered system, platform certification, a direct (vs GDS-resold)
  airline connection and its features in production, what one CDP connector does (modes, event types, sync
  modes), the strongest 1EdTech standard certified, the eIDAS qualified service types granted. Never the number of
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
| coverage | >= 50% coverage | reaches banks, carriers, utilities or customer sites (aggregators, EHR vendors) |
| covered | reached mainly through aggregators | carriers, car makers, utilities, exchanges that aggregators name |
| standard | >= 50% voluntary standards directories | OpenTelemetry, CAMARA, OIDF, RESO, FIDO, health networks |
| regulated | >= 50% regulator register or partner contract | MiCA, NYDFS, CDR, Open Finance Brasil, UK Open Banking |
| gravity | >= 40% partner-built | other companies invest to build on it |
| builds-on | >= 50% builds-on-platform | its integrations are apps it publishes on other platforms' stores |
| core | >= 35% provider-built | builds the connectors its customers need |
| long-tail | >= 60% iPaaS | the long tail, reached through Zapier, n8n, Make |
| list | >= 60% own-page claims | a long list on its own page, mostly unevidenced |
| mixed | none dominates | |
| undeclared | nothing declared | no number |

Position labels, `undeclared` included, are provisional on the same terms as the depth number: they
change only on a weekly release, and a provider can change its own label by declaring integrations (section 9).

## 6b. Three kinds of marketplace

Listings are never lumped together:

| Kind | Example | What it means |
|---|---|---|
| platform app store | AppExchange, Guidewire, Okta | a partner builds ON the platform: inbound depth |
| cloud marketplace | AWS, Azure | the provider SELLS through it: a distribution channel, not an integration |
| iPaaS connector | Zapier, Make, n8n, Workato | a bridge any two providers can meet on |

Distribution and bridges are reported beside position, never counted inside it.

A platform app store listing has two sides, and both read one way (2026-10-14). The platform's side is
`platform-app`, `partner-built`: someone built on it (gravity). The publisher's side is `platform-app`,
`third-party`: mode `builds-on-platform`, written by the developer-tools sweep and, for every other platform, by
`mirror-platform-listings.py` (one edge per publisher and platform, domain-linked listings only). It reads the
same evidence as the platform side but the base substance only: the store's certification vets the listing on
the platform's side and is not carried to the publisher. Store badges that vet the publisher (GitHub Verified
creator, Atlassian Cloud Fortified, JetBrains Verified vendor, VS Code Verified publisher) are recorded as a
separate `publisher_verified` signal with weight 0 until decided. An advertiser or publisher on Google's Ad Tech
Providers list (no adtech tag, no TCF registration) is out of market and takes no position; TCF and ATP
registrations are participation only, with no per-edge depth signal.

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
| object storage | providers' own S3 compatibility pages and operation matrices | fetched own docs, own contracts, structural detection (S3 operations and paths) |
| databases (PostgreSQL) | providers' own PostgreSQL compatibility pages and feature lists | fetched own docs, own contracts (a wire protocol: no structural detection) |
| streaming (Kafka) | providers' own Kafka protocol and feature tables | fetched own docs, own contracts; Kafka proxies reported as mediation |
| search (Elasticsearch / OpenSearch) | providers' own compatibility pages | fetched own docs, own contracts, structural detection (`_bulk`, `_cat`, `/_plugins/`) |
| container registries (OCI) | the OCI conformance register, providers' own OCI pages | register (PRODUCT.yaml + junit), fetched own docs, structural detection (`/v2/{name}/manifests`) |
| IoT / smart home | the standards body's certification ledger | CSA Distributed Compliance Ledger (Matter): vendor IDs and certified products, one signal per device type, never per model |
| US open banking | the standards body's own registry | FDX Registry (role, newest FDX version per participant). Not machine-readable: CFPB 1033 lists, Plaid/MX/Finicity/Yodlee institution lists (keys), Akoya |
| AI agent tools (frontier) | the protocol's own directory, providers' own MCP and agent-card surfaces | Official MCP Registry (verified reverse-DNS namespace = publisher domain), a2aregistry.org; gateways (Smithery, Composio, Glama, Zapier MCP, Pipedream) reported as mediation |
| construction | platform app stores, connector coverage lists | Procore App Marketplace, ServiceTitan, Bluebeam; Trimble App Xchange coverage |
| hospitality | PMS app stores, the channel manager's connectivity list | Mews, Apaleo, Hostaway, Guesty stores; SiteMinder partner list. Not machine-readable: Oracle OPERA/OHIP, Cloudbeds, Stayntouch, RateGain, D-EDGE, Lodgify |
| restaurants / POS | POS app stores, middleware coverage lists | Clover, Toast, Olo, 7shifts, SpotOn; Otter, Deliverect coverage |
| nonprofit / fundraising | donor-CRM marketplaces, giving platforms' integration pages | Blackbaud Marketplace (public listing API), GoFundMe Pro (Classy), Neon One; Givebutter, Bloomerang, Donorbox pages |
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
- Dispute any edge, or a position label, through the apis.io correction path: `report_correction` (free,
  no key) or `dispute_finding` on the MCP server, or the matching REST routes. Every edge cites its
  evidence, and a person works each request.

## 10. Open questions before any weight

- Calibration of the weights against expert reads of each market.
- Inbound vs outbound: reported beside the score, not folded in yet.
- Vote baselines: universal apps (Sheets, Gmail, Notion) dominate iPaaS pairing and need a lift baseline.
- Frontier metrics need at least four weekly snapshots before a trajectory is published.

## 12. Draft: Alignment, shape votes beside integration votes (2026-10-13)

Providers vote for each other in two ways: by integrating with each other, and by supporting the same API
design. Two votes:

| | Integration vote | Shape vote |
|---|---|---|
| What happens | A integrates with B | A re-serves B's contract (paths, vocabulary, schemas) |
| Says | B's workflow matters to my customers | B's design is how this capability should work |
| Who gains | B's depth (inbound) | B becomes a de facto standard; A becomes substitutable |

### What the two frontier markets show

| | Decision models | Model routing (chat completions) |
|---|---|---|
| Anchor shape | TypeSafe System One | OpenAI chat completions |
| Declared re-servers in their own contracts | 5 (Telnyx, LLM Gateway, Cloudflare, Ollama, Kev) | 123 |
| Same vocabulary, own path or names | Microsoft (`/systemone`, "similar to"), Upstage, Perplexity (`/decisions`), AWS Strands ("follows the docs") | not yet measured |
| Rival shape | OpenAI `/decisions` (predicate, refusal) | — |
| Who adopts | entrants and platforms alike, within a month | the long tail: hosts, neoclouds, gateways. Of the 12 makers every router carries, only DeepSeek declares OpenAI compatibility |
| Who translates | LLM Gateway serves both shapes | routers (OpenRouter, LiteLLM, Portkey, LLM Gateway, Cloudflare) adapt every maker's own shape |
| Calibration published | none | none |

Two different convergence patterns: **decision models converged by imitation** (adopters copy the anchor's
contract), **model routing converged by mediation** (the leading makers keep their own shapes and the routers
translate; adoption of the anchor shape is a long-tail strategy for being substitutable). Alignment has to
read both.

### Shape markets after seven readings (2026-10-13)

Five more markets were read as shape markets beside the two frontier ones. Counts are companies (one edge per
provider per shape, the best evidence kept; two repos of one company are one vote). Convergence is the share of the
cohort, minus the anchor's own family, mediators and rival shapes, that declares the shape.

| Market | Mode | Anchor shape | Adopters (companies) | Convergence | Pattern | Rival shapes |
|---|---|---|---|---|---|---|
| Object storage | bedrock | Amazon S3 API | 32 (34 repos) | 25 of 30, 83.3% | imitation | Azure Blob, GCS JSON API, OpenStack Swift |
| Databases | bedrock | PostgreSQL wire protocol and dialect | 19 (21 repos) | 19 of 24, 79.2% | imitation | MySQL wire (TiDB, SingleStore, Vitess, MySQL) |
| Streaming | bedrock | Apache Kafka wire protocol | 9 (10 repos) | 10 of 14, 71.4% | imitation, with mediation beside | Pulsar, AMQP (RabbitMQ), NATS, Kinesis, Pub/Sub |
| Search | frontier | Elasticsearch REST API and its OpenSearch fork | 7 (6 Elasticsearch, 3 OpenSearch) | 7 of 11, 63.6% | fork | Algolia, Typesense, Meilisearch, Vespa, Solr, Azure AI Search, CloudSearch |
| Container registries | bedrock | OCI Distribution Specification | 15 (6 in the conformance register) | 15 of 19, 78.9% | register | none |
| Decision models | frontier | TypeSafe System One | 5 declared | not measured | imitation | OpenAI `/decisions` |
| Model routing | frontier | OpenAI chat completions | 123 declared | not measured | mediation | each maker's own shape |

Four patterns: **imitation** (adopters copy the anchor's contract), **mediation** (proxies or routers sit in front
of the shape and translate; Kafka gateways and AI model routers), **fork** (two related shapes split from one
codebase, and re-servers name one or both), **register** (a de jure shape with a conformance programme whose results
are public). The leaders keep their own shapes and also re-serve the anchor (every hyperscaler serves Kafka and
PostgreSQL beside its own); the long tail adopts the anchor to be substitutable.

### The measure (provisional, unweighted)

1. **Graded `compatible` edges.** Each carries `shape`, `degree` and `evidence`. Degrees:

   | Degree | Meaning |
   |---|---|
   | `full` | the provider's own page says fully / 100% compatible and lists nothing unsupported |
   | `declared-subset` | the provider publishes what is and is not supported; the operation matrix is the per-edge signal |
   | `declared-unqualified` | the provider says "compatible" and publishes no list: a claim, not a matrix |
   | `interoperable-subset` | the provider says only some tools interoperate |
   | `same-vocabulary-own-path` | our structural detection: the contract carries the anchor's operations, the provider says nothing |
   | `same-concepts-own-names` | the anchor's concepts under the provider's own names (resemblance, recorded, never compatibility) |

   **A published operation matrix outranks a bare "full" claim.** In object storage every provider that publishes a
   matrix lists something unsupported; every "full" claim is a sentence with no matrix. A `declared-subset` with its
   supported share is the more trustworthy reading.
2. **Serve versus consume.** Only a provider SERVING the API itself counts. Backup targets, connectors, sinks,
   migration sources, "any S3-compatible storage" and clients that pull from a registry consume someone else's
   endpoint and are not adopters. In a contract, only the API's own description (info, tags, servers, or a path
   description that says the provider serves the shape) is a declaration; a field or parameter is not.
3. **Evidence ladder**, strongest first: **conformance register** (someone ran the anchor's own test suite against
   the implementation and published the result; the OCI conformance register is the only one that exists today) >
   **own docs** (the provider's page, fetched and saved with a hash) > **own contract** > **own blog** > **our
   structural detection** (marked ours). Page chrome is never evidence: our own fetch header and title or navigation
   lines are excluded for every shape. "Similar to" is resemblance, never compatibility.
4. **Mediation.** Proxies and routers in front of a shape (Kong Event Gateway, Gravitee, Conduktor and aklivity Zilla
   for Kafka; OpenRouter, LiteLLM, Portkey for model routing) are reported beside, never as adopters. Mediation is
   the second path to substitutability.
5. **Shape gravity (originators).** Who re-serves your contract and how faithfully, counted by company, reported
   beside depth. In databases the anchor project scores low on depth and has 19 companies re-serving it: gravity and
   depth measure different things and are never added.
6. **Convergence (per capability).** Share of the cohort on the shape, the rival shapes, and the pattern.

**Bedrock versus frontier shape markets.** A bedrock shape market has a settled anchor that most of the cohort
already serves (object storage, databases, streaming, container registries); it is read like any bedrock market,
with a shape section beside position. A frontier shape market is still forming (decision models, model routing,
search after the fork) and is read by movement in weekly dated snapshots.

**Report only.** `compatible` edges carry no weight. They are shown on the market page as a shape section and as
"declares compatibility" on a provider, and are excluded from depth, position and the own/covered declaration rate.
Nothing is weighted until it holds across at least four weekly snapshots.
