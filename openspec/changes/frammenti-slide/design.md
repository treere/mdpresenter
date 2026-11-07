# Design

## Context

Vedi proposal.md — Why. Lo stato attuale che conta:

- `src/lib/slides.ts` espone `splitSlides(text)` puro e senza DOM: divide sulle righe `---`
  ignorando quelle dentro un blocco di codice (toggle su `/^(`{3,}|~{3,})/`), scarta le slide
  vuote e restituisce sempre almeno un elemento. È già coperto da `src/lib/slides.test.ts`.
- `src/lib/Viewer.svelte` riceve `slides: string[]` e `index` in bind; calcola in un `$effect`
  `html` (slide corrente) e `allHtml` (tutte le slide) con `renderMarkdown` + `DOMPurify`;
  li stampa con `{@html}`. `allHtml` alimenta il blocco `.print` (una pagina per slide).
  `next()`/`prev()` cambiano `index`; tastiera, swipe e pulsanti passano dagli stessi due
  metodi. `checkOverflow()` misura `scrollHeight` della slide.
- `src/routes/+page.svelte` monta lo stesso `Viewer` come anteprima dell'editor, quindi
  l'anteprima eredita per forza qualunque comportamento si aggiunga al visualizzatore.
- `src/routes/v/+page.svelte` monta il `Viewer` da solo: è la vista presentazione.
- La stampa vive in `src/print.css` (foglio globale) e agisce su `.print-page`; il blocco
  `.print` del `Viewer` è `display: none` a schermo e visibile solo in stampa.

## Goals / Non-Goals

**Goals:**

- Un vocabolario minimo nel Markdown che non rompa il documento fuori da mdpresenter.
- Passi gestiti da una funzione pura, testabile senza montare Svelte.
- Nessuna regressione per una slide senza marcatori: identica a oggi, byte per byte.
- Export e anteprima che mostrano sempre la slide completa.

**Non-Goals:**

- Animazioni, durate, dissolvenze, ordine non lineare dei passi, passo nell'URL.
- Evidenziare la differenza fra "nascosto" e "non ancora visto" (nessuna transizione, come
  chiede la issue).
- Documentare il marcatore nella pagina Progetto o negli Esempi: lavoro separato.

## Decisions

**Marcatore `<!-- passo -->` su una riga da sola, non il `:::` di `::: colonne` né `===`.**
`===` è già valido Markdown (sottolineatura di un titolo setext) e spezzerebbe documenti
esistenti. `::: passo` sarebbe coerente con `::: colonne`, ma le due cose hanno semantica
diversa: `:::` apre un contenitore e ha bisogno di una chiusura, il passo è un confine. Riusarlo
ha tre costi concreti: (a) il `:::` nudo è già la chiusura di `::: colonne`
(`/^::: +colonne *\n([\s\S]*?)\n::: *(?:\n|$)/`, `src/lib/markdown.ts:20`), quindi il `:::` di
chiusura di un passo dentro una colonna chiuderebbe la colonna; (b) `splitSteps` lavora sul testo
prima del rendering, e su `::: passo … :::` dovrebbe bilanciare aperture e chiusure con
annidamento, cioè replicare il parser Markdown invece di scansionare righe; (c) una chiusura
dimenticata non è un errore visibile, inghiotte il resto della slide in un unico passo. Un
commento HTML non ha chiusura, non collide con nessun blocco esistente e resta invisibile in ogni
altro renderer (GitHub, VS Code, un'estensione Markdown qualsiasi): lo stesso testo continua a
leggersi bene fuori dall'app. Il confronto è esatto sulla riga trimmata, come `---` in
`splitSlides`; nessuna variante tollerata, per non creare dialetti. Alternativa scartata anche:
un marcatore dentro il paragrafo (`**|**`), che sporca il testo e non si può nascondere in altri
renderer.

**Analisi in `splitSteps(text): string[]` dentro `src/lib/slides.ts`, pura.** Stessa forma di
`splitSlides` (toggle della fence, scarto dei blocchi vuoti, almeno un elemento), così le due
funzioni condividono la stessa regola sui blocchi di codice e i test restano in vitest senza
jsdom. Motivo: il parsing è la parte che sbaglia, e va provata senza browser. Un solo
passo (nessun marcatore, o marcatori tutti a inizio/fine) → array di un elemento.

**Nascosto con `visibility: hidden`, non `display: none` e non rendering condizionale.**
Ogni passo è renderizzato una volta e resta nel DOM; i passi oltre quello corrente ricevono
`visibility: hidden`. Così il testo non si riposiziona a ogni passo (è il caso d'uso: si
legge la slide mentre compare), `checkOverflow()` misura sempre la slide completa e mermaid
ha geometria reale per disegnare anche dentro un passo ancora nascosto. Con `display: none`
mermaid misura zero e l'avviso di sbordo mentirebbe; con il rendering condizionale si
perderebbe lo stato del diagramma a ogni passo.

**Un wrapper per passo, creato da Svelte e non dall'HTML sanitizzato.** `Viewer` calcola
`stepHtml: string[]` con `renderMarkdown` + `DOMPurify` per ogni passo e li stampa con un
`{#each}` dentro `<div class="step">`: l'HTML finale resta sanitizzato come oggi e la classe
di visibilità non passa mai per `{@html}`. Una slide con un solo passo mantiene il markup
attuale (un solo `{@html}`, nessun wrapper), per non toccare spaziature e selettori esistenti.

**Lo stato del passo vive nel `Viewer` e si azzera al cambio slide.** `stepIndex` è locale;
un `$effect` su `index` lo riporta a `0`, quindi nessun passo entra nell'URL né nella
libreria. `next()`: se restano passi avanza il passo, altrimenti slide successiva e passo
`0`. `prev()`: se il passo è oltre il primo torna indietro di un passo, altrimenti slide
precedente **con il suo ultimo passo** (slide già vista → tutta visibile), come chiede lo
scenario «Ritorno a una slide già vista». Le scorciatoie esistenti (tastiera, swipe,
pulsanti, fullscreen) non cambiano: chiamano già `next`/`prev`.

**L'anteprima dell'editor usa una prop `showAllSteps`.** `Viewer` accetta
`showAllSteps = false`; `+page.svelte` la passa a `true`. Motivo: chi scrive deve vedere la
slide completa, e il componente è condiviso, quindi il default resta il comportamento da
presentazione. Alternativa scartata: duplicare un viewer di anteprima, che divergerebbe dal
visualizzatore vero.

**La stampa non vede i marcatori.** `allHtml` si costruisce da `splitSteps(slide).join('\n\n')`
invece che dal testo grezzo: le righe marcatore non arrivano mai al DOM e la pagina stampata
contiene tutti i blocchi. `.print-page` non eredita `.slide`, quindi la visibilità dei passi
non lo raggiunge comunque: la regola è nella costruzione dell'HTML, non nel CSS.

**Contatore.** `2/5` resta com'è; con più di un passo diventa `2/5 · 1/3`, con un'etichetta
`aria-label` tradotta (chiave `step` in `it`/`en`). Nessuna nuova stringa visibile oltre a
quella, così il tipo `Record<Language, Texts>` continua a garantire le due lingue.

## Risks / Trade-offs

- **Marcatore fra due voci di un elenco** → il Markdown viene reso a blocchi separati: due
  `<ul>` invece di una lista sola, con lo spazio fra l'una e l'altra. Conseguenza accettata e
  da scrivere nella PR: per far comparire le voci una alla volta si mettono in passi separati,
  accettando la spaziatura; la documentazione del marcatore è lavoro successivo.
- **Slide già piene + passi nascosti** → lo spazio riservato è quello della slide completa,
  quindi una slide che sborda continua a segnalarlo. È voluto: la dimensione non cambia durante
  la presentazione.
- **Passi in una slide con mermaid** → il diagramma si disegna anche se nascosto; costo di
  rendering leggermente maggiore per slide, accettabile (il rendering è per slide, non per passo).
- **Slide con molti passi e `checkOverflow`** → l'avviso si riferisce alla slide intera, non al
  passo corrente; coerente con lo scenario esistente «Avviso di sbordo».
- **Chi presenta con un telecomando che manda `PageDown`** → si muove di passo, non di slide;
  comportamento voluto, ma da dire a voce a chi presenta.
- **Nessuna migrazione**: i testi senza marcatori si comportano come prima; i link esistenti
  restano validi perché lo schema dell'URL non cambia.

## Migration Plan

Nessuna migrazione e nessun dato da convertire. Rollback = rimuovere il supporto al marcatore:
i testi che lo contengono mostrerebbero una riga di commento invisibile, nessun errore.

## Open Questions

- Documentare il marcatore nella pagina Progetto e negli Esempi: rimandato a una change
  successiva, non cambia requisiti né task di questa.
