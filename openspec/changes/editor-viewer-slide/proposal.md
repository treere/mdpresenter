# Proposal

## Why

La home oggi mostra solo una scritta statica. Serve il cuore dell'app: scrivere
Markdown da una parte e vedere le slide dall'altra, con link condivisibile per
riaprire la stessa presentazione su telefono e desktop.

## What Changes

- Editor Markdown (textarea) con anteprima dal vivo delle slide
- Separatore slide: linea `---`
- Navigazione slide: frecce tastiera, click e swipe
- Testo della presentazione codificato nell'URL (hash), così il link condiviso riapre la stessa presentazione
- Layout: fianco a fianco su desktop, schede su telefono
- La home ospita editor e visualizzatore al posto della scritta statica

## Capabilities

### New Capabilities

- `editor`: scrittura del Markdown con persistenza del testo nell'URL
- `presentazione`: rendering delle slide e navigazione tra esse

### Modified Capabilities

- `home`: la pagina iniziale ora ospita editor e visualizzatore invece della sola scritta `mdpresenter`

## Impact

- Nuova dipendenza: libreria Markdown leggera (scelta nel design)
- Nessun backend: tutto nel browser + URL
- Temi, stampa PDF e fullscreen restano fuori ambito
