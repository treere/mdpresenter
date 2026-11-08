# Spec Delta

## Purpose

Il trasporto da e verso un file Markdown permette di riprendere una presentazione scritta
altrove e di portare fuori quella aperta nel browser, senza copiare e incollare il testo.

## ADDED Requirements

### Requirement: Esportazione in file Markdown

L'utente scarica la presentazione aperta come file Markdown. Il file contiene il testo
dell'editor così com'è, senza riscritture: separatori di slide, direttive `:::` e blocchi di
codice restano identici, così il file riaperto dà le stesse slide.

#### Scenario: Esportazione della presentazione aperta

- **WHEN** l'utente chiede di esportare la presentazione aperta
- **THEN** il browser scarica un file `.md` il cui contenuto è esattamente il testo dell'editor

#### Scenario: Nome del file

- **WHEN** la presentazione si chiama "Lezione 3: reti"
- **THEN** il file scaricato ha un nome ricavato da quel titolo, con estensione `.md` e senza
  caratteri che i file system rifiutano

#### Scenario: Nome non utilizzabile

- **WHEN** la presentazione non ha un nome o il nome è fatto solo di caratteri non ammessi
- **THEN** il file scaricato ha un nome predefinito con estensione `.md`

#### Scenario: Direttive e separatori conservati

- **WHEN** la presentazione contiene righe `---`, blocchi `::: step` e blocchi di codice
- **THEN** il file esportato le contiene come sono state scritte

#### Scenario: Presentazione vuota

- **WHEN** l'editor è vuoto e l'utente esporta
- **THEN** il file scaricato è vuoto e non compare nessun errore

### Requirement: Importazione di un file Markdown

L'utente sceglie un file Markdown dal dispositivo e decide se aprirlo come presentazione
nuova in libreria oppure se sostituire la presentazione aperta. La scelta è la conferma:
annullandola non cambia nulla. Un file che non si riesce a leggere non tocca il lavoro in
corso.

#### Scenario: Scelta del file

- **WHEN** l'utente sceglie un file Markdown
- **THEN** l'interfaccia chiede se aprire il contenuto come nuova presentazione o sostituire
  quella aperta, e offre di annullare

#### Scenario: Nuova presentazione

- **WHEN** l'utente sceglie "nuova presentazione"
- **THEN** la libreria guadagna una voce con il nome ricavato dal contenuto, l'editor e
  l'anteprima mostrano il testo importato, si parte dalla prima slide e il link condivisibile
  porta il testo nuovo

#### Scenario: Sostituzione della presentazione aperta

- **WHEN** l'utente sceglie "sostituisci" su una presentazione aperta
- **THEN** quella presentazione conserva il proprio nome e riceve il testo importato, si parte
  dalla prima slide e la versione precedente del testo non è più recuperabile

#### Scenario: Import annullato

- **WHEN** l'utente chiude la scelta senza confermare
- **THEN** testo, libreria, slide corrente e link restano com'erano

#### Scenario: File illeggibile

- **WHEN** la lettura del file fallisce
- **THEN** compare un avviso e testo, libreria, slide corrente e link restano com'erano

#### Scenario: File scritto su Windows

- **WHEN** il file importato ha fine riga CRLF o un BOM iniziale
- **THEN** il testo mostrato nell'editor usa fine riga LF e non inizia con caratteri invisibili

#### Scenario: Import senza libreria disponibile

- **WHEN** il browser nega l'accesso allo spazio locale e l'utente importa un file
- **THEN** il testo entra nell'editor e nel link senza errori, e nessuna voce compare in elenco
