# Spec Delta

## MODIFIED Requirements

### Requirement: Scritta iniziale centrata

La home non mostra più solo la scritta statica: ospita l'editor e il visualizzatore.
Con URL senza testo e libreria vuota, l'editor parte con un esempio minimo che mostra come
separare le slide. Se la libreria locale ha presentazioni salvate, la home riapre l'ultima
usata al posto dell'esempio; il testo portato dall'URL ha sempre la precedenza su entrambi.

#### Scenario: Apertura della home

- **WHEN** l'utente apre la pagina iniziale senza testo nell'URL e con la libreria vuota
- **THEN** vede editor e visualizzatore con una presentazione di esempio

#### Scenario: Rotazione o ridimensionamento

- **WHEN** l'utente ruota il telefono o ridimensiona la finestra
- **THEN** editor e visualizzatore restano utilizzabili e la slide resta interamente visibile

#### Scenario: Ultima presentazione riaperta

- **WHEN** l'utente apre la home senza testo nell'URL e la libreria contiene presentazioni
- **THEN** l'editor mostra l'ultima presentazione usata, non l'esempio

#### Scenario: Testo nell'URL con libreria piena

- **WHEN** l'URL contiene un testo condiviso e la libreria ha presentazioni salvate
- **THEN** l'editor mostra il testo dell'URL
