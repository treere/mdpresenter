# Proposal

## Why

Oggi un link apre sempre la prima slide: per dire "guarda la slide 7" non c'è
modo. Serve l'indice della slide nell'URL, e per farlo si passa tutto ai query param.

## What Changes

- URL in forma `?t=<testo>&s=<indice>`: testo come oggi, indice 0-based della slide
- Navigando si aggiorna `s`; aprendo un link con `s` si parte da quella slide
- Vecchi link con hash non più supportati (rottura accettata, come le scorse)

## Capabilities

### New Capabilities

Nessuna.

### Modified Capabilities

- `editor`: testo e indice slide nei query param invece che nell'hash
- `presentazione`: apertura diretta su una slide specifica

## Impact

- Cambia formato URL ovunque (home, `/v`, copia link, esempi)
- Privacy: il testo finisce nei log server e nei Referer (vedi Rischi)
