# Proposal

## Why

Oggi una slide è tutta visibile appena la si apre: chi presenta non può accompagnare il
discorso con il testo, perché l'ascoltatore legge la conclusione prima che venga detta. Serve
un modo per far comparire gli elementi uno alla volta restando nella stessa slide.

## What Changes

- Un solo vocabolario nel Markdown, lo stesso per i passi e per le colonne: una riga di soli
  `:::` separa le parti di ciò che la contiene, una riga `::: <nome>` apre un blocco che
  termina con `::: fine`.
- Al livello della slide le parti sono **passi**: la vista presentazione ne mostra uno alla
  volta, in ordine, e quelli già mostrati restano visibili.
- Dentro un blocco `::: colonne` … `::: fine` le parti sono **colonne affiancate** (due o più).
  Il vecchio `::: left` / `::: right` sparisce: la chiusura anonima `:::` diventa `::: fine` e
  il separatore fra colonne è la stessa riga `:::` dei passi.
- Nella vista presentazione avanti (frecce, swipe, pulsanti) scorre le parti della slide prima
  di passare alla slide dopo; indietro le ripercorre al contrario e, tornando alla slide
  precedente, la mostra con tutte le parti visibili.
- Gli elementi non ancora mostrati restano al loro posto ma invisibili: il testo non si
  riposiziona a ogni passo e l'avviso di sbordo continua a misurare la slide completa.
- Il contatore dice anche il passo quando la slide ne ha più di uno (`2/5 · 1/3`).
- **L'export PDF ignora le parti**: una slide, una pagina, con tutto visibile. Anche
  l'anteprima dell'editor mostra la slide intera, così si scrive senza indovinare.
- Una slide senza righe `:::` si comporta esattamente come oggi: un passo, nessuna variazione.
- La sintassi vecchia non resta in piedi: la retrocompatibilità è fuori scope per decisione
  sull'issue (#14). Gli esempi dell'app vengono riscritti in questa change; i testi già salvati
  con `::: left` / `::: right` mostrano le vecchie direttive come testo finché non si
  riscrivono a mano.
- I testi nuovi dell'interfaccia entrano in italiano e inglese come il resto dell'app.

## Non-goals

- Nessuna animazione, dissolvenza o transizione fra slide: la comparsa è immediata.
- Nessuna scelta del passo nell'URL: il link continua a puntare alla slide, non al passo.
- Nessun passo dentro una colonna: dentro un blocco `:::` separa le parti di quel blocco.
- Nessun cambio al formato del link condiviso, alla libreria locale o all'editor.
- Nessun alias e nessun dialetto della vecchia sintassi: una sola forma per ogni cosa.
- Nessuna dipendenza nuova.

## Capabilities

### New Capabilities

_(nessuna)_

### Modified Capabilities

- `presentazione`: il Markdown di una slide riconosce le direttive `:::`, con le parti come
  passi; le colonne usano la stessa sintassi; la navigazione attraversa i passi prima di
  cambiare slide.
- `esportazione-pdf`: la stampa mostra ogni slide completa, indipendentemente dalle parti.

## Impact

Codice: `src/lib/slides.ts` (grammatica delle direttive e `splitSteps`, con test in
`src/lib/slides.test.ts`), `src/lib/markdown.ts` (estensione dei blocchi generalizzata a N parti
e alla chiusura `::: fine`, con test in `src/lib/markdown.test.ts`), `src/lib/Viewer.svelte`
(stato del passo, navigazione, contatore, stili delle parti nascoste e della griglia),
`src/routes/+page.svelte` (anteprima sempre completa), `src/lib/i18n.ts` (testi del contatore),
`src/lib/examples.ts` (esempi migrati alla nuova sintassi). Nessuna dipendenza nuova, nessun
file in `.github/workflows/` né in `openspec/specs/`.
