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
