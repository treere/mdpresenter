# Design

## Context

Visualizzatore esistente con navigazione. PDF ed fullscreen sono API del browser,
nessun backend. Vedi proposal.md (Why).

## Goals / Non-Goals

**Goals:**

- Schermo intero con navigazione invariata
- PDF con una slide per pagina via stampa del browser

**Non-Goals:**

- Generazione PDF senza dialogo di stampa (richiederebbe librerie pesanti)
- Temi di stampa personalizzati: foglio pulito con gli stessi stili delle slide

## Decisions

- **Fullscreen: Fullscreen API su `requestFullscreen()` del contenitore viewer**
  Pulsante entra/esci + tasto Esc nativo. In fullscreen si mostra solo la slide
  (niente editor). Alternativa: overlay CSS a tutto viewport (scartato: non è vero
  schermo intero su proiettori e non nasconde i controlli del browser).
- **PDF: `window.print()` con foglio `@media print`** che stampa TUTTE le slide,
  una per pagina (`break-after: page`), nascondendo editor, pulsanti e contatore.
  Alternativa: jsPDF/html2canvas (scartata: bundle pesante, resa peggiore del motore
  di stampa nativo).
- **Stampa dal vivo**: sezione di stampa nascosta a schermo (`display: none`) con
  tutte le slide renderizzate, visibile solo in `@media print`.

## Risks / Trade-offs

- [iOS Safari e fullscreen su iPhone: API limitata] → il pulsante resta ma su iPhone
  potrebbe non entrare in vero fullscreen; la presentazione resta usabile
- [Impaginazione di stampa variabile tra browser] → una slide per pagina con
  `break-inside: avoid` come rete di sicurezza
