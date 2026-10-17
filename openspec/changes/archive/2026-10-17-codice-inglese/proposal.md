# Proposal

## Why

Il codice è scritto in italiano (nomi file, variabili, funzioni, commenti):
si passa tutto all'inglese, come standard. I testi visibili restano IT/EN.

## What Changes

- Nomi file, variabili, funzioni, tipi e commenti in inglese
- Classi CSS, attributi `data-*` e valori tema in inglese
- Chiavi dei dizionari in inglese (i testi IT/EN restano)
- Unica differenza visibile: il tema salvato si azzera una volta

## Capabilities

Nessuna: refactor puro, nessun comportamento cambia (`skip_specs: true`).

## Impact

- Tocca quasi tutti i file `src/`; verifiche con check, test e build
