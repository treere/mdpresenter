# Proposal

## Why

Oggi la presentazione vive solo nel browser: per portarla altrove (un altro editor, un
repo, un backup) bisogna copiare il testo a mano, e per riprendere un Markdown già scritto
bisogna incollarlo nell'editor. Il Markdown è già il formato nativo dell'app, quindi
manca solo il trasporto da e verso un file.

## What Changes

- Pulsante **Esporta**: scarica il testo della presentazione aperta così com'è in un file
  `.md`, con nome derivato dal nome della presentazione.
- Pulsante **Importa**: si sceglie un file Markdown e una finestra chiede se aprire il
  contenuto come **nuova presentazione** in libreria oppure **sostituire** quella aperta;
  annullando non cambia nulla.
- Il testo importato viene normalizzato (BOM iniziale rimosso, fine riga CRLF → LF) prima
  di entrare nell'editor, così file scritti su Windows non sporcano il Markdown.
- Se il file non si legge, non cambia niente e compare un avviso.
- I testi nuovi dell'interfaccia entrano in italiano e inglese; nessuna dipendenza nuova
  (download via `Blob` + `URL.createObjectURL`, lettura via `File.text()`).

## Non-goals

- Nessun formato diverso dal Markdown (niente PDF in ingresso, niente `.zip`, niente
  round-trip JSON della libreria).
- Nessun import massivo di più file e nessuna esportazione dell'intera libreria.
- Nessun cambio al formato del link condiviso, alla libreria salvata o alla resa delle
  slide.
- Nessuna conferma di sovrascrittura in più passaggi: la scelta fra "nuova" e
  "sostituisci" è già la conferma.

## Capabilities

### New Capabilities

- `import-export`: esportazione della presentazione aperta in un file Markdown e
  importazione di un file Markdown come nuova presentazione o al posto di quella aperta,
  con avvisi sui file illeggibili.

### Modified Capabilities

Nessuna: il comportamento già specificato di `editor`, `libreria` e `home` resta invariato;
l'import crea una voce di libreria come già avviene per una presentazione nuova, ma è una
capacità nuova e vive nel suo spec.

## Impact

Codice: `src/routes/+page.svelte` (pulsanti, input file, finestra di scelta), nuovo modulo
`src/lib/transfer.ts` con i test in `src/lib/transfer.test.ts`, `src/lib/i18n.ts` (testi
nuovi in italiano e inglese). Nessuna dipendenza nuova, nessun file in `.github/workflows/`
né in `openspec/specs/`.
