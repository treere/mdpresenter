# Design

## Context

Rendering attuale: `marked` + `DOMPurify` nel componente Visualizzatore.
Tabelle GFM già parsate da `marked` di default, manca solo lo stile;
il codice richiede un evidenziatore. Vedi proposal.md (Why).

## Goals / Non-Goals

**Goals:**

- Blocchi di codice con linguaggio evidenziati, senza linguaggio in monospace semplice
- Tabelle con intestazione distinta e allineamento colonne, scroll orizzontale su telefono

**Non-Goals:**

- Scelta del tema da parte dell'utente, numeri di riga, copia negli appunti: change future

## Decisions

- **Evidenziazione: `highlight.js` con i linguaggi comuni** via `marked-highlight`.
  Alternativa: `shiki` (scartato: più pesante, temi grandi) e Prism (scartato: plugin ESM scomodi).
  Linguaggio sconosciuto o assente: fallback a testo semplice.
- **Tabelle: nessun parser nuovo** (`marked` fa già GFM); solo CSS: intestazione
  distinta, bordi leggeri, `overflow-x: auto` per schermi stretti.
- **Stili del codice**: un CSS `highlight.js` compatto importato nel componente,
  non globale, così resta nel bundle della pagina.

## Risks / Trade-offs

- [Peso del bundle con tutti i linguaggi] → importare solo i comuni (js/ts, python,
  bash, json, markdown, html/css); gli altri cadono nel fallback semplice
- [HTML evidenziato e sanificazione] → sanificare DOPO l'evidenziazione, prima del `{@html}`
