# Architecture Decision Document — Arokia (Index)

**Status:** Complete · Last amended 2026-04-25
**Input:** `prd.md`

## Shard Map

| File | Contents |
|---|---|
| `data.md` | Supabase 9-table schema + RLS policies + audio caching + migration setup |
| `auth-security.md` | No-auth decision, secrets management, Razorpay webhook, tracker audit |
| `api-patterns.md` | Service layer (`lib/`), Zustand patterns, error handling, offline state |
| `frontend.md` | Component structure, routing, stores, verse attribution invariant, home extensibility |
| `infrastructure.md` | CI/CD, EAS build profiles, OTA, Glass-Wall budget, ElevenLabs scripts, monitoring |
| `implementation-patterns.md` | Naming conventions, structure patterns, format patterns, enforcement rules (10 mandatory rules) |
| `project-structure.md` | Full directory listing, architectural boundaries, key data flows |

## Project Overview

**Stack:** React Native + Expo SDK 54/55 · TypeScript strict · NativeWind v4 · Expo Router v4 · Zustand · Supabase (Postgres + Storage + Edge Functions) · react-native-track-player · react-i18next

**Scale:** 100 → 15,000 MAU without architectural changes. Supabase free → Pro is the sole operational scaling step.

**Core architectural invariants (enforced everywhere):**
1. `verse_reference` is NOT NULL at DB level and non-optional at TypeScript type level
2. No raw Supabase calls in components — all DB access through `lib/` service functions
3. No hardcoded UI strings — all through `useTranslation()` and `ta.json`
4. No Supabase Auth calls in v1 or v1.1 — fully anonymous app
5. No third-party trackers (Firebase, Mixpanel, Amplitude, Facebook SDK)

## Critical Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Scripture text storage | Expo SQLite v2 | Offline-first; full-text search; pre-populated at build time |
| Audio format | 64 kbps mono AAC (.m4a) | ~3.4 MB per 7-min track; 15 tracks ≤ 51 MB (satisfies NFR-P5) |
| Audio download | Progressive (play-then-prefetch) | Bulk pre-download is poor UX on cellular |
| Auth | None through v1.1 | Core features require no identity; first auth surface is Pastor Portal (v2+) |
| Verse attribution | TypeScript compile-time invariant | Missing attribution = build error, not runtime decision |
| Donation webhook | Supabase Edge Function + atomic transaction | All three inserts (donation + 2 allocations) succeed or all rollback |
| Verse card | react-native-view-shot (on-device) | Offline-capable; no network dependency for PNG generation |
| State management | Zustand (no react-query in MVP) | Insufficient complexity to justify react-query; reconsider at v2 |
| Glass-Wall Budget | DB-generated markdown → git → in-app render | No manual math risk; git commit history is auditable record |

## Week-1 Technical Spikes (must pass before writing app screens)

| Spike | What to prove | Pass criteria |
|---|---|---|
| SPIKE-1: Tamil text | System fonts render Tamil Unicode | No glyph fallback; correct ligatures; no layout overflow |
| SPIKE-2: RNTP background audio | react-native-track-player with screen locked | Lockscreen controls visible; audio resumes after call |
| SPIKE-3: Audio format + size | 64 kbps mono AAC from ElevenLabs | File plays clearly; 7-min file ≤ 3.5 MB |
| SPIKE-4: Offline cache | expo-file-system downloads + plays offline | Airplane mode test passes; no network calls during playback |
| SPIKE-5: Razorpay on device | External webview completes test payment | Both iOS + Android; webhook fires; DB record created |

## Content Operations Pipeline (core architecture, not a feature)

```
1. Curate     → content_items (review_status: 'draft')
2. Verify     → review_status: 'source_verified'
3. Advise     → review_status: 'advisor_reviewed'
4. Generate   → ElevenLabs → audio_assets INSERT → review_status: 'audio_generated'
5. QA         → review_status: 'qa_passed'
6. Publish    → review_status: 'published' (RLS makes item visible to app)
7. Correct    → correction_log INSERT → old item: 'superseded' → new item: version+1, restart from step 2
```

RLS policy on `content_items`: anonymous SELECT where `review_status = 'published'` only.
