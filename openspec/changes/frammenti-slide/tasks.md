# Tasks

## 1. Grammatica delle direttive (funzione pura)

- [ ] 1.1 In `src/lib/slides.ts` aggiungere `directiveOf(line)` che classifica una riga trimmata
  come `parts` (`:::`), `open` (`::: <parola>`), `close` (`::: fine`) o `null`, con le parole
  case-insensitive e gli spazi interni tollerati come oggi; aggiungere `isFenceLine(line)` e
  usarlo in `splitSlides` al posto del toggle inline. Verifica: `npm run check` senza errori di
  tipo sul modulo.
- [ ] 1.2 Aggiungere `splitSteps(text: string): string[]`: divide sulle direttive `parts` a
  profondità zero (le `open` incrementano, le `close` decrementano), ignora le righe dentro le
  fence, scarta le parti vuote e restituisce sempre almeno un elemento. Verifica: `npm run check`
  verde.
- [ ] 1.3 In `src/lib/slides.test.ts` coprire: tre parti con due righe `:::`; testo senza direttive
  → una parte con il testo intero; `:::` dentro un blocco di codice → una parte sola; `:::` dentro
  `::: colonne` … `::: fine` → non è un passo; `::: fine` senza blocco aperto → resta nel testo e
  non chiude niente; `::: colonne` senza chiusura → il resto della slide è una parte sola; righe
  vicine ma diverse (`::::`, `:: :`, `::: passi`) → non sono direttive `parts`. Verifica:
  `npm test` verde.
- [ ] 1.4 Verificare che `splitSlides` continui a comportarsi come prima dopo l'estrazione
  dell'helper: i test esistenti delle slide devono passare senza modifiche. Verifica: `npm test`
  verde con i casi di `splitSlides` invariati nel diff.

## 2. Renderer dei blocchi

- [ ] 2.1 In `src/lib/markdown.ts` sostituire l'estensione `colonne` con una che riconosce
  `::: colonne` … `::: fine` contando la profondità (un `::: colonne` annidato non chiude il
  padre), divide il contenuto sulle righe `:::` di primo livello e produce una parte per ciascuna
  con `this.lexer.blockTokens`. Usare `directiveOf`/`isFenceLine` da `slides.ts`, non una seconda
  regex. Verifica: `npm run check` verde.
- [ ] 2.2 Il renderer emette `<div class="colonne">` con un `<div>` per parte, per N qualsiasi; una
  parte sola rende un blocco a piena larghezza. Verifica: `npm run build` verde.
- [ ] 2.3 Blocco non chiuso e direttiva sconosciuta restano testo: il tokenizer restituisce
  `undefined` e `marked` rende la riga come paragrafo, come già fa oggi. Verifica: il test
  «leaves unclosed column blocks as text» continua a passare.
- [ ] 2.4 In `src/lib/markdown.test.ts` coprire: due parti, tre parti, blocco annidato dentro una
  parte, vecchia sintassi `::: left` / `::: right` resa come testo, `:::` dentro una fence intatto
  e non interpretato. Verifica: `npm test` verde.

## 3. Stili e testi di esempio

- [ ] 3.1 In `src/lib/Viewer.svelte` portare `.colonne` a
  `grid-template-columns: repeat(auto-fit, minmax(0, 1fr))`, lasciando il breakpoint ≤700px a una
  colonna. Verifica: in `/v` un blocco con due e uno con tre parti hanno colonne di uguale
  larghezza, e su viewport 390×844 sono impilate.
- [ ] 3.2 In `src/lib/examples.ts` riscrivere le due slide «Colonne» con la nuova sintassi
  (`::: colonne`, righe `:::` fra le parti, `::: fine`). Verifica: nella home gli esempi «Colonne»
  si vedono come prima, senza direttive a schermo.

## 4. Visualizzatore con i passi

- [ ] 4.1 In `src/lib/Viewer.svelte` aggiungere `stepIndex` come stato locale, `steps` derivati da
  `splitSteps(current)` e `stepHtml: string[]` calcolato nell'`$effect` esistente con
  `renderMarkdown` + `DOMPurify.sanitize`, uno per parte. Rendere `<div class="step">` per ogni
  parte; una slide con una parte sola resta un unico `{@html}` senza wrapper. Le parti oltre
  `stepIndex` prendono la classe che le nasconde con `visibility: hidden`. Verifica: `npm run
  check` e `npm run build` verdi; con due righe `:::` in una slide, la vista `/v` mostra solo la
  prima parte.
- [ ] 4.2 Aggiornare `next()`/`prev()`: avanti di passo finché ci sono parti, poi slide successiva
  con `stepIndex = 0`; indietro di passo, altrimenti slide precedente con `stepIndex` sulla sua
  ultima parte. Azzerare `stepIndex` quando cambia `index` (link diretto, indicatore, cambio
  manuale). Verifica: prova manuale su `/v` con una presentazione di due slide e una con tre parti
  — avanti tre volte poi cambia slide, indietro riporta alla slide precedente tutta visibile, un
  link `?s=1` parte dal primo passo.
- [ ] 4.3 Contatore: mostrare `{index+1}/{total}` e, quando la slide ha più di una parte,
  `· {stepIndex+1}/{steps.length}`, con `aria-label` dalla nuova chiave `step` aggiunta in
  `src/lib/i18n.ts` per `it` e `en`. Verifica: `npm run check` verde (la tipizzazione `Texts`
  impone le due lingue) e il contatore visibile in entrambe le lingue.
- [ ] 4.4 Stili: regola `.step` nascosta con `visibility: hidden`, nessuna transizione, nessun
  cambio di layout fra parte e parte. Verifica: nella vista `/v`, avanzando di passo gli elementi
  già visibili non si spostano (confronto visivo a schermo e su viewport 390×844).

## 5. Anteprima dell'editor completa

- [ ] 5.1 Aggiungere al `Viewer` la prop `showAllSteps = false`; quando è `true` tutte le parti
  sono visibili e la navigazione si muove solo fra le slide. In `src/routes/+page.svelte` passare
  `showAllSteps` al `Viewer` dell'anteprima. Verifica: la scheda Anteprima della home mostra una
  slide con righe `:::` per intero, mentre `/v` la mostra a passi.
- [ ] 5.2 Nessun cambiamento a tastiera, swipe, fullscreen, tema e link: le scorciatoie esistenti
  chiamano già `next`/`prev`. Verifica: in `/v` frecce, swipe su viewport da telefono e schermo
  intero si comportano come prima su una presentazione senza direttive.

## 6. Stampa e export

- [ ] 6.1 In `src/lib/Viewer.svelte` costruire `allHtml` da `splitSteps(slide).join('\n\n')`
  invece che dal testo grezzo, così le righe `:::` di livello zero non finiscono nel DOM e la
  pagina stampata contiene tutte le parti. Verifica: `npm run build` verde e, con `window.print()`
  dall'anteprima di stampa, la slide con tre parti occupa una sola pagina con tutto il contenuto.
- [ ] 6.2 Controllare che `src/print.css` non richieda modifiche: `.print-page` è fuori da
  `.slide`, quindi la regola di visibilità dei passi non lo raggiunge. Verifica: diff che non
  tocca `src/print.css`.

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
