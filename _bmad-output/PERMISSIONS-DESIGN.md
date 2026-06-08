# Claude Code permission design

## The architecture

Three layers, deliberately separated by what each can do:

1. **`.claude/settings.json`** — committed to the repo. Holds **only deny rules**.
   Because deny beats allow at every scope and the first matching rule wins
   (`deny -> ask -> allow`), nothing in your local file or a CLI flag can punch
   a hole in this. This is your safety floor.

2. **`.claude/settings.local.json`** — gitignored, personal. Holds your
   convenience `allow` rules, the `ask` checkpoints, and `defaultMode`. It can
   only ever *reduce* friction. It cannot weaken the deny floor above it.

3. **`~/.claude/settings.json`** (host machine, optional) — the bypass lockout.
   See the snippet at the bottom.

Add `.claude/settings.local.json` to `.gitignore`. Keep `.claude/settings.json`
in version control so the deny floor travels with the repo and survives a PR
review.

## Why deny rules live in the committed file, not the local one

A deny in any scope blocks the action even if another scope allows it. If you
ever put a deny only in the gitignored local file, it disappears the moment you
clone fresh, work in a container, or hand the repo to someone. Putting the floor
in the committed file means the protection is a property of the repo, not of one
machine's untracked file.

## What `defaultMode: acceptEdits` buys you

File edits and routine filesystem commands (`mkdir`, `mv`, `cp`, `touch`) inside
the working directory auto-apply with no prompt. Bash commands that don't match
an `allow` rule still prompt. So normal coding flows without interruption, while
anything unusual in a shell still stops and asks. That is the "smooth but
guarded" middle you want, without touching bypass mode.

## Honest limits of permission rules (read this before trusting it blindly)

Permission rules are enforced by Claude Code, not the model, but they are still
**process-level, not OS-level**:

- Read/Edit deny rules cover Claude's own file tools and the bash file commands
  Claude Code recognizes (`cat`, `head`, `tail`, `sed`). They do **not** stop an
  arbitrary subprocess. A Python or Node script Claude runs can open `.env`
  itself and the deny rule never fires. This is the single biggest gap.

- Bash argument patterns are fragile. `Bash(rm -rf *)` is real defense in depth,
  but a determined path through a variable, an env runner like `npx`/`make`, or
  an odd quoting can sidestep an argument filter. Claude Code does parse shell
  operators, so each subcommand in `a && b` is matched independently, which
  helps, but do not treat argument-level denies as airtight.

The real OS-level boundary is the **sandbox** (`/sandboxing` in the docs). It
restricts the Bash tool's filesystem and network at the OS level for the command
and all its child processes, so the Python-reads-.env gap closes. If you want a
genuine guarantee rather than guardrails, enable sandboxing on top of these
rules. Permissions + sandbox is the defense-in-depth posture Anthropic
recommends.

## Network exfiltration choice

`curl` and `wget` are denied as Bash commands on purpose. Constraining them by
URL argument is the exact fragile pattern the docs warn against, so the robust
move is to block the bash tools and route fetches through the `WebFetch` tool
with an explicit domain allowlist (the `WebFetch(domain:...)` entries in the
local file). Add domains as you need them. If a build script genuinely needs
curl, prefer wrapping it in an npm/make target you allow by name rather than
re-opening curl globally.

## When you actually want full autonomy (YOLO / auto mode)

Keep the host guarded and move the autonomy into an isolated environment:

- **Dev container** (the safest YOLO): run `claude --dangerously-skip-permissions`
  *inside* a container or VM where a wrong command can't touch your real machine.
  Anthropic ships a reference dev-container config in the claude-code repo.

- **Auto mode** (`defaultMode: auto`): a classifier checks each action and blocks
  risky ones instead of prompting. It is a research preview, costs slightly more
  per session because of the per-call check, and Anthropic still recommends
  running it in an isolated environment. It reduces risk; it does not remove it.

Neither belongs in your normal host workflow if the goal is "nothing dangerous
without my explicit say-so."

## Optional: lock yourself out of bypass mode on the host

Put this in `~/.claude/settings.json` on your laptop (NOT in the repo, or it will
also block bypass inside your dev container, which is where you legitimately want
it). This makes `--dangerously-skip-permissions` refuse to run on the host:

```json
{
  "permissions": {
    "disableBypassPermissionsMode": "disable"
  }
}
```

If you are on a Team/Enterprise plan and want this enforced for an org rather
than self-imposed, the same key plus `disableAutoMode` belongs in *managed
settings*, where users cannot override it.
