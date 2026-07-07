# Deferred Work

## Deferred from: code review of 1-4-service-layer-domain-types-and-zustand-store-skeletons (2026-06-08)

- **`prefsStore` no persistence**: Holds `vowAcknowledged` and `playbackSpeed` in volatile in-memory state. Intentionally deferred to Story 2.1 when `@react-native-async-storage/async-storage` is installed. Every app restart silently resets vow acknowledgement.
- **Donation/disbursement queries hit Supabase 1000-row default limit**: `getDonationSummary` and `getPayForwardSummary` fetch entire tables client-side. Silently truncated at 1000 rows — financial summary values will be incorrect at scale. Move to server-side aggregate query.
- **RNTP teardown missing from `playTrack`**: `playTrack` is a state-only mutation; no RNTP player stop/start. Must call `lib/audio.ts` when RNTP is wired in Story 1.6.
- **`resumeAudio` / `clearDownloads` need RNTP state awareness**: `resumeAudio` doesn't check `isBuffering`; `clearDownloads` can clear local file paths while an offline track is playing. Both need RNTP integration in Story 1.6.
- **`AnalyticsEvent` interface missing `id` field**: DB row has a primary key `id` but the read interface doesn't include it. Add when events are read back from DB.
- **No runtime schema validation at Supabase boundary**: All Supabase results are type-asserted (`data as RowType[]`) with no Zod validation layer. Schema drift will cause silent runtime failures. Consider a Zod validation pass in a future story.
- **`logEvent` silently swallows insert errors**: Analytics insert errors are `console.error`'d but not thrown or returned. Accepted trade-off — analytics is non-critical path.
- **Concurrent `fetchQuotes` / `fetchMeditations` share a single `isLoading` flag**: Two async store actions share one loading flag, creating a race condition when both fire concurrently (spinner dismissed while second fetch still in flight). Fix requires adding per-action loading flags, which changes the spec-mandated `ContentState` interface.

## Deferred from: code review of 2-1-opening-vow-first-launch-gate (2026-07-04)

- **`Stack.Protected` guard allowlist fails open for forgotten routes**: `app/_layout.tsx` gates screens by explicitly listing them inside a `guard={vowAcknowledged}` block; expo-router only excludes routes named inside a *false*-guarded `Stack.Protected` — any future route file not added to that block renders unguarded with no compile-time or runtime signal. Every new Epic 3+ content screen must be added to the guarded block by hand. Consider a structural fix (e.g. an `app/(gated)/` route group owning the guard) before Epic 3 adds enough screens that a miss becomes likely.
- **`onRehydrateStorage` write-through on every cold start**: `setHasHydrated(true)` goes through the same `set` as persisted fields, so `persist` re-serializes and re-writes `arokia-prefs` to AsyncStorage on every launch even when no persisted value changed. Minor (one small write per launch); worth a `skipHydration`-based or non-persisted-field-aware fix if more state gets added to `prefsStore`.

## Deferred from: code review of 2-2-returning-user-re-acknowledgment-and-vow-state-management (2026-07-04)

- **Re-vow gate can't detect an EAS OTA update**: `constants/vow.ts`'s `needsReVow()` keys off `Constants.expoConfig?.version` (the native `app.json` version), which an EAS Update (OTA JS-bundle push) does not bump. A vow-text correction shipped via OTA without a native version bump would never trigger re-acknowledgment for already-acknowledged users. Out of Story 2.2's scope (the epic's AC only describes app-version-triggered re-vow); if OTA-only vow corrections become a real workflow, this needs a second signal (e.g. a runtime-config value bumped independently of `expo.version`).
- **No validation that `VOW_REQUIRED_VERSIONS` entries match `app.json`'s version format**: entries are matched by exact string equality with no normalization (e.g. `'1.1'` vs `'1.1.0'`, stray whitespace). A typo silently disables the re-vow prompt for that release with no test, lint, or runtime signal. Acceptable for now given the array is operator-edited rarely and reviewed in PR; worth a lint rule or startup assertion (e.g. verifying array entries look like semver) if this becomes error-prone in practice.

## Deferred from: implementation of 2-4-theological-concern-submission-form (2026-07-04)

