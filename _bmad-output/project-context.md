# Project Context — Cross-Story Learnings

## Learnings from Story 1.1 — 2026-05-28

The Expo app was initially scaffolded with a double-nested structure (`arokia/arokia/`)
because `create-expo-stack arokia` was run inside a folder already named `arokia`.
This was corrected: the git repo root and Expo app root are now the same directory
(`/Users/lawrence/Desktop/projects/arokia/`). All file paths, imports, and commands
operate from this single root — there is no inner app subdirectory.
