# Design

## Context

Identificatori italiani ovunque: `Visualizzatore`, `condiviso`, `codifica`,
`ESEMPIO`, classi `.pannelli`/`.stampa`, `data-tema` con valori
chiaro/scuro/vivace. Vedi proposal.md (Why).

## Goals / Non-Goals

**Goals:**

- Codice interamente in inglese, build e test verdi

**Non-Goals:**

- Cambio comportamenti o testi visibili

## Decisions

- **Rinomine 1:1**: `Visualizzatore`→`Viewer`, `condiviso`→`shared`
  (`preferenze`→`preferences`, `appoggio`→`pending`), `codifica`→`encode`,
  `decodifica`→`decode`, `ESEMPIO`→`SAMPLE`, `ESEMPI`→`EXAMPLES`
  (campi `title`/`description`/`text`), chiavi dizionari in inglese.
- **CSS e attributi**: classi in inglese, `data-tema`→`data-theme`,
  valori `light`/`dark`/`vivid`; `localStorage` rilegge i nuovi valori
  (chi aveva un tema salvato riparte dal chiaro).
- **Regola permanente** in `openspec/config.yaml`: codice e commenti sempre
  in inglese (gli artefatti restano in italiano).

## Risks / Trade-offs

- [Dimenticare un riferimento] → `check` + build + grep di controllo a fine lavoro
