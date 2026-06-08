# Epic 4: The Walk — Triune Home & Full Audio Meditation Practice

Users can navigate the Mind/Body/Soul practice paths, play all 21 meditation tracks (15 + 5 anxiety + 1 Lectio Divina) with background audio, lockscreen controls, offline cache, sleep timer, and speed control. The complete daily spiritual practice rhythm is live.

**FRs covered:** FR6, FR7, FR8, FR9, FR12, FR14, FR15, FR16, FR17, FR18, FR19, FR20, FR21, FR41

---

### Story 4.1: Triune Home Screen (Mind / Body / Soul Navigation)

As a Tamil Christian user,
I want to navigate to three distinct practice paths (Mind, Body, Soul) from the home screen and reach today's featured Soul content within two taps,
So that daily spiritual practice has a clear, calm entry point that reflects the wholeness Arokia is built on.

**Acceptance Criteria:**

**Given** a user who has completed the Opening Vow
**When** they arrive at the home screen
**Then** three clearly labelled practice path tiles are shown: 🧠 மனம் (Mind), 💪 உடல் (Body), 🕊️ ஆத்மா (Soul) — each as a distinct tappable area with ≥48×48 dp touch target (FR6, NFR-A1)

**Given** the home screen
**When** the user taps the Soul tile
**Then** they reach today's featured Soul meditation within one more tap — total 2 taps from home to playing content (FR7, NFR-A4)

**Given** the `<TimeOfDayBanner>` component slot in `app/(tabs)/index.tsx`
**When** rendered in v1
**Then** it renders `null`; the `timeFilter` constant is `'any'`; the component accepts a `timeFilter` prop so v1.1 can activate it without structural change

**Given** the `<TriuneGrid>` component
**When** it receives `timeFilter = 'any'`
**Then** it passes the filter to `lib/content.ts:getMeditations()` — the time-of-day filtering infrastructure is wired even though v1 always passes `'any'`

**Given** all home screen strings
**When** reviewed
**Then** zero are hardcoded — all come from `ta.json` home namespace (NFR-I1)

---

### Story 4.2: Meditation Library — Browse by Practice Path & Emotional State

As a Tamil Christian user,
I want to browse the full meditation library filtered by practice path (Mind/Body/Soul) and by emotional state (anxious, grieving, angry, lonely, tempted),
So that I can find the right meditation for what I am carrying today, not just what is newest.

**Acceptance Criteria:**

**Given** the user taps a practice path tile (e.g., Mind)
**When** the library screen loads
**Then** all published meditations with matching `practice_path` are shown as a list with title, duration, and mood tag (FR8)

**Given** the anxiety library accessible from the home screen or Mind path
**When** the user selects an emotional state (e.g., "கவலை" — anxious)
**Then** only meditations with the matching `mood_tag` are shown; `mood_tag = 'none'` meditations are excluded (FR9)

**Given** the meditation list
**When** rendered on a mid-range Android simulator
**Then** it reaches interactive state in ≤1 second (NFR-P4)

**Given** any meditation in the list
**When** tapped
**Then** a detail screen opens with title, verse reference, duration, and a prominent Play button — no account prompt (NFR-PR1)

**Given** the Lectio Divina track (`content_type = 'lectio'`)
**When** browsing the Soul path
**Then** the "Silence Between Words" track is discoverable and accessible (FR12)

---

### Story 4.3: Audio Player — Core Playback with Background & Lockscreen Controls

As a Tamil Christian user,
I want to play any meditation track with standard controls and continue listening while my screen is locked or I use other apps,
So that I can listen during my commute, while walking, or before sleep without the audio cutting out.

**Acceptance Criteria:**

**Given** the user taps Play on a meditation
**When** the track starts from a cached local file
**Then** audio begins within 500 ms (NFR-P2); `meditation_started` analytics event is logged

**Given** audio is playing and the user presses the home button or locks the screen
**When** the device is backgrounded or screen-locked
**Then** audio continues uninterrupted; the lockscreen Now Playing card shows the meditation title and play/pause/seek controls (FR16, FR17)

**Given** audio is playing and hardware headphone buttons or Bluetooth controls are used
**When** play/pause or skip is triggered
**Then** the audio responds correctly (FR17)

**Given** audio is playing and an incoming phone call arrives
**When** the call connects
**Then** audio pauses immediately; when the call ends, audio resumes automatically (NFR-R2)

**Given** the persistent mini-player in `app/(tabs)/_layout.tsx`
**When** a track is playing and the user navigates between tabs
**Then** the `PlayerBar` component remains visible above the tab bar; tapping it opens the full player screen

**Given** the app memory during active background audio
**When** measured on a mid-range Android device
**Then** in-session memory footprint stays ≤150 MB (NFR-P3)

---

### Story 4.4: Audio Player — Sleep Timer, Speed Control & Bible Hand-off

