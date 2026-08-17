#!/usr/bin/env bash
#
# Publish the Kin Score cards to the shared image bucket.
#
# Target matches the convention already used for per-provider generated images
# (shared/apis-json/icons/<slug>.png, written by screenshots/backfill-icons.py),
# so there is one bucket and one habit for anything generated per provider.
#
#   ./upload-cards.sh            # sync changed cards
#   ./upload-cards.sh --dry-run  # show what would change, upload nothing
#
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="${CARDS_DIR:-$HERE/dist/cards}"
BUCKET="${CARDS_BUCKET:-kinlane-images}"
PREFIX="${CARDS_PREFIX:-shared/kin-score/cards}"

DRY=""
[[ "${1:-}" == "--dry-run" ]] && DRY="--dryrun"

[[ -d "$SRC" ]] || { echo "no cards at $SRC — run build-cards.mjs first" >&2; exit 1; }

count=$(find "$SRC" -name '*.png' | wc -l | tr -d ' ')
echo "syncing $count cards from $SRC -> s3://$BUCKET/$PREFIX/"

# --size-only would miss a re-render that lands on the same byte count; the
# manifest already decided what changed, so let mtime drive it and let S3 skip
# the rest. Cards are immutable at their URL, so cache hard: a rescore rewrites
# the object in place rather than minting a new path (see README).
#
# NO --acl public-read. The bucket is BucketOwnerEnforced, so ACLs are disabled
# and that flag fails the whole sync with AccessControlListNotSupported. Public
# read comes from the bucket policy (PublicReadGetObject on kinlane-images/*),
# which already covers this prefix.
aws s3 sync "$SRC" "s3://$BUCKET/$PREFIX/" \
  $DRY \
  --exclude '*' --include '*.png' \
  --content-type 'image/png' \
  --cache-control 'public, max-age=86400' \
  --only-show-errors

if [[ -z "$DRY" ]]; then
  echo "done — https://$BUCKET.s3.amazonaws.com/$PREFIX/<slug>.png"
fi
