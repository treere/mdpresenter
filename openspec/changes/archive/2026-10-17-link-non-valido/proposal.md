# Proposal

## Why

Oggi un link rotto o corrotto mostra in silenzio l'esempio: sembra che funzioni,
ma non sono le tue slide. Serve un avviso chiaro.

## What Changes

- Se il codice nell'URL non si decodifica, avviso visibile invece dell'esempio silenzioso
- L'editor parte comunque vuoto e utilizzabile

## Capabilities

### New Capabilities

Nessuna.

### Modified Capabilities

- `editor`: decodifica fallita mostra un avviso invece di cadere in silenzio sull'esempio

## Impact

- Solo home e vista `/v`; nessun cambio a codifica o link validi
