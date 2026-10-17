# Spec Delta

## Purpose

La vista presentazione permette di mostrare le slide senza editor e di
condividere un link pulito con chi guarda.

## ADDED Requirements

### Requirement: Pagina solo visualizzatore

La pagina `/v` mostra solo le slide (navigabili, con tema e fullscreen),
leggendo il testo dall'URL come la home.

#### Scenario: Apertura link presentazione

- **WHEN** l'utente apre un link `/v` con testo codificato
- **THEN** vede solo il visualizzatore con quelle slide

#### Scenario: Link senza testo

- **WHEN** l'utente apre `/v` senza testo nell'URL
- **THEN** vede il visualizzatore con la presentazione di esempio

#### Scenario: Strumenti disponibili

- **WHEN** l'utente è nella vista presentazione
- **THEN** può usare schermo intero e download PDF come nella home

### Requirement: Copia link presentazione

Dalla home l'utente copia con un tocco il link alla vista presentazione del testo corrente.

#### Scenario: Copia

- **WHEN** l'utente preme "Copia link presentazione"
- **THEN** negli appunti finisce l'URL di `/v` con lo stesso testo dell'editor

#### Scenario: Appunti non disponibili

- **WHEN** il browser blocca gli appunti
- **THEN** l'utente vede comunque il link pronto da copiare a mano