- **No automated acknowledgment email for concern submissions (FR31)**: `theological_concerns` rows insert successfully via `lib/concerns.ts:submitConcern()` and the user sees an in-app confirmation with the 7-day SLA message, but no email is actually sent to `submitter_email`. `architecture.md` already designates the fix — a `supabase/functions/concern-notification/` Edge Function triggered by a DB webhook on `theological_concerns` INSERT — but no email provider (Resend/SendGrid/etc.) has been chosen and no API key exists. Needs Lawrence to pick a provider and supply credentials before this Edge Function can be built; not blocking the form itself.
- **No `submitter_name` field**: `epics.md`'s Story 2.4 AC lists an optional "name" field, but the already-implemented `theological_concerns` schema and `submitConcern()` signature only support `description` + optional `email` (no name column). Adding one needs a new migration — out of scope for a mobile/unattended session per policy. If a name field is wanted, add the column + update `submitConcern()`'s signature + the form together.

## Deferred from: implementation of 4-2-meditation-library-browse-by-practice-path-and-emotional-state (2026-07-04)

- **Lectio Divina ("Silence Between Words") not discoverable from the Soul path (AC5)**: `architecture.md` designates a dedicated `app/lectio-divina.tsx` route for this distinct silence-based practice — building it is fundamentally audio-player-core work (Story 4.3/4.4 territory), which is gated behind RNTP device validation. Revisit once that gate clears and the route can actually be built, rather than linking to a route that doesn't exist.
- **Meditation duration not shown anywhere**: `ContentItem` has no `duration` field; it lives on `audio_assets.duration_sec`, unjoined by `getMeditations()`/`getQuotes()`. No meditation has an `audio_asset_id` yet (Story 4.6 hasn't run), so there's nothing to display regardless. Add the join + a `durationSec` field once real audio exists.

## Deferred from: implementation of 4-4-audio-player-sleep-timer-speed-control-and-bible-hand-off (2026-07-07)

- **Bible hand-off resource → switch to YouVersion Tamil O.V. before Tamil audio ships (Story 4-6).**
  `lib/bible.ts` currently opens BibleGateway `ERV-TA` (Easy-to-Read Tamil) via free-text reference —
  fine for today's only content (English-referenced voiced quotes), but (a) the translation differs
  from the bundled Tamil **O.V.**, and (b) BibleGateway free-text search does NOT reliably resolve
  **Tamil-script** book names (e.g. "யோவான் 3:16"). The production target is YouVersion Tamil O.V.
  (matches the bundled translation, opens the user's native Bible app), which needs a bilingual
  book-name→USFM code map (66 books × Ta/En). Build it when Story 4-6 seeds Tamil meditation content.
  Lawrence to confirm the final resource/translation. Single constant in `lib/bible.ts`.
- **Sleep timer is a JS `setTimeout`** — may not fire precisely in deep background on iOS (RNTP has no
  native sleep timer). Acceptable for MVP; revisit with a background-capable mechanism if users report
  the timer not stopping audio overnight.

## Deferred from: PR #6 walkthrough (2026-07-06)

- ~~**Epic 4 — moods must be path-specific, not the same 5 under Mind/Body/Soul.**~~ **RESOLVED**
  (2026-07-07, story 4-1/4-2 close). `components/home/CategoryFilter.tsx` now owns `CATEGORIES_BY_PATH`:
  Mind = emotional states, Body = rest/movement/breathwork/sleep, Soul = prayer/lectio/silence/communion.
  `walk.tsx` renders only the active path's chips. New `CategoryTag` type + `category` i18n namespace.
- **DB `mood_tag` CHECK must widen to hold Body/Soul categories (do at Story 4-6 seeding).** The
  path-aware filter is frontend-only right now: `content_items.mood_tag` still only allows the 5
  emotional values (`20260603000001_add_check_constraints.sql`). This is fine today because 0 meditation
  rows exist, so Body/Soul filters just return empty. **Before Story 4-6 seeds any Body/Soul meditation**,
  a migration must expand the CHECK to include `rest/movement/breathwork/sleep/prayer/lectio/silence/communion`
  — otherwise the insert fails the constraint. (Lawrence-run migration; not an unattended-session step.)
- **Tamil Body/Soul category labels are draft, pending linguistic review** (same treatment `mood.*` got):
  `category.rest/movement/breathwork/sleep/prayer/lectio/silence/communion` in `ta.json` use standard
  Tamil Christian vocabulary (ஜெபம், மௌனம், ஐக்கியம், etc.) but Lawrence should confirm phrasing.
- **Meditations not seeded.** Only the 50 `quote` rows exist; `content_type='meditation'` rows (the 21 audio
  tracks) come with Epic 4 + the audio pipeline, so meditation lists render empty today (expected, not a bug).
