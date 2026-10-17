# Proposal

## Why

Le presentazioni tecniche contengono codice e dati: senza evidenziazione i blocchi
di codice sono muri di testo grigio, e senza tabelle non si mostrano dati strutturati.

## What Changes

- Evidenziazione sintassi nei blocchi di codice con linguaggio dichiarato (ad es. ```js)
- Rendering delle tabelle Markdown (GFM) con intestazione e allineamento colonne
- Tema di evidenziazione leggibile su telefono e desktop

## Capabilities

### New Capabilities

Nessuna.

### Modified Capabilities

- `presentazione`: il rendering delle slide ora evidenzia il codice e rende le tabelle

## Impact

- Nuove dipendenze leggere per evidenziazione (scelta nel design)
- Nessun cambio a editor, URL o navigazione
