# Design

## Context

Rendering `marked` + highlight + mermaid + DOMPurify. Manca: layout a colonne,
contenimento immagini, segnale di sbordo. Vedi proposal.md (Why).

## Goals / Non-Goals

**Goals:**

- Sintassi colonne semplice, immagini sempre dentro, avviso non invasivo

**Non-Goals:**

- Tre o più colonne, larghezze personalizzate, editor visuale: dopo

## Decisions

- **Sintassi a recinti**:
  `::: colonne` apre, `::: sinistra` e `::: destra` dividono, `:::` chiude.
  Implementata come estensione `marked` (tokenizer custom) che emette
  `<div class="colonne"><div>…</div><div>…</div></div>` con inner Markdown
  renderizzato ricorsivamente. Alternativa: `<div>` HTML scritto a mano
  (scartata: scomodo da scrivere e facile sbagliare).
- **Immagini**: CSS globale `.slide img { max-width: 100%; height: auto; }`,
  mai deformate, mai fuori bordo.
- **Avviso sbordo**: dopo il render, confronto `scrollHeight > clientHeight`
  del contenitore slide; badge discreto sull'indicatore di posizione.
  Nessun ridimensionamento testo, titoli intoccabili. Su telefono vale lo stesso.
- **Colonne su telefono**: impilate in verticale (media query esistente a 700px).

## Risks / Trade-offs

- [Recinti mal chiusi] → resi come testo semplice, mai rottura pagina
- [Avviso e slide lunghe volute] → solo segnale, nessuno blocco
