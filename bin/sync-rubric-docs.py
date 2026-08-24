#!/usr/bin/env python3
"""
Keep every Kin Score document aligned with the PUBLISHED rubric.

The rubric is the argument; the documents are how anyone else reads it. When they
drift, a reader cites a weight, a band cut or a dimension count that no longer
exists — which is the one failure a published, versioned rating system cannot
afford. This script makes the drift mechanical instead of remembered.

    python3 bin/sync-rubric-docs.py            # rewrite every generated block
    python3 bin/sync-rubric-docs.py --check    # report drift, exit 1 (for CI / release)
    python3 bin/sync-rubric-docs.py --diff     # --check, plus the unified diff

WHAT IS AUTHORITATIVE, AND WHY IT IS THE SNAPSHOT

Documents render from `rubric/scoring-<current>.yml` — the FROZEN published
snapshot in this repo — never from the working rubric in `api-search/signals`.
A document describes what the catalog was scored with, not what someone is
midway through building. Reading the live source would have this repo publishing
unreleased rubric changes as though they were current.

The live source is still read, for exactly one purpose: SOURCE DRIFT (check 3).
If `signals/_data/scoring.yml` differs semantically from the frozen snapshot
while carrying the SAME `schema_version`, then behaviour has changed under a
released version number and the next scoring pass will stamp scores with a
version that does not describe them. That has happened before — 0.11.0 shipped
inside an unrelated commit and nothing in the repo named it — and it is the
reason this check exists rather than the reason it does not.

THREE KINDS OF DRIFT

    1. block    a generated table no longer matches the rubric
    2. version  a document's declared rubric version is not the current one
    3. source   the working rubric changed without a version bump

Only 1 and 2 are fixable by this script. 3 is a release decision: bump
`schema_version`, freeze a snapshot, write the CHANGELOG entry, then re-run.

ADDING A DOCUMENT

Append to DOCUMENTS. Anything with `blocks` needs matching marker pairs in the
file:

    <!-- kin-score:bands:start -->
    ...generated, do not hand-edit...
    <!-- kin-score:bands:end -->

Markdown front matter uses a `rubric_version:` key instead of markers.
"""

import argparse
import difflib
import os
import re
import sys

try:
    import yaml
except ImportError:
    sys.exit("sync-rubric-docs: needs PyYAML (pip install pyyaml)")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RUBRIC_DIR = os.path.join(ROOT, "rubric")

# The working rubric. Read ONLY for the source-drift check — never to render a
# document. Override when the sibling checkout lives elsewhere.
SOURCE_RUBRIC = os.environ.get(
    "KIN_SCORE_SOURCE",
    os.path.normpath(os.path.join(ROOT, "..", "..", "api-search", "signals", "_data", "scoring.yml")),
)

# Papers live in a sibling repo. Documents there are still Kin Score documents:
# the paper IS the published methodology, and a stale table in it is cited.
PAPERS = os.environ.get("KIN_SCORE_PAPERS", os.path.normpath(os.path.join(ROOT, "..", "papers")))


# ---------------------------------------------------------------------------
# The prose the rubric does not carry.
#
# Every facet and dimension has a long description in scoring.yml written for a
# maintainer. A reader wants one line. Those lines live HERE, in one place, so
# both the canonical README and the paper render the same phrasing rather than
# drifting into two descriptions of one facet.
# ---------------------------------------------------------------------------
FACET_QUESTION = {
    "contract_quality": "Is there a machine-readable contract at all — in any format — and can you call it?",
    "developer_ergonomics": "Can a human get started — docs, portal, SDKs, auth clarity, a real description?",
    "commercial_clarity": "What does it cost, what are you permitted to do, and how do you get in?",
    "operational_transparency": "Will it tell you when it changes or breaks?",
    "governance": "Is anyone holding the contract itself to a standard?",
    "discoverability": "Can an agent find you *without being told where to look*?",
    "regulatory": "Does it publish the posture its regime demands?",
    "open_source": "Can a consumer depend on the repository — disclosure, contribution, releases?",
}

CONDITIONAL_WHEN = {
    "regulatory": "The provider's tags match one of **nine regulated regimes**",
    "open_source": "The product itself is open source *and* we hold a live repository read",
}

