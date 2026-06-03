# Session Start — Resume Instructions

Load previous session state and orient for continuation in a fresh window.

---

## Step 1: Load Handover

Read `_bmad-output/CURRENT.md`.

**If file does not exist:**
- Output: "No previous handover found."
- Read `_bmad-output/implementation-artifacts/sprint-status.yaml` if it exists
- Skip to Step 4 (fresh orientation mode)

Parse the timestamp from the header: `# Handover — {YYYY-MM-DD HH:MM}`

**Staleness check:**
- Under 24 hours → proceed normally
- 24 hours – 7 days → prepend `⚠️ Handover is {X} hours old — verify git state matches`
- Over 7 days → prepend `⚠️ Handover is {X} days old — consider running /bmad:bmm:workflows:sprint-status for fresh orientation`

Check `_bmad-output/handoff/` for timestamped copies. If any copy is **newer** than CURRENT.md, warn:
> "⚠️ A more recent handover exists: `_bmad-output/handoff/{newer-timestamp}.md` — using that instead."
> Then use the newer file as the source of truth.

---

## Step 2: Verify Git State

Run:
```bash
git branch --show-current
git status --short
git log -1 --format="%h %s"
```

Compare with handover:
- Branch matches handover branch → good
- Branch differs → warn: `⚠️ Current branch ({current}) differs from handover branch ({handover-branch})`
- Handover listed uncommitted files → confirm they are still present in git status output

---

## Step 3: Load Story Context

Read `_bmad-output/implementation-artifacts/sprint-status.yaml`.

**If handover Mode is Mid-story:**
- Load the story file referenced in the handover
- Read the resume point from the story file's existing completion-notes section:
  - `### Completion Notes List`, if present
  - otherwise `### Completion Notes`, if present
  - do not create or rename sections during session-start

**If handover Mode is Story complete:**
- Read the completed story's current status from sprint-status.yaml (this is the authoritative source)
- If status is `review` → load the completed story file; next action is code review
- If status is `done` → find the next story in sprint-status.yaml with status `ready-for-dev`; load that story file; next action is dev-story

Read `_bmad-output/project-context.md` if it exists. Note any entries added in the last session (check the handover's References section for whether it was updated).

Also load each file listed in the handover's **References** section and **Context Needed** section. These are the files the previous agent explicitly flagged as required for continuation.

### Context Loading Strategy

| When | What to load |
|------|--------------|
| Always | `CURRENT.md`, `sprint-status.yaml`, `project-context.md` |
| If active story exists | Active story file (full Dev Agent Record + Tasks) |
| If Context Needed section lists files | Each file named there |
| On user request only | PRD, full architecture docs, epic files |

---

## Step 3.5: Validate Continuity

Before displaying the resume brief, cross-check for inconsistencies:

| Check | Action if failed |
|-------|-----------------|
| Story status in CURRENT.md matches sprint-status.yaml | Warn user, show both values — trust sprint-status.yaml |
| Files listed in References section exist on disk | Warn which paths are missing |
| Branch in handover matches current git branch | Warn of branch mismatch |
| Uncommitted files in handover still appear in `git status` | Note if they were committed or disappeared since handover |

If checks pass, proceed silently. Only surface issues, not confirmations.

---

## Step 4: Display Resume Brief

### Mid-story mode:

```
📋 Session resumed — {handover datetime} ({X min/hours ago})
   Written by: {agent from handover header}

┌─────────────────────────────────────────────────┐
│  Story:    {story-id} — {story-title}           │
│  Branch:   {branch-name}                        │
│  Progress: {X of Y tasks complete}              │
└─────────────────────────────────────────────────┘

Resume Point:
{resume point from Dev Agent Record, verbatim}

Uncommitted files from last session:
{list, or "None — working tree was clean"}

{if project-context.md was updated last session:}
Cross-story context (added last session):
  ↳ {relevant entries}

What happened last session:
{bullet list from CURRENT.md}

Decisions to carry forward:
{decisions from CURRENT.md}

Context loaded:
  ✓ project-context.md
  ✓ {story-file-path}
  {✓ each additional file from References / Context Needed}

⚡ Next Action
Run dev-story on the story file above, or ask a question.
  Claude:  /bmad:bmm:workflows:dev-story
  Codex:   use dev-story prompt
```

### Story-complete mode (status = review — pending code review):

```
📋 Session resumed — {handover datetime} ({X min/hours ago})
   Written by: {agent from handover header}

┌─────────────────────────────────────────────────┐
│  Completed: {story-id} — {story-title}          │
│  Status:    review (pending code review)        │
│  Branch:    {branch-name}                       │
└─────────────────────────────────────────────────┘

Last session built:
{bullet list from CURRENT.md}

Decisions made:
{decisions from CURRENT.md}

{if project-context.md was updated last session:}
Cross-story context added last session:
  ↳ {relevant entries}

Context loaded:
  ✓ project-context.md
  ✓ {completed-story-file-path}
  {✓ each additional file from References / Context Needed}

⚡ Next Action
Run code review on the completed story before starting the next one.
  Claude:  /bmad:bmm:workflows:code-review
  Codex:   use code-review prompt
```

### Story-complete mode (status = done — ready for next story):

```
📋 Session resumed — {handover datetime} ({X min/hours ago})
   Written by: {agent from handover header}

┌─────────────────────────────────────────────────┐
│  Done:   {story-id} — {story-title}             │
│  Next:   {next-story-id} — {next-title}         │
│  Branch: {branch-name}                          │
└─────────────────────────────────────────────────┘

Last session built:
{bullet list from CURRENT.md}

Decisions made:
{decisions from CURRENT.md}

{if project-context.md was updated last session:}
Cross-story context added last session:
  ↳ {relevant entries — automatically available to next story}

Context loaded:
  ✓ project-context.md
  ✓ {next-story-file-path}
  {✓ each additional file from References / Context Needed}

⚡ Next Action
  Claude:  /bmad:bmm:workflows:dev-story
  Codex:   use dev-story prompt
```

### No handover found:

```
📋 No previous handover found.

{if sprint-status.yaml exists:}
Current sprint state:
  {first in-progress or ready-for-dev story, or summary if none}

⚡ Suggested next step:
  Run /bmad:bmm:workflows:sprint-status for full orientation.
```

---

## Error Handling

| Scenario | Action |
|----------|--------|
| `CURRENT.md` missing | Output "No previous handover found", load sprint-status.yaml, display fresh orientation |
| `CURRENT.md` older than 7 days | Warn strongly, suggest running `/bmad:bmm:workflows:sprint-status` instead |
| Story file referenced but missing | Warn which path is missing, continue with what's available |
| `sprint-status.yaml` missing | Note "No sprint tracking found", rely on CURRENT.md state only |
| Git branch mismatch | Warn and list both — do not assume either is correct |
| `project-context.md` missing | Skip silently — it's optional |

---

## Notes

- Do not ask clarifying questions — work from what the files contain
- If sprint-status.yaml and CURRENT.md contradict each other on story status, trust sprint-status.yaml (it is the authoritative source) and note the discrepancy
- session-start is orientation only — do not begin implementation, do not edit files
- The agent that wrote the handover may differ from the current agent; that is expected and fine
- Load files eagerly — it's better to have too much context than too little at session start
