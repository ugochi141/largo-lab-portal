#!/bin/bash
set -euo pipefail

printf "\n🚀 Building Largo Lab Portal (React + Vite)\n"

if ! command -v npm >/dev/null 2>&1; then
  echo "❌ npm is required. Install Node.js 18+ before deploying." >&2
  exit 1
fi

npm install
npm run build

if ! command -v gh-pages >/dev/null 2>&1; then
  npx gh-pages -d dist
else
  gh-pages -d dist
fi

printf "\n✅ Deployment complete. Ensure GitHub Pages is configured to use the gh-pages branch.\n"
