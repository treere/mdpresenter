# Proposal

## Why

Oggi per mostrare le slide a qualcuno devi condividere la pagina con l'editor
a fianco: sporco per chi presenta e confusionario per chi guarda. Serve un link
che apre solo la presentazione, facile da copiare dalla pagina stessa.

## What Changes

- Pagina `/v` che mostra solo il visualizzatore (niente editor), con lo stesso testo dell'URL
- Schermo intero e download PDF disponibili anche nella vista presentazione
- Pulsante "Copia link presentazione" nella home che copia l'URL della vista sola
- Il link funziona anche aperto direttamente: stesso testo, stesse slide, stesso tema

## Capabilities

### New Capabilities

- `vista-presentazione`: pagina con solo il visualizzatore e link facile da condividere

### Modified Capabilities

Nessuna.

## Impact

- Nuova route `/v`, riuso di decodifica e visualizzatore esistenti
- Nessun cambio a editor, temi o deploy
