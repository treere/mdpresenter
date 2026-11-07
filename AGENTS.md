# AGENTS.md — come si lavora in questo repository

Istruzioni per gli agenti che lavorano su questo repo. Il padrone di casa è `@treere`:
quello che non è scritto qui, non è autorizzato.

## Il repo

`mdpresenter` è un'app **solo frontend**: SvelteKit statico, pubblicato su GitHub Pages
sotto `/mdpresenter`, servito su `/` in locale. Nessun server, nessun account, nessun
database, nessun segreto. Il contenuto delle slide vive nel link.

## Comando unico di verifica

```sh
npm ci && npm run check && npm test && npm run build
```

È l'unica verifica valida: se non passa questa, il lavoro non è finito e non si apre
una PR in stato ready. Baseline attesa: 0 errori, 0 warning da `svelte-check`.
Nota: `.nvmrc` dice Node 22 (la CI usa 22); l'ambiente di lavoro può avere un Node
più recente. Se una differenza di comportamento compare solo qui, sospetta la versione
prima di toccare il codice.

## Regole di ferro

1. **Mai push su `main`.** Solo branch `hermes/<numero-issue>-<slug>`. Il merge lo fa una persona.
2. **Mai toccare `.github/workflows/`.** Il token dell'agente non ha lo scope Workflows:
   il push verrebbe rifiutato. Se un task sembra richiederlo, fermati e scrivilo
   sull'issue con l'etichetta `agent-blocked`.
3. **Mai modificare `openspec/specs/` a mano.** Gli spec si aggiornano solo con
   `openspec-archive-change`, che sincronizza i delta di una change approvata.
4. **Nessuna dipendenza nuova** senza approvazione esplicita nell'issue. Il progetto ha
   12 dipendenze e le tiene.
5. **Mai mettere l'etichetta `spec-approved`.** Quella la mette solo una persona.
6. **Mai mergiare, mai abilitare l'auto-merge.**

## Il flusso: issue → change → gate → apply → archive

Ogni richiesta passa da una change OpenSpec. Le skill generate sono in `.hermes/skills/`:

| Fase | Skill | Cosa produce |
|---|---|---|
| 1. Triage e proposta | `openspec-propose` | `openspec/changes/<id>/` (proposal, design, tasks) |
| 2. Applicazione | `openspec-apply-change` | commit task per task + checkbox girate |
| 3. Chiusura | `openspec-archive-change` + `openspec-sync-specs` | delta fusi in `openspec/specs/`, change in `archive/` |

Prima di proporre, **leggi `openspec/specs/`**: se la richiesta contraddice un comportamento
già specificato, non è una change, è una decisione di prodotto. Fermati e dillo sull'issue.

### Etichette di stato

- `agent-change` — richiesta che richiede una change: l'agente può partire col triage.
- `agent-fix` — bugfix che ripristina un comportamento già specificato: nessuna change, fix diretto.
- `spec-review` — la proposta è pronta e aspetta una persona.
- `needs-info` — l'agente ha fatto domande e aspetta risposte.
- `spec-approved` — **solo umano**. Da qui in poi si scrive codice.
- `agent-blocked` — serve una decisione che l'agente non può prendere.

## Dove si parla

- **Issue = intento e decisioni.** Cosa deve succedere, cosa è fuori scope, le domande.
- **PR = implementazione.** Domande sul codice, commenti inline, verifica.
- Domanda di intento nella PR, o domanda di codice nell'issue, sono un errore di posto:
  sposta la conversazione e lascia un link.

Regola di coerenza: quando la PR nasce, l'issue riceve un commento di una riga con il link.
Da lì in poi le decisioni nuove tornano comunque sull'issue.

## Quando qualcosa non è chiaro

1. Chiedi **al massimo 3 domande**, ognuna **chiusa**, ognuna con il default che adotteresti:
   «esistono `ConfirmDialog` e `Modal`: quale? (default: `ConfirmDialog`)».
2. Ogni domanda cita ciò che l'ha generata: file, riga, comportamento osservato.
3. **Vietato chiedere ciò che è nel codice.** Se non sai dove sta un componente, cerca.
   Una domanda del genere significa che queste istruzioni sono povere: segnalalo.
4. Posta le domande come commento sull'issue, metti `needs-info` e chiudi il run.
5. Se nessuno risponde entro **un giorno lavorativo**, applica i default e scrivili nel
   corpo della PR sotto «Assunzioni». Un'attesa infinita è peggio di un'assunzione tracciata.

## Convenzioni del progetto

- **Questo progetto è tutto in italiano**: artifact OpenSpec, messaggi di commit, titoli e
  descrizioni delle PR, corpi delle issue, commenti. Codice, nomi di file, variabili e commenti
  restano **in inglese**; i testi visibili in italiano e inglese.
- Le descrizioni delle PR hanno cinque sezioni, in questo ordine: **Perché / Cosa cambia /
  Come verificarlo / Rischi e assunzioni / Note per il revisore**. Sotto le ~40 righe, nessun
  changelog generato, nessun elenco di file.
- Commit in italiano, uno per task quando si applica una change.
- SvelteKit 3: niente `svelte.config.js`, la config sta nel plugin `sveltekit()` di Vite;
  i tipi `$app/*` si dichiarano in `app.d.ts`; gli import interni usano `resolve()` per
  rispettare il base path `/mdpresenter`.
- Stato condiviso fra route in moduli `.svelte.ts` con `$state`; preferenze del dispositivo
  in `localStorage`, contenuto condivisibile nell'URL (frammento `#`, mai query).
- Markdown in `{@html}`: sanitizzare l'HTML **finale** con DOMPurify; mermaid inizializzato
  con `htmlLabels: false` globale.
- `@media print` va in un foglio globale importato dal layout: gli stili dei componenti
  Svelte sono scoped e non raggiungono i sibling.

## Cosa guardare prima di dire «fatto»

- `npm run check && npm test && npm run build` verde.
- `openspec validate <id>` verde sulla change.
- Nessun file toccato fuori da quelli che i task nominano.
- Il diff non contiene `.github/workflows/**`, `openspec/specs/**` o nuove dipendenze.
