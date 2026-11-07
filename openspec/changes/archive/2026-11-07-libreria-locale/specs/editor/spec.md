# Spec Delta

## MODIFIED Requirements

### Requirement: Testo persistito nell'URL

Il testo dell'editor e l'indice della slide corrente vivono nei query param
(`t` per il testo compresso, `s` per l'indice) e si aggiornano mentre si usa l'app.
Lo stesso testo è salvato in automatico nella libreria locale del browser: la libreria è la
copia di lavoro, l'URL resta il modo per condividerlo con chi non ce l'ha.

#### Scenario: Condivisione del link

- **WHEN** l'utente copia l'URL e lo apre in un altro browser o telefono
- **THEN** ritrova lo stesso testo nell'editor e le stesse slide

#### Scenario: Riapertura con testo lungo

- **WHEN** l'URL contiene un testo codificato valido
- **THEN** l'editor lo decodifica e lo mostra; se la decodifica fallisce, l'editor parte vuoto

#### Scenario: Link corto

- **WHEN** il testo supera la soglia minima
- **THEN** l'URL contiene la versione compressa, più corta del testo in chiaro

#### Scenario: Link non valido

- **WHEN** l'URL contiene un codice che non si decodifica
- **THEN** l'utente vede un avviso e l'editor parte vuoto (non l'esempio)

#### Scenario: Autosalvataggio locale

- **WHEN** l'utente modifica il testo senza toccare il link
- **THEN** la presentazione aperta nella libreria contiene il testo aggiornato, senza premere salva
