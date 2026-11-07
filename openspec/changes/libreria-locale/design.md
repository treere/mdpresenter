# Design

## Context

Vedi proposal.md — Why. Lo stato attuale che conta:

- `src/routes/+page.svelte` tiene il testo in `$state`, lo inizializza da `readQuery()`
  (`?t=` compresso, `?s=` indice) e lo riscrive nell'URL con debounce di 500 ms, protetto da
  `encodeSeq` contro le encode fuori ordine. `SAMPLE` è il default, `invalidLink` l'avviso.
- `src/lib/slides.ts` contiene `encode`/`decode` (base64url + gzip con prefisso `0`/`1`) e
  `readQuery`/`writeQuery`. Nessuna dipendenza di storage.
- Preferenze del dispositivo già in `localStorage` (`mdpresenter-theme`,
  `mdpresenter-language`) lette nel layout, quindi la scelta è coerente con l'app.
- Test: `vitest` senza ambiente dichiarato; `jsdom` è già devDependency, basta il docblock
  `// @vitest-environment jsdom` nel file di test.

## Goals / Non-Goals

**Goals:**

- Persistenza locale di più presentazioni con nome, senza toccare il formato del link.
- Autosalvataggio con lo stesso debounce dell'URL, così le due copie non divergono.
- Comportamento degradato esplicito quando `localStorage` manca, è pieno o è corrotto.

**Non-Goals:**

- Sync fra dispositivi, cronologia, import/export di file, cifratura dei dati locali.
- Cambiare lo schema dell'URL o il rendering delle slide.

## Decisions

**Un solo modulo puro `src/lib/library.ts`, nessun `$state` dentro.** Funzioni
`loadLibrary/saveLibrary/createPresentation/renamePresentation/deletePresentation` che
parlano con `localStorage` e restituiscono dati tipizzati; lo stato reattivo resta in
`+page.svelte`. Motivo: testabile in vitest senza montare componenti. Alternativa scartata:
runes nel modulo, che legherebbero la libreria al runtime Svelte e renderebbero i test più
lenti e fragili.

**Una sola chiave `mdpresenter-library`, forma `{ version: 1, presentations: [...],
lastOpenedId }`.** Ogni voce ha `id` (`crypto.randomUUID()`), `name`, `text`, `slide`,
`updatedAt`. Motivo: enumerare e cancellare è banale, la scrittura è atomica e una quota
superata non lascia metà libreria. Alternativa scartata: una chiave per presentazione, che
richiede un indice separato e può divergere da esso. Costo accettato: a ogni salvataggio si
riscrive l'intero JSON, mitigato dal debounce e dalle dimensioni tipiche (decine di KB).

**L'URL resta il canale di condivisione, non la copia di lavoro.** All'apertura: `?t=`
presente → si carica quel testo; assente → ultima presentazione (`lastOpenedId`) se esiste,
altrimenti `SAMPLE`. Un testo arrivato dall'URL **non** entra in libreria finché l'utente non
lo modifica: altrimenti ogni link aperto lascerebbe una copia. La presentazione caricata
dall'URL diventa la presentazione aperta al primo salvataggio, con nome ricavato dal testo.

**Nome automatico dal primo titolo, poi libero.** Primo heading `# ...` del testo, altrimenti
prima riga non vuota, accorciato a 40 caratteri; se non c'è nulla, "Senza titolo". La rinomina
rifiuta stringhe vuote o di soli spazi mantenendo il nome precedente. Motivo: zero attrito
alla prima scrittura, nome utile nell'elenco.

**Cancellazione con conferma in linea, non `window.confirm`.** Il pulsante si trasforma in
"Confermi?" per la voce selezionata: due click, nessun dialog bloccante, funziona su telefono
e nei test. Cancellare la presentazione aperta carica l'ultima rimasta, o `SAMPLE` se la
libreria si svuota.

**UI in un pannello `src/lib/Library.svelte` sopra l'editor**, con elenco a fisarmonica:
nome e data relativa per riga, azioni rinomina ed elimina, voce corrente evidenziata. Motivo:
un `<select>` non permette rinomina/eliminazione comode e su mobile diventa illeggibile con
testi lunghi.

**Fallimenti dello storage gestiti in un punto solo.** `loadLibrary` cattura
`SyntaxError`/forma inattesa e restituisce libreria vuota più un flag `corrupt`;
`saveLibrary` cattura `QuotaExceededError` (nome diverso fra browser) e restituisce `false`;
se `localStorage` lancia all'accesso, la libreria si dichiara non disponibile e il pannello
non compare. In tutti i casi l'editor continua con URL e `SAMPLE`, con un avviso.

## Risks / Trade-offs

- **Testi molto grandi oltre la quota (~5 MB per origine)** → avviso, il testo resta in
  editor e URL; nessun tentativo di compressione nella libreria (il JSON resta leggibile e
  semplice).
- **Due schede aperte sulla stessa presentazione si sovrascrivono** (last write wins) →
  accettato in questa change; il riallineamento su `storage`/focus è lavoro separato.
- **Il testo nell'URL e la libreria possono divergere** se l'utente apre un link condiviso e
  non modifica nulla → è il comportamento voluto (nessuna copia implicita), ma va spiegato
  nel pannello con un invito a modificare per salvare.
- **Dati locali non cifrati**: chiunque usi quel browser li vede → coerente con l'assenza di
  account; da dire nella pagina Progetto solo se serve.
- **La spec `editor` parlava dei query param e `AGENTS.md` del frammento `#`**: la change non
  tocca lo schema dell'URL e lascia la discrepanza esistente fuori scope; la segnalo nella PR.

## Migration Plan

Nessuna migrazione: la chiave `mdpresenter-library` non esiste oggi e il campo `version`
permette evoluzioni future. Rollback = rimuovere il pannello e ignorare la chiave; nessun dato
utente remoto da ripulire.

## Open Questions

- Posizione del pannello (sopra l'editor o in una scheda dedicata su telefono): si decide in
  apply guardando il layout mobile, senza cambiare requisiti né task.
