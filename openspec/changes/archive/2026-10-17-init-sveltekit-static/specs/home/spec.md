# Spec Delta

## Purpose

La pagina iniziale presenta il progetto con la sua scritta centrata nella viewport.
È il punto di partenza su cui cresceranno le funzionalità di presentazione.

## ADDED Requirements

### Requirement: Scritta iniziale centrata

La home mostra il testo `mdpresenter` centrato orizzontalmente e verticalmente nella viewport,
leggibile su telefono e desktop senza interazioni.

#### Scenario: Apertura della home

- **WHEN** l'utente apre la pagina iniziale
- **THEN** vede la scritta `mdpresenter` centrata nella viewport

#### Scenario: Rotazione o ridimensionamento

- **WHEN** l'utente ruota il telefono o ridimensiona la finestra
- **THEN** la scritta resta centrata e interamente visibile