DIMENSION_QUESTION = {
    "spec_presence": "Is there an OpenAPI contract to drive at all?",
    "mcp_server": "Is there a live Model Context Protocol surface — *probed*, not pointed at?",
    "agentic_access": "Are operations classified by action-class, consequence and escalation?",
    "auth_clarity": "Can auth be negotiated without reading prose?",
    "idempotency": "Can an agent retry without double-charging a card?",
    "error_semantics": "Can an agent branch on errors, or only on free text?",
    "agent_card": "Is there an agent discovery manifest at the well-known path?",
    "openapi_examples": "Can an agent learn a payload shape before its first call?",
    "rate_limit_signal": "Does it surface live rate-limit state in response headers?",
    "reversibility_documented": "Can the action be taken back, and within what window?",
    "event_surface_described": "Is the webhook/event surface described by a contract?",
    "agent_skills": "Are operating instructions packaged, not inferred?",
    "well_known_catalog": "Is there an RFC 9727 `api-catalog` linkset?",
    "dry_run_mode": "Can a destructive operation be rehearsed before it commits?",
    "consent_identity": "AIPREF / Content-Signals / Web Bot Auth — the frontier signals.",
}


# ---------------------------------------------------------------------------
# Loading
# ---------------------------------------------------------------------------
def _version_key(v):
    return tuple(int(p) if p.isdigit() else 0 for p in str(v).split("."))


def published_snapshots():
    out = {}
    if not os.path.isdir(RUBRIC_DIR):
        return out
    for name in os.listdir(RUBRIC_DIR):
        m = re.fullmatch(r"scoring-(\d+(?:\.\d+)*)\.yml", name)
        if m:
            out[m.group(1)] = os.path.join(RUBRIC_DIR, name)
    return out


def load_current():
    """The newest frozen snapshot — what the catalog was actually scored with."""
    snaps = published_snapshots()
    if not snaps:
        sys.exit(f"sync-rubric-docs: no rubric snapshots in {RUBRIC_DIR}")
    version = max(snaps, key=_version_key)
    with open(snaps[version], encoding="utf-8") as fh:
        rubric = yaml.safe_load(fh)
    declared = str(rubric.get("schema_version", ""))
    if declared != version:
        sys.exit(
            f"sync-rubric-docs: {os.path.basename(snaps[version])} declares "
            f"schema_version {declared!r}; a snapshot must match its own filename"
        )
    return version, rubric, snaps[version]


def check_counts(rubric):
    """Checks per facet, keyed by facet id. Checks hang off artifacts, not facets."""
    counts = {}
    for art in (rubric.get("artifacts") or {}).values():
        for chk in art.get("checks") or []:
            f = chk.get("facet")
            if f:
                counts[f] = counts.get(f, 0) + 1
    return counts


# ---------------------------------------------------------------------------
# Block renderers. Each returns markdown for one marker pair.
# ---------------------------------------------------------------------------
def _num(x):
    """Render a rubric number without a trailing .0 nobody wrote."""
    f = float(x)
    return str(int(f)) if f == int(f) else str(f)


def block_facets(rubric, **_):
    counts = check_counts(rubric)
    base = [(k, v) for k, v in rubric["facets"].items() if not v.get("conditional")]
    rows = ["| Facet | Weight | Checks | The question it asks |",
            "|-------|:------:|:------:|----------------------|"]
    for fid, cfg in sorted(base, key=lambda kv: -float(kv[1]["weight"])):
        rows.append(
            f"| **{cfg['label']}** | {float(cfg['weight']):.2f} | {counts.get(fid, 0)} | "
            f"{FACET_QUESTION.get(fid, '')} |"
        )
    total = sum(counts.get(f, 0) for f, _ in base)
    rows.append("")
    rows.append(
        f"**{_spell(total)} base checks.** Plus "
        f"{sum(counts.get(f, 0) for f, c in rubric['facets'].items() if c.get('conditional'))} "
        f"more in the two conditional facets, for {rubric.get('checks_total', sum(counts.values()))} "
        f"in total."
    )
    return "\n".join(rows)


def block_conditional_facets(rubric, **_):
    counts = check_counts(rubric)
    cond = [(k, v) for k, v in rubric["facets"].items() if v.get("conditional")]
    rows = ["| Conditional facet | Weight | Checks | Applies when |",
            "|---|:---:|:---:|---|"]
    for fid, cfg in sorted(cond, key=lambda kv: -float(kv[1]["weight"])):
        rows.append(
            f"| **{cfg['label']}** | {float(cfg['weight']):.2f} | {counts.get(fid, 0)} | "
            f"{CONDITIONAL_WHEN.get(fid, '')} |"
        )
    return "\n".join(rows)


def block_bands(rubric, **_):
    rows = ["| Band | Composite | Share of catalog | What it means |",
            "|------|:---------:|:----------------:|---------------|"]
    for b in rubric["bands"]:
        summary = " ".join((b.get("description") or "").split())
        summary = summary.split(". ")[0].rstrip(".") + "."
        rows.append(f"| **{b['label']}** | {b['range']} | {b.get('share', '—')} | {summary} |")
    return "\n".join(rows)


