# Proposal

## Why

Le slide hanno bisogno di struttura: testo-immagine affiancati, due elenchi
a confronto. Oggi c'è solo il flusso verticale, le immagini escono dai bordi
e nessuno avvisa quando una slide sborda.

## What Changes

- Blocchi a due colonne con sintassi autore: `::: colonne`, `::: left`, `::: right`
- Immagini sempre contenute nella slide (mai fuori dai bordi)
- Avviso visivo quando una slide supera la viewport (i titoli restano intoccabili)

## Capabilities

### New Capabilities

Nessuna.

### Modified Capabilities

- `presentazione`: colonne affiancate, immagini auto-dimensionate, avviso di sbordo

## Impact

- Estensione marked per i blocchi colonna + CSS; resto invariato
