# Spec Delta

## ADDED Requirements

### Requirement: Passi dentro la slide

Una slide può dichiarare un ordine di comparsa dei propri elementi: una riga che contiene solo
il marcatore `<!-- passo -->` separa il contenuto in passi. La vista presentazione mostra un
passo alla volta, nell'ordine del testo; gli elementi dei passi successivi occupano il proprio
spazio ma non sono visibili. Una slide senza marcatori è un unico passo.

#### Scenario: Contenuto iniziale di una slide con passi

- **WHEN** una slide contiene tre blocchi separati da due marcatori `<!-- passo -->`
- **THEN** la vista presentazione mostra solo il primo blocco della slide

#### Scenario: Comparsa del blocco successivo

- **WHEN** l'utente avanza su una slide che ha ancora passi da mostrare
- **THEN** compare il blocco successivo e la slide resta quella corrente

#### Scenario: Spazio riservato

- **WHEN** un blocco non è ancora visibile
- **THEN** gli elementi già visibili non si spostano e il testo non si riposiziona

#### Scenario: Slide senza marcatori

- **WHEN** una slide non contiene marcatori `<!-- passo -->`
- **THEN** la slide è visibile tutta e la navigazione passa direttamente alla slide successiva

#### Scenario: Marcatore dentro un blocco di codice

- **WHEN** la riga `<!-- passo -->` compare dentro un blocco di codice delimitato
- **THEN** è mostrata come codice e non divide la slide in passi

#### Scenario: Anteprima dell'editor

- **WHEN** l'utente guarda l'anteprima nell'editor
- **THEN** la slide mostra tutti i suoi passi, senza elementi nascosti

## MODIFIED Requirements

### Requirement: Navigazione tra slide

L'utente si sposta tra le slide con frecce tastiera, click e swipe, con indicatore di posizione.
La navigazione attraversa i passi di una slide prima di cambiare slide. La navigazione resta
attiva anche in schermo intero.

#### Scenario: Tastiera

- **WHEN** l'utente preme freccia destra o sinistra
- **THEN** avanza o torna indietro di un passo o di una slide, senza uscire dalla prima né dall'ultima

#### Scenario: Fine dei passi di una slide

- **WHEN** l'utente avanza sull'ultimo passo visibile di una slide
- **THEN** passa alla slide successiva, che parte dal suo primo passo

#### Scenario: Ritorno a una slide già vista

- **WHEN** l'utente torna indietro dalla prima slide che segue una slide con passi
- **THEN** rivede la slide precedente con tutti i suoi passi visibili

#### Scenario: Indicatore di posizione

- **WHEN** la presentazione ha più slide
- **THEN** il visualizzatore mostra la posizione corrente (es. 2/5) e, se la slide ha più passi, anche il passo corrente (es. 2/5 · 1/3)

#### Scenario: Schermo intero

- **WHEN** l'utente preme il pulsante schermo intero
- **THEN** la slide corrente occupa tutto lo schermo e resta navigabile

#### Scenario: Uscita dallo schermo intero

- **WHEN** l'utente preme Esc o il pulsante di uscita
- **THEN** si torna alla vista normale sulla stessa slide

#### Scenario: Cambio tema

- **WHEN** l'utente sceglie un tema dal selettore
- **THEN** tutta l'interfaccia (slide, editor, barra, schede) usa i colori del tema scelto

#### Scenario: Tema ricordato

- **WHEN** l'utente riapre il sito dopo aver scelto un tema
- **THEN** ritrova l'ultimo tema usato

#### Scenario: Stampa sempre chiara

- **WHEN** l'utente esporta il PDF con qualsiasi tema attivo
- **THEN** il PDF usa il tema chiaro

#### Scenario: Tema sempre raggiungibile

- **WHEN** l'utente è su qualsiasi pagina o scheda (anche editor su telefono)
- **THEN** può cambiare tema senza passare dal visualizzatore

#### Scenario: Link diretto a slide

- **WHEN** l'utente apre un link con indice slide valido
- **THEN** la presentazione parte da quella slide, dal suo primo passo

#### Scenario: Indice fuori intervallo

- **WHEN** l'indice nel link supera le slide esistenti
- **THEN** si parte dall'ultima slide senza errori