def block_agent_dimensions(rubric, **_):
    dims = rubric["agent_readiness"]["dimensions"]
    rows = ["| Dimension | Points | What it asks |", "|---|:---:|---|"]
    for d in sorted(dims, key=lambda d: -int(d["points"])):
        rows.append(f"| **{d['label']}** | {d['points']} | {DIMENSION_QUESTION.get(d['id'], '')} |")
    rows.append("")
    rows.append(
        f"**{_spell(len(dims))} dimensions, {sum(int(d['points']) for d in dims)} points**, "
        f"normalised to 0–100."
    )
    return "\n".join(rows)


def block_agent_bands(rubric, **_):
    rows = ["| Band | Score | Share | Meaning |", "|---|:---:|:---:|---|"]
    for b in rubric["agent_readiness"]["bands"]:
        summary = " ".join((b.get("description") or "").split())
        summary = summary.split(". ")[0].rstrip(".") + "."
        rng = b.get("range") or (f"{_num(b['min'])}+" if b is rubric["agent_readiness"]["bands"][0] else _num(b["min"]))
        rows.append(f"| **{b['label']}** | {rng} | {b.get('share', '—')} | {summary} |")
    return "\n".join(rows)


def block_regime_means(rubric, **_):
    means = rubric.get("regime_means") or {}
    labels = {k: (v.get("label") or k) for k, v in (rubric.get("industry_regulatory") or {}).items()}
    named = sorted(
        ((labels.get(k, k), v) for k, v in means.items() if not k.startswith("_")),
        key=lambda kv: -float(kv[1]),
    )
    head = (
        f"Measured at rubric {means.get('_rubric', '?')} on {means.get('_measured_at', '?')}, "
        f"across {int(means.get('_n', 0)):,} regulated providers:"
    )
    half = (len(named) + 1) // 2
    rows = ["| Regime | Mean | | Regime | Mean |", "|---|---:|---|---|---:|"]
    for i in range(half):
        left = f"| {named[i][0]} | {_num(named[i][1])} |"
        j = i + half
        right = f" | {named[j][0]} | {_num(named[j][1])} |" if j < len(named) else " | | |"
        rows.append(left + right)
    rows.append(f"| *All regulated* | *{_num(means.get('_default', 0))}* | | | |")
    return head + "\n\n" + "\n".join(rows)


def block_version(rubric, version=None, **_):
    return f"Current: **{version}** — published {rubric.get('last_updated', '?')}."


def _spell(n):
    words = {4: "Four", 6: "Six", 8: "Eight", 9: "Nine", 14: "Fourteen", 15: "Fifteen",
             88: "Eighty-eight", 110: "One hundred and ten"}
    return words.get(n, str(n))


BLOCKS = {
    "facets": block_facets,
    "conditional-facets": block_conditional_facets,
    "bands": block_bands,
    "agent-dimensions": block_agent_dimensions,
    "agent-bands": block_agent_bands,
    "regime-means": block_regime_means,
    "version": block_version,
}


# ---------------------------------------------------------------------------
# The documents that carry rubric-derived content.
# ---------------------------------------------------------------------------
DOCUMENTS = [
    {
        "path": os.path.join(ROOT, "README.md"),
        "label": "kin-score/README.md",
        "blocks": ["facets", "conditional-facets", "regime-means", "bands",
                   "agent-dimensions", "agent-bands", "version"],
    },
    {
        "path": os.path.join(PAPERS, "the-api-rating-rubric-explained", "README.md"),
        "label": "papers/the-api-rating-rubric-explained/README.md",
        "blocks": ["facets", "conditional-facets", "regime-means", "bands",
                   "agent-dimensions", "agent-bands"],
        "version_in": "prose",
        "optional": True,
    },
    {
        "path": os.path.join(PAPERS, "_papers", "the-api-rating-rubric-explained.md"),
        "label": "papers/_papers/the-api-rating-rubric-explained.md",
        "blocks": [],
        "version_in": "frontmatter",
        "optional": True,
    },
]


MARKER = "<!-- kin-score:{name}:{edge} -->"


MARKER_ANY = re.compile(r"<!-- kin-score:([a-z-]+):start -->")


