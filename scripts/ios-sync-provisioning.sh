#!/usr/bin/env bash
# After a bundle-id rename, Expo may skip -allowProvisioningUpdates when
# DEVELOPMENT_TEAM is already baked into the pbxproj. This helper builds for a
# connected device (or generic iOS) with that flag so Xcode can mint the profile.
#
# Usage:
#   npm run ios:sync-signing
#   npm run ios:sync-signing -- Release
# Optional: DEVICE_UDID=... npm run ios:sync-signing
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/ios"
TEAM="${DEVELOPMENT_TEAM:-7HG9BF8LGF}"
CONFIG="${1:-Debug}"

DEST="generic/platform=iOS"
if [[ -n "${DEVICE_UDID:-}" ]]; then
  DEST="id=${DEVICE_UDID}"
fi

echo "› Syncing provisioning for team $TEAM ($CONFIG, destination $DEST)…"
echo "› Sign in to Xcode with your Apple ID if prompted."

xcodebuild \
  -workspace KSalaryInsights.xcworkspace \
  -scheme KSalaryInsights \
  -configuration "$CONFIG" \
  -destination "$DEST" \
  -allowProvisioningUpdates \
  -allowProvisioningDeviceRegistration \
  DEVELOPMENT_TEAM="$TEAM" \
  build

echo "› Done. Next: npx expo run:ios --device"
