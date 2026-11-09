# Proposal

## Why

L'editor è una `textarea` nuda: chi scrive deve ricordare a memoria la sintassi — `**` per il
grassetto, i backtick per il codice, la linea `---` fra le slide, e soprattutto le direttive
`::: step` / `::: columns` / `::: part` / `::: end`, che sono state introdotte da poco e non
hanno nessun riscontro visivo nell'interfaccia. Chi non ha il Markdown in mano scrive più lento
e sbaglia di più, e la pagina Esempi è l'unico posto dove vedere la sintassi.

## What Changes

- Sopra l'editor compare una **barra di formattazione** con pulsanti che agiscono sul testo
  selezionato o sulla riga corrente, senza cambiare il fatto che l'editor resti una `textarea`
  con il suo Markdown visibile:
  - **in linea**: grassetto, corsivo, codice;
  - **blocchi**: titolo, elenco, citazione, blocco di codice;
  - **presentazione**: separatore fra slide (`---`), blocco `::: step`, blocco `::: columns`;
  - **collegamento**: testo e URL in un colpo solo.
- Il comportamento è da pulsante di editor, non da sostituto del Markdown: con una selezione i
  marcatori la avvolgono, senza selezione si inseriscono i marcatori con il cursore in mezzo; un
  secondo clic sugli stessi marcatori li **toglie** (interruttore), e gli inserimenti di riga
  aggiungono o tolgono il prefisso all'inizio della riga corrente.
- Ogni pulsante è **annullabile con `Ctrl+Z`** come una normale digitazione, e ha una
  scorciatoia da tastiera (`Ctrl/Cmd+B`, `Ctrl/Cmd+I`, `Ctrl/Cmd+K`) attiva solo con il cursore
  nell'editor.
- Ogni pulsante ha etichetta e `title`, quindi è raggiungibile da tastiera e da screen reader;
  su telefono la barra scorre in orizzontale e non ruba spazio all'editor.
- I testi nuovi entrano in italiano e inglese; nessuna dipendenza nuova.

## Non-goals

- Nessuna evidenziazione della sintassi nell'editor, nessun editor ricco, nessun CodeMirror: il
  testo resta Markdown visibile.
- Nessuna finestra o procedura guidata: niente dialoghi per tabelle, immagini o link, dove un
  pulsante non basta.
- Nessun caricamento di immagini locali (l'immagine resta un URL) e nessun cambio al motore
  Markdown, alle direttive o alla resa delle slide.
- Nessun cambio alla libreria, al link condiviso o all'esportazione.

## Capabilities

### New Capabilities

Nessuna: la barra è un modo diverso di scrivere lo stesso Markdown nell'editor che esiste.

### Modified Capabilities

- `editor`: si aggiunge la barra di formattazione, gli inserimenti di blocco e struttura e le
  scorciatoie di formattazione, con il vincolo che ogni azione sia annullabile.

## Impact

Codice: nuovo modulo `src/lib/editing.ts` (funzioni pure sull'intervallo di selezione) con i
test in `src/lib/editing.test.ts`, nuovo componente `src/lib/FormatBar.svelte`,
`src/routes/+page.svelte` (innesto della barra e delle scorciatoie), `src/lib/i18n.ts` (testi in
italiano e inglese). Nessuna dipendenza nuova, nessun file in `.github/workflows/` né in
`openspec/specs/`.
