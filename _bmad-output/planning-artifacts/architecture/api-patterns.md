# Architecture: API & Communication Patterns

## Service Layer (lib/)

No raw Supabase calls in components or Zustand stores — all database access goes through typed functions in `lib/`.

```
lib/
  supabase.ts         — singleton Supabase JS client (anon key)
  content.ts          — getQuotes(lang, practicePath?, moodTag?), getMeditations(lang, practicePath?), searchContent(lang, query)
                        queries only review_status = 'published' rows
  donations.ts        — getDonationSummary(), getPayForwardSummary(), getDisbursements()
                        generates Glass-Wall numbers from allocation_entries + disbursements; no manual math
  concerns.ts         — submitConcern(contentItemId?, description, email?)
  audio.ts            — resolveAudioUrl(audioAssetId), downloadTrack(contentItemId), prefetchQueue(queue)
  analytics.ts        — logEvent(eventType, contentId?) — uses local install_id from SecureStore
  sqlite.ts           — Expo SQLite v2: schema init, verse queries, full-text search
  trackPlayerService.ts — RNTP headless task: events → audioStore actions
  i18n.ts             — react-i18next init: language detection, ta.json default
  network.ts          — useNetworkStatus() hook (NetInfo → isOnline: boolean)
```

## Supabase Response Handling

Always destructure, never ignore error:

```typescript
// CORRECT
const { data, error } = await supabase.from('content_items').select('*');
if (error) throw error;
return transformContent(data);

// WRONG — missing error check
const { data } = await supabase.from('content_items').select('*');
return data;
```

## Content Fetching: Zustand contentStore (No react-query)

- Scripture quotes: queried from Expo SQLite (offline, instant, no network)
- Meditation metadata: fetched from Supabase on app launch, held in `contentStore` for the session
- No react-query in MVP — insufficient complexity; reconsider at v2

## Three-Tier Error Handling

```typescript
// Tier 1: lib/ — throws, logs to Sentry
export async function getQuotes(lang: LanguageCode): Promise<ContentItem[]> {
  const { data, error } = await supabase.from('content_items').select('*')
    .eq('language_code', lang).eq('review_status', 'published');
  if (error) { Sentry.captureException(error); throw error; }
  return data.map(transformContent);
}

// Tier 2: Zustand store — catches, sets error state
fetchQuotes: async (lang) => {
  set({ isLoading: true, error: null });
  try { set({ quotes: await getQuotes(lang), isLoading: false }); }
  catch { set({ error: 'errors.offline', isLoading: false }); }
},

// Tier 3: Component — reads store.error, shows localized message via t()
// Never shows raw error strings to users
```

## Zustand Store Conventions

- State updated via named actions only — no direct `setState` object spreads outside the store
- Action naming: imperative verbs (`playTrack`, `pauseAudio`, `setTimeFilter`, `addDownload`)
- Use `zustand/middleware/immer` for nested state — prevents accidental mutation
- Selectors inline: `useAudioStore(state => state.currentTrack)` — no separate selector files in MVP

```typescript
// store/audioStore.ts — structure pattern
interface AudioState {
  currentTrack: ContentItem | null;
  isPlaying: boolean;
  isBuffering: boolean;
  speed: 0.75 | 1 | 1.25;
  sleepTimerMinutes: 0 | 15 | 30 | 45;
  downloadedTracks: Record<string, string>; // contentId → localFilePath
  // Actions
  playTrack: (content: ContentItem) => void;
  pauseAudio: () => void;
  setSpeed: (speed: AudioState['speed']) => void;
  setSleepTimer: (minutes: AudioState['sleepTimerMinutes']) => void;
}
```

## react-native-track-player Event Handling

All RNTP events handled exclusively in `lib/trackPlayerService.ts` (headless task). Events update `audioStore` via store actions. No RNTP event listeners inside components.

## Offline State Pattern

`@react-native-community/netinfo` → shared `useNetworkStatus()` hook → `isOnline: boolean`.
- Network-dependent features render `<OfflineBanner>` or inline message from `ta.json`.
- Cached content and audio: never blocked by offline state.
- Donation flow: always shows a clear offline indicator if `isOnline === false`.

## Loading States

- Zustand stores expose `isLoading: boolean` per async operation
- Audio buffering: RNTP state → `audioStore.isBuffering`
- Content lists: skeleton screens (not raw spinners) for perceived performance

## Donation Flow — Webhook-Authoritative

App initiates Razorpay external webview → shows "processing" screen → waits.
- App does NOT poll for payment status.
- App does NOT create donation records.
- Only the webhook Edge Function creates `donations` + `allocation_entries` records.
- "Thank you" screen shown only after webhook confirmation.

## DB to TypeScript Transformation

The `lib/` service layer transforms Supabase snake_case → TypeScript camelCase:
```typescript
// DB row:    { verse_reference: "Matthew 6:25", language_code: "ta" }
// TS type:   { verseReference: "Matthew 6:25", languageCode: "ta" }
```

Components never see raw DB field names.
