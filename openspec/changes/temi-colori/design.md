# Design

## Context

Visualizzatore con stili fissi chiari. Il tema tocca solo i colori delle slide,
non il resto dell'app. Vedi proposal.md (Why).

## Goals / Non-Goals

**Goals:**

- Tre temi applicati a slide, codice e tabelle
- Scelta persistente tra visite, stampa sempre chiara

**Non-Goals:**

- Temi personalizzati dall'utente o per singola slide: change future

## Decisions

- **Temi come attributo `data-tema` sul contenitore slide** (`chiaro` default, `scuro`,
  `vivace`), con variabili CSS per sfondo, testo, accenti e codice.
  Alternativa: classi separate per tema (scartata: più selettori duplicati).
- **Persistenza in `localStorage`** (preferenza personale del dispositivo).
  Alternativa: parametro nell'URL (scartato: il link condiviso deve portare il
  contenuto, non i gusti di chi lo manda).
- **Stampa**: il foglio `@media print` forza i colori chiari, indipendente dal tema attivo.
- **Colorato `vivace`**: sfondo blu notte con accenti gialli e testo bianco;
  scuro: grigi con testo chiaro; chiaro: gli attuali.

## Risks / Trade-offs

- [Contrasto insufficiente in qualche combinazione] → verificato a occhio sui tre temi
  con codice e tabelle prima del merge
