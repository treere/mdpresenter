# Design

## Context

Scaffolding SvelteKit statico esistente con home statica. Vedi proposal.md (Why).
Tutto resta client-side: nessun backend né storage server.

## Goals / Non-Goals

**Goals:**

- Editor con anteprima dal vivo, separatore `---`, navigazione completa
- Testo nell'URL condivisibile tra telefono e desktop

**Non-Goals:**

- Evidenziazione sintassi ed editing ricco (textarea semplice)
- Temi slide, fullscreen, stampa PDF: change future

## Decisions

- **Libreria Markdown: `marked`** (leggera, GFM, output HTML da sanificare).
  Alternativa: `remark`+`rehype` (scartata: più pesante per questo MVP).
  Sanificazione con `DOMPurify` o `marked` + escape: da fissare in implementazione,
  mai HTML grezzo da input utente.
- **Codifica URL: `location.hash` con base64url del testo** (compatta, non tocca il server).
  Aggiornamento con debounce via `history.replaceState` per non intasare la cronologia.
  Alternativa: query param (scartato: finisce nei log server) e localStorage
  (scartato: non condivisibile, l'utente ha scelto l'URL).
- **Stato in Svelte runes**: testo, indice slide, vista (editor/anteprima su telefono).
  Split su `/^---$/m` con trim; indice clampato tra 0 e N-1.
- **Layout**: CSS grid due colonne su desktop, schede Editor/Anteprima sotto breakpoint mobile.
- **Navigazione**: `ArrowLeft`/`ArrowRight` su window, click zone laterali, touch swipe
  con soglia minima; indicatore `i/N`.

## Risks / Trade-offs

- [URL lunghi oltre ~2000 caratteri su alcuni browser] → nessun blocco: se il testo
  supera la soglia, mostrare avviso che il link potrebbe non aprirsi ovunque
- [XSS da Markdown] → sanificare sempre l'HTML prima del `{@html}`

## Open Questions

- Nessuna: le scelte rinviate (temi, PDF) sono fuori ambito per decisione presa.
