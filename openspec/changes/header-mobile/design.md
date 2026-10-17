# Design

## Context

Header flex su una riga: marchio, nav con 3 link, 2 select. Su ~360px sborda.
Vedi proposal.md (Why).

## Goals / Non-Goals

**Goals:**

- Zero scroll orizzontale fino a 320px, tutto raggiungibile

**Non-Goals:**

- Menu hamburger: troppa struttura per 3 link; si compatta in place

## Decisions

- **Menu hamburger sotto i 700px**: pulsante con icona che apre un pannello con
  nav + selettori; chiusura alla scelta di un link e con Esc. Desktop invariato.
  Alternativa: due righe compatte (scartata: occupa sempre spazio verticale
  anche quando non serve).

## Risks / Trade-offs

- Nessuno rilevante: solo CSS con breakpoint esistente.
