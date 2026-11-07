# Tasks

## 1. Grammatica delle direttive (funzione pura)

- [ ] 1.1 In `src/lib/slides.ts` aggiungere `directiveOf(line)` che classifica una riga trimmata
  come `{ kind: 'open', name: 'step' | 'columns' }`, `{ kind: 'separator', name: 'part' }`,
  `{ kind: 'close' }` oppure `null`, con i nomi case-insensitive e gli spazi interni tollerati;
  aggiungere `isFenceLine(line)` e usarlo in `splitSlides` al posto del toggle inline. Verifica:
  `npm run check` senza errori di tipo sul modulo.
- [ ] 1.2 Aggiungere `initialRevealed(text: string): 0 | 1`: `1` quando il testo prima del primo
  `::: step` fuori dalle fence è vuoto, `0` altrimenti. Verifica: `npm run check` verde.
- [ ] 1.3 In `src/lib/slides.test.ts` coprire: `directiveOf` su `::: step`, `::: columns`,
  `::: part`, `::: end`, con spazi e maiuscole; righe vicine ma diverse (`::::`, `:: :`,
  `::: steps`, `::: colonne`, `::: left`, `:::` nudo) → `null`; `initialRevealed` su una slide
  che comincia con un passo, su una che ha un titolo prima, su una che ha `::: step` solo dentro
  una fence. Verifica: `npm test` verde.
- [ ] 1.4 Verificare che `splitSlides` continui a comportarsi come prima dopo l'estrazione
  dell'helper: i test esistenti delle slide devono passare senza modifiche. Verifica: `npm test`
  verde con i casi di `splitSlides` invariati nel diff.

## 2. Renderer dei blocchi

- [ ] 2.1 In `src/lib/markdown.ts` sostituire l'estensione `colonne` con una `directives` che
  riconosce le direttive tramite `directiveOf`/`isFenceLine`: un blocco è aperto da `::: columns`
  o `::: step` e chiuso dal `::: end` che riporta la profondità a zero (un blocco annidato non
  chiude il padre). Un blocco non chiuso o con nome sconosciuto resta testo. Verifica:
  `npm run check` verde.
- [ ] 2.2 `::: columns` divide il contenuto sulle righe `::: part` di primo livello, ne fa un
  token per parte con `this.lexer.blockTokens` ed emette `<div class="columns">` con un `<div>` per
  parte, per N qualsiasi; senza `::: part` rende una parte sola a piena larghezza. Verifica:
  `npm run build` verde.
- [ ] 2.3 `::: step` emette `<div class="step">` con il contenuto parse-ato, e funziona anche
  dentro una colonna; un `::: step` dentro un altro `::: step` resta testo. Verifica: `npm run
  build` verde.
- [ ] 2.4 In `src/lib/markdown.test.ts` coprire: due e tre colonne; passo che contiene un blocco
  colonne; passo dentro una colonna; `::: step` annidato reso come testo; vecchia sintassi
  `::: left` / `::: right` resa come testo; direttive dentro una fence intatte; blocco non chiuso
  (il test «leaves unclosed column blocks as text» continua a passare). Verifica: `npm test` verde.

## 3. Stili e testi di esempio

- [ ] 3.1 In `src/lib/Viewer.svelte` rinominare il selettore `.colonne` in `.columns` (stessa
  classe emessa da `markdown.ts` al punto 2.2) e portarlo a
  `grid-template-columns: repeat(auto-fit, minmax(0, 1fr))`, lasciando il breakpoint ≤700px a una
  colonna. Verifica: in `/v` un blocco con due e uno con tre colonne hanno larghezze uguali, e su
  viewport 390×844 sono impilate.
- [ ] 3.2 In `src/lib/examples.ts` riscrivere le due slide «Colonne» con la nuova sintassi
  (`::: columns`, `::: part`, `::: end`) e aggiungere un passo dentro una colonna in una delle
  due. Verifica: nella home gli esempi «Colonne» si vedono senza direttive a schermo e la colonna
  con il passo mostra il contenuto solo avanzando in `/v`.

## 4. Rivelazione dei passi

