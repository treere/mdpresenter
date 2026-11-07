# Proposal

## Why

Oggi una slide è tutta visibile appena la si apre: chi presenta non può accompagnare il
discorso con il testo, perché l'ascoltatore legge la conclusione prima che venga detta. Serve
un modo per far comparire gli elementi uno alla volta restando nella stessa slide, anche
quando gli elementi stanno dentro un confronto affiancato.

## What Changes

- Un vocabolario di direttive **nominato**, con un prefisso comune e **nomi in inglese**:
  `::: step` apre un passo, `::: columns` un blocco di colonne affiancate, `::: part` inizia la
  colonna successiva dentro un blocco `::: columns`, `::: end` chiude il blocco aperto più
  interno. Ogni riga dice cosa fa, quindi leggendo il Markdown si capisce la struttura senza
  ricordare convenzioni; i quattro nomi non si somigliano, quindi un refuso non cambia il senso
  della riga.
- I passi sono blocchi `::: step` … `::: end`. La vista presentazione li rivela uno alla volta,
  nell'ordine del testo, in modo cumulativo: quelli già mostrati restano visibili.
- I blocchi si annidano: un passo può contenere un blocco colonne e un blocco colonne può
  contenere passi, quindi anche il contenuto di una singola colonna può comparire più tardi.
- `::: columns` … `::: end` con due o più parti `::: part` rende N colonne affiancate. Il
  vecchio `::: left` / `::: right` sparisce, e con lui la chiusura anonima `:::`.
- La riga di soli `:::` non è più una direttiva: si vede come testo, come qualunque nome non
  riconosciuto.
- Nella vista presentazione avanti (frecce, swipe, pulsanti) rivela il passo successivo prima di
  passare alla slide dopo; indietro li ripercorre al contrario e, tornando alla slide precedente,
  la mostra con tutti i passi visibili.
- Gli elementi non ancora mostrati restano al loro posto ma invisibili: il testo non si
  riposiziona a ogni passo e l'avviso di sbordo continua a misurare la slide completa.
- Il contatore dice anche il passo quando la slide ne ha più di uno (`2/5 · 1/3`).
- **L'export PDF ignora i passi**: una slide, una pagina, con tutto visibile. Anche l'anteprima
  dell'editor mostra la slide intera, così si scrive senza indovinare.
- Una slide senza direttive si comporta esattamente come oggi: un passo, nessuna variazione.
- La sintassi vecchia non resta in piedi: la retrocompatibilità è fuori scope per decisione
  sull'issue (#14). Gli esempi dell'app vengono riscritti in questa change; i testi già salvati
  con `::: left` / `::: right` mostrano le vecchie direttive come testo finché non si riscrivono
  a mano.
- I testi nuovi dell'interfaccia entrano in italiano e inglese come il resto dell'app.

## Non-goals

- Nessuna animazione, dissolvenza o transizione fra slide: la comparsa è immediata.
- Nessuna scelta del passo nell'URL: il link continua a puntare alla slide, non al passo.
- Nessun ordine dei passi diverso da quello del testo: niente passi fuori sequenza o ripetuti.
- Nessun passo dentro un passo: un `::: step` annidato in un altro resta testo, come le altre
  direttive non riconosciute nel contesto.
- Nessun cambio al formato del link condiviso, alla libreria locale o all'editor.
- Nessun alias e nessun dialetto della vecchia sintassi: una sola forma per ogni cosa.
- Nessuna dipendenza nuova.

## Capabilities

### New Capabilities

_(nessuna)_

### Modified Capabilities

- `presentazione`: il Markdown di una slide riconosce le direttive nominate `::: step`,
  `::: columns`, `::: part` e `::: end`, annidabili; la navigazione attraversa i passi prima
  di cambiare slide.
- `esportazione-pdf`: la stampa mostra ogni slide completa, indipendentemente dai passi.

## Impact

Codice: `src/lib/slides.ts` (predicato unico della grammatica e conteggio dei passi, con test in
`src/lib/slides.test.ts`), `src/lib/markdown.ts` (estensione di blocco per `::: step` e
`::: columns` con N colonne, con test in `src/lib/markdown.test.ts`), `src/lib/Viewer.svelte`
(rivelazione dei passi, navigazione, contatore, stili), `src/routes/+page.svelte` (anteprima
sempre completa), `src/lib/i18n.ts` (testi del contatore), `src/lib/examples.ts` (esempi migrati
alla nuova sintassi). Nessuna dipendenza nuova, nessun file in `.github/workflows/` né in
`openspec/specs/`.
