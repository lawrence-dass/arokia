# Story 2.1: Opening Vow — First-Launch Gate

Status: review

## Story

As a first-time user,
I want to read and acknowledge the Opening Vow before any content is accessible,
So that I understand from the first moment that Arokia is a tool pointing to Jesus, not a replacement for Him.

## Acceptance Criteria

1. **Given** a user opens Arokia for the first time
   **When** the app loads
   **Then** the Opening Vow screen is the first screen shown — no content, home screen, or navigation is accessible until the Vow is acknowledged (FR1)

2. **Given** the Opening Vow screen is displayed
   **When** the user reads it
   **Then** the screen displays the verbatim Tamil vow text (from `ta.json` `vow` namespace), the acknowledgment button (ஆமென் — தொடங்கு), and no other navigation options

3. **Given** the user taps the acknowledgment button
   **When** the tap registers
   **Then** `vow_completed` analytics event is logged via `lib/analytics.ts:logEvent()`; the user is navigated to the home screen; the vow state is persisted in AsyncStorage so it does not reappear on subsequent launches

4. **Given** the user has NOT tapped the acknowledgment button
   **When** they attempt to navigate away (back gesture, deep link)
   **Then** navigation is blocked — the Vow screen remains; the app does not reveal content (FR2)

5. **Given** the Opening Vow screen
   **When** measured against accessibility standards
   **Then** the acknowledgment button has a minimum 48×48 dp touch target (NFR-A1); text meets WCAG AA contrast (NFR-A3); all strings are from `ta.json` with no hardcoded text (NFR-I1)

## Tasks / Subtasks

- [x] **Install AsyncStorage** (AC: 3)
  - [x] `npx expo install @react-native-async-storage/async-storage` — could not reach the Expo compatibility API from this cloud session; installed `@react-native-async-storage/async-storage@2.2.0` directly via `npm install` (the version Expo SDK 54 bundles, confirmed via SDK 54 changelog)
  - [x] Verify `npx tsc --noEmit` still passes after install

- [x] **Persist `prefsStore` with zustand persist middleware** (AC: 1, 3)
  - [x] Wrap the existing `store/prefsStore.ts` creator with `persist(...)` from `zustand/middleware` using `createJSONStorage(() => AsyncStorage)`, storage key `arokia-prefs`
  - [x] Keep the existing state shape and actions EXACTLY as-is (`playbackSpeed`, `vowAcknowledged`, `lastVowAppVersion`, `setPlaybackSpeed`, `acknowledgeVow`, `resetVow`) — Story 2.2 handles vow versioning; do not add `VOW_VERSION` logic here
  - [x] Add a `_hasHydrated: boolean` flag + `setHasHydrated` action set via the persist `onRehydrateStorage` callback so components can reactively wait for hydration (do NOT persist `_hasHydrated` — use `partialize` to exclude it)

- [x] **Create `OpeningVow` component** (AC: 2, 5)
  - [x] Create `components/onboarding/OpeningVow.tsx` (new feature directory — architecture-designated home for this component)
  - [x] Create `components/onboarding/index.ts` barrel exporting `OpeningVow`
  - [x] Render `t('vow.title')`, `t('vow.body')`, and a CTA button with `t('vow.cta')` — zero hardcoded strings
  - [x] Component accepts an `onAcknowledge: () => void` prop; it does NOT touch the store or router itself (keeps it testable and dumb)
  - [x] CTA: NativeWind classes only, `bg-primary` golden, dark text token for AA contrast, `min-h-12` + adequate horizontal padding for ≥48×48 dp target, `accessibilityRole="button"`
  - [x] Screen background `bg-background` (warm cream), body text `text-text-primary`
  - [x] Use `className` exclusively — no `StyleSheet.create()`

- [x] **Create `/vow` route and gate navigation with Expo Router Protected routes** (AC: 1, 3, 4)
  - [x] Create `app/vow.tsx` — thin screen wrapper: renders `<OpeningVow onAcknowledge={...} />` inside a `SafeScreen`-style container; the handler calls `acknowledgeVow(<app version>)` (use `expo-constants` `Constants.expoConfig?.version ?? '1.0.0'`), then `logEvent('vow_completed')`
  - [x] In `app/_layout.tsx`, restructure the `<Stack>` using `Stack.Protected` guards (Expo Router v6 supports these):
    - `<Stack.Protected guard={!vowAcknowledged}>` → contains `vow` screen
    - `<Stack.Protected guard={vowAcknowledged}>` → contains `index`, `spikes` (and all future content screens)
  - [x] Guard values must come from `usePrefsStore` reactively — when `acknowledgeVow` fires, the guard flips and Expo Router automatically navigates to the newly available `index` screen; no manual `router.replace` needed (verify this behavior; if the auto-redirect does not fire, fall back to `router.replace('/')` after acknowledging) — **implemented per the documented (no-manual-redirect) pattern; auto-navigation itself is unverified, see Dev Agent Record**
  - [ ] Protected guards also block deep links into guarded routes (FR2) — verify by opening a deep link to `/` before acknowledging — **pending desktop verification, needs simulator/device**
  - [x] Do NOT render the Stack until `_hasHydrated` is true — return `null` (or keep the splash screen visible) while hydrating, so an already-acknowledged user never sees a vow flash, and a new user never sees home flash

