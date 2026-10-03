#!/bin/bash
# Copy the presentation from the working site folder into public/ (what the Worker serves and GitHub holds).
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
src="$here/../site"
rm -rf "$here/public"; mkdir -p "$here/public"
cp "$src/index.html" "$src/player.css" "$src/player.js" "$src/timeline.js" "$src/sources.js" "$src/og.png" "$here/public/"
mkdir -p "$here/public/deck/data" "$here/public/deck/fonts"
cp "$src"/deck/*.html "$src"/deck/*.js "$src"/deck/*.css "$here/public/deck/"
cp "$src"/deck/data/*.js "$here/public/deck/data/"
cp "$src"/deck/fonts/*.woff2 "$here/public/deck/fonts/"
echo "synced $(find "$here/public" -type f | wc -l | tr -d ' ') files"
