import Constants from 'expo-constants';

// App version strings that require every user to re-acknowledge the Opening Vow, even if
// they already acknowledged an earlier version. Add the exact `app.json` `expo.version`
// string here whenever the Vow text changes meaningfully — leave empty otherwise.
export const VOW_REQUIRED_VERSIONS: string[] = [];

export function getCurrentAppVersion(): string {
  return Constants.expoConfig?.version ?? '1.0.0';
}

export function needsReVow(lastVowAppVersion: string, currentAppVersion: string): boolean {
  return (
    VOW_REQUIRED_VERSIONS.includes(currentAppVersion) && lastVowAppVersion !== currentAppVersion
  );
}

export function isVowSatisfied(
  vowAcknowledged: boolean,
  lastVowAppVersion: string,
  currentAppVersion: string
): boolean {
  return vowAcknowledged && !needsReVow(lastVowAppVersion, currentAppVersion);
}
