# Design

## Context

Vedi `proposal.md` — Why. Lo stato che conta: l'editor è una `<textarea class="editor">` in
`src/routes/+page.svelte`, legata a `text` con `bind:value`; da `text` derivano `slides`
(`splitSlides`) e l'anteprima, e lo stesso `$effect` che osserva `text` scrive il link e la
libreria con un debounce di 500 ms. La sintassi delle direttive vive in `src/lib/slides.ts`
(`directiveOf`, `isFenceLine`) e in `src/lib/markdown.ts`; i testi stanno in `src/lib/i18n.ts`
con il tipo `Texts` che impone le stesse chiavi in italiano e inglese. Le icone vengono da
`lucide-svelte`, già dipendenza.

## Goals / Non-Goals

**Goals:**

- Inserire marcatori e direttive senza toccare il formato: il testo resta Markdown leggibile.
- Non perdere l'annullamento nativo: ogni azione della barra si annulla con `Ctrl+Z` insieme
  alle digitazioni.
- Tenere i casi limite — selezione su più righe, marcatori già presenti, riga vuota, fine testo
  — in funzioni pure, provate in vitest senza montare il componente.

**Non-Goals:**

- Nessun editor ricco: niente CodeMirror, niente evidenziazione, nessuna nuova dipendenza.
- Nessuna finestra di dialogo per link, tabelle o immagini: solo trasformazioni di testo.
- Nessun cambio al motore Markdown, alle direttive o alla resa delle slide.

## Decisions

**La barra sta in `+page.svelte`, sopra la `textarea`, non in `Viewer.svelte`.**
Le azioni hanno bisogno di `text`, della selezione e del fuoco sull'editor: sono cose che vivono
nella pagina. `Viewer` vede solo l'array delle slide e su `/v` non c'è nessun editor. La barra è
un componente senza stato (`FormatBar.svelte`) che riceve un elenco di azioni e le emette: così
il markup e gli stili restano fuori dalla pagina, che è già lunga.

**Le trasformazioni sono funzioni pure in `src/lib/editing.ts`.**
Firma delle funzioni: da `{ text, start, end }` a `{ text, start, end }`, senza DOM e senza
runes — la stessa scelta fatta per `slides.ts`, `library.ts` e `transfer.ts`, che si provano in
vitest. Il componente si limita a leggere `selectionStart`/`selectionEnd`, chiamare la funzione,
scrivere il risultato e ripristinare la selezione.

**Scrittura nel campo con `document.execCommand('insertText')`, non con `textarea.value`.**
Assegnare `value` azzera la cronologia di undo del campo: `Ctrl+Z` non annullerebbe più
l'azione e in alcuni browser nemmeno le digitazioni precedenti. `insertText` passa dalla stessa
via dell'input da tastiera, quindi entra nella cronologia; è deprecato ma implementato da tutti
i browser e non ha alternative con questa proprietà. Se la chiamata fallisce o non esiste, si
usa `setRangeText` seguito da un evento `input`, accettando la perdita dell'undo: il codice lo
dice in un commento, così nessuno lo scambia per una svista.

**Selezione ripristinata dopo l'azione.**
Per i marcatori in linea la selezione resta sul contenuto (senza selezione, il cursore finisce
fra i due marcatori); per i prefissi di riga resta sulla riga; per i blocchi `::: step` e
`::: columns` il cursore finisce dentro il blocco, alla prima riga utile. Dopo aver scritto si
chiama `focus()` sul campo, altrimenti il clic sul pulsante porta via il fuoco e la tastiera non
arriva più all'editor.

**Interruttore solo quando è inequivocabile.**
I marcatori in linea si tolgono solo se stanno esattamente fuori dalla selezione (o la
contengono per intero): una selezione parziale non viene mai riscritta a metà. Per i prefissi di
riga si toglie solo il prefisso del pulsante premuto, all'inizio della riga, senza toccare gli
altri.

**Selezione su più righe: un avvolgimento per riga.**
Con più righe selezionate i marcatori in linea avvolgono ogni riga separatamente: avvolgere il
blocco intero produrrebbe un blocco di codice, non tre parole in grassetto. I prefissi di riga
si applicano invece a ogni riga della selezione, ed è quello che ci si aspetta da un elenco.

**Un solo gestore `keydown` sull'editor, non su `window`.**
`Ctrl/Cmd+B`, `Ctrl/Cmd+I`, `Ctrl/Cmd+K`: attivi solo con il fuoco nel campo, con
`preventDefault` solo quando l'azione esiste. Il gestore globale delle frecce sta già in
`Viewer` e non va toccato: le scorciatoie di formattazione non devono convivere con la
navigazione delle slide, che fuori dall'editor resta com'è.

**Direttive scritte a mano, non generate dalla grammatica.**
I pulsanti inseriscono i letterali `::: step`, `::: columns`, `::: part`, `::: end`. Riusare
`directiveOf` servirebbe a leggere, non a scrivere, e un valore calcolato dalla stessa funzione
che lo interpreta renderebbe più difficile accorgersi di un cambio di sintassi: se la grammatica
cambia, i test dei pulsanti devono rompersi.

## Rischi

- `document.execCommand` è deprecato: se un browser lo togliesse, resta il fallback senza undo.
  Un caso end-to-end (o una prova manuale finché la suite non c'è) deve verificare `Ctrl+Z` dopo
  un'azione della barra.
- Su Firefox `Ctrl+K` apre la barra di ricerca; il `preventDefault` sul campo deve impedirlo. Da
  verificare a mano su Firefox, che non è nella suite automatica.
- La barra su telefono riduce lo spazio dell'editor: riga singola con scorrimento orizzontale e
  pulsanti da 44 px, e la `textarea` resta la parte che cresce.

## Questioni aperte

- L'insieme dei pulsanti è la parte da rivedere in fase di `spec-review`: dieci azioni coprono
  in linea, blocchi e struttura, ma tabelle, immagini e indice dei titoli restano fuori. Se
  servono, è una change successiva.
- Se la barra debba restare visibile anche con la scheda «Anteprima» attiva su telefono: qui si
  assume di no, perché agisce su un campo che in quella scheda non si vede.
