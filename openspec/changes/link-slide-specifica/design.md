# Design

## Context

Testo nell'hash con prefisso e gzip. L'indice slide vive solo in memoria.
Vedi proposal.md (Why).

## Goals / Non-Goals

**Goals:**

- Link con slide iniziale, navigazione che aggiorna l'URL

**Non-Goals:**

- Retrocompatibilità hash: rotta per scelta

## Decisions

- **Formato `?t=<testo>&s=<n>`**: `t` riusa codifica esistente (base64url, sicura
  in query), `s` indice 0-based; parametri assenti = default (esempio, slide 0).
- **Lettura/scrittura con `URLSearchParams`** + `replaceState` (niente reload,
  niente cronologia). Navigazione aggiorna `s`, digitazione aggiorna `t`.
- **Indice invalido** (non numero o fuori intervallo) → clamp all'ultima slide,
  mai errore.
- **Alternativa scartata**: indice nell'hash (`#t.../3`) — tiene la privacy ma
  aggiunge un formato custom da parsare e i link con due pezzi separati
  (`?`+`#`) confondono più di due query chiare.

## Risks / Trade-offs

- [Testo in chiaro nei log server e negli header Referer verso siti esterni] →
  accettato: presentazioni pensate per essere condivise; non mettere dati sensibili
- [URL lunghi come prima] → invariato rispetto all'hash
