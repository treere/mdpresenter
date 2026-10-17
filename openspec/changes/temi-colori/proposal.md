# Proposal

## Why

Le slide tutte uguali stancano: servono un tema scuro per proiettare al buio
e uno colorato per presentazioni più vivaci, con l'ultimo usato già pronto all'apertura.

## What Changes

- Tre temi slide: chiaro (attuale), scuro e colorato
- Selettore tema nel visualizzatore
- Ultimo tema ricordato tra le visite

## Capabilities

### New Capabilities

Nessuna.

### Modified Capabilities

- `presentazione`: il visualizzatore applica il tema scelto alle slide

## Impact

- Solo CSS + piccola logica di selezione, nessuna dipendenza nuova
- Stampa PDF: usa sempre il tema chiaro per restare leggibile su carta
