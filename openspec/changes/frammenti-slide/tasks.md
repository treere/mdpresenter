# Tasks

## 1. Passi nel testo (funzione pura)

- [ ] 1.1 In `src/lib/slides.ts` aggiungere la costante `STEP_MARKER = '<!-- passo -->'` e
  `splitSteps(text: string): string[]`: divide sulle righe che, dopo `trim()`, sono esattamente
  il marcatore, ignorando quelle dentro le fence (stesso toggle di `splitSlides`, estratto in
  un helper privato condiviso). Scarta i blocchi vuoti e restituisce sempre almeno un elemento
  (`['']` se non resta niente). Verifica: `npm run check` senza errori di tipo sul modulo.
- [ ] 1.2 In `src/lib/slides.test.ts` coprire: tre blocchi con due marcatori → tre passi; testo
  senza marcatori → un passo con il testo intero; marcatore dentro un blocco di codice → un
  passo solo; marcatore come prima riga o come ultima → nessun passo vuoto; marcatore con
  spazi intorno sulla riga → riconosciuto; riga simile ma diversa (`<!-- passo --> testo`,
  `<!-- passi -->`) → non è un marcatore. Verifica: `npm test` verde.
- [ ] 1.3 Verificare che `splitSlides` continui a comportarsi come prima dopo l'estrazione
  dell'helper: i test esistenti di `src/lib/slides.test.ts` devono passare senza modifiche.
  Verifica: `npm test` verde con i test delle slide invariati nel diff.

## 2. Visualizzatore con i passi

- [ ] 2.1 In `src/lib/Viewer.svelte` aggiungere `stepIndex` come stato locale, `steps` derivati
  da `splitSteps(current)` e `stepHtml: string[]` calcolato nell'`$effect` esistente con
  `renderMarkdown` + `DOMPurify.sanitize`, uno per passo. Rendere `<div class="step">` per
  ogni passo; una slide con un solo passo resta un unico `{@html}` senza wrapper. I passi oltre
  `stepIndex` prendono la classe che li nasconde con `visibility: hidden`. Verifica: `npm run
  check` e `npm run build` verdi; con due marcatori in una slide, la vista `/v` mostra solo il
  primo blocco.
- [ ] 2.2 Aggiornare `next()`/`prev()`: avanti di passo finché ci sono passi, poi slide
  successiva con `stepIndex = 0`; indietro di passo, altrimenti slide precedente con
  `stepIndex` sul suo ultimo passo. Azzerare `stepIndex` quando cambia `index` (link diretto,
  indicatore, cambio manuale). Verifica: prova manuale su `/v` con una presentazione di due
  slide e una con tre passi — avanti tre volte poi cambia slide, indietro riporta alla slide
  precedente tutta visibile, un link `?s=1` parte dal primo passo.
- [ ] 2.3 Contatore: mostrare `{index+1}/{total}` e, quando la slide ha più di un passo,
  `· {stepIndex+1}/{steps.length}`, con `aria-label` dalla nuova chiave `step` aggiunta in
  `src/lib/i18n.ts` per `it` e `en`. Verifica: `npm run check` verde (la tipizzazione
  `Texts` impone le due lingue) e il contatore visibile in entrambe le lingue.
- [ ] 2.4 Stili: regola `.step` nascosta con `visibility: hidden`, nessuna transizione, nessun
  cambio di layout fra passo e passo. Verifica: nella vista `/v`, avanzando di passo gli
  elementi già visibili non si spostano (confronto visivo a schermo e su viewport 390×844).

## 3. Anteprima dell'editor completa

- [ ] 3.1 Aggiungere al `Viewer` la prop `showAllSteps = false`; quando è `true` tutti i passi
  sono visibili e la navigazione si muove solo fra le slide. In `src/routes/+page.svelte`
  passare `showAllSteps` al `Viewer` dell'anteprima. Verifica: la scheda Anteprima della home
  mostra una slide con marcatori per intero, mentre `/v` la mostra a passi.
- [ ] 3.2 Nessun cambiamento a tastiera, swipe, fullscreen, tema e link: le scorciatoie
  esistenti chiamano già `next`/`prev`. Verifica: in `/v` frecce, swipe su viewport da telefono
  e schermo intero si comportano come prima su una presentazione senza marcatori.

## 4. Stampa e export

- [ ] 4.1 In `src/lib/Viewer.svelte` costruire `allHtml` da `splitSteps(slide).join('\n\n')`
  invece che dal testo grezzo, così le righe marcatore non finiscono nel DOM e la pagina
  stampata contiene tutti i blocchi. Verifica: `npm run build` verde e, con `window.print()`
  dall'anteprima di stampa, la slide con tre passi occupa una sola pagina con i tre blocchi.
- [ ] 4.2 Controllare che `src/print.css` non richieda modifiche: `.print-page` è fuori da
  `.slide`, quindi la regola di visibilità dei passi non lo raggiunge. Verifica: diff che non
  tocca `src/print.css`.

## 5. Verifica finale

- [ ] 5.1 Eseguire sul branch `npm ci && npm run check && npm test && npm run build`: tutto
  verde, 0 errori e 0 warning da `svelte-check`. Verifica: output del comando.
- [ ] 5.2 Eseguire `npx -y @fission-ai/openspec@latest validate frammenti-slide`: valido.
  Verifica: output del comando (i warning RFC 2119 sulle spec in italiano sono attesi, come
  nelle change precedenti).
- [ ] 5.3 Controllare il diff: nessun file fuori da `src/lib/slides.ts`,
  `src/lib/slides.test.ts`, `src/lib/Viewer.svelte`, `src/lib/i18n.ts`,
  `src/routes/+page.svelte` e dagli artifact della change; nessuna dipendenza nuova, niente in
  `.github/workflows/` né in `openspec/specs/`. Verifica: `git diff --stat origin/main...HEAD`.

## Workflow follow-up

- Dopo il merge: commentare la issue con il link del merge, etichettare `agent-done` e
  archiviare la change con `openspec-archive-change` (sync dei delta in `openspec/specs/`).
