# Proposal

## Why

Oggi è una pagina singola solo in italiano senza spiegazioni: per sembrare un
progetto serio servono navigazione, due lingue e pagine che raccontino cosa si
può fare e cos'è il progetto.

## What Changes

- Selettore tema sempre raggiungibile (anche dalla scheda editor su telefono)
- Italiano e inglese commutabili ovunque, anche nelle nuove pagine
- Pagina esempi: cosa si può fare + presentazioni di esempio caricabili nell'editor
- Pagina progetto: cos'è, come funziona, link al repository
- Navigazione con link alle pagine
- Footer con link al repository, favicon dedicata, pagina 404 e meta description

## Capabilities

### New Capabilities

- `lingua`: interfaccia in italiano e inglese, commutabile ovunque e ricordata
- `pagine`: pagine informative (esempi, progetto) con navigazione

### Modified Capabilities

- `presentazione`: il selettore tema è raggiungibile da ogni vista, non solo dal visualizzatore

## Impact

- Nuove route SvelteKit, dizionari IT/EN, contenuti di esempio nelle due lingue
- Nessun cambio a rendering, URL condivisi o deploy
