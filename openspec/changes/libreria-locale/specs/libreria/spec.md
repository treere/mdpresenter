# Spec Delta

## Purpose

La libreria tiene nel browser del visitatore le presentazioni su cui sta lavorando, così
che possano essere più d'una e non vivano solo nel link.

## ADDED Requirements

### Requirement: Elenco delle presentazioni salvate

La libreria mostra le presentazioni salvate nel browser, ciascuna con il proprio nome e il
momento dell'ultima modifica, dalla più recente alla più vecchia.

#### Scenario: Più presentazioni in elenco

- **WHEN** la libreria contiene tre presentazioni
- **THEN** l'elenco le mostra tutte e tre, con nome e ultima modifica, ordinate dalla più recente

#### Scenario: Libreria vuota

- **WHEN** la libreria non contiene nessuna presentazione
- **THEN** l'elenco è vuoto e l'interfaccia mostra un invito a scrivere nell'editor

### Requirement: Salvataggio automatico

La presentazione aperta si aggiorna da sola a ogni modifica del testo: non esiste un
pulsante di salvataggio e il lavoro non si perde ricaricando la pagina.

#### Scenario: Modifica del testo

- **WHEN** l'utente digita nell'editor
- **THEN** entro un secondo la presentazione aperta nella libreria contiene il testo aggiornato

#### Scenario: Ricarica della pagina

- **WHEN** l'utente ricarica la pagina senza testo nell'URL
- **THEN** ritrova il testo e la slide su cui stava lavorando

#### Scenario: Prima presentazione

- **WHEN** la libreria è vuota e l'utente modifica l'esempio iniziale
- **THEN** nasce una presentazione nella libreria, senza chiedere conferma

### Requirement: Nome della presentazione

Ogni presentazione ha un nome scelto dall'utente; finché non lo cambia, il nome viene
ricavato dal contenuto.

#### Scenario: Nome automatico

- **WHEN** nasce una presentazione da un testo che inizia con un titolo
- **THEN** il nome dell'elenco è quel titolo, accorciato se troppo lungo

#### Scenario: Rinomina

- **WHEN** l'utente rinomina una presentazione
- **THEN** l'elenco mostra subito il nuovo nome, anche dopo aver ricaricato la pagina

#### Scenario: Nome vuoto

- **WHEN** l'utente conferma un nome vuoto o fatto solo di spazi
- **THEN** la presentazione mantiene il nome precedente

### Requirement: Cancellazione

L'utente cancella una presentazione dalla libreria, con una conferma prima di perdere il
testo.

#### Scenario: Cancellazione confermata

- **WHEN** l'utente conferma la cancellazione di una presentazione
- **THEN** la presentazione sparisce dall'elenco e non ricompare dopo la ricarica

#### Scenario: Cancellazione annullata

- **WHEN** l'utente annulla la conferma
- **THEN** la presentazione resta nell'elenco, invariata

#### Scenario: Cancellazione della presentazione aperta

- **WHEN** l'utente cancella la presentazione che sta modificando
- **THEN** l'editor passa a un'altra presentazione della libreria, o all'esempio se non ce ne sono

### Requirement: Apertura di una presentazione

Scegliere una presentazione nell'elenco la carica nell'editor e nel visualizzatore, alla
slide in cui era stata lasciata.

#### Scenario: Riapertura

- **WHEN** l'utente sceglie una presentazione dall'elenco
- **THEN** l'editor mostra il suo testo e l'anteprima le sue slide

#### Scenario: Slide ripristinata

- **WHEN** l'utente riapre una presentazione lasciata sulla terza slide
- **THEN** il visualizzatore parte dalla terza slide

### Requirement: Affidabilità dello spazio locale

La libreria vive nel `localStorage` del browser: quando lo spazio finisce, i dati sono
illeggibili o lo storage non è disponibile, l'app continua a funzionare come prima e lo
dice all'utente.

#### Scenario: Spazio esaurito

- **WHEN** il salvataggio supera lo spazio disponibile nel browser
- **THEN** compare un avviso e il testo resta nell'editor e nell'URL, senza errori non gestiti

#### Scenario: Dati corrotti

- **WHEN** il contenuto salvato non è leggibile come libreria
- **THEN** l'elenco parte vuoto con un avviso, senza cancellare il resto dello storage

#### Scenario: Storage non disponibile

- **WHEN** il browser nega l'accesso a `localStorage`
- **THEN** l'app funziona come ora, con l'esempio e la condivisione via URL, e l'elenco non compare
