# Spec Delta

## MODIFIED Requirements

### Requirement: Scritta iniziale centrata

La home non mostra più solo la scritta statica: ospita l'editor e il visualizzatore.
Con URL senza testo, l'editor parte con un esempio minimo che mostra come separare le slide.

#### Scenario: Apertura della home

- **WHEN** l'utente apre la pagina iniziale senza testo nell'URL
- **THEN** vede editor e visualizzatore con una presentazione di esempio

#### Scenario: Rotazione o ridimensionamento

- **WHEN** l'utente ruota il telefono o ridimensiona la finestra
- **THEN** editor e visualizzatore restano utilizzabili e la slide resta interamente visibile