As a Tamil Christian user,
I want to set a sleep timer so audio stops automatically, adjust playback speed for better Tamil comprehension, and open the full scripture passage in an external Bible app when a meditation ends,
So that the audio experience serves my actual context — night-time listening, slower comprehension needs, and a desire to go deeper into Scripture.

**Acceptance Criteria:**

**Given** the full player screen
**When** the user opens the sleep timer control
**Then** they can select 15, 30, or 45 minutes; audio stops automatically at the selected time (FR20)

**Given** the playback speed control
**When** the user selects a speed
**Then** they can choose 0.75×, 1×, or 1.25×; the speed change is applied immediately to the current track (FR21)

**Given** a meditation reaches its end
**When** the track completes
**Then** a "Read the full passage" link appears showing the verse reference; tapping it opens the complete scripture chapter in an external Tamil Bible resource via deep link or browser (FR14)

**Given** the Bible hand-off link
**When** tapped
**Then** `scripture_link_opened` analytics event is logged; the user leaves Arokia — the app does not intercept or frame the external Bible resource

**Given** all player UI strings
**When** reviewed
**Then** all come from `ta.json`; no hardcoded strings (NFR-I1)

---

### Story 4.5: Offline Content Download — Progressive Cache & Manual Download

As a Tamil Christian user,
I want meditation audio to download automatically when I first play a track, with subsequent tracks pre-fetched silently, and the option to manually download a week's content,
So that I can listen fully offline during my commute, in rural areas, or wherever connectivity is poor.

**Acceptance Criteria:**

**Given** a user plays a track for the first time
**When** playback starts
**Then** `lib/audio.ts:downloadTrack()` downloads the `.m4a` to `FileSystem.documentDirectory` before or during playback; `audioStore` records the local file path in its cache manifest (FR18)

**Given** a track has begun playing
**When** `lib/audio.ts:prefetchQueue()` runs in the background
**Then** it silently pre-fetches the next 2 tracks in the current path queue with no visible UI

**Given** the user taps "Download This Week's Content" (manual option)
**When** the download begins
**Then** the estimated size (~30 MB) is shown before confirmation; progress is displayed; on completion the user is informed content is available offline (FR19)

**Given** the device is in airplane mode and a track has been previously downloaded
**When** the user taps Play
**Then** audio plays from local cache in ≤500 ms with no network request and no error (NFR-P2)

**Given** the total first-week offline content package
**When** size is measured
**Then** 9 tracks at 64 kbps mono AAC is ≤50 MB (NFR-P5)

**Given** a cached file in `FileSystem.documentDirectory`
**When** the OS is restarted or a low-memory event occurs
**Then** the file survives — `documentDirectory` is persistent across OS restarts

---

### Story 4.6: Meditation Content Seeding — 21 Tracks

As an operator,
I want all 21 MVP meditation tracks entered into `content_items` with Tamil audio generated and uploaded, keerthanai instrumentation in place, and all metadata fields correctly set,
So that the Triune Home and Audio Player have the full intended content set from first release.

**Acceptance Criteria:**

**Given** `content_items` after seeding
**When** queried for meditations
**Then** exactly 21 rows exist: 5 Mind, 5 Body, 5 Soul, 5 anxiety-tagged (`mood_tag` in `('anxious','grieving','angry','lonely','tempted')`), 1 Lectio Divina — all `language_code = 'ta'`, `review_status = 'published'`

**Given** each meditation row
**When** `audio_asset_id` is inspected
**Then** it references a valid `audio_assets` row; the storage path resolves to a playable `.m4a` file in Supabase Storage

**Given** each meditation's audio
**When** listened to
**Then** Tamil voice is at natural speech pace (1×) with keerthanai instrumental at 20-30% relative volume (NFR-AU1); keerthanai is distinctly Christian — no bhajan/mantra-adjacent melodic phrases (NFR-AU3, FR41)

**Given** each meditation row's `verse_reference`
**When** verified
**Then** it is non-null and resolves to a valid Tamil OV passage

**Given** all 21 audio files downloaded
**When** total size is measured
**Then** it is ≤50 MB (NFR-P5)

---

### Story 4.7: App Launch Performance & Cold Start Validation

As a Tamil Christian user,
I want the app to reach an interactive home screen within 2 seconds of launch on a mid-range Android device,
So that the app feels immediate and trustworthy — not sluggish.

**Acceptance Criteria:**

**Given** the app is cold-launched on a Snapdragon 680-class Android device (4 GB RAM, Android 11)
**When** timing is measured from tap to interactive home screen
**Then** the app reaches interactive state in ≤2 seconds (NFR-P1)

**Given** `contentStore` initializing on launch
**When** meditation metadata is fetched from Supabase
**Then** the fetch runs in the background; the home screen renders immediately from any locally cached data without blocking

**Given** the app cold-launched on iOS 16+ (returning user)
**When** timing is measured
**Then** the home screen is interactive in ≤2 seconds (NFR-P1)

**Given** the app launched with no network connection
**When** the home screen loads
**Then** it renders correctly from local SQLite data and cached content; no crash or blank screen (NFR-R3)
