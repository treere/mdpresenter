# lingua Specification

## Purpose

La lingua rende l'app usabile da chi non legge l'italiano: ogni testo
dell'interfaccia e delle pagine esiste nelle due lingue e la scelta vale ovunque.

## Requirements

### Requirement: Commutazione lingua

L'utente passa da italiano a inglese e viceversa da qualsiasi pagina; la scelta
è ricordata tra le visite.

#### Scenario: Cambio lingua

- **WHEN** l'utente sceglie una lingua dal selettore
- **THEN** tutti i testi dell'interfaccia e delle pagine appaiono nella lingua scelta

#### Scenario: Lingua ricordata

- **WHEN** l'utente riapre il sito dopo aver scelto una lingua
- **THEN** ritrova l'ultima lingua usata