- [x] **Analytics event** (AC: 3)
  - [x] Call the existing `logEvent('vow_completed')` from `@/lib/analytics` — this is currently a console stub; do NOT implement the Supabase insert in this story (tracked as deferred work; requires `expo-secure-store` install-id which is out of scope here)

- [x] **Verification** (AC: all)
  - [x] `npm run format` after all file writes
  - [x] `npx tsc --noEmit` — 0 errors
  - [x] `npm run lint` — 0 new warnings (1 pre-existing in `lib/i18n.ts` is known)
  - [ ] Simulator walkthrough: fresh install → vow shows first → tap ஆமென் — தொடங்கு → lands on home → kill + relaunch → home shows directly (no vow) — **pending desktop verification, needs simulator/device**
  - [ ] Simulator walkthrough: before acknowledging, attempt back gesture / deep link — vow remains — **pending desktop verification, needs simulator/device**

## Dev Notes

### Critical Architecture Requirements (MUST follow)

- **Route mapping is architecture-fixed:** vow screen = `app/vow.tsx`; component = `components/onboarding/OpeningVow` [Source: _bmad-output/planning-artifacts/architecture/frontend.md#Route to Component Mapping]
- **`components/onboarding/` does not exist yet** — create it WITH its `index.ts` barrel. All imports go through `@/components/onboarding`, never `@/components/onboarding/OpeningVow` directly
- **`@/` path aliases only** — no relative `../../` imports
- **Zero hardcoded strings in JSX** — the `vow` namespace already exists in `locales/ta.json` (`title`, `body`, `cta`). If any new visible string is needed (there should be none), add the key to `ta.json` FIRST
- **No Supabase Auth, no forbidden packages** (firebase, mixpanel, amplitude, fbsdk) — enforcement rules 7–8
- **`app/_layout.tsx` line 1 must remain `import '@/lib/i18n'`** — do not reorder imports when editing the layout
- **Do not disturb the RNTP registration block** in `app/_layout.tsx` (`registerPlaybackService` at module scope, `module.exports` service) — Story 1.6 invariants

### Existing Code You Are Building On (do NOT reinvent)

- `store/prefsStore.ts` — store already has `vowAcknowledged`, `lastVowAppVersion`, `acknowledgeVow(appVersion)` with an empty-string guard, and `resetVow()`. Your job is ONLY to add persistence + hydration flag around it
- `lib/analytics.ts:logEvent(eventType, contentId?)` — exists as a console stub; `'vow_completed'` is already a valid `AnalyticsEventType` in `types/analytics.ts`
- `app/index.tsx` — placeholder home screen; its comment says "replaced by Opening Vow screen in Story 2.1" — that comment means the *gate* arrives now; keep index.tsx as the (placeholder) home screen itself, just remove the stale comment
- `constants/colors.ts` + `tailwind.config.js` — design tokens already defined; use `bg-background`, `bg-primary`, `text-text-primary`

### zustand persist pattern (v5)

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      /* existing state + actions unchanged */
      _hasHydrated: false,
      setHasHydrated: (v: boolean) => set({ _hasHydrated: v }),
    }),
    {
      name: 'arokia-prefs',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        playbackSpeed: s.playbackSpeed,
        vowAcknowledged: s.vowAcknowledged,
        lastVowAppVersion: s.lastVowAppVersion,
      }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    }
  )
);
```

### Expo Router Protected routes pattern

```tsx
// app/_layout.tsx (inside SQLiteProvider, replacing the bare <Stack .../>)
const vowAcknowledged = usePrefsStore((s) => s.vowAcknowledged);
const hasHydrated = usePrefsStore((s) => s._hasHydrated);
if (!hasHydrated) return null; // or keep splash visible

<Stack screenOptions={{ headerShown: false }}>
  <Stack.Protected guard={!vowAcknowledged}>
    <Stack.Screen name="vow" />
  </Stack.Protected>
  <Stack.Protected guard={vowAcknowledged}>
    <Stack.Screen name="index" />
    <Stack.Screen name="spikes" />
  </Stack.Protected>
