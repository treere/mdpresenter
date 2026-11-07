# Design

## Context

Vedi proposal.md — Why. Lo stato attuale che conta:

- `src/lib/slides.ts` espone `splitSlides(text)` puro e senza DOM: divide sulle righe `---`
  ignorando quelle dentro un blocco di codice (toggle su `/^(`{3,}|~{3,})/`), scarta le slide
  vuote e restituisce sempre almeno un elemento. È già coperto da `src/lib/slides.test.ts`.
- `src/lib/markdown.ts` registra su `marked` un'estensione di blocco `colonne`: il tokenizer
  prende il **primo** `:::` successivo come chiusura
  (`/^::: +colonne *\n([\s\S]*?)\n::: *(?:\n|$)/i`), e le righe `::: left` / `::: right`
  dividono le parti. Un blocco non chiuso non è riconosciuto e resta testo.
- `src/lib/Viewer.svelte` riceve `slides: string[]` e `index` in bind; calcola in un `$effect`
  `html` (slide corrente) e `allHtml` (tutte le slide) con `renderMarkdown` + `DOMPurify`;
  li stampa con `{@html}`. `allHtml` alimenta il blocco `.print` (una pagina per slide).
  `next()`/`prev()` cambiano `index`; tastiera, swipe e pulsanti passano dagli stessi due
  metodi. `checkOverflow()` misura `scrollHeight` della slide. Lo stile `.colonne` è una griglia
  a due colonne, impilata sotto i 700px.
- `src/routes/+page.svelte` monta lo stesso `Viewer` come anteprima dell'editor, quindi
  l'anteprima eredita per forza qualunque comportamento si aggiunga al visualizzatore.
- `src/routes/v/+page.svelte` monta il `Viewer` da solo: è la vista presentazione.
- La stampa vive in `src/print.css` (foglio globale) e agisce su `.print-page`; il blocco
  `.print` del `Viewer` è `display: none` a schermo e visibile solo in stampa.
- `src/lib/examples.ts` contiene due slide con la vecchia sintassi
  (`::: colonne` / `::: left` / `::: right` / `:::`).

## Goals / Non-Goals

**Goals:**

- Direttive che si leggono da sole: ogni riga dice se apre, separa o chiude, e cosa.
- Passi possibili anche dentro un blocco colonne, cioè dentro una singola colonna.
- Grammatica in un predicato puro, provata senza montare Svelte; il renderer la consuma e non
  la riscrive.
- Nessuna regressione per una slide senza direttive: identica a oggi.
- Export e anteprima che mostrano sempre la slide completa.

**Non-Goals:**

- Animazioni, durate, dissolvenze, ordine non lineare dei passi, passo nell'URL.
- Passi annidati uno dentro l'altro: un passo è un contenitore terminale.
- Evidenziare la differenza fra "nascosto" e "non ancora visto".
- Documentare la sintassi nella pagina Progetto o negli Esempi: lavoro separato.

## Decisions

**Vocabolario nominato con prefisso comune `:::`, e niente più direttive anonime.** La revisione
chiede blocchi parlanti e un passo dentro le colonne: due cose che la forma precedente — riga
`:::` che separa le parti del contenitore corrente, più `::: fine` — non permetteva, perché
dentro un blocco `:::` *doveva* significare "colonna" e non poteva significare "passo". Il modo
per togliersi l'ambiguità non è aggiungere un caso, è dare un nome a ogni direttiva:

| Riga | Significato |
|---|---|
| `::: passo` | apre un passo: il contenuto compare a un certo momento |
| `::: colonne` | apre un blocco di colonne affiancate |
| `::: colonna` | dentro `::: colonne`, separa una colonna dalla successiva |
| `::: fine` | chiude il blocco aperto più interno |

Regole, riga per riga (riga trimmata, nome case-insensitive, spazi interni tollerati):

- un blocco aperto senza il suo `::: fine` non è riconosciuto: la sua riga e quelle interne
  restano testo, come oggi (`markdown.test.ts`, «leaves unclosed column blocks as text»);
- un nome sconosciuto (`::: passo,` o `::: left`, `:::` nudo) è testo;
- `::: colonna` vale solo a profondità 1 dentro un `::: colonne`: fuori è testo;
- `::: passo` dentro un altro `::: passo` è testo: un passo annidato non ha un ordine di comparsa
  che si possa dedurre dal testo.

La forma è quella dei *fenced div* di Pandoc e delle *colon fence* di MyST — direttiva su una
riga, un nome, chiusura esplicita — quindi non è un dialetto inventato qui.

**I blocchi si annidano, e ogni colonna può avere i suoi passi.** Un `::: passo` può contenere un
blocco colonne e un blocco colonne può contenere passi, anche diversi da colonna a colonna. La
profondità si conta sulle direttive: `::: passo` e `::: colonne` aprono, `::: fine` chiude,
`::: colonna` non cambia profondità. Il tokenizer cerca quindi il `::: fine` che riporta la
profondità a zero, non il primo che incontra — è la correzione dell'errore che oggi chiuderebbe il
blocco padre.

```
# Prima e dopo

