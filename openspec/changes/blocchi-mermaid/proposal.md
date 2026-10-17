# Proposal

## Why

Le presentazioni tecniche hanno bisogno di diagrammi (flussi, architetture,
sequenze): oggi c'è solo testo e tabelle. Mermaid li descrive in testo e li
rende come grafici.

## What Changes

- Blocchi ```mermaid resi come diagrammi SVG nelle slide
- Blocchi ```mermaid-code mostrati come codice evidenziato
- Scelta per blocco decisa dall'autore nel Markdown
- Esempio con diagramma nella pagina esempi

## Capabilities

### New Capabilities

Nessuna.

### Modified Capabilities

- `presentazione`: le slide rendono i diagrammi mermaid oltre a codice e tabelle

## Impact

- Nuova dipendenza `mermaid` (caricata solo quando serve)
- Nessun cambio a editor, URL o navigazione
