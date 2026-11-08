# Spec Delta

## Purpose

La barra di formattazione rende la scrittura del Markdown meno mnemonica: i marcatori e le
direttive della presentazione si inseriscono con un pulsante, senza smettere di vedere il testo
così com'è.

## ADDED Requirements

### Requirement: Formattazione in linea

La barra offre pulsanti per grassetto, corsivo e codice. Ogni pulsante avvolge la selezione
corrente nei marcatori del Markdown, oppure inserisce i marcatori con il cursore in mezzo quando
non c'è selezione. Ripetere l'azione su un testo già avvolto toglie i marcatori.

#### Scenario: Testo selezionato

- **WHEN** l'utente seleziona «parola» e preme il pulsante del grassetto
- **THEN** l'editor contiene `**parola**` e la selezione resta su `parola`

#### Scenario: Nessuna selezione

- **WHEN** l'utente preme il pulsante del corsivo senza aver selezionato niente
- **THEN** l'editor inserisce `**` … i marcatori del corsivo e il cursore resta fra loro, pronto
  per la parola

#### Scenario: Interruttore

- **WHEN** l'utente seleziona `**parola**` e preme di nuovo il pulsante del grassetto
- **THEN** l'editor contiene `parola` e la selezione resta su `parola`

#### Scenario: Selezione su più righe

- **WHEN** l'utente seleziona due righe di testo e preme il pulsante del codice in linea
- **THEN** ogni riga selezionata viene avvolta separatamente, senza produrre un blocco di codice

### Requirement: Inserimenti di blocco e di struttura

La barra offre pulsanti per i prefissi di riga (titolo, elenco, citazione, blocco di codice) e
per gli elementi della presentazione (separatore fra slide, blocco `::: step`, blocco
`::: columns`). I prefissi agiscono sulla riga corrente, o su ogni riga della selezione, e si
tolgono premendo di nuovo lo stesso pulsante; gli elementi della presentazione inseriscono la
struttura completa con il cursore dentro.

#### Scenario: Prefisso di riga

- **WHEN** il cursore è su una riga di testo e l'utente preme il pulsante del titolo
- **THEN** la riga comincia con `# ` e il cursore resta sul testo

#### Scenario: Prefisso già presente

- **WHEN** il cursore è su una riga che comincia già con `# ` e l'utente preme il pulsante del
  titolo
- **THEN** il prefisso sparisce e il resto della riga non cambia

#### Scenario: Separatore fra slide

- **WHEN** l'utente preme il pulsante del separatore con il cursore alla fine di una slide
- **THEN** viene inserita una riga `---` separata da righe vuote e le slide aumentano di una

#### Scenario: Blocco di passi

- **WHEN** l'utente preme il pulsante del passo
- **THEN** l'editor inserisce un blocco `::: step` … `::: end` completo e il cursore sta fra le
  due direttive, pronto per il contenuto

#### Scenario: Blocco di colonne

- **WHEN** l'utente preme il pulsante delle colonne
- **THEN** l'editor inserisce un blocco con `::: columns`, due `::: part` e `::: end` e il
  cursore sta nella prima colonna

### Requirement: Scorciatoie di formattazione

Le stesse azioni della barra sono raggiungibili da tastiera, con le scorciatoie che ci si
aspetta da un editor, e sono attive solo quando il cursore è nell'editor: fuori dall'editor la
tastiera continua a fare quello che faceva prima.

#### Scenario: Grassetto da tastiera

- **WHEN** il cursore è nell'editor e l'utente preme `Ctrl+B` (o `Cmd+B` su macOS)
- **THEN** si applica la stessa azione del pulsante del grassetto, senza aprire menu del browser

#### Scenario: Collegamento da tastiera

- **WHEN** il cursore è nell'editor, c'è del testo selezionato e l'utente preme `Ctrl+K` (o
  `Cmd+K` su macOS)
- **THEN** la selezione diventa il testo di un collegamento e il cursore va sull'URL da scrivere

#### Scenario: Scorciatoie fuori dall'editor

- **WHEN** il cursore non è nell'editor
- **THEN** `Ctrl+B`, `Ctrl+I` e `Ctrl+K` non toccano il testo della presentazione

### Requirement: Annullamento e stato dell'editor

Ogni azione della barra è una modifica come le altre: si annulla con `Ctrl+Z` insieme alle
digitazioni, non lascia il fuoco fuori dall'editor e non interrompe l'anteprima dal vivo né il
salvataggio automatico.

#### Scenario: Annullamento

- **WHEN** l'utente applica il grassetto e poi preme `Ctrl+Z`
- **THEN** il testo torna esattamente a prima dell'azione, senza perdere le digitazioni
  precedenti

#### Scenario: Anteprima e salvataggio

- **WHEN** l'utente usa un pulsante della barra
- **THEN** l'anteprima si aggiorna e la presentazione aperta viene salvata come dopo una
  digitazione

#### Scenario: Telefono

- **WHEN** l'utente scrive da telefono
- **THEN** la barra resta raggiungibile e l'editor conserva uno spazio utilizzabile
