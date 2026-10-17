# Proposal

## Why

Il testo in chiaro nell'URL diventa lungo in fretta e su alcuni browser i link
oltre i ~2000 caratteri non si aprono ovunque. Comprimendolo i link restano
corti e condivisibili.

## What Changes

- Testo compresso con gzip nativo (`CompressionStream`) + base64url nell'hash
- Soglia minima: sotto ~200 caratteri resta in chiaro (la compressione allungherebbe)
- I vecchi link in chiaro non sono più supportati (rottura accettata)

## Capabilities

### New Capabilities

Nessuna.

### Modified Capabilities

- `editor`: il testo nell'URL è compresso invece che in chiaro

## Impact

- Solo `slides.ts` (codifica/decodifica asincrone) e chiamanti
- Nessuna dipendenza nuova, nessun cambio visibile