- [ ] 4.1 In `src/lib/Viewer.svelte` aggiungere `revealed` come stato locale, azzerato su `index`
  a `initialRevealed(current)`. Dopo l'aggiornamento di `html`, leggere `slideEl.querySelectorAll('.step')`
  e applicare a quelli con indice ≥ `revealed` la classe che nasconde. Verifica: `npm run check` e
  `npm run build` verdi; con una slide a due passi, `/v` mostra solo il contenuto fuori dai passi e
  il primo passo.
- [ ] 4.2 Aggiornare `next()`/`prev()`: avanti di un passo finché ce ne sono, poi slide successiva
  con `initialRevealed`; indietro di un passo, altrimenti slide precedente con tutti i passi
  visibili. Verifica: prova manuale su `/v` con una presentazione di due slide e una con tre passi,
  uno dei quali dentro una colonna — avanti tre volte poi cambia slide, indietro riporta alla slide
  precedente tutta visibile, un link `?s=1` parte dal valore iniziale della sua slide.
- [ ] 4.3 Contatore: mostrare `{index+1}/{total}` e, quando la slide ha passi,
  `· {revealed}/{n}`, con `aria-label` dalla nuova chiave `step` aggiunta in `src/lib/i18n.ts` per
  `it` e `en`. Verifica: `npm run check` verde (la tipizzazione `Texts` impone le due lingue) e il
  contatore visibile in entrambe le lingue.
- [ ] 4.4 Stili: regola `.step` nascosta con `visibility: hidden`, nessuna transizione, nessun
  cambio di layout fra passo e passo. Verifica: nella vista `/v`, avanzando di passo gli elementi
  già visibili non si spostano (confronto visivo a schermo e su viewport 390×844).

## 5. Anteprima dell'editor completa

- [ ] 5.1 Aggiungere al `Viewer` la prop `showAllSteps = false`; quando è `true` nessun passo viene
  nascosto e la navigazione si muove solo fra le slide. In `src/routes/+page.svelte` passare
  `showAllSteps` al `Viewer` dell'anteprima. Verifica: la scheda Anteprima della home mostra una
  slide con `::: step` per intero, mentre `/v` la mostra a passi.
- [ ] 5.2 Nessun cambiamento a tastiera, swipe, fullscreen, tema e link: le scorciatoie esistenti
  chiamano già `next`/`prev`. Verifica: in `/v` frecce, swipe su viewport da telefono e schermo
  intero si comportano come prima su una presentazione senza direttive.

## 6. Stampa ed export

- [ ] 6.1 Verificare che `allHtml` costruito da `renderMarkdown(slide)` in `src/lib/Viewer.svelte`
  produca pagine con tutti i passi visibili: la regola di visibilità è limitata a `.slide .step` e
  `.print-page` non è dentro `.slide`. Verifica: `npm run build` verde e, dall'anteprima di stampa,
  la slide con tre passi occupa una sola pagina con tutto il contenuto.
- [ ] 6.2 Controllare che `src/print.css` non richieda modifiche. Verifica: diff che non tocca
  `src/print.css`.

## 7. Verifica finale

- [ ] 7.1 Eseguire sul branch `npm ci && npm run check && npm test && npm run build`: tutto verde,
  0 errori e 0 warning da `svelte-check`. Verifica: output del comando.
- [ ] 7.2 Eseguire `npx -y @fission-ai/openspec@latest validate frammenti-slide`: valido.
  Verifica: output del comando (i warning RFC 2119 sulle spec in italiano sono attesi, come nelle
  change precedenti).
- [ ] 7.3 Controllare il diff: nessun file fuori da `src/lib/slides.ts`, `src/lib/slides.test.ts`,
  `src/lib/markdown.ts`, `src/lib/markdown.test.ts`, `src/lib/Viewer.svelte`, `src/lib/i18n.ts`,
  `src/lib/examples.ts`, `src/routes/+page.svelte` e dagli artifact della change; nessuna
  dipendenza nuova, niente in `.github/workflows/` né in `openspec/specs/`. Verifica:
  `git diff --stat origin/main...HEAD`.

## Workflow follow-up

- Dopo il merge: commentare la issue con il link del merge, etichettare `agent-done` e archiviare
  la change con `openspec-archive-change` (sync dei delta in `openspec/specs/`).
