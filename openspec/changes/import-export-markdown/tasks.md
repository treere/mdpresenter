# Tasks

## 1. Modulo di trasporto e test

- [ ] 1.1 Creare `src/lib/transfer.ts` con due funzioni pure: `exportFileName(name: string): string`
  (minuscole non forzate, caratteri vietati `/ \ : * ? " < > |` e di controllo sostituiti con
  `-`, spazi consecutivi compressi in `-`, trattini ai bordi tolti, lunghezza massima 60,
  risultato vuoto → `presentazione`, estensione `.md` aggiunta una volta sola) e
  `normalizeImportedText(raw: string): string` (BOM iniziale rimosso, `\r\n` e `\r` → `\n`).
  Verifica: `npm run check` senza errori sul nuovo modulo.
- [ ] 1.2 Scrivere `src/lib/transfer.test.ts` con i casi limite: nome con accenti, con spazi,
  con barre, nome vuoto o fatto di soli caratteri vietati, nome lunghissimo, nome che finisce
  già in `.md`; testo con BOM, con CRLF, con CR isolato, già in LF e testo vuoto. Verifica:
  `npm test` verde e ogni scenario dei requirement «Nome del file», «Nome non utilizzabile» e
  «File scritto su Windows» coperto da almeno un caso.

## 2. Testi dell'interfaccia

- [ ] 2.1 Aggiungere in `src/lib/i18n.ts`, sia in `it` sia in `en`, un blocco `transfer` con:
  etichetta esporta, etichetta importa, titolo della scelta, testo della scelta, azione «nuova
  presentazione», azione «sostituisci questa», annulla, avviso file illeggibile. Verifica:
  `npm run check` verde — la tipizzazione `en: Texts` garantisce che nessuna chiave manchi.

## 3. Esportazione

- [ ] 3.1 In `src/routes/+page.svelte` aggiungere una riga di azioni sopra `.panels` con il
  pulsante di esportazione: costruisce un `Blob` con il testo dell'editor, crea un object URL,
  innesca il download con `exportFileName` del nome della presentazione aperta e revoca l'URL
  subito dopo. Verifica: `npm run check` e `npm run build` verdi; in locale il file scaricato
  si apre e contiene lo stesso testo dell'editor, direttive e `---` compresi.

## 4. Importazione

- [ ] 4.1 In `src/routes/+page.svelte` aggiungere il pulsante di importazione con
  `<input type="file" accept=".md,.markdown,.txt,text/markdown,text/plain">` nascosto: la scelta
  del file viene letta con `file.text()`, passata a `normalizeImportedText`, e apre il blocco di
  scelta con le tre azioni; `input.value` viene azzerato dopo ogni scelta. Verifica: `npm run
  check` verde; scegliendo due volte di seguito lo stesso file il blocco di scelta ricompare.
- [ ] 4.2 Applicare le due scelte: «nuova presentazione» crea la voce con
  `createPresentation`/`addPresentation`, imposta `currentId`, svuota `silentText`, porta
  `slideIndex` a 0 e salva subito la libreria; «sostituisci questa» tiene `currentId` e il nome,
  cambia il testo, azzera `silentText` e `slideIndex` e salva subito; «annulla» non tocca nulla.
  Un errore di lettura mostra l'avviso e lascia tutto com'era; con `library.unavailable` il testo
  entra solo nell'editor e nel link. Verifica: `npm run check` e `npm run build` verdi; in locale
  i quattro percorsi si comportano come negli scenari dello spec `import-export`.

## 5. Verifica finale

- [ ] 5.1 Eseguire `npm ci && npm run check && npm test && npm run build`: tutto verde.
  Prova manuale in locale: esporta la presentazione di esempio, reimportala come nuova
  presentazione e confronta il testo con l'originale (identico); importa lo stesso file su una
  presentazione aperta scegliendo «sostituisci» e controlla che il nome resti e la slide torni
  alla prima; annulla una scelta e verifica che testo e link non cambino; ricarica subito dopo
  una sostituzione e verifica che resti il testo importato.
- [ ] 5.2 Controllare il diff: solo i file nominati dai task (`src/lib/transfer.ts`,
  `src/lib/transfer.test.ts`, `src/lib/i18n.ts`, `src/routes/+page.svelte`, gli artifact della
  change), nessuna dipendenza nuova in `package.json`, nessun file in `.github/workflows/` né in
  `openspec/specs/`. Verifica: `git diff --stat main...HEAD` e `git diff main...HEAD --
  .github/workflows openspec/specs package.json package-lock.json` vuoto.
