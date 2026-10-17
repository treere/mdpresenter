# Design

## Context

Rendering via `marked` + highlight + DOMPurify, tutto sincrono. Mermaid rende
in asincrono e pesa: va isolato. Vedi proposal.md (Why).

## Goals / Non-Goals

**Goals:**

- Diagrammi SVG da blocchi mermaid, codice da mermaid-code, errore garbato

**Non-Goals:**

- Editor visuale dei diagrammi, temi mermaid personalizzati, zoom/pan: dopo

## Decisions

- **Libreria `mermaid` con import dinamico**: caricata solo se la slide contiene
  blocchi mermaid, così il bundle iniziale non cresce. Inizializzata con
  `startOnLoad: false` e tema dal sito (chiaro/scuro).
- **Due linguaggi**: `mermaid` → contenitore con sorgente in `data-` che il
  visualizzatore renderizza dopo l'HTML; `mermaid-code` → alias di `mermaid`
  per highlight.js (mostra codice con linguaggio "mermaid").
  Alternativa: toggle UI per blocco (scartata: stato in più da persistere,
  l'autore decide meglio nel testo).
- **Pipeline**: `marked` produce `<pre data-mermaid-src="...">`, poi il componente
  chiama `mermaid.render` per blocco e sostituisce con l'SVG sanificato;
  errore di sintassi → box "diagramma non valido" con il testo originale.
- **Sanificazione**: SVG passato in DOMPurify dopo il render (mermaid emette
  SVG con stili inline ammessi).

## Risks / Trade-offs

- [Peso mermaid anche lazy (~1MB)] → solo su richiesta, con cache dopo il primo uso
- [Mermaid e SSR/prerender] → render solo client, in `$effect` come l'HTML
