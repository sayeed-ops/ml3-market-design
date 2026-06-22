#!/usr/bin/env bash
# Sync the ML3 design from the ml3-ui working copy into this publish repo and push.
# Usage:  ./sync.sh ["optional commit message"]
set -euo pipefail

# Source: the design-mockups dir in the ml3-ui repo.
SRC="/Users/sayeed/Ai projects/ml3-ui/design-mockups"
# Destination: this repo (the directory this script lives in).
DST="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

for d in market-ml3 system-ml3; do
  if [ ! -d "$SRC/$d" ]; then
    echo "✗ Source folder missing: $SRC/$d" >&2
    exit 1
  fi
done

echo "→ Syncing market-ml3 + system-ml3 from:"
echo "    $SRC"
echo "  into:"
echo "    $DST"

# Mirror only the two design folders (--delete removes files deleted upstream).
# Root files (index.html, README.md, .nojekyll, sync.sh, .git) are left untouched.
rsync -a --delete --exclude '.DS_Store' "$SRC/market-ml3/"  "$DST/market-ml3/"
rsync -a --delete --exclude '.DS_Store' "$SRC/system-ml3/"  "$DST/system-ml3/"

cd "$DST"
if git diff --quiet && git diff --cached --quiet; then
  echo "✓ No changes — site already up to date. Nothing to push."
  exit 0
fi

git add -A
MSG="${1:-Update ML3 mockup ($(date '+%Y-%m-%d %H:%M'))}"
git commit -q -m "$MSG"
git push -q origin main
echo "✓ Pushed. GitHub Pages will rebuild in ~30–60s:"
echo "  https://sayeed-ops.github.io/ml3-market-design/"
