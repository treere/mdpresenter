# Design

## Context

Variabili di tema definite sul contenitore del visualizzatore: le usa solo lui.
Editor, nav a schede e sfondo pagina hanno colori fissi chiari. Pulsanti con
etichette testuali o glifi (‹ ›). Vedi proposal.md (Why).

## Goals / Non-Goals

**Goals:**

- Tema su sfondo pagina, editor, barra, schede e selettore
- Icone coerenti su tutti i pulsanti

**Non-Goals:**

- Nuovi temi o personalizzazioni: change future

## Decisions

- **Variabili di tema spostate su un contenitore a livello pagina** (`main[data-tema]`
  in `+page.svelte`, stato tema sollevato dal visualizzatore): editor, nav e viewer
  ereditano gli stessi token. Il visualizzatore riceve il tema come prop.
- **Persistenza invariata** in `localStorage`, stampa invariata (chiara).
- **Icone: `lucide-svelte`** (alberi scossi dal bundler, stile coerente):
  frecce navigazione, ingrandisci/comprimi per fullscreen, scarica/stampa per PDF,
  tavolozza per il selettore tema. Alternativa: SVG inline (scartata: più codice
  da mantenere per lo stesso risultato).

## Risks / Trade-offs

- [Nuova dipendenza] → `lucide-svelte` è leggera e tree-shaken, solo le icone usate finiscono nel bundle
