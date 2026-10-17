# presentazione Specification

## Purpose

Il visualizzatore trasforma il Markdown in slide navigabili, una alla volta,
su telefono e desktop.

## Requirements

### Requirement: Suddivisione in slide

Il testo viene diviso in slide sulla linea `---`; ogni slide rende il proprio Markdown.

#### Scenario: Tre blocchi di testo

- **WHEN** il testo contiene due linee `---`
- **THEN** il visualizzatore mostra 3 slide

#### Scenario: Nessun separatore

- **WHEN** il testo non contiene `---`
- **THEN** il visualizzatore mostra 1 sola slide con tutto il contenuto

### Requirement: Navigazione tra slide

L'utente si sposta tra le slide con frecce tastiera, click e swipe, con indicatore di posizione.

#### Scenario: Tastiera

- **WHEN** l'utente preme freccia destra o sinistra
- **THEN** avanza o torna indietro di una slide, senza uscire dalla prima né dall'ultima

#### Scenario: Indicatore di posizione

- **WHEN** la presentazione ha più slide
- **THEN** il visualizzatore mostra la posizione corrente (es. 2/5)
