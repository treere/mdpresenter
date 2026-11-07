# Tasks

## 1. Modulo libreria

- [x] 1.1 Creare `src/lib/library.ts` con tipi `Presentation` e `Library`, chiave
  `mdpresenter-library`, forma `{ version: 1, presentations, lastOpenedId }` e le funzioni
  `loadLibrary`, `saveLibrary`, `createPresentation`, `renamePresentation`,
  `deletePresentation`, `defaultName`. Verifica: `npm run check` senza errori di tipo sul
  nuovo modulo.
- [x] 1.2 Gestire i casi limite dentro il modulo: JSON illeggibile o forma inattesa →
  libreria vuota con flag `corrupt`; `QuotaExceededError` → `saveLibrary` restituisce `false`;
  `localStorage` inaccessibile → flag `unavailable`. Verifica: `npm test` con i test del
  punto 1.3 verdi.
- [x] 1.3 Scrivere `src/lib/library.test.ts` con `// @vitest-environment jsdom`: salvataggio e
  rilettura, nome automatico dal primo heading e dalla prima riga, nome vuoto rifiutato,
  rinomina, cancellazione, dati corrotti, storage non disponibile. Verifica: `npm test` verde
  e i casi coprono ogni scenario della capability `libreria`.

## 2. Testi e pannello

- [x] 2.1 Aggiungere in `src/lib/i18n.ts` (sia `it` sia `en`) i testi della libreria: titolo,
  invito a scrivere, rinomina, elimina, conferma, annulla, avviso quota, avviso dati corrotti,
  nome predefinito. Verifica: `npm run check` verde, quindi la tipizzazione
  `Record<Language, Texts>` garantisce le chiavi in entrambe le lingue.
- [ ] 2.2 Creare `src/lib/Library.svelte`: elenco ordinato per `updatedAt` decrescente con
  nome e data relativa, voce corrente evidenziata, rinomina in linea, eliminazione a due
  passi ("Elimina" → "Confermi?"), invito quando è vuota, avvisi per quota e dati corrotti.
  Verifica: `npm run check` e `npm run build` verdi; controllare l'anteprima locale che il
  pannello si apra e si chiuda e che i testi siano tradotti in entrambe le lingue.

## 3. Integrazione nella pagina

- [ ] 3.1 In `src/routes/+page.svelte`, inizializzare lo stato: `?t=` presente → testo
  dell'URL; assente → ultima presentazione (`lastOpenedId`) se esiste, altrimenti `SAMPLE`;
  `localStorage` non disponibile → `SAMPLE` e pannello nascosto. Verifica: aprendo `/` senza
  query si vede l'esempio, ricaricando dopo una modifica si ritrova il testo modificato, e
  aprendo un `?t=` valido vince il testo dell'URL.
- [ ] 3.2 Salvare in libreria con lo stesso debounce dell'URL, dentro l'`$effect` già
  esistente e con lo stesso contatore di sequenza; un testo arrivato dall'URL entra in
  libreria solo alla prima modifica. Verifica: modificando l'esempio nasce una voce in
  elenco; aprendo un link condiviso e non toccando nulla la libreria non cambia.
- [ ] 3.3 Collegare il pannello alla pagina: scegliere una voce carica testo e indice slide,
  rinomina ed eliminazione aggiornano l'elenco, cancellare la voce aperta passa alla
  successiva o a `SAMPLE`. Verifica: `npm test`, `npm run check` e `npm run build` verdi;
  prova manuale su viewport da telefono che l'elenco non copra l'editor.

## 4. Verifica finale

- [ ] 4.1 Eseguire `npm ci && npm run check && npm test && npm run build` sul branch:
  tutto verde, 0 errori e 0 warning da `svelte-check`. Verifica: output del comando, più
  `grep -c "/mdpresenter/" build/index.html` per confermare che il base path sia applicato
  agli asset di `build/`.

## Workflow follow-up

- Dopo il merge: commentare la issue con il link del merge, etichettare `agent-done` e
  archiviare la change con `openspec-archive-change` (sync dei delta in `openspec/specs/`).
