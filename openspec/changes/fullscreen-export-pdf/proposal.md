# Proposal

## Why

Le slide si presentano dal vivo: servono schermo intero per proiettare e un PDF
da inviare o stampare dopo.

## What Changes

- Pulsante schermo intero sul visualizzatore (una slide alla volta, navigazione attiva)
- Pulsante esporta PDF: apre la stampa con foglio ottimizzato (una slide per pagina)
- Uscita dallo schermo intero con tasto Esc e pulsante dedicato

## Capabilities

### New Capabilities

- `esportazione-pdf`: generazione di un PDF della presentazione, una slide per pagina

### Modified Capabilities

- `presentazione`: il visualizzatore offre la modalità schermo intero

## Impact

- Nessuna dipendenza nuova (API fullscreen del browser + stampa)
- Nessun cambio a editor, URL o navigazione esistente
