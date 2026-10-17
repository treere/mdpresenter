# presentazione Specification

## Purpose

Il visualizzatore trasforma il Markdown in slide navigabili, una alla volta,
su telefono e desktop.

## Requirements

### Requirement: Suddivisione in slide

Il testo viene diviso in slide sulla linea `---`; ogni slide rende il proprio Markdown,
con codice evidenziato e tabelle formattate.

#### Scenario: Tre blocchi di testo

- **WHEN** il testo contiene due linee `---`
- **THEN** il visualizzatore mostra 3 slide

#### Scenario: Nessun separatore

- **WHEN** il testo non contiene `---`
- **THEN** il visualizzatore mostra 1 sola slide con tutto il contenuto

#### Scenario: Codice evidenziato nella slide

- **WHEN** una slide contiene un blocco di codice con linguaggio dichiarato
- **THEN** il codice è mostrato con evidenziazione sintassi del linguaggio

#### Scenario: Codice senza linguaggio

- **WHEN** un blocco di codice non dichiara il linguaggio
- **THEN** è mostrato come testo preformattato senza evidenziazione e senza errori

#### Scenario: Tabella nella slide

- **WHEN** una slide contiene una tabella Markdown con riga di intestazione e separatore
- **THEN** è mostrata come tabella con intestazione distinta e colonne allineate come dichiarato

### Requirement: Navigazione tra slide

L'utente si sposta tra le slide con frecce tastiera, click e swipe, con indicatore di posizione.
La navigazione resta attiva anche in schermo intero.

#### Scenario: Tastiera

- **WHEN** l'utente preme freccia destra o sinistra
- **THEN** avanza o torna indietro di una slide, senza uscire dalla prima né dall'ultima

#### Scenario: Indicatore di posizione

- **WHEN** la presentazione ha più slide
- **THEN** il visualizzatore mostra la posizione corrente (es. 2/5)

#### Scenario: Schermo intero

- **WHEN** l'utente preme il pulsante schermo intero
- **THEN** la slide corrente occupa tutto lo schermo e resta navigabile

#### Scenario: Uscita dallo schermo intero

- **WHEN** l'utente preme Esc o il pulsante di uscita
- **THEN** si torna alla vista normale sulla stessa slide

#### Scenario: Cambio tema

- **WHEN** l'utente sceglie un tema dal selettore
- **THEN** tutta l'interfaccia (slide, editor, barra, schede) usa i colori del tema scelto

#### Scenario: Tema ricordato

- **WHEN** l'utente riapre il sito dopo aver scelto un tema
- **THEN** ritrova l'ultimo tema usato

#### Scenario: Stampa sempre chiara

- **WHEN** l'utente esporta il PDF con qualsiasi tema attivo
- **THEN** il PDF usa il tema chiaro
