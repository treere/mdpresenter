# presentazione Specification

## Purpose

Il visualizzatore trasforma il Markdown in slide navigabili, una alla volta,
su telefono e desktop.

## Requirements

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

#### Scenario: Diagramma mermaid

- **WHEN** una slide contiene un blocco ```mermaid valido
- **THEN** è mostrato il diagramma renderizzato, non il codice

#### Scenario: Codice mermaid visibile

- **WHEN** una slide contiene un blocco ```mermaid-code
- **THEN** è mostrato come blocco di codice evidenziato

#### Scenario: Mermaid non valido

- **WHEN** un blocco ```mermaid contiene sintassi errata
- **THEN** la slide mostra un segnaposto di errore al posto del diagramma

#### Scenario: Due colonne

- **WHEN** una slide contiene un blocco colonne con parte sinistra e destra
- **THEN** le due parti stanno affiancate su desktop e impilate su telefono

#### Scenario: Immagine contenuta

- **WHEN** una slide contiene un'immagine più larga della slide
- **THEN** l'immagine si ridimensiona per stare dentro senza deformarsi

#### Scenario: Avviso di sbordo

- **WHEN** il contenuto di una slide supera l'altezza visibile
- **THEN** la slide mostra un avviso discreto senza cambiare le dimensioni del testo

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

### Requirement: Direttive nominate nella slide

Il Markdown di una slide riconosce direttive nominate, ciascuna su una riga da sola, con nome in
inglese: `::: step` apre un passo, `::: columns` apre un blocco di colonne affiancate, `::: part`
inizia la colonna successiva dentro un blocco colonne, `::: end` chiude il blocco aperto più
interno. I nomi sono case-insensitive e i blocchi si annidano. Una direttiva dentro un blocco di
codice, un nome non riconosciuto e una riga di soli `:::` sono testo.

#### Scenario: Blocco colonne

- **WHEN** una slide contiene `::: columns` … `::: end` con due righe `::: part` all'interno
- **THEN** il blocco è reso in tre colonne affiancate su desktop e impilate su telefono

#### Scenario: Blocco colonne senza separatori

- **WHEN** un blocco `::: columns` … `::: end` non contiene righe `::: part`
- **THEN** il suo contenuto occupa una sola colonna a piena larghezza

#### Scenario: Passo dentro una colonna

- **WHEN** una colonna di un blocco `::: columns` contiene un blocco `::: step` … `::: end`
- **THEN** le colonne sono affiancate dall'inizio e il contenuto del passo compare al suo turno, nella colonna a cui appartiene

#### Scenario: Passo che contiene colonne

- **WHEN** il contenuto di un `::: step` contiene un blocco `::: columns` … `::: end`
- **THEN** il blocco colonne compare insieme al passo e non ne spezza il contenuto

#### Scenario: Passo dentro un passo

- **WHEN** un blocco `::: step` contiene un altro `::: step`
- **THEN** la direttiva interna è mostrata come testo e non crea un secondo passo

#### Scenario: Direttiva dentro un blocco di codice

- **WHEN** una riga `::: step`, `::: columns`, `::: part` o `::: end` compare dentro un blocco di codice delimitato
- **THEN** è mostrata come codice e non apre, separa o chiude nulla

#### Scenario: Blocco non chiuso

- **WHEN** un blocco `::: columns` o `::: step` non ha il suo `::: end`
- **THEN** le sue direttive sono mostrate come testo e il resto della slide non viene inghiottito

#### Scenario: Direttiva sconosciuta

- **WHEN** una riga contiene `:::` seguito da una parola diversa da `step`, `columns`, `part` e `end`, oppure è una riga di soli `:::`
- **THEN** è mostrata come testo

### Requirement: Passi dentro la slide

Una slide può dichiarare un ordine di comparsa dei propri elementi con blocchi `::: step`, anche
dentro le colonne di un blocco colonne. La vista presentazione rivela i passi nell'ordine del testo
— prima ciò che precede il primo passo, poi un passo alla volta — in modo cumulativo: i passi già
mostrati restano visibili, quelli successivi occupano il proprio spazio ma non sono visibili. Una
slide senza blocchi `::: step` è visibile tutta.

#### Scenario: Contenuto iniziale di una slide con passi

- **WHEN** una slide contiene tre blocchi `::: step` dopo un'introduzione
- **THEN** la vista presentazione mostra l'introduzione e il primo passo

#### Scenario: Slide che comincia con un passo

- **WHEN** il testo della slide prima del primo `::: step` è vuoto
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

- **WHEN** una slide non contiene blocchi `::: step`
- **THEN** la slide è visibile tutta e la navigazione passa direttamente alla slide successiva

#### Scenario: Anteprima dell'editor

- **WHEN** l'utente guarda l'anteprima nell'editor
- **THEN** la slide mostra tutti i suoi passi, senza elementi nascosti
