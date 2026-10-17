# Design

## Context

Home con editor + viewer e testo nell'hash. La vista `/v` riusa gli stessi
mattoni senza editor. Vedi proposal.md (Why).

## Goals / Non-Goals

**Goals:**

- `/v` con solo viewer navigabile e lo stesso tema globale
- Copia link in un tocco con fallback visibile

**Non-Goals:**

- Presentatore con note o vista relatore: change future
- Password o link privati: l'URL resta pubblico a chi ce l'ha

## Decisions

- **Route `/v` con proprio `+page.svelte`**: legge l'hash come la home (stesse
  funzioni `decodifica`/`splitSlides`), esempio di fallback se vuoto.
- **Link di condivisione**: `${location.origin}${base}/v#${codifica(testo)}`,
  con `base` da importare dove serve (stesso `resolve()` usato nella nav).
  Pulsante nella barra del viewer? No: nella home sopra/sotto il viewer, così
  sta vicino al contenuto da condividere.
- **Copia**: `navigator.clipboard.writeText` con fallback a campo di testo
  selezionabile se rifiutato; conferma visiva ("Copiato!").

## Risks / Trade-offs

- [Appunti bloccati su HTTP o permessi negati] → fallback con link selezionabile, da spec