il testo che si vede subito

::: passo

una riga che compare dopo

::: fine

::: colonne

::: colonna

a sinistra, subito

::: colonna

::: passo

a destra, al passo successivo

::: fine

::: fine
```

**L'ordine dei passi è l'ordine del testo (visita in profondità).** I passi si numerano scorrendo
il documento: prima il passo della prima colonna, poi quello della seconda, poi quelli fuori dai
blocchi, nell'ordine in cui compaiono. Non serve altra sintassi, e il numero scritto nella slide
corrisponde a quello che il lettore incontra leggendo. Un ordine per colonna (tutte le colonne
avanzano insieme) sarebbe un secondo modello da spiegare e non è chiesto: se servirà, è una change
successiva, e nel frattempo resta un'Open Question.

**La grammatica sta in un solo posto: `directiveOf(line)` e `isFenceLine(line)` in `slides.ts`.**
`directiveOf` restituisce `{ kind: 'open' | 'separator' | 'close', name }` oppure `null`, e lo
usano sia il tokenizer di `marked` sia `initialRevealed` / `countSteps`. Due implementazioni della
stessa regola divergerebbero al primo caso limite; `slides.ts` non importa `markdown.ts`, quindi
non c'è ciclo e la tabella dei casi si prova una volta sola con vitest, senza browser.

**Il renderer non divide più il testo: avvolge i passi.** Il passo diventa un blocco
`<div class="step">` con il contenuto parse-ato da `this.lexer.blockTokens`, e questo è ciò che
rende possibile un passo dentro una colonna: il contenitore vive nell'HTML, non in una lista di
frammenti di testo. Con la sintassi a separatori una divisione del testo avrebbe dovuto spezzare
la slide a metà di un blocco colonne, cioè produrre Markdown non valido; con i contenitori il
problema non esiste. Sparisce quindi `splitSteps`: non c'è più nulla da spezzare.

**`::: colonne` emette un `<div>` per colonna, N qualsiasi.** `.colonne` passa da `1fr 1fr` a
`repeat(auto-fit, minmax(0, 1fr))`: con N figli si ottengono N colonne uguali senza classi per
ogni numero, e il breakpoint ≤700px resta a una colonna. Una parte sola rende un blocco a piena
larghezza.

**Visibilità per indice, applicata dal `Viewer` sul DOM già sanitizzato.** Dopo `{@html}` il
`Viewer` legge `slideEl.querySelectorAll('.step')`: l'ordine del DOM è la visita in profondità, cioè
esattamente la numerazione decisa sopra. `revealed` è il numero di passi mostrati; gli elementi con
indice ≥ `revealed` prendono una classe che applica `visibility: hidden`. Così il conteggio dei
passi è quello degli elementi davvero resi (una direttiva scritta male non crea un passo fantasma),
il contatore e la navigazione leggono lo stesso numero, e nessuna classe di visibilità passa per
`{@html}`.

**Nascosto con `visibility: hidden`, non `display: none` e non rendering condizionale.** Ogni passo
è renderizzato una volta e resta nel DOM; il testo non si riposiziona a ogni passo (è il caso
d'uso: si legge la slide mentre compare), `checkOverflow()` misura sempre la slide completa e
mermaid ha geometria reale anche dentro un passo ancora nascosto. Con `display: none` mermaid misura
zero e l'avviso di sbordo mentirebbe; con il rendering condizionale si perderebbe lo stato del
diagramma a ogni passo.

**Lo stato vive nel `Viewer` e si azzera al cambio slide, con un caso iniziale esplicito.**
`revealed` è locale; un `$effect` su `index` lo riporta al valore iniziale della slide.
`initialRevealed(text)` vale `0` quando la slide ha contenuto prima del primo `::: passo`, `1`
quando comincia con un passo: aprire una slide su una schermata vuota sarebbe un guasto visibile, e
la regola è una funzione pura da provare. `next()`: se restano passi ne rivela uno, altrimenti
slide successiva con il suo valore iniziale. `prev()`: se oltre il valore iniziale toglie un passo,
altrimenti slide precedente **con tutti i suoi passi** (slide già vista → tutta visibile), come
chiede lo scenario «Ritorno a una slide già vista». Tastiera, swipe, pulsanti e fullscreen non
cambiano: chiamano già `next`/`prev`.

**L'anteprima dell'editor usa una prop `showAllSteps`.** `Viewer` accetta `showAllSteps = false`;
`+page.svelte` la passa a `true`. Motivo: chi scrive deve vedere la slide completa, e il componente
è condiviso, quindi il default resta il comportamento da presentazione. Alternativa scartata:
duplicare un viewer di anteprima, che divergerebbe dal visualizzatore vero.

**La stampa non ha bisogno di ricomporre niente.** `allHtml` torna a essere `renderMarkdown` del
testo grezzo: le direttive sono consumate dal tokenizer e i passi diventano `<div class="step">`
dentro la pagina. La regola che nasconde i passi è limitata a `.slide .step`, e `.print-page` non
è dentro `.slide`: la pagina stampata mostra tutto senza codice dedicato e senza toccare
`src/print.css`.

**Contatore.** `2/5` resta com'è; quando la slide ha passi diventa `2/5 · 1/3`, con un'etichetta
`aria-label` tradotta (chiave `step` in `it`/`en`). Nessuna nuova stringa visibile oltre a quella,
così il tipo `Record<Language, Texts>` continua a garantire le due lingue.

Alternative scartate: (a) la forma precedente, `:::` separatore più `::: fine` — è quella appena
respinta: dentro un blocco non si può distinguere un passo da una colonna; (b) `<!-- passo -->`
accanto a `::: colonne` — due vocabolari per la stessa idea, e l'annidamento resta impossibile;
(c) `::: left` / `::: right` — nomi di posizione, non di cosa si sta scrivendo, e non regge più di
due colonne; (d) `===` — è già Markdown valido (setext) e rompe i documenti esistenti.

## Risks / Trade-offs

- **Sintassi rotta per i testi esistenti** → chi ha slide salvate con `::: left` / `::: right` le
  vede come testo. Deciso sull'issue («non mi interessa la retrocompatibilità»), ma è un cambio
  visibile: esempi aggiornati qui, link condivisi da riscrivere a mano. Il rollback è ripristinare
  il tokenizer precedente.
- **Ordine dei passi dentro le colonne** → è l'ordine del testo, quindi in un confronto a due
  colonne compare prima tutto ciò che sta a sinistra e poi ciò che sta a destra. È la lettura
  naturale del documento, ma chi si aspetta colonne che avanzano insieme va corretto a voce; è
  l'Open Question aperta in questa revisione.
- **Un `::: passo` senza `::: fine`** → da lì in poi le direttive si vedono come testo: errore
  visibile, non silenzioso, ma la slide resta senza passi. È la stessa difesa di oggi per i blocchi
  colonne; un controllo nell'editor è fuori scope.
- **Markdown reso a blocchi separati dentro un passo** → un passo creato in mezzo a un elenco
  produce due `<ul>` invece di una lista sola. Conseguenza accettata e da scrivere nella PR.
- **Slide già piene + passi nascosti** → lo spazio riservato è quello della slide completa, quindi
  una slide che sborda continua a segnalarlo. È voluto: la dimensione non cambia durante la
  presentazione.
- **Passi in una slide con mermaid** → il diagramma si disegna anche se nascosto; costo di
  rendering leggermente maggiore per slide, accettabile (il rendering è per slide, non per passo).
- **Chi presenta con un telecomando che manda `PageDown`** → si muove di passo, non di slide;
  comportamento voluto, ma da dire a voce a chi presenta.

## Migration Plan

Nessuna migrazione automatica e nessun dato da convertire. La sintassi vecchia (`::: left`,
`::: right`, chiusura `:::` anonima) non è più riconosciuta: i testi che la usano vanno riscritti a
mano, poche righe per blocco. Gli esempi dell'app sono aggiornati in questa change. Rollback =
ripristinare il tokenizer precedente: i testi con `:::` tornano a comportarsi come oggi (colonne con
`left`/`right`, nessun passo).

## Open Questions

- Ordine dei passi in un blocco a più colonne: ordine del testo (scelta di questa proposta) oppure
  avanzamento simultaneo per colonna? Default confermato: ordine del testo, perché non richiede
  sintassi aggiuntiva.
- Documentare la sintassi nella pagina Progetto e negli Esempi: rimandato a una change successiva,
  non cambia requisiti né task di questa.
