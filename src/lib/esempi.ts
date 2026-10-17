import type { Lingua } from './i18n';

export interface Esempio {
	titolo: string;
	descrizione: string;
	testo: string;
}

export const ESEMPI: Record<Lingua, Esempio[]> = {
	it: [
		{
			titolo: 'Lezione',
			descrizione: 'Titoli, elenchi e una citazione per spiegare.',
			testo: `# La fotosintesi\n\nCome le piante trasformano luce in energia.\n\n---\n\n# Ingredienti\n\n- Luce del sole\n- Acqua\n- Anidride carbonica\n\n---\n\n# Ricorda\n\n> Senza luce, niente energia.`
		},
		{
			titolo: 'Riunione',
			descrizione: 'Agenda con tabella di attività e responsabili.',
			testo: `# Stato progetto\n\nAggiornamento settimanale del team.\n\n---\n\n# Attività\n\n| Cosa | Chi | Quando |\n|---|---|---|\n| Demo | Anna | Lun |\n| Test | Bruno | Mer |\n\n---\n\n# Prossimi passi\n\n1. Chiudere i test\n2. Preparare la demo`
		},
		{
			titolo: 'Codice',
			descrizione: 'Blocco di codice evidenziato per temi tecnici.',
			testo: `# Somma in JavaScript\n\nUna funzione semplice, spiegata riga per riga.\n\n---\n\n# Il codice\n\n\`\`\`js\nfunction somma(a, b) {\n  return a + b;\n}\n\nconsole.log(somma(2, 3));\n\`\`\``
		},
		{
			titolo: 'Link e immagini',
			descrizione: 'Collegamenti e foto dentro le slide.',
			testo: `# Un gatto per iniziare\n\nLe immagini rendono tutto più chiaro.\n\n![Gatto](https://picsum.photos/seed/gatto/600/400)\n\n---\n\n# Approfondisci\n\nLeggi la [documentazione](https://svelte.dev) per saperne di più.`
		}
	],
	en: [
		{
			titolo: 'Lesson',
			descrizione: 'Headings, lists and a quote to explain.',
			testo: `# Photosynthesis\n\nHow plants turn light into energy.\n\n---\n\n# Ingredients\n\n- Sunlight\n- Water\n- Carbon dioxide\n\n---\n\n# Remember\n\n> No light, no energy.`
		},
		{
			titolo: 'Meeting',
			descrizione: 'Agenda with a task table and owners.',
			testo: `# Project status\n\nWeekly team update.\n\n---\n\n# Tasks\n\n| What | Who | When |\n|---|---|---|\n| Demo | Anna | Mon |\n| Tests | Bruno | Wed |\n\n---\n\n# Next steps\n\n1. Finish tests\n2. Prepare the demo`
		},
		{
			titolo: 'Code',
			descrizione: 'Highlighted code block for technical topics.',
			testo: `# Sum in JavaScript\n\nA simple function, explained line by line.\n\n---\n\n# The code\n\n\`\`\`js\nfunction sum(a, b) {\n  return a + b;\n}\n\nconsole.log(sum(2, 3));\n\`\`\``
		},
		{
			titolo: 'Links and images',
			descrizione: 'Links and photos inside slides.',
			testo: `# A cat to start\n\nImages make everything clearer.\n\n![Cat](https://picsum.photos/seed/cat/600/400)\n\n---\n\n# Learn more\n\nRead the [documentation](https://svelte.dev) to learn more.`
		}
	]
};
