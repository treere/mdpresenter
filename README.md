# mdpresenter

Write Markdown slides and present them from the browser. Frontend only, no account, no server.

Live at <https://treere.github.io/mdpresenter/>

## Features

- Markdown editor with live slide preview (`---` separates slides)
- Code highlighting, tables, links and images
- Shareable URL: the text lives in the link (compressed)
- Viewer-only page (`/v`), fullscreen, PDF export (one slide per page)
- Light, dark and vivid themes (remembered)
- Italian and English, example decks, offline-friendly static build

## Develop

```sh
npm install
npm run dev    # serves on /
npm test       # unit tests
npm run check  # types + Svelte diagnostics
```

Production is served under `/mdpresenter` (via `BASE_PATH`); locally it stays on `/`.

## Build & deploy

```sh
npm run build
```

Pushing to `main` publishes automatically to GitHub Pages via GitHub Actions.

## Specs

Decisions live in `openspec/` (in Italian): proposal, design and tasks per change, with synced specs as source of truth.
