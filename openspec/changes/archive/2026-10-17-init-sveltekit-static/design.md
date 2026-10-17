# Design

## Context

Repo appena creato, nessun codice esistente. Serve lo scaffolding iniziale con deploy
automatico su GitHub Pages. Vedi proposal.md (Why) per la motivazione.

## Goals / Non-Goals

**Goals:**

- Scaffolding SvelteKit con output statico pronto al deploy
- Home con scritta centrata come da spec `home`
- Deploy automatico su Pages a ogni push su `main`

**Non-Goals:**

- Funzionalità slide (editor, rendering Markdown, navigazione): change future
- Temi, fullscreen, stampa PDF, condivisione via URL: fuori ambito

## Decisions

- **SvelteKit ultima stabile (Svelte 5) con TypeScript strict via `sv create --template minimal`**
  Alternativa: template demo (scartato: codice superfluo) o setup manuale (scartato: più errori).
- **`adapter-static` con fallback `404.html` e prerender della home**
  Alternativa: `adapter-auto` (scartato: non garantisce output statico su Pages).
- **Percorso base condizionale: `BASE_PATH=/mdpresenter` in CI, vuoto in locale**
  Su Pages il sito sta sotto `/mdpresenter`, in locale su `/`. Alternativa: percorso
  fisso (scartato: rompe il dev locale) o custom domain subito (rinviato).
- **Configurazione nel plugin `sveltekit()` di `vite.config.ts`**
  SvelteKit 3 non legge più `svelte.config.js`: adapter e `paths.base` vanno nel plugin.
- **npm + `.nvmrc` con Node 22**
  Scelta default, zero configurazioni. La CI usa `setup-node` con Node 22.
- **Workflow Pages con action ufficiali** (`upload-pages-artifact` + `deploy-pages`)
  Alternativa: branch `gh-pages` con push manuale (scartato: più fragile).

## Risks / Trade-offs

- [Versione SvelteKit al momento dello scaffolding] → usare quella proposta dal template,
  senza pinnare major diverse
- [Push del workflow richiede token con scope `workflow`] → se il push viene rifiutato,
  pushare prima il codice e aggiungere il workflow con un token adeguato

## Migration Plan

- Primo deploy: push su `main`, attivazione Pages con sorgente GitHub Actions, verifica URL
- Rollback: revert del commit su `main` (il deploy precedente resta servito fino al nuovo build)