def apply_blocks(text, rubric, version, blocks, label, problems):
    # A marker pair nobody renders stays silently empty, which reads to a
    # maintainer as "the rubric says nothing here". Catch it as drift.
    for found in sorted(set(MARKER_ANY.findall(text))):
        if found not in blocks:
            problems.append((
                "block", label,
                f"file has a `{found}` marker pair that this document is not registered to "
                f"render — add it to DOCUMENTS[...]['blocks'] or remove the markers"
                + ("" if found in BLOCKS else f"; `{found}` is also not a known block"),
            ))
    for name in blocks:
        start, end = MARKER.format(name=name, edge="start"), MARKER.format(name=name, edge="end")
        if start not in text or end not in text:
            problems.append(("block", label, f"missing marker pair for `{name}`"))
            continue
        head, _, rest = text.partition(start)
        _, _, tail = rest.partition(end)
        body = BLOCKS[name](rubric, version=version)
        text = f"{head}{start}\n{body}\n{end}{tail}"
    return text


VERSION_PROSE = re.compile(r"(Kin Score rubric )\d+(?:\.\d+)*")
VERSION_FM = re.compile(r'^(rubric_version:\s*)["\']?\d+(?:\.\d+)*["\']?\s*$', re.M)


def apply_version(text, version, where, label, problems):
    if where == "prose":
        if not VERSION_PROSE.search(text):
            problems.append(("version", label, "no `Kin Score rubric <version>` stamp found"))
            return text
        return VERSION_PROSE.sub(rf"\g<1>{version}", text)
    if where == "frontmatter":
        if not VERSION_FM.search(text):
            problems.append(("version", label, "no `rubric_version:` key in front matter"))
            return text
        return VERSION_FM.sub(rf'\g<1>"{version}"', text)
    return text


def source_drift(version, rubric):
    """Has the working rubric changed without a version bump?"""
    if not os.path.isfile(SOURCE_RUBRIC):
        return None
    with open(SOURCE_RUBRIC, encoding="utf-8") as fh:
        live = yaml.safe_load(fh)
    live_version = str(live.get("schema_version", ""))
    if live_version != version:
        return (
            f"working rubric is {live_version}, newest published snapshot is {version} — "
            f"freeze `rubric/scoring-{live_version}.yml` and write the CHANGELOG entry"
        )
    if live != rubric:
        changed = sorted(k for k in set(live) | set(rubric) if live.get(k) != rubric.get(k))
        return (
            f"working rubric differs from the frozen {version} snapshot but still declares "
            f"{version} — behaviour changed under a released version number "
            f"(sections: {', '.join(changed)}). Bump `schema_version`, freeze a snapshot, "
            f"and record it in CHANGELOG.md + ROADMAP.md before the next scoring pass"
        )
    return None


def main():
    ap = argparse.ArgumentParser(description="Align Kin Score documents with the published rubric.")
    ap.add_argument("--check", action="store_true", help="report drift without writing; exit 1 if any")
    ap.add_argument("--diff", action="store_true", help="like --check, and print the diff")
    args = ap.parse_args()
    dry = args.check or args.diff

    version, rubric, snap = load_current()
    print(f"rubric {version}  ({os.path.relpath(snap, ROOT)})")

    problems, written = [], []
    for doc in DOCUMENTS:
        if not os.path.isfile(doc["path"]):
            if not doc.get("optional"):
                problems.append(("block", doc["label"], "file not found"))
            else:
                print(f"  skip  {doc['label']} (not checked out)")
            continue
        with open(doc["path"], encoding="utf-8") as fh:
            before = fh.read()
        after = apply_blocks(before, rubric, version, doc["blocks"], doc["label"], problems)
        if doc.get("version_in"):
            after = apply_version(after, version, doc["version_in"], doc["label"], problems)
        if after == before:
            print(f"  ok    {doc['label']}")
            continue
        if dry:
            problems.append(("block", doc["label"], "generated content is stale"))
            if args.diff:
                sys.stdout.writelines(
                    difflib.unified_diff(before.splitlines(True), after.splitlines(True),
                                         f"a/{doc['label']}", f"b/{doc['label']}")
                )
        else:
            with open(doc["path"], "w", encoding="utf-8") as fh:
                fh.write(after)
            written.append(doc["label"])
            print(f"  wrote {doc['label']}")

    drift = source_drift(version, rubric)
    if drift:
        problems.append(("source", "api-search/signals/_data/scoring.yml", drift))

    print()
    if problems:
        for kind, label, msg in problems:
            print(f"  {kind:8s} {label}\n           {msg}")
        print()
        fixable = [p for p in problems if p[0] != "source"]
        if dry and fixable:
            print("  run without --check to rewrite the generated blocks")
        if any(p[0] == "source" for p in problems):
            print("  source drift is a RELEASE decision — this script will not bump a version")
        return 1
    print("  aligned" + (f" ({len(written)} rewritten)" if written else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
