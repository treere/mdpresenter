# Design

## Context

Codifica attuale sincrona in `slides.ts`: base64url dell'UTF-8. Vedi proposal.md (Why).

## Goals / Non-Goals

**Goals:**

- URL corti con gzip nativo, vecchi link in chiaro abbandonati

**Non-Goals:**

- Retrocompatibilità, altre codifiche, compressione di immagini: fuori ambito

## Decisions

- **`CompressionStream('gzip')` nativo** per comprimere, `DecompressionStream('gzip')`
  per leggere; base64url sui byte. Alternativa fflate (scartata: dipendenza inutile
  per due `await`).
- **Prefisso `1` + soglia 200 caratteri**: sopra si comprime, sotto resta in chiaro
  (con prefisso `0`). I vecchi link senza prefisso non si aprono più, per scelta.
- **`codifica`/`decodifica` diventano `async`**: l'unico chiamante in scrittura è
  già dentro un debounce (si aspetta la promise), in lettura è all'avvio pagina.

## Risks / Trade-offs

- [Browser senza `CompressionStream` (molto vecchi)] → l'app mostra l'esempio
  invece di rompersi; niente polyfill per scelta
