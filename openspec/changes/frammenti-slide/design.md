# Design

## Context

Vedi proposal.md — Why. Lo stato attuale che conta:

- `src/lib/slides.ts` espone `splitSlides(text)` puro e senza DOM: divide sulle righe `---`
  ignorando quelle dentro un blocco di codice (toggle su `/^(`{3,}|~{3,})/`), scarta le slide
  vuote e restituisce sempre almeno un elemento. È già coperto da `src/lib/slides.test.ts`.
- `src/lib/markdown.ts` registra su `marked` un'estensione di blocco `colonne`: il tokenizer
  prende il **primo** `:::` successivo come chiusura
  (`/^::: +colonne *\n([\s\S]*?)\n::: *(?:\n|$)/i`), e le righe `::: left` / `::: right`
  dividono le due parti. Un blocco non chiuso non è riconosciuto e resta testo.
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

- Un vocabolario solo, con una sola regola di apertura e chiusura, per passi e colonne.
- Passi e blocchi gestiti da funzioni pure, testabili senza montare Svelte.
- Nessuna regressione per una slide senza direttive: identica a oggi, byte per byte.
- Export e anteprima che mostrano sempre la slide completa.

**Non-Goals:**

- Animazioni, durate, dissolvenze, ordine non lineare dei passi, passo nell'URL.
- Passi dentro una colonna (vedi la decisione: dentro un blocco `:::` separa le parti di quel
  blocco). Se servirà, è una change successiva.
- Evidenziare la differenza fra "nascosto" e "non ancora visto" (nessuna transizione, come
  chiede la issue).
- Documentare la sintassi nella pagina Progetto o negli Esempi: lavoro separato.

## Decisions

**Un vocabolario solo: `:::` separa le parti, `::: <nome>` … `::: fine` apre e chiude un
blocco.** La revisione sull'issue chiede una sintassi che valga sia per i passi sia per le
colonne, con la retrocompatibilità fuori scope: quindi non si aggiunge un secondo marcatore
accanto a quello delle colonne, si unifica quello che c'è. La grammatica, riga per riga (riga
trimmata, parole case-insensitive come oggi, spazi interni tollerati):

- `:::` → separa le parti del contenitore corrente;
- `::: colonne` → apre un blocco colonne, che finisce con `::: fine`;
- `::: fine` → chiude il blocco aperto più interno;
- qualsiasi altra riga → testo, comprese `::: passo` e la vecchia `::: left`.

Così c'è un solo concetto da imparare, "le parti di un blocco", e cambia solo la disposizione:
al livello della slide le parti sono passi (in sequenza), dentro `::: colonne` sono colonne
(affiancate). Non serve un marcatore diverso per i passi proprio perché il separatore è lo
stesso. Precedente: è la forma dei *fenced div* di Pandoc e delle *colon fence* di MyST —
direttiva su una riga, un nome, chiusura esplicita — quindi non è un dialetto inventato qui.

Costo accettato e da dire a voce: `::: left`, `::: right` e la chiusura anonima `:::` spariscono.
I testi già scritti mostrano le vecchie direttive come testo; gli esempi dell'app si aggiornano
in questa change, i link già condivisi vanno riscritti a mano (nessuna migrazione possibile lato
app, ed è la ragione per cui la PR lo scrive fra i rischi).

Alternative scartate: (a) `<!-- passo -->` accanto a `::: colonne` — è quello che la revisione ha
respinto: due vocabolari per la stessa idea, e le colonne restano senza una sintassi coerente;
(b) chiudere un blocco con un `:::` nudo — è l'ambiguità da cui nasce la revisione:
`:::` separatore o chiusura? Con `::: fine` la domanda non si pone, e l'annidamento diventa
banale; (c) `===` — è già Markdown valido (setext) e rompe i documenti esistenti.

**La grammatica sta in un solo posto: `directiveOf(line)` e `isFenceLine(line)` in
`slides.ts`.** `splitSteps` e il tokenizer di `marked` devono applicare la stessa regola (fence
di codice escluse, `:::` alla profondità giusta, `::: colonne`/`::: fine` come apertura e
chiusura); due implementazioni divergerebbero al primo caso limite. Esponendo i due predicati
da `slides.ts` — che non importa `markdown.ts`, quindi nessun ciclo — la tabella dei casi si
prova una volta sola con vitest, senza browser, e il tokenizer si limita a contare la
profondità e a chiamare `this.lexer.blockTokens` sulle parti.

**`splitSteps(text): string[]` in `slides.ts`, puro.** Stessa forma di `splitSlides` (toggle
della fence, scarto delle parti vuote, almeno un elemento): divide sulle direttive `parts` a
profondità zero. Un blocco `::: colonne` aperto e non chiuso non fa parte del vocabolario
riconosciuto (vedi sotto), quindi da lì in poi non ci sono più confini di passo: il resto della
slide resta una parte sola, e le direttive si vedono come testo — l'errore è visibile invece di
inghiottire la presentazione.

**Blocco non chiuso o direttiva sconosciuta → testo letterale.** È già il comportamento attuale
(`markdown.test.ts`, «leaves unclosed column blocks as text») e resta l'unica difesa contro
l'errore silenzioso: un `::: fine` dimenticato mostra le righe `:::` nella slide invece di
assorbire il contenuto. Il tokenizer restituisce `undefined` e `marked` rende la riga come
paragrafo.

**Nascosto con `visibility: hidden`, non `display: none` e non rendering condizionale.** Ogni
parte è renderizzata una volta e resta nel DOM; le parti oltre quella corrente ricevono
`visibility: hidden`. Così il testo non si riposiziona a ogni passo (è il caso d'uso: si legge
la slide mentre compare), `checkOverflow()` misura sempre la slide completa e mermaid ha
geometria reale per disegnare anche dentro una parte ancora nascosta. Con `display: none`
mermaid misura zero e l'avviso di sbordo mentirebbe; con il rendering condizionale si perderebbe
lo stato del diagramma a ogni passo.

**Un wrapper per parte, creato da Svelte e non dall'HTML sanitizzato.** `Viewer` calcola
`stepHtml: string[]` con `renderMarkdown` + `DOMPurify` per ogni parte e li stampa con un
`{#each}` dentro `<div class="step">`: l'HTML finale resta sanitizzato come oggi e la classe di
visibilità non passa mai per `{@html}`. Una slide con una parte sola mantiene il markup attuale
(un solo `{@html}`, nessun wrapper), per non toccare spaziature e selettori esistenti.

**Lo stato del passo vive nel `Viewer` e si azzera al cambio slide.** `stepIndex` è locale; un
`$effect` su `index` lo riporta a `0`, quindi nessun passo entra nell'URL né nella libreria.
`next()`: se restano parti avanza la parte, altrimenti slide successiva e passo `0`. `prev()`:
se il passo è oltre il primo torna indietro di una parte, altrimenti slide precedente **con la
sua ultima parte** (slide già vista → tutta visibile), come chiede lo scenario «Ritorno a una
slide già vista». Le scorciatoie esistenti (tastiera, swipe, pulsanti, fullscreen) non cambiano:
chiamano già `next`/`prev`.

**L'anteprima dell'editor usa una prop `showAllSteps`.** `Viewer` accetta
`showAllSteps = false`; `+page.svelte` la passa a `true`. Motivo: chi scrive deve vedere la
slide completa, e il componente è condiviso, quindi il default resta il comportamento da
presentazione. Alternativa scartata: duplicare un viewer di anteprima, che divergerebbe dal
visualizzatore vero.

**La stampa non vede le direttive.** Le righe `:::` di livello zero sono già consumate da
`splitSteps`, quindi `allHtml` si costruisce da `splitSteps(slide).join('\n\n')`: il documento
così ricomposto è identico alla slide intera per il parser e contiene tutte le parti. Le
direttive interne a un blocco (`::: colonne` … `::: fine`, `:::`) sono consumate dal tokenizer e
non arrivano nell'HTML. `.print-page` non eredita `.slide`, quindi la visibilità dei passi non
lo raggiunge comunque: la regola è nella costruzione dell'HTML, non nel CSS.

**Griglia a N parti.** `.colonne` passa da `1fr 1fr` a
`repeat(auto-fit, minmax(0, 1fr))`: con N `<div>` figli si ottengono N colonne uguali senza
classi per ogni numero, e il breakpoint ≤700px resta a una colonna. Il renderer emette un
`<div>` per parte, quindi anche un blocco con tre parti è corretto senza altro codice.

**Contatore.** `2/5` resta com'è; con più di una parte diventa `2/5 · 1/3`, con un'etichetta
`aria-label` tradotta (chiave `step` in `it`/`en`). Nessuna nuova stringa visibile oltre a
quella, così il tipo `Record<Language, Texts>` continua a garantire le due lingue.

## Risks / Trade-offs

- **Sintassi rotta per i testi esistenti** → chi ha slide salvate con `::: left` / `::: right`
  le vede come testo. Deciso sull'issue («non mi interessa la retrocompatibilità»), ma è un
  cambio visibile: esempi aggiornati qui, link condivisi da riscrivere a mano. Il rollback è
  ripristinare il tokenizer precedente.
- **Una riga `:::` di troppo crea un passo in più** → non si nota nell'anteprima dell'editor
  (che mostra tutte le parti) ma si vede in `/v`. Costo basso, e un secondo marcatore avrebbe lo
  stesso problema; la differenza è che qui la sintassi è una sola.
- **Un `:::` fra due voci di un elenco** → il Markdown viene reso a blocchi separati: due `<ul>`
  invece di una lista sola, con lo spazio fra l'una e l'altra. Conseguenza accettata e da
  scrivere nella PR.
- **Passo dentro una colonna non possibile** → dentro `::: colonne` la riga `:::` separa le
  colonne. Chi vuole elementi progressivi dentro una colonna deve oggi spezzare in due slide;
  limite dichiarato nei Non-Goals.
- **Slide già piene + parti nascoste** → lo spazio riservato è quello della slide completa,
  quindi una slide che sborda continua a segnalarlo. È voluto: la dimensione non cambia durante
  la presentazione.
- **Passi in una slide con mermaid** → il diagramma si disegna anche se nascosto; costo di
  rendering leggermente maggiore per slide, accettabile (il rendering è per slide, non per passo).
- **Slide con molti passi e `checkOverflow`** → l'avviso si riferisce alla slide intera, non alla
  parte corrente; coerente con lo scenario esistente «Avviso di sbordo».
- **Chi presenta con un telecomando che manda `PageDown`** → si muove di passo, non di slide;
  comportamento voluto, ma da dire a voce a chi presenta.

## Migration Plan

Nessuna migrazione automatica e nessun dato da convertire. La sintassi vecchia (`::: left`,
`::: right`, chiusura `:::` anonima) non è più riconosciuta: i testi che la usano vanno
riscritti a mano, poche righe per blocco. Gli esempi dell'app sono aggiornati in questa change.
Rollback = ripristinare il tokenizer precedente: i testi con `:::` tornano a comportarsi come
oggi (colonne con `left`/`right`, nessun passo).

## Open Questions

- Documentare la sintassi nella pagina Progetto e negli Esempi: rimandato a una change
  successiva, non cambia requisiti né task di questa.