</Stack>
```

Note: `Layout` is a component — hooks are fine here, but the store subscription makes the layout re-render on guard flip; that is exactly the mechanism that unlocks `index` after acknowledgment.

### Scope Boundaries (do NOT build)

- **No vow versioning / re-acknowledgment logic** — that is Story 2.2 (`constants/vow.ts`, `VOW_VERSION`). Story 2.2 may rename `lastVowAppVersion` → `vowAcknowledgedVersion`; do not pre-build it
- **No Supabase analytics insert / install-id** — deferred; the stub call satisfies this story's AC at the service boundary
- **No About page / Privacy Policy link** — Story 2.3 (note: 2.3 requires Privacy Policy accessible *before* vow acknowledgment; the Protected-routes structure you build must make adding an unguarded screen trivial — it does, by placing it outside both guards)
- **No `SafeScreen` shared component yet** unless trivially extracted — a `SafeAreaView`-based container inline in `app/vow.tsx` is acceptable for this story

### Previous Story Intelligence (from project-context.md + Stories 1.4–1.7)

- Write/Edit tools work normally; always run `npm run format` after file writes (Prettier will otherwise fail CI)
- Zustand v5: actions reading state need `(set, get)` factory — not needed for this story's actions, but do not break the pattern if touching others
- Pre-existing ESLint warning in `lib/i18n.ts` line 8 — known, do not "fix" it and do not flag it
- CI runs Type Check, Lint & Tracker Audit on PRs to `main` — the tracker audit (`scripts/audit-trackers.sh`) fails the build if forbidden analytics SDKs appear; AsyncStorage is safe
- Commit style: conventional commits, no AI attribution lines, branch `feat/story-2-1-opening-vow` (already created), PR `--base main`, merge-commit style

### Library Versions (verified against package.json, 2026-07-03)

- expo ^54.0.0, expo-router ~6.0.10 (Protected routes supported), react 19.1.0, react-native 0.81.5, zustand ^5.0.12, nativewind v4
- `@react-native-async-storage/async-storage` — NOT yet installed; install via `npx expo install` only
- `expo-constants` ~18.0.9 already installed — use for app version string

### Testing Standards

No test suite exists yet (deferred per Epic 1). Verification is: tsc + lint + the two simulator walkthroughs in the Verification task. Document walkthrough results in the Dev Agent Record.

### Project Structure Notes

- New files: `components/onboarding/OpeningVow.tsx`, `components/onboarding/index.ts`, `app/vow.tsx`
- Modified files: `store/prefsStore.ts` (persist wrapper), `app/_layout.tsx` (Protected stack + hydration gate), `app/index.tsx` (stale comment only), `package.json` (AsyncStorage)
- No conflicts with unified project structure detected; `onboarding/` is a planned feature directory per architecture

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-2.md#Story 2.1]
- [Source: _bmad-output/planning-artifacts/architecture/frontend.md#Route to Component Mapping]
- [Source: _bmad-output/planning-artifacts/architecture/frontend.md#i18n Key Conventions]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns.md#10 Mandatory Enforcement Rules]
- [Source: _bmad-output/planning-artifacts/prd.md#FR1–FR3, NFR-A1, NFR-A3]
- [Source: _bmad-output/project-context.md — Stories 1.4–1.6 learnings]

## Dev Agent Record

### Agent Model Used

Claude (Claude Code, cloud/mobile session)

### Debug Log References

- `npx tsc --noEmit` — 0 errors
- `npm run lint` — 0 errors, 1 pre-existing warning (`lib/i18n.ts:8`, known, not in scope)
- `npm run format` — clean
- `bash scripts/audit-trackers.sh` — passed, no forbidden SDKs

### Completion Notes List

- Installed `@react-native-async-storage/async-storage@2.2.0` via `npm install` (pinned to the
  version Expo SDK 54 bundles — `npx expo install` could not run in this cloud session because it
  calls out to the Expo native-module-compatibility API, which isn't reachable through this
  session's network egress; version confirmed against the SDK 54 changelog instead).
- `prefsStore` wrapped with zustand `persist` + `createJSONStorage(() => AsyncStorage)`, storage key
  `arokia-prefs`, `partialize` excludes `_hasHydrated`. State shape/actions unchanged per scope note.
- `components/onboarding/OpeningVow.tsx` + barrel created; dumb component, no store/router access.
- `app/vow.tsx` route wires `acknowledgeVow(appVersion)` + `logEvent('vow_completed')`.
- `app/_layout.tsx`: hydration gate (`return null` until `_hasHydrated`) + `Stack.Protected` guards
  (`vow` unguarded-when-not-acknowledged, `index`/`spikes` guarded-when-acknowledged), relying on
  Expo Router's guard-flip auto-navigation (no manual `router.replace` added).
- Removed the stale placeholder comment in `app/index.tsx`.
- **Pending desktop verification (cannot run in this cloud session — no simulator/device access):**
  - Fresh-install walkthrough: vow shows first → tap CTA → lands on home → relaunch → home shows
    directly (no vow).
  - Back-gesture / deep-link-into-`/` block before acknowledging.
  - Confirm the `Stack.Protected` guard flip auto-navigates away from `/vow` after acknowledgment.
    If it does **not** auto-navigate, add `router.replace('/')` at the end of `handleAcknowledge` in
    `app/vow.tsx` (the story's documented fallback) before merging.
  - Touch-target / contrast spot-check of the CTA on-device (`min-h-12` + `bg-primary` /
    `text-on-primary` used; not device-measured).

### File List

- `store/prefsStore.ts` (modified)
- `app/_layout.tsx` (modified)
- `app/index.tsx` (modified)
- `app/vow.tsx` (new)
- `components/onboarding/OpeningVow.tsx` (new)
- `components/onboarding/index.ts` (new)
- `package.json`, `package-lock.json` (modified — AsyncStorage dependency)
