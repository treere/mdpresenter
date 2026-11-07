# Proposal

## Why

Oggi una presentazione esiste solo nell'URL: chi lavora su più presentazioni deve salvare
un link diverso per ognuna e, se lo perde, perde il lavoro. Il sito è statico e senza
account, quindi la memoria deve stare nel browser del visitatore.

## What Changes

- Nuova **libreria locale** nel browser: le presentazioni si salvano da sole in
  `localStorage`, con nome modificabile, e si possono riaprire, rinominare e cancellare.
- Ogni modifica al testo aggiorna la presentazione aperta, senza bisogno di premere salva.
- All'apertura della home: se l'URL porta un testo condiviso, si apre quello; altrimenti si
  riapre l'ultima presentazione usata; se la libreria è vuota resta l'esempio attuale.
- La condivisione via link resta com'è: l'URL continua a portare il testo per chi non ha la
  libreria, ma non è più l'unico posto dove il lavoro vive.
- I testi dell'interfaccia nuovi entrano in italiano e inglese come il resto dell'app.

## Non-goals

- Nessun account, nessun sync fra dispositivi, nessun backend: solo il browser.
- Nessuna importazione/esportazione di file e nessuna cronologia delle versioni.
- Nessun cambio al formato del link condiviso né al rendering delle slide.

## Capabilities

### New Capabilities

- `libreria`: elenco delle presentazioni salvate nel browser, salvataggio automatico,
  nome modificabile, riapertura e cancellazione, con tolleranza allo spazio esaurito e ai
  dati corrotti.

### Modified Capabilities

- `editor`: il testo continua a viaggiare nell'URL per la condivisione, ma viene anche
  salvato in automatico nella libreria locale.
- `home`: la presentazione mostrata all'apertura dipende da URL, ultima presentazione usata
  o esempio, in quest'ordine.

## Impact

Codice: `src/routes/+page.svelte` (stato e autosalvataggio), nuovo modulo
`src/lib/library.ts` con i test, `src/lib/i18n.ts` (testi nuovi), eventuale pannello
dedicato in `src/lib/`. Nessuna dipendenza nuova, nessun file in `.github/workflows/` né in
`openspec/specs/`.
