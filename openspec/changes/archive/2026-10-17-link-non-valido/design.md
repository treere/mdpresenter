# Design

## Context

Oggi: hash assente o invalido → esempio, senza distinzione. Vedi proposal.md (Why).

## Goals / Non-Goals

**Goals:**

- Link rotto distinguibile: avviso + editor vuoto

**Non-Goals:**

- Dettagli tecnici dell'errore: messaggio semplice, niente codici

## Decisions

- **Tre stati all'avvio**: nessun hash → esempio (come oggi); hash valido → testo;
  hash invalido → editor vuoto + banner di avviso chiudibile.
- **Banner**: stesso stile dell'app, localizzato IT/EN, con pulsante di chiusura.
  Vale per home e `/v` (in `/v` mostra solo avviso, niente editor).

## Risks / Trade-offs

- Nessuno rilevante.
