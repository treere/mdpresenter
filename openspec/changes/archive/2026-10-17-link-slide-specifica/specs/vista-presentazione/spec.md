# Spec Delta

## MODIFIED Requirements

### Requirement: Copia link presentazione

Dalla home l'utente copia con un tocco il link alla vista presentazione del testo corrente,
scegliendo se partire dall'inizio o dalla slide corrente.

#### Scenario: Copia

- **WHEN** l'utente preme "Copia link presentazione"
- **THEN** negli appunti finisce l'URL di `/v` con lo stesso testo dell'editor

#### Scenario: Appunti non disponibili

- **WHEN** il browser blocca gli appunti
- **THEN** l'utente vede comunque il link pronto da copiare a mano

#### Scenario: Scelta slide iniziale

- **WHEN** l'utente copia il link scegliendo "dall'inizio" o "dalla slide corrente"
- **THEN** il link apre la presentazione rispettivamente dalla prima slide o da quella corrente
