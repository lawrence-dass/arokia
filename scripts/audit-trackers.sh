#!/bin/bash
set -euo pipefail

FORBIDDEN_PKGS=(
  "firebase"
  "@react-native-firebase"
  "mixpanel"
  "mixpanel-react-native"
  "amplitude"
  "@amplitude"
  "react-native-google-analytics"
  "facebook-sdk"
)

FILES_TO_CHECK=("package.json" "package-lock.json")
[ -f "ios/Podfile" ] && FILES_TO_CHECK+=("ios/Podfile")
[ -f "android/build.gradle" ] && FILES_TO_CHECK+=("android/build.gradle")

FOUND=0
for pkg in "${FORBIDDEN_PKGS[@]}"; do
  for file in "${FILES_TO_CHECK[@]}"; do
    if grep -qF "$pkg" "$file" 2>/dev/null; then
      echo "FORBIDDEN TRACKER FOUND: '$pkg' in $file"
      FOUND=1
    fi
  done
done

if [ "$FOUND" -eq 1 ]; then
  echo "CI FAILED: Forbidden trackers detected (NFR-S5 violation)"
  exit 1
fi

echo "Tracker audit passed — no forbidden SDKs found."
