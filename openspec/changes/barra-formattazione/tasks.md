# Tasks

## 1. Modulo di editing e test

- [ ] 1.1 Creare `src/lib/editing.ts` con funzioni pure sull'intervallo di selezione, da
  `{ text, start, end }` a `{ text, start, end }`: `wrapInline` (grassetto, corsivo, codice, con
  interruttore quando i marcatori sono adiacenti alla selezione e un avvolgimento per riga sulle
  selezioni multi-riga), `applyLinePrefix` (titolo, elenco, citazione, blocco di codice, con
  interruttore e applicazione a ogni riga della selezione), `insertSlideBreak`,
  `insertDirectiveBlock` (`::: step` e `::: columns` con `::: part`, cursore dentro) e
  `applyLink`. Verifica: `npm run check` senza errori sul nuovo modulo.
- [ ] 1.2 Scrivere `src/lib/editing.test.ts` con i casi limite: nessuna selezione, selezione
  dentro una parola, selezione che include già i marcatori, selezione su due righe per i
  marcatori in linea, prefisso già presente, riga vuota, cursore a inizio e fine del testo,
  testo vuoto, blocco inserito a metà di una slide. Verifica: `npm test` verde e ogni scenario
  dei requirement «Formattazione in linea» e «Inserimenti di blocco e di struttura» coperto da
  almeno un caso.

## 2. Testi e icone

- [ ] 2.1 Aggiungere in `src/lib/i18n.ts`, sia in `it` sia in `en`, un blocco `format` con le
  etichette di tutte le azioni (grassetto, corsivo, codice, titolo, elenco, citazione, blocco di
  codice, separatore, passo, colonne, collegamento) e il `title` di ciascuna. Verifica:
  `npm run check` verde — la tipizzazione `en: Texts` garantisce che nessuna chiave manchi.

## 3. Componente della barra

- [ ] 3.1 Creare `src/lib/FormatBar.svelte`: riceve l'elenco delle azioni (`id`, icona,
  etichetta) ed emette l'id premuto; niente stato, niente accesso all'editor. Icone da
  `lucide-svelte`, `<button type="button">` con `aria-label` e `title`, area di tocco minima
  44 px, raggruppamento visivo fra in linea, blocchi e presentazione. Verifica: `npm run check`
  verde e `npm run build` verde.
- [ ] 3.2 Stili: riga sopra la `textarea`, `display: flex` con `overflow-x: auto` e nessun
  `flex-wrap`, così su telefono scorre in orizzontale e la `textarea` resta la parte che cresce;
  sulle schede strette la barra appartiene al pannello dell'editor e non compare in anteprima.
  Verifica: a 360 px di larghezza la barra scorre senza coprire l'editor e ogni pulsante resta
  raggiungibile.

## 4. Innesto nell'editor

- [ ] 4.1 In `src/routes/+page.svelte` montare `FormatBar` sopra `.editor`, leggere
  `selectionStart`/`selectionEnd` al clic, chiamare la funzione di `editing.ts`, scrivere il
  risultato con `document.execCommand('insertText')` (fallback `setRangeText` + evento `input`,
  con commento che spiega la perdita dell'undo), ripristinare `selectionStart`/`selectionEnd` e
  riportare il fuoco sulla `textarea`. Verifica: `npm run check` verde; in locale un'azione
  della barra seguita da `Ctrl+Z` riporta il testo esattamente a prima, senza perdere le
  digitazioni precedenti.
- [ ] 4.2 Aggiungere il gestore `keydown` sull'editor per `Ctrl/Cmd+B`, `Ctrl/Cmd+I` e
  `Ctrl/Cmd+K`, con `preventDefault` solo quando l'azione esiste. Verifica: con il fuoco
  nell'editor le tre scorciatoie funzionano; con il fuoco fuori dall'editor il testo non cambia;
  le frecce continuano a navigare le slide.
- [ ] 4.3 Collegare l'inserimento del separatore e delle direttive al testo corrente, e
  controllare che anteprima e salvataggio automatico si comportino come dopo una digitazione.
  Verifica: inserendo `::: step` in una slide, l'anteprima mostra il passo e la libreria si
  aggiorna entro un secondo.
- [ ] 4.4 Se la suite end-to-end è già in `main`, aggiungere in `e2e/` un caso che preme il
  pulsante del grassetto con una selezione e verifica il testo e il ritorno con `Ctrl+Z`.
  Verifica: `npm run test:e2e` verde.

## 5. Verifica finale

- [ ] 5.1 Eseguire `npm ci && npm run check && npm test && npm run build`: tutto verde.
- [ ] 5.2 Prova manuale dei percorsi degli spec: grassetto e corsivo con e senza selezione,
  interruttore, titolo ed elenco su più righe, separatore fra due slide, blocco `::: step`,
  blocco `::: columns`, collegamento con `Ctrl+K`, annullamento con `Ctrl+Z`, barra a 360 px.
- [ ] 5.3 Controllare che il diff non contenga `.github/workflows/**`, `openspec/specs/**`,
  dipendenze nuove o file non nominati dai task, e che `openspec validate barra-formattazione`
  sia verde.
