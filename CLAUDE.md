# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git Rules

- Never add `Co-Authored-By` or any Claude/AI attribution lines to commit messages. Commits are authored by Lawrence only.
- Never commit directly to `main`. Always create a feature branch (e.g. `feat/story-1-2-supabase-schema`) before committing, and open a PR from that branch.

## Project Layout

The repo root and the Expo app root are the same directory. All `npm` commands run from the repo root.

```
arokia/                  ← repo root = app root
  app/                   ← Expo Router file-based routes
  components/            ← Feature-scoped UI (scripture/, audio/, home/, donation/, shared/)
  lib/                   ← Singleton services: supabase.ts, i18n.ts, audio.ts (Story 1.6)
  store/                 ← Zustand stores (audioStore, prefsStore, contentStore — Story 1.4)
  constants/             ← Design tokens: colors.ts, theme.ts
  locales/               ← i18n strings: ta.json (Tamil only in MVP)
  types/                 ← Shared domain types (Story 1.4)
  _bmad/                 ← BMAD workflow tooling
  _bmad-output/          ← Planning artifacts: PRD, architecture, epics, sprint-status.yaml
```

## Commands

Run all commands from the repo root:

```bash
npx expo start --ios        # Start Metro + open iOS simulator
npx expo start --android    # Start Metro + open Android emulator
npx tsc --noEmit            # Type-check (must pass 0 errors before any commit)
npm run lint                # ESLint + Prettier check
npm run format              # ESLint --fix + Prettier --write
```

There is no test suite yet (Story 1.5 adds CI; testing stories follow in Epic 1).

## Architecture

### Routing

Expo Router v6 — file-based. Every file under `app/` becomes a route. `app/_layout.tsx` is the root shell; it imports `@/lib/i18n` as its very first line (before any component import) to guarantee i18next is initialized before rendering.

### Styling

NativeWind v4 — use `className` prop with Tailwind utility classes on all React Native components. Custom design tokens are defined in `tailwind.config.js` and mirrored in `constants/colors.ts`. Key tokens:

| Token | Value | Use |
|---|---|---|
| `bg-background` | `#F5EFE6` | Warm cream — all screen backgrounds |
| `primary` | `#F0C040` | Golden — CTAs, The Word path |
| `secondary` | `#E07058` | Coral — active states, Body path |
| `tertiary` | `#A8C8C4` | Teal — Soul path, Lectio Divina |
| `path-mind/body/soul` | above | Triune navigation path tinting |

### i18n — Zero Hardcoded Strings (enforced invariant)

All UI strings live in `locales/ta.json`. No Tamil or English string may appear in JSX — use `const { t } = useTranslation()` and reference an i18n key. This is a non-negotiable architectural constraint, not a preference. The five established namespaces are `vow`, `home`, `audio`, `donation`, `errors`. New stories must add keys to `ta.json` before writing components.

### Scripture Attribution Invariant

Every component that renders scripture must accept and display `verse_reference` as a non-optional prop. A scripture card without attribution cannot be rendered — this is enforced at the TypeScript type level. The `VerseText` component (Story 3.1) codifies this pattern.

### State Management

Zustand (Story 1.4) — three stores:
- `audioStore` — RNTP playback state, queue, cache manifest, sleep timer
- `prefsStore` — playback speed, vow acknowledgement flag, Sunday tracker entries
- `contentStore` — content filter state (practice_path, mood_tag), offline availability flags

No React Query in MVP. Supabase calls go through a thin service layer in `lib/` — never raw Supabase client calls from components.

### Backend

Supabase (Postgres + Storage + Edge Functions). The app is fully anonymous — no Supabase Auth in MVP or v1.1. Key tables: `content_items`, `audio_assets`, `correction_log`, `theological_concerns`, `donations`, `allocation_entries`, `beneficiaries`, `disbursements`, `analytics_events`.

`verse_reference` is `NOT NULL` at the DB level on `content_items`. This constraint exists in the schema and must never be relaxed.

Credentials are read from `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` via `.env.local` (not committed).

### Audio

react-native-track-player (Story 1.6) — background audio with lockscreen controls. Audio files are 64 kbps mono AAC (`.m4a`). `lib/audio.ts` owns all RNTP interaction, URL resolution from Supabase Storage, and the `prefetchQueue()` progressive download logic. Components never call RNTP directly.

### Path Alias

`@/*` resolves to the repo root. Configured in `tsconfig.json` + `app.json` (`tsconfigPaths: true`). Always import via `@/` — no relative `../../` imports.

### Component Barrel Pattern

Each `components/<feature>/` directory exports through its `index.ts` barrel. App code imports from `@/components/scripture` not from `@/components/scripture/VerseText` directly.

## Content Pipeline (not a feature — core architecture)

Content moves through a mandatory review workflow before it appears in the app. The `review_status` column on `content_items` gates RLS visibility: only `published` items are returned to app clients. The stages are: `draft → source_verified → advisor_reviewed → audio_generated → qa_passed → published`. Theological corrections create a new version of the item and restart from `source_verified`; the old item is marked `superseded`. This pipeline is operated via Supabase admin and CLI scripts in `scripts/` (Story 1.8).

## Sprint Tracking

`_bmad-output/implementation-artifacts/sprint-status.yaml` is the authoritative source of story status. Story files live in `_bmad-output/implementation-artifacts/`. The current sprint state: Story 1.1 (`review`), Stories 1.2–1.8 (`backlog`), all subsequent epics (`backlog`).
