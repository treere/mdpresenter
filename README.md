# mdpresenter

Slide da Markdown, solo frontend. SvelteKit con output statico, pubblicato su GitHub Pages.

## Sviluppo

```sh
npm install
npm run dev
```

Il sito in locale è su `/`; in produzione sta sotto `/mdpresenter` (gestito con `BASE_PATH`).

## Build e deploy

```sh
npm run check
npm run build
```

Il push su `main` pubblica in automatico su <https://treere.github.io/mdpresenter/> tramite GitHub Actions.

## Specifiche

Le decisioni stanno in `openspec/` (tutto in italiano): proposta, design e task della change corrente.
