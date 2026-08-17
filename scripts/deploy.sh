#!/usr/bin/env bash
#
# One-command publish for jotaros.github.io.
#
# Builds the static export and mirrors it into the GitHub Pages user-site repo
# (JotaroS.github.io), then commits and pushes so the live site updates.
#
# Usage:
#   npm run deploy                 # build + publish with a timestamped message
#   npm run deploy -- "my message" # build + publish with a custom commit message
#
# The Pages repo location can be overridden:
#   PAGES_REPO=/path/to/JotaroS.github.io npm run deploy
#
set -euo pipefail

# Resolve the project root (this script lives in <root>/scripts).
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Pages repo: default to the sibling checkout, allow override via env.
PAGES_REPO="${PAGES_REPO:-"$ROOT/../JotaroS.github.io"}"

if [ ! -d "$PAGES_REPO/.git" ]; then
  echo "error: Pages repo not found at: $PAGES_REPO" >&2
  echo "       Clone it next to this project or set PAGES_REPO=/path/to/JotaroS.github.io" >&2
  exit 1
fi
PAGES_REPO="$(cd "$PAGES_REPO" && pwd)"

COMMIT_MSG="${1:-"update webpage ($(date '+%Y-%m-%d %H:%M'))"}"

echo "==> Building static export"
cd "$ROOT"
npm run build

echo "==> Publishing out/ -> $PAGES_REPO"
# Mirror the build output. Preserve the Pages repo's .git and .nojekyll
# (the latter tells GitHub Pages to serve the _next/ folder verbatim).
rsync -a --delete \
  --exclude '.git' \
  --exclude '.nojekyll' \
  --exclude '.DS_Store' \
  "$ROOT/out/" "$PAGES_REPO/"

# Guarantee .nojekyll exists so hashed _next asset paths are served.
touch "$PAGES_REPO/.nojekyll"

cd "$PAGES_REPO"
git add -A
if git diff --cached --quiet; then
  echo "==> No changes to publish (site already up to date)."
  exit 0
fi

git commit -q -m "$COMMIT_MSG"
git push origin HEAD
echo "==> Published. https://jotaros.github.io will update shortly."
