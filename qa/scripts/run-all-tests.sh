#!/usr/bin/env bash
# run-all-tests.sh
#
# Runs all three QA layers sequentially, writes JUnit XMLs to results/junit/,
# then aggregates into results/summary.json.
#
# Usage:
#   cd qa && bash scripts/run-all-tests.sh
#
# Optional env vars:
#   SKIP_E2E=true        — skip Playwright (e.g. in CI without display)
#   SKIP_UPLOAD=true     — skip Supabase upload step

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
QA_DIR="$(dirname "$SCRIPT_DIR")"
REPO_ROOT="$(dirname "$QA_DIR")"

mkdir -p "$QA_DIR/results/junit"

echo ""
echo "=================================================="
echo "  Ascendly QA — Full Test Suite"
echo "=================================================="

# ── Layer 1: Backend API tests (pytest) ───────────────────────────────────────
echo ""
echo "[ Layer 1 ] Backend API Tests (pytest)"
echo "--------------------------------------------------"
cd "$QA_DIR/api-tests"

# Ensure we can import the backend package
export PYTHONPATH="$REPO_ROOT/backend:${PYTHONPATH:-}"

python -m pytest \
  --tb=short \
  --junitxml="$QA_DIR/results/junit/pytest-results.xml" \
  -q \
  . || true   # don't exit — collect all results

echo ""

# ── Layer 2: Frontend Component Tests (Vitest) ───────────────────────────────
echo "[ Layer 2 ] Frontend Component Tests (Vitest)"
echo "--------------------------------------------------"
cd "$QA_DIR"

if [ ! -d "node_modules" ]; then
  echo "  Installing QA Node dependencies…"
  npm install --silent
fi

npm run test:components -- --reporter=verbose --reporter=junit 2>&1 || true

echo ""

# ── Layer 3: E2E Tests (Playwright) ──────────────────────────────────────────
if [ "${SKIP_E2E:-false}" = "true" ]; then
  echo "[ Layer 3 ] E2E Tests — SKIPPED (SKIP_E2E=true)"
  # Write empty JUnit so aggregate-results.js doesn't fail
  cat > "$QA_DIR/results/junit/e2e-results.xml" << 'XML'
<?xml version="1.0" encoding="UTF-8"?>
<testsuites tests="0" failures="0" errors="0" skipped="0" time="0"/>
XML
else
  echo "[ Layer 3 ] E2E Tests (Playwright)"
  echo "--------------------------------------------------"
  cd "$QA_DIR"

  # Install browsers if needed (CI)
  if [ "${CI:-false}" = "true" ]; then
    npx playwright install --with-deps chromium 2>/dev/null || true
  fi

  npx playwright test --reporter=list,junit 2>&1 || true
fi

echo ""

# ── Aggregate results ─────────────────────────────────────────────────────────
echo "[ Aggregate ] Merging JUnit results → summary.json"
echo "--------------------------------------------------"
cd "$QA_DIR"
node scripts/aggregate-results.js

# ── Upload to Supabase Storage ────────────────────────────────────────────────
if [ "${SKIP_UPLOAD:-false}" != "true" ]; then
  echo ""
  echo "[ Upload ] Pushing summary.json to Supabase Storage"
  node scripts/upload-summary.js || true
fi

echo ""
echo "=================================================="
echo "  Done. Open http://localhost:5174 for dashboard."
echo "  Or: open http://localhost:5173/qa-status"
echo "=================================================="
