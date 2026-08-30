# Proposal 0.18.0 — parsed evidence for `developer_ergonomics`

**Status: proposed, not implemented.** Nothing in `scoring.yml` or `score.rb` changes with this
document. 0.17.0 has been scored and its bands re-fitted; this is the next version's subject.

**Tracks roadmap#13** ("Xquik reached #1 by working the rubric").

## The finding this rests on

0.16.0 tried a declaration ceiling — *no facet reaches 100 unless a check that parsed a document
contributed* — and it either capped everyone or capped nobody. The reason was recorded and is the
real problem: **seven of eight facets have no parsed checks at all.** Only `contract_quality` has
any, 23 of 40.

`developer_ergonomics` is the sharpest case, and the one worth fixing first.

| | |
|---|---|
| checks | 13 |
| points | 42 |
| parsed checks | **0** |
| every rule | `common[].type includes "<X>"` |

The facet awards 42 points for listing thirteen *kinds of link*: a portal, docs, an API reference,
a getting-started, an authentication page, SDKs, a CLI, a console, a Postman collection, an agent
skill, a support channel, a blog. None of them is opened.

The consequence, at 0.17.0:

| provider | composite | `developer_ergonomics` |
|---|---:|---:|
| `xquik-api` | 90.4 (catalog max) | **100.0** |
| `shopify` | 84.0 | **100.0** |
| `stripe` | 80.6 | below 100 |
| `twilio` | 72.3 | below 100 |

**A facet where the provider that hard-optimized the rubric and the largest platform in the catalog
are exactly tied is not measuring developer ergonomics.** It is measuring whether someone filled in
thirteen rows, which is an afternoon's work and is precisely the activity roadmap#13 was opened
about.

## What parsed evidence is actually available

Sampled over 300 randomly-selected providers holding a parseable contract of 5+ operations
(`ergo_sample.py`, seed 13). Every signal below is read from the OpenAPI the catalog already parses
— `openapi_operations`, `operation_params` and `example_coverage` exist in `score.rb` today, so
this needs no new capability.

| signal | mean | median | at 100% | at 0% | verdict |
|---|---:|---:|---:|---:|---|
| operation has summary/description | 97.7% | 100.0% | 92.3% | 0.7% | **saturated — reject** |
| operation has tags | 100.0% | 100.0% | 100.0% | 0.0% | **saturated, and ours — reject** |
| operation has operationId | 87.0% | 100.0% | 83.7% | 9.3% | weak |
| **parameters documented** | 44.4% | 33.3% | 18.8% | 19.1% | **varies — use** |
| **response examples** | 14.4% | 0.0% | 6.0% | 75.7% | **varies — use** |
| **error responses documented** | 62.7% | 89.3% | 42.0% | 18.0% | **varies — use** |
| response schemas present | 78.8% | 95.9% | 44.0% | 7.3% | usable, weaker |

### Reject `tags` specifically, and for a reason worth writing down

`tags` reads 100.0% on every provider sampled, and **the reason is our own pipeline.**
`refine-openapis` splits a contract into one file per tag, so every operation in a split file has a
tag by construction. Checked against the harvest archive:

| provider | `_original` tagged | after our split |
|---|---:|---:|
| `litellm` | **0.0%** | 100.0% |
| `gp-connect` | **0.0%** | 100.0% |
| `fivetran` | **0.0%** | 100.0% |
| `typesense` | 100.0% | 100.0% |

Three providers publish contracts with no tags at all and would have scored full marks for tagging.
That is the same defect class as 0.16.0's `llms_txt_published` — **a check satisfied by a file
property the catalog itself created** — and it is worth recording that it was caught before it
shipped rather than after.

## The proposal

Add three PARSED checks to `developer_ergonomics`, each graded on coverage rather than presence,
each `na_unless` the provider has a parseable contract (so a provider with no OpenAPI is not
penalised for a document type it does not ship — the existing N/A convention):

| id | reads | why it is ergonomics and not contract quality |
|---|---|---|
| `params_documented` | share of parameters carrying a `description` | a developer cannot call an endpoint whose parameters are unexplained |
| `response_examples` | share of operations with a response example | the single thing most consulted when integrating |
| `error_responses_documented` | share of operations declaring a 4xx/5xx | error handling is where integrations actually break |

**Points are not proposed here.** Adding points changes the facet denominator and moves every
score in the catalog; the size of that move should be modelled against the scored corpus, not
guessed in a proposal.

## What this predicts, and the honest caveat

`params_documented` is **the first signal found that ranks the platform above the optimizer**:

| provider | params documented | response examples | errors documented |
|---|---:|---:|---:|
| `xquik-api` | **32.2%** | 100.0% | 100.0% |
| `shopify` | **99.7%** | 0.0% | 0.4% |
| `stripe` | 63.3% | 0.0% | 0.0% |
| `twilio` | 86.4% | 0.0% | 5.8% |
| `brevo` | 94.2% | 0.0% | 100.0% |

That is what roadmap#13 has been asking for since 2026-08-03 — a measure on which working the
rubric is not enough.

**But the other two columns are not obviously about the provider.** Stripe publishes examples in
its real documentation, and the contract we hold shows 0%. Before these become scored checks
somebody has to establish whether a 0% is the provider's contract or our harvest of it — the
archive agrees with the split for all five providers above, so it is not the splitter, but "the
archive is thin" and "the provider is thin" are different findings and this measurement cannot yet
tell them apart. That question is roadmap#35, and **`response_examples` should not ship before it is
answered**, or the check measures our coverage and calls it their ergonomics.

`params_documented` does not have that problem: a description either is in the document we hold or
is not, and no harvest step adds one.

## Sequencing

Ship after tonight's 0.17.0 deploy, not with it. This changes a facet denominator, so it requires
its own scoring pass and its own band re-fit, and 0.17.0's bands were fitted today against a
distribution this would move.
