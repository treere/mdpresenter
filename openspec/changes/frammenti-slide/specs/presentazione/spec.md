# Spec Delta

## ADDED Requirements

### Requirement: Parti e direttive nella slide

Il Markdown di una slide riconosce un solo vocabolario di direttive, ciascuna su una riga da
sola: `:::` separa le parti del contenitore corrente, `::: colonne` apre un blocco che termina
con `::: fine`. Al livello della slide le parti sono passi; dentro un blocco colonne le parti
sono colonne affiancate. I blocchi si annidano, e una direttiva dentro un blocco di codice è
testo.

#### Scenario: Slide divisa in parti

- **WHEN** una slide contiene due righe `:::` fuori da un blocco
- **THEN** la slide ha tre parti, e la prima è il contenuto che precede la prima riga

#### Scenario: Blocco colonne

- **WHEN** una slide contiene `::: colonne` … `::: fine` con due righe `:::` all'interno
- **THEN** il blocco è reso in tre colonne affiancate su desktop e impilate su telefono

#### Scenario: Blocco dentro una parte

- **WHEN** una parte contiene un blocco `::: colonne` … `::: fine`
- **THEN** il blocco interno è reso come colonne e la parte resta una sola

#### Scenario: Direttiva dentro un blocco di codice

- **WHEN** una riga `:::`, `::: colonne` o `::: fine` compare dentro un blocco di codice delimitato
- **THEN** è mostrata come codice e non divide, apre o chiude nulla

#### Scenario: Blocco non chiuso

- **WHEN** un blocco `::: colonne` non ha il suo `::: fine`
- **THEN** le sue direttive sono mostrate come testo e il resto della slide non viene inghiottito

#### Scenario: Direttiva sconosciuta

- **WHEN** una riga contiene `:::` seguito da una parola che non è `colonne` né `fine`
- **THEN** è mostrata come testo

### Requirement: Passi dentro la slide

Una slide può dichiarare un ordine di comparsa dei propri elementi: le righe `:::` di primo
livello separano il contenuto della slide in passi. La vista presentazione mostra i passi
nell'ordine del testo, uno alla volta e in modo cumulativo: i passi già mostrati restano
visibili, quelli successivi occupano il proprio spazio ma non sono visibili. Una slide senza
righe `:::` è un unico passo.

#### Scenario: Contenuto iniziale di una slide con passi

- **WHEN** una slide contiene tre parti separate da due righe `:::`
- **THEN** la vista presentazione mostra solo la prima parte della slide

#### Scenario: Comparsa del blocco successivo

- **WHEN** l'utente avanza su una slide che ha ancora parti da mostrare
- **THEN** compare la parte successiva e la slide resta quella corrente

#### Scenario: Parti già mostrate

- **WHEN** la presentazione è oltre la prima parte di una slide
- **THEN** le parti precedenti restano visibili, non spariscono

#### Scenario: Spazio riservato

- **WHEN** una parte non è ancora visibile
- **THEN** gli elementi già visibili non si spostano e il testo non si riposiziona

#### Scenario: Slide senza parti

- **WHEN** una slide non contiene righe `:::`
- **THEN** la slide è visibile tutta e la navigazione passa direttamente alla slide successiva

#### Scenario: Anteprima dell'editor

- **WHEN** l'utente guarda l'anteprima nell'editor
- **THEN** la slide mostra tutte le sue parti, senza elementi nascosti

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
