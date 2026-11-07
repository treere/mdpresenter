# Spec Delta

## ADDED Requirements

### Requirement: Direttive nominate nella slide

Il Markdown di una slide riconosce direttive nominate, ciascuna su una riga da sola: `::: passo`
apre un passo, `::: colonne` apre un blocco di colonne affiancate, `::: colonna` separa una colonna
dalla successiva dentro un blocco colonne, `::: fine` chiude il blocco aperto più interno. I nomi
sono case-insensitive e i blocchi si annidano. Una direttiva dentro un blocco di codice, un nome
non riconosciuto e una riga di soli `:::` sono testo.

#### Scenario: Blocco colonne

- **WHEN** una slide contiene `::: colonne` … `::: fine` con due righe `::: colonna` all'interno
- **THEN** il blocco è reso in tre colonne affiancate su desktop e impilate su telefono

#### Scenario: Blocco colonne senza separatori

- **WHEN** un blocco `::: colonne` … `::: fine` non contiene righe `::: colonna`
- **THEN** il suo contenuto occupa una sola colonna a piena larghezza

#### Scenario: Passo dentro una colonna

- **WHEN** una colonna di un blocco `::: colonne` contiene un blocco `::: passo` … `::: fine`
- **THEN** le colonne sono affiancate dall'inizio e il contenuto del passo compare al suo turno, nella colonna a cui appartiene

#### Scenario: Passo che contiene colonne

- **WHEN** il contenuto di un `::: passo` contiene un blocco `::: colonne` … `::: fine`
- **THEN** il blocco colonne compare insieme al passo e non ne spezza il contenuto

#### Scenario: Passo dentro un passo

- **WHEN** un blocco `::: passo` contiene un altro `::: passo`
- **THEN** la direttiva interna è mostrata come testo e non crea un secondo passo

#### Scenario: Direttiva dentro un blocco di codice

- **WHEN** una riga `::: passo`, `::: colonne`, `::: colonna` o `::: fine` compare dentro un blocco di codice delimitato
- **THEN** è mostrata come codice e non apre, separa o chiude nulla

#### Scenario: Blocco non chiuso

- **WHEN** un blocco `::: colonne` o `::: passo` non ha il suo `::: fine`
- **THEN** le sue direttive sono mostrate come testo e il resto della slide non viene inghiottito

#### Scenario: Direttiva sconosciuta

- **WHEN** una riga contiene `:::` seguito da una parola diversa da `passo`, `colonne`, `colonna` e `fine`, oppure è una riga di soli `:::`
- **THEN** è mostrata come testo

### Requirement: Passi dentro la slide

Una slide può dichiarare un ordine di comparsa dei propri elementi con blocchi `::: passo`, anche
dentro le colonne di un blocco colonne. La vista presentazione rivela i passi nell'ordine del testo
— prima ciò che precede il primo passo, poi un passo alla volta — in modo cumulativo: i passi già
mostrati restano visibili, quelli successivi occupano il proprio spazio ma non sono visibili. Una
slide senza blocchi `::: passo` è visibile tutta.

#### Scenario: Contenuto iniziale di una slide con passi

- **WHEN** una slide contiene tre blocchi `::: passo` dopo un'introduzione
- **THEN** la vista presentazione mostra l'introduzione e il primo passo

#### Scenario: Slide che comincia con un passo

- **WHEN** il testo della slide prima del primo `::: passo` è vuoto
- **THEN** la presentazione parte dal primo passo e non mostra una slide vuota

#### Scenario: Comparsa del passo successivo

- **WHEN** l'utente avanza su una slide che ha ancora passi da mostrare
- **THEN** compare il passo successivo e la slide resta quella corrente

#### Scenario: Passi già mostrati

- **WHEN** la presentazione è oltre il primo passo di una slide
- **THEN** i passi precedenti restano visibili, non spariscono

#### Scenario: Spazio riservato

- **WHEN** un passo non è ancora visibile
- **THEN** gli elementi già visibili non si spostano e il testo non si riposiziona

#### Scenario: Slide senza passi

- **WHEN** una slide non contiene blocchi `::: passo`
- **THEN** la slide è visibile tutta e la navigazione passa direttamente alla slide successiva

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
