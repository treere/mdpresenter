# Spec Delta

## MODIFIED Requirements

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
