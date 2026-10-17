# Tasks

## 1. Rendering Markdown e slide

- [x] 1.1 Installazione `marked` (+ sanificazione) e funzione di split su `---` con test di unità — verifica: `npm run check` verde e split di 2 separatori restituisce 3 slide
- [x] 1.2 Componente visualizzatore con navigazione (frecce, click, swipe) e indicatore `i/N` — verifica: build e navigazione manuale da tastiera tra 3 slide di esempio

## 2. Editor e condivisione

- [x] 2.1 Editor con anteprima dal vivo e layout schede su mobile / colonne su desktop — verifica: digitare aggiorna l'anteprima senza reload
- [x] 2.2 Codifica del testo in `location.hash` con debounce e decodifica all'avvio (fallback a esempio se assente o invalido) — verifica: copiare l'URL in una finestra anonima riapre stesso testo e slide

## 3. Pubblicazione

- [x] 3.1 Check, build con `BASE_PATH`, commit e push — verifica: deploy Pages verde e URL pubblico mostra editor e anteprima
