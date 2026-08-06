#!/usr/bin/env bash
# Capture feature screenshots on booted iOS Simulator and scrub Expo FAB.
# Note: deep links open empty forms. Prefer capturing after manual/automated
# "Tính" so README shows results (see docs/screenshots/README.md).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/docs/screenshots"
TMP="/tmp/ksalary-shots"
SCRUB_PY="${SCRUB_PY:-/tmp/ksalary-venv/bin/python}"
SCRIPT="$ROOT/scripts/scrub-expo-fab.py"
HOST="${EXPO_HOST:-127.0.0.1:8081}"

mkdir -p "$OUT" "$TMP"

if [[ ! -x "$SCRUB_PY" ]]; then
  echo "Creating Pillow venv at /tmp/ksalary-venv …"
  python3 -m venv /tmp/ksalary-venv
  /tmp/ksalary-venv/bin/pip install -q pillow
  SCRUB_PY=/tmp/ksalary-venv/bin/python
fi

open_route() {
  local route="${1:-}"
  if [[ -z "$route" || "$route" == "/" ]]; then
    xcrun simctl openurl booted "exp://${HOST}/--/"
  else
    xcrun simctl openurl booted "exp://${HOST}/--/${route}"
  fi
}

capture() {
  local name="$1"
  local route="$2"
  local wait_s="${3:-3.5}"
  echo "==> $name (route=$route)"
  open_route "$route"
  sleep "$wait_s"
  local raw="$TMP/${name}-raw.png"
  xcrun simctl io booted screenshot "$raw"
  "$SCRUB_PY" "$SCRIPT" "$raw" "$OUT/${name}.png"
}

# Core story routes (empty until user calculates - replace with result shots for README)
capture "01-calculator-net" "" 4
capture "03-offer-compare" "offer-compare" 3.5
capture "04-settlement-refund" "settlement" 3.5
capture "05-multi-source" "multi-source" 3.5
capture "06-benefits-hub" "benefits" 3.5
capture "07-maternity" "maternity" 3.5
capture "08-other-income" "other-income" 3.5
capture "09-settings" "settings" 3.5

echo "Done. Files in $OUT:"
ls -la "$OUT"/*.png
echo
echo "Tip: for README, re-shoot after tapping Tính / So sánh / Ước quyết toán so heroes show Net / Δ / hoàn."
