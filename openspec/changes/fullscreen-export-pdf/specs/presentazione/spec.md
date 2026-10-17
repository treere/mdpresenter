# Spec Delta

## MODIFIED Requirements

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
