# Design

## Context

Vedi `proposal.md` — Why. Lo stato che conta: il testo vive in `+page.svelte` (`text`),
insieme all'id della presentazione aperta (`currentId`), alla slide corrente (`slideIndex`) e
alla libreria in `localStorage`. Il testo si persiste con un debounce di 500 ms dentro
l'`$effect` esistente, e `silentText` segna il testo arrivato senza modifica (link, esempio)
che non deve entrare in libreria da solo. La toolbar con PDF e link sta in `Viewer.svelte`,
che riceve solo l'array delle slide; `/v` è la rotta di sola visione.

## Goals / Non-Goals

**Goals:**

- Esportare il testo **byte per byte** come sta nell'editor: nessuna ricostruzione da
  `slides`, che perderebbe spaziature e righe vuote.
- Importare con una scelta esplicita fra nuova presentazione e sostituzione, senza passaggi
  di conferma aggiuntivi.
- Logica di nome file e normalizzazione del testo in funzioni pure, testabili senza DOM.

**Non-Goals:**

- Nessun componente di dialogo riusabile: serve una scelta sola, con due azioni e un annulla.
- Nessuna gestione di formati diversi dal testo: `.md`, `.markdown`, `.txt` letti come testo.
- Nessun tocco al formato dell'URL, alla libreria salvata o al rendering.

## Decisions

**Pulsanti in `+page.svelte`, non nella toolbar di `Viewer.svelte`.**
L'esportazione ha bisogno di `text`, non delle slide: `slides.join('\n---\n')` riscriverebbe il
testo. Inoltre l'importazione ha bisogno della libreria e di `currentId`, che vivono nella
pagina. Passare `text` e i callback a `Viewer` sarebbe prop drilling per un widget che `/v`
non può usare (lì non c'è libreria né editor). I due pulsanti e l'input file stanno quindi in
una riga di azioni sopra `.panels`, con lo stesso stile dei pulsanti esistenti.

**Download con `Blob` + `URL.createObjectURL`, nessuna dipendenza.**
Un `<a download>` con object URL è il percorso standard e non ha limiti di lunghezza pratici;
la variante `data:` inquina la cronologia e ha limiti in alcuni browser. L'URL viene revocato
subito dopo il click per non tenere il blob in memoria.

**Lettura con `await file.text()` dietro `<input type="file" accept=".md,.markdown,.txt,text/markdown,text/plain">`.**
Niente `FileReader`: `Blob.text()` è più corto e già promise-based. Dopo ogni scelta
`input.value = ''`, altrimenti scegliere due volte lo stesso file non emette `change` e
l'import sembra non funzionare.

**Due funzioni pure in `src/lib/transfer.ts`.**
`exportFileName(name: string): string` (nome file) e `normalizeImportedText(raw: string):
string` (BOM iniziale via `stripBom`, CRLF → LF). Stanno fuori dal componente perché sono la
parte con casi limite — accenti, barre, nome vuoto, file Windows — e si testano in vitest
senza montare nulla, come `library.ts` e `slides.ts`.

**Scelta dell'import come blocco in linea, non come `confirm()`.**
`window.confirm()` ha due soli esiti e qui le strade sono tre (nuova / sostituisci / annulla).
Il blocco appare al posto del file scelto, con i tre pulsanti, e la scelta è la conferma: la
sostituzione è distruttiva per definizione e chiederla due volte è rumore.

**Sostituzione persistita subito, non al debounce.**
Con la sola modifica di `text` la scrittura in libreria arriverebbe dopo 500 ms: ricaricare
subito dopo l'import riporterebbe il testo vecchio. Quindi `currentId` resta, `text` cambia,
`slideIndex` torna a 0, `silentText = null` e si chiama subito `saveLibrary` aggiornando
`quotaWarning` come fa `persist`. Per la nuova presentazione si crea la voce con
`createPresentation`/`addPresentation` e si imposta `currentId`, con lo stesso salvataggio
immediato.

**Testi in `i18n.ts` sotto una chiave `transfer`.**
`Texts = typeof it` e la tipizzazione `en: Texts` fanno fallire `npm run check` se una chiave
manca in una delle due lingue: nessun testo visibile resta monolingua.

## Risks / Trade-offs

- **La sostituzione distrugge il testo precedente** e la libreria tiene solo l'ultima versione
  → mitigato dal fatto che la scelta è esplicita e l'alternativa "nuova presentazione" è lì
  accanto; da scrivere nelle note della PR.
- **`input.value` non azzerato** rende il secondo import dello stesso file muto → l'azzeramento
  è un task esplicito, non un dettaglio.
- **Object URL non revocato** tiene il testo in memoria per la vita della pagina → revoca
  immediata dopo il click.
- **`file.text()` non esiste in browser molto vecchi** → l'app è già Svelte 5 e usa
  `crypto.randomUUID` con fallback; qui non serve fallback, ma un errore di lettura deve
  finire nell'avviso e non in console.
- **Nessun test end-to-end sul download** → la verifica manuale è obbligatoria e va scritta
  nella sezione "Come verificarlo" della PR.

## Migration Plan

Nessuna migrazione: nessun dato salvato cambia forma, nessuna chiave di `localStorage` nuova.
Il rollback è il revert del commit.
