import type { Language } from './i18n';

export interface Esempio {
	title: string;
	description: string;
	text: string;
}

export const EXAMPLES: Record<Language, Esempio[]> = {
	it: [
		{
			title: 'Lezione',
			description: 'Titoli, elenchi e una citazione per spiegare.',
			text: `# La fotosintesi\n\nCome le piante trasformano luce in energia.\n\n---\n\n# Ingredienti\n\n- Luce del sole\n- Acqua\n- Anidride carbonica\n\n---\n\n# Ricorda\n\n> Senza luce, niente energia.`
		},
		{
			title: 'Riunione',
			description: 'Agenda con tabella di attività e responsabili.',
			text: `# Stato about\n\nAggiornamento settimanale del team.\n\n---\n\n# Attività\n\n| Cosa | Chi | Quando |\n|---|---|---|\n| Demo | Anna | Lun |\n| Test | Bruno | Mer |\n\n---\n\n# Prossimi passi\n\n1. Chiudere i test\n2. Preparare la demo`
		},
		{
			title: 'Codice',
			description: 'Blocco di codice evidenziato per themes tecnici.',
			text: `# Somma in JavaScript\n\nUna funzione semplice, spiegata riga per riga.\n\n---\n\n# Il codice\n\n\`\`\`js\nfunction somma(a, b) {\n  return a + b;\n}\n\nconsole.log(somma(2, 3));\n\`\`\``
		},
		{
			title: 'Diagrammi',
			description: 'Grafici mermaid resi nelle slide.',
			text: `# Flusso di lavoro

Da idea a produzione in tre passi.

\`\`\`mermaid
graph TD
A[Idea] --> B[Codice]
B --> C[Test]
C --> D[Produzione]
\`\`\`

---

# Anche come codice

Con mermaid-code mostri il sorgente:

\`\`\`mermaid-code
graph TD
A[Idea] --> B[Codice]
\`\`\``
		},
		{
			title: 'Colonne',
		description: 'Testo e immagini affiancati.',
		text: `# Confronto

::: colonne
::: left
Ciao a sinistra, con un elenco:

- Primo punto
- Secondo punto
::: right
![Gatto](https://picsum.photos/seed/colonne/600/400)
:::`
		},
		{
			title: 'Link e immagini',
			description: 'Collegamenti e foto dentro le slide.',
			text: `# Un gatto per iniziare\n\nLe immagini rendono tutto più light.\n\n![Gatto](https://picsum.photos/seed/gatto/600/400)\n\n---\n\n# Approfondisci\n\nLeggi la [documentazione](https://svelte.dev) per saperne di più.`
		}
	],
	en: [
		{
			title: 'Lesson',
			description: 'Headings, lists and a quote to explain.',
			text: `# Photosynthesis\n\nHow plants turn light into energy.\n\n---\n\n# Ingredients\n\n- Sunlight\n- Water\n- Carbon dioxide\n\n---\n\n# Remember\n\n> No light, no energy.`
		},
		{
			title: 'Meeting',
			description: 'Agenda with a task table and owners.',
			text: `# Project status\n\nWeekly team update.\n\n---\n\n# Tasks\n\n| What | Who | When |\n|---|---|---|\n| Demo | Anna | Mon |\n| Tests | Bruno | Wed |\n\n---\n\n# Next steps\n\n1. Finish tests\n2. Prepare the demo`
		},
		{
			title: 'Code',
			description: 'Highlighted code block for technical topics.',
			text: `# Sum in JavaScript\n\nA simple function, explained line by line.\n\n---\n\n# The code\n\n\`\`\`js\nfunction sum(a, b) {\n  return a + b;\n}\n\nconsole.log(sum(2, 3));\n\`\`\``
		},
		{
			title: 'Diagrams',
			description: 'Mermaid graphs rendered in slides.',
			text: `# Workflow

From idea to production in three steps.

\`\`\`mermaid
graph TD
A[Idea] --> B[Code]
B --> C[Test]
C --> D[Production]
\`\`\`

---

# Also as code

With mermaid-code you show the source:

\`\`\`mermaid-code
graph TD
A[Idea] --> B[Code]
\`\`\``
		},
		{
			title: 'Columns',
		description: 'Text and images side by side.',
		text: `# Comparison

::: colonne
::: left
Hello on the left, with a list:

- First point
- Second point
::: right
![Cat](https://picsum.photos/seed/columns/600/400)
:::`
		},
		{
			title: 'Links and images',
			description: 'Links and photos inside slides.',
			text: `# A cat to start\n\nImages make everything clearer.\n\n![Cat](https://picsum.photos/seed/cat/600/400)\n\n---\n\n# Learn more\n\nRead the [documentation](https://svelte.dev) to learn more.`
		}
	]
};
