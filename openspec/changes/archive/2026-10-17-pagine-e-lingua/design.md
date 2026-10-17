# Design

## Context

Pagina singola senza routing né i18n. Il selettore tema vive nella barra del
visualizzatore (nascosto nella scheda editor su telefono). Vedi proposal.md (Why).

## Goals / Non-Goals

**Goals:**

- IT/EN ovunque con scelta persistente
- Pagine esempi e progetto bilingue con navigazione
- Tema cambiabile da intestazione globale

**Non-Goals:**

- Altre lingue, traduzione dei contenuti utente, SEO multilingua avanzata: dopo

## Decisions

- **i18n con dizionari TS** (`src/lib/i18n.ts`: `it`/`en`, chiave → testo) e stato
  lingua in pagina con persistenza `localStorage`; `lang` dell'HTML aggiornato.
  Alternativa: libreria `svelte-i18n` (scartata: pesante per due lingue e poche stringhe).
- **Selettori globali in `+layout.svelte`**: intestazione con nav (Home, Esempi,
  Progetto) + selettore lingua + selettore tema; il tema resta bindato e condiviso.
  Il selettore tema resta anche nel visualizzatore? No: uno solo, nell'intestazione,
  per non duplicare. (Modifica visiva, nessun cambio di scenario oltre al nuovo.)
- **Route**: `/` home esistente, `/esempi`, `/progetto`; link con `data-sveltekit-preload-data`.
  Prerender di tutte le route (adapter-static le include in automatico).
- **Finiture**: footer con link GitHub in `+layout.svelte`, favicon SVG dedicata
  (slide stilizzata), route `+error.svelte` per la 404, meta description bilingue
  e titolo per pagina in `app.html`/head.
- **Esempi**: 2-3 presentazioni pronte per lingua (lezione, riunione, codice),
  pulsante "Apri nell'editor" che porta in home con testo via stato condiviso o URL.

## Risks / Trade-offs

- [Testi da mantenere in due lingue] → dizionari tipizzati: chiave mancante = errore di tipo
- [Esempi lunghi nell'URL] → passaggio via `sessionStorage` o stato, non via hash
