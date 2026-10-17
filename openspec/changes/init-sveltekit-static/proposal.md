# Proposal

## Why

`mdpresenter` deve diventare un'app solo frontend che presenta slide scritte in Markdown,
pubblicata come pagina statica su GitHub Pages e provabile dal telefono tramite URL pubblico.
Si parte dallo scaffolding e da una pagina minima, le funzionalità arrivano dopo.

## What Changes

- Scaffolding SvelteKit (Svelte 5, TypeScript strict, npm) con output statico (`adapter-static`)
- Pagina iniziale che mostra la scritta `mdpresenter` centrata
- Workflow GitHub Actions per build e deploy su Pages dal ramo `main`
- Percorso base `/mdpresenter` in produzione (variabile `BASE_PATH`), `/` in locale
- File `.nvmrc` con Node 22

## Capabilities

### New Capabilities

- `home`: la pagina iniziale del sito, con la scritta `mdpresenter` centrata nella viewport

### Modified Capabilities

- Nessuna (repo appena creato, nessuna spec esistente)

## Impact

- Nuovo progetto: nessun codice esistente da modificare
- Dipendenze: SvelteKit, `adapter-static`, Node 22 in CI
- Hosting: GitHub Pages (nessun backend)
