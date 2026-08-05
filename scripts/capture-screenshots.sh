#!/usr/bin/env bash
# Capture all feature screenshots on booted iOS Simulator and scrub Expo FAB.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/docs/screenshots"
TMP="/tmp/ksalary-shots"
SCRUB_PY="${SCRUB_PY:-/tmp/ksalary-venv/bin/python}"
SCRIPT="$ROOT/scripts/scrub-expo-fab.py"
HOST="${EXPO_HOST:-127.0.0.1:8081}"

mkdir -p "$OUT" "$TMP"

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

# Tabs + stack screens
capture "01-calculator" "" 4
capture "03-settlement" "settlement" 3.5
capture "04-benefits-hub" "benefits" 3.5
capture "06-settings" "settings" 3.5
capture "05-maternity" "maternity" 3.5
capture "07-sick-leave" "sick-leave" 3.5
capture "08-severance" "severance" 3.5
capture "09-unemployment" "unemployment" 3.5
capture "10-retirement" "retirement" 3.5
capture "11-other-income" "other-income" 3.5
capture "12-comparison" "comparison" 3.5
capture "13-filing-wizard" "filing-wizard" 3.5

echo "Done. Files in $OUT:"
ls -la "$OUT"
