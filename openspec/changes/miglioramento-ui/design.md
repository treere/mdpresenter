# Design

## Context

Stato attuale: pagina con h1 piccolo, textarea monospace con bordo grigio, viewer con
bordo grigio e frecce testuali ‹ ›, barra con 2 bottoni + select tema, tutto in
system-ui senza gerarchia. Vedi proposal.md (Why).

## Goals / Non-Goals

**Goals:**

- Aspetto moderno e coerente su telefono e desktop
- Stessi comportamenti, zero nuove funzioni

**Non-Goals:**

- Cambio layout (colonne/schede resta), nuove funzioni, temi aggiuntivi

## Decisions

- **Slide-canvas**: card bianca (o del tema) con ombra morbida, angoli arrotondati,
  padding generoso e larghezza di lettura; titoli con pesi/dimensioni scalati,
  interlinea ampia; `pre` e `table` con gli stili esistenti ma integrati nella card.
- **Barra strumenti sticky** sopra il viewer: gruppo navigazione (‹ › + contatore pill),
  gruppo vista (tema select stilizzata, schermo intero, PDF). Su mobile resta compatta.
- **Editor**: sfondo soft, focus ring sull'accento del tema, angoli e padding come la card.
- **Dettagli**: transizione di 150ms su cambio slide e cambio tema; zone di tocco
  di almeno 44px; focus visibile su bottoni e select per tastiera.
- **Tipografia**: stack di sistema ma con scala definita (h1 1.8rem, h2 1.4rem, corpo 1.05rem,
  interlinea 1.6) uguale in tutti i temi.

## Risks / Trade-offs

- [Gusti soggettivi] → restare sobri: pochi colori (quelli dei temi), niente animazioni invasive
