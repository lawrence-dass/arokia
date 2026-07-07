import Constants from 'expo-constants';

// App version strings ("major.minor.patch", matching app.json's `expo.version` exactly)
// that require every user to re-acknowledge the Opening Vow — including a user who has
// already acknowledged an earlier version, and one who updates straight past a flagged
// version to a later one. Add an entry whenever the Vow text changes meaningfully; leave
// empty otherwise. NOTE: this only fires on a native version bump (a new store release);
// it does not detect an EAS OTA update that changes `locales/ta.json` without bumping
// `expo.version` — see deferred-work.md.
export const VOW_REQUIRED_VERSIONS: string[] = [];

export function getCurrentAppVersion(): string {
  return Constants.expoConfig?.version ?? '1.0.0';
}

function compareVersions(a: string, b: string): number {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);
  const length = Math.max(partsA.length, partsB.length);
  for (let i = 0; i < length; i++) {
    const diff = (partsA[i] ?? 0) - (partsB[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

export function needsReVow(lastVowAppVersion: string, currentAppVersion: string): boolean {
  // An empty `lastVowAppVersion` means the vow was never acknowledged — that's a first-time
  // vow, not a re-vow, and is handled by the `vowAcknowledged` check wherever this is used.
  if (VOW_REQUIRED_VERSIONS.length === 0 || !lastVowAppVersion) return false;
  const latestRequiredVersion = VOW_REQUIRED_VERSIONS.reduce((latest, version) =>
    compareVersions(version, latest) > 0 ? version : latest
  );
  // The app must have actually reached the flagged version (guards against a user still on
  // an old build), and the user's last acknowledgment must predate it — this way a user who
  // updates straight past the flagged version (e.g. 1.0.0 -> 1.2.0 with only 1.1.0 flagged)
  // still gets re-prompted, rather than only users who happen to land on the exact version.
  return (
    compareVersions(currentAppVersion, latestRequiredVersion) >= 0 &&
    compareVersions(lastVowAppVersion, latestRequiredVersion) < 0
  );
}

export function isVowSatisfied(
  vowAcknowledged: boolean,
  lastVowAppVersion: string,
  currentAppVersion: string
): boolean {
  return vowAcknowledged && !needsReVow(lastVowAppVersion, currentAppVersion);
}
