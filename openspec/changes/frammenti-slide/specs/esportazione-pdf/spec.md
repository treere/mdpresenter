# Spec Delta

## MODIFIED Requirements

### Requirement: PDF con una slide per pagina

L'utente avvia l'esportazione e ottiene un PDF dove ogni slide occupa una pagina intera,
con codice e tabelle leggibili. I passi di una slide non contano nell'esportazione: ogni
pagina mostra la slide completa, con tutti i suoi elementi visibili.

#### Scenario: Esportazione completa

- **WHEN** l'utente preme il pulsante PDF
- **THEN** si apre la stampa del browser con ogni slide su una pagina separata

#### Scenario: Presentazione di una slide

- **WHEN** la presentazione ha 1 sola slide
- **THEN** il PDF ha 1 sola pagina

#### Scenario: Slide con passi

- **WHEN** una slide contiene marcatori `<!-- passo -->`
- **THEN** la pagina di quella slide mostra tutti i blocchi, senza elementi nascosti e senza pagine in più
