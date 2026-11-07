# AGENTS.md — how to work in this repository

Instructions for agents working on this repo. The owner is `@treere`: anything not
written here is not authorized.

## The repo

`mdpresenter` is a **frontend-only** app: static SvelteKit, published to GitHub Pages
under `/mdpresenter`, served at `/` locally. No server, no accounts, no database, no
secrets. Slide content lives in the link.

## The single verification command

```sh
npm ci && npm run check && npm test && npm run build
```

This is the only valid check: if it does not pass, the work is not done and no PR moves
to ready. Expected baseline: 0 errors, 0 warnings from `svelte-check`.
Note: `.nvmrc` pins Node 22 (CI uses 22); the working environment may run a newer Node.
If a behaviour difference shows up only locally, suspect the version before touching code.

## Hard rules

1. **Never push to `main`.** Branches are `hermes/<issue-number>-<slug>`. A human merges.
2. **Never touch `.github/workflows/`.** The agent token has no Workflows scope: GitHub
   would reject the push. If a task seems to require it, stop and write it on the issue
   with the `agent-blocked` label.
3. **Never edit `openspec/specs/` by hand.** Specs are updated only by
   `openspec-archive-change`, which syncs the deltas of an approved change.
4. **No new dependencies** without explicit approval on the issue. The project has 12
   dependencies and keeps them.
5. **Never apply the `spec-approved` label.** Only a human does that.
6. **Never merge, never enable auto-merge.**

## The flow: issue → change → gate → apply → archive

Every request goes through an OpenSpec change. The generated skills live in `.hermes/skills/`:

| Phase | Skill | Output |
|---|---|---|
| 1. Triage and proposal | `openspec-propose` | `openspec/changes/<id>/` (proposal, design, tasks) |
| 2. Apply | `openspec-apply-change` | one commit per task, checkboxes ticked |
| 3. Close | `openspec-archive-change` + `openspec-sync-specs` | deltas merged into `openspec/specs/`, change moved to `archive/` |

Before proposing, **read `openspec/specs/`**: if the request contradicts behaviour that is
already specified, it is not a change, it is a product decision. Stop and say so on the issue.

### State labels

- `agent-change` — request that needs a change: the agent may start triage.
- `agent-fix` — bugfix restoring already-specified behaviour: no change, fix directly.
- `spec-review` — the proposal is ready and waits for a human.
- `needs-info` — the agent asked questions and waits for answers.
- `spec-approved` — **human only.** Code is written from here on.
- `agent-blocked` — a decision the agent cannot make is required.
- `agent-done` — PR merged and change archived.

## Where the conversation happens

- **Issue = intent and decisions.** What must happen, what is out of scope, the questions.
- **PR = implementation.** Questions about code, inline comments, verification.
- An intent question in the PR, or a code question on the issue, is in the wrong place:
  move the conversation and leave a link.

Consistency rule: when the PR is opened, the issue gets a one-line comment with the link.
From then on, new decisions still go on the issue.

## When something is unclear

1. Ask **at most 3 questions**, each **closed**, each with the default you would adopt:
   "there are `ConfirmDialog` and `Modal`: which one? (default: `ConfirmDialog`)".
2. Every question cites what produced it: file, line, observed behaviour.
3. **Never ask what is in the code.** If you don't know where a component lives, search.
   A question like that means these instructions are thin: say so.
4. Post the questions as an issue comment, apply `needs-info`, and end the run.
5. If nobody answers within **one business day**, apply the defaults and write them in the
   PR body under "Assumptions". An endless wait is worse than a recorded assumption.

## Project conventions

- OpenSpec artifacts (proposal, tasks, specs) are written **in Italian**; code, file names,
  variables and comments **in English**; visible UI text in Italian and English. This file,
  issues and PR descriptions are in English.
- Commits in Italian, one per task when applying a change.
- SvelteKit 3: no `svelte.config.js`, config lives in the Vite `sveltekit()` plugin; `$app/*`
  types are declared in `app.d.ts`; internal links use `resolve()` to respect the
  `/mdpresenter` base path.
- Cross-route shared state in `.svelte.ts` modules holding `$state`; device preferences in
  `localStorage`, shareable content in the URL (fragment `#`, never the query string).
- Markdown into `{@html}`: sanitize the **final** HTML with DOMPurify; mermaid initialized
  with a global `htmlLabels: false`.
- `@media print` rules go in a global stylesheet imported by the layout: Svelte component
  styles are scoped and cannot reach siblings.

## Before saying "done"

- `npm run check && npm test && npm run build` is green.
- `openspec validate <id>` is green for the change.
- No file touched outside the ones the tasks name.
- The diff contains no `.github/workflows/**`, no `openspec/specs/**`, no new dependencies.
