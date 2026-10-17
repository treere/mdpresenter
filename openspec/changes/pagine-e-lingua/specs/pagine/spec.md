# Spec Delta

## Purpose

Le pagine informative spiegano il progetto e mostrano con esempi pratici cosa
si può fare, in entrambe le lingue.

## ADDED Requirements

### Requirement: Pagina esempi

La pagina esempi descrive cosa si può fare e offre presentazioni pronte che si
aprono nell'editor.

#### Scenario: Apertura esempio

- **WHEN** l'utente preme un esempio nella pagina esempi
- **THEN** l'editor si apre con il testo dell'esempio nella lingua corrente

### Requirement: Pagina progetto

La pagina progetto spiega cos'è mdpresenter, come funziona e dove sta il codice.

#### Scenario: Consultazione

- **WHEN** l'utente apre la pagina progetto
- **THEN** legge descrizione, funzionamento e link al repository

### Requirement: Navigazione tra pagine

L'utente raggiunge home, esempi e progetto da ogni pagina, su telefono e desktop.
Ogni pagina ha un footer con link al repository.

#### Scenario: Spostamento

- **WHEN** l'utente preme un link di navigazione
- **THEN** arriva alla pagina corrispondente nella lingua corrente

#### Scenario: Pagina inesistente

- **WHEN** l'utente apre un indirizzo che non esiste
- **THEN** vede una pagina 404 nella lingua corrente con link alla home
