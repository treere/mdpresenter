# esportazione-pdf Specification

## Purpose

L'esportazione produce un documento PDF della presentazione, leggibile e stampabile,
con una slide per pagina.

## Requirements

### Requirement: PDF con una slide per pagina

L'utente avvia l'esportazione e ottiene un PDF dove ogni slide occupa una pagina intera,
con codice e tabelle leggibili.

#### Scenario: Esportazione completa

- **WHEN** l'utente preme il pulsante PDF
- **THEN** si apre la stampa del browser con ogni slide su una pagina separata

#### Scenario: Presentazione di una slide

- **WHEN** la presentazione ha 1 sola slide
- **THEN** il PDF ha 1 sola pagina
