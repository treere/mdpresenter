# Proposal

## Why

Oggi una slide è tutta visibile appena la si apre: chi presenta non può accompagnare il
discorso con il testo, perché l'ascoltatore legge la conclusione prima che venga detta. Serve
un modo per far comparire gli elementi uno alla volta restando nella stessa slide.

## What Changes

- Un marcatore nel Markdown, su una riga da solo — `<!-- passo -->` — divide il contenuto
  della slide in **passi**: quello che sta prima del primo marcatore è visibile subito, ogni
  marcatore apre il passo successivo.
- Nella vista presentazione si vede un passo alla volta: avanti (frecce, swipe, pulsanti)
  scorre i passi della slide prima di passare alla slide dopo; indietro li ripercorre al
  contrario e, tornando alla slide precedente, la mostra con tutti i suoi passi visibili.
- Gli elementi non ancora mostrati restano al loro posto ma invisibili: il testo non si
  riposiziona a ogni passo e l'avviso di sbordo continua a misurare la slide completa.
- Il contatore dice anche il passo quando la slide ne ha più di uno (`2/5 · 1/3`).
- **L'export PDF ignora i passi**: una slide, una pagina, con tutto visibile. Anche
  l'anteprima dell'editor mostra la slide intera, così si scrive senza indovinare.
- Una slide senza marcatori si comporta esattamente come oggi: nessun passo, nessuna
  variazione di navigazione.
- I testi nuovi dell'interfaccia entrano in italiano e inglese come il resto dell'app.

## Non-goals

- Nessuna animazione, dissolvenza o transizione fra slide: la comparsa è immediata.
- Nessuna scelta del passo nell'URL: il link continua a puntare alla slide, non al passo.
- Nessun cambio al formato del link condiviso, alla libreria locale o all'editor.
- Nessun nuovo tipo di blocco Markdown e nessuna dipendenza nuova.

## Capabilities

### New Capabilities

_(nessuna)_

### Modified Capabilities

- `presentazione`: il rendering di una slide tiene conto dei passi; la navigazione attraversa
  i passi prima di cambiare slide.
- `esportazione-pdf`: la stampa mostra ogni slide completa, indipendentemente dai passi.

## Impact

Codice: `src/lib/slides.ts` (nuova funzione pura `splitSteps`, con test in
`src/lib/slides.test.ts`), `src/lib/Viewer.svelte` (stato del passo, navigazione, contatore,
stili dei passi nascosti), `src/routes/+page.svelte` (anteprima sempre completa, navigazione
dell'anteprima), `src/lib/i18n.ts` (testi del contatore). Nessuna dipendenza nuova, nessun
file in `.github/workflows/` né in `openspec/specs/`.
