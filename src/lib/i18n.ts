export type Language = 'it' | 'en';
export type Theme = 'light' | 'dark' | 'vivid';

const it = {
	nav: { home: 'Home', examples: 'Esempi', about: 'Progetto' },
	language: 'Language',
	theme: 'Theme',
	themes: { light: 'Chiaro', dark: 'Scuro', vivid: 'Vivace' },
	tabs: { editor: 'Editor', preview: 'Anteprima' },
	toolbar: { screen: 'Schermo', fullscreen: 'Schermo intero', exitFullscreen: 'Esci da schermo intero', pdf: 'PDF' },
	sharing: { copy: 'Copia da qui', copyFromStart: "Copia dall'inizio", copied: 'Copiato!', manual: 'Copia questo link' },
	editorLabel: 'Testo Markdown della presentazione',
	previousSlide: 'Slide precedente',
	nextSlide: 'Slide successiva',
	currentSlide: 'Slide corrente',
	library: {
		title: 'Presentazioni salvate',
		empty: 'Ancora nessuna presentazione: scrivi nell’editor e questa si salva qui.',
		rename: 'Rinomina',
		save: 'Salva',
		delete: 'Elimina',
		confirm: 'Confermi?',
		cancel: 'Annulla',
		quota: 'Spazio del browser esaurito: il testo resta qui e nel link, ma non nella libreria.',
		corrupt: 'I dati salvati non erano leggibili: la libreria riparte vuota.',
		untitled: 'Senza titolo'
	},
	transfer: {
		export: 'Esporta',
		import: 'Importa',
		chooseTitle: 'Cosa facciamo con questo file?',
		chooseText: 'Puoi aprirlo come nuova presentazione oppure sostituire quella aperta.',
		newPresentation: 'Nuova presentazione',
		replace: 'Sostituisci questa',
		cancel: 'Annulla',
		unreadable: 'Il file non si è potuto leggere: non è cambiato niente.'
	},
	format: {
		label: 'Formattazione',
		groups: { inline: 'In linea', blocks: 'Blocchi', structure: 'Presentazione' },
		bold: 'Grassetto',
		boldTitle: 'Grassetto (Ctrl+B)',
		italic: 'Corsivo',
		italicTitle: 'Corsivo (Ctrl+I)',
		code: 'Codice in linea',
		codeTitle: 'Codice in linea',
		heading: 'Titolo',
		headingTitle: 'Titolo di sezione',
		list: 'Elenco',
		listTitle: 'Elenco puntato',
		quote: 'Citazione',
		quoteTitle: 'Citazione',
		codeBlock: 'Blocco di codice',
		codeBlockTitle: 'Blocco di codice',
		separator: 'Separatore',
		separatorTitle: 'Separatore fra slide',
		step: 'Passo',
		stepTitle: 'Blocco di passi',
		columns: 'Colonne',
		columnsTitle: 'Blocco di colonne',
		link: 'Collegamento',
		linkTitle: 'Collegamento (Ctrl+K)'
	},
	footer: 'Codice su GitHub',
	invalidDiagram: 'Diagramma non valido: controlla la sintassi mermaid.',
	overflow: 'La slide supera lo schermo: scorri per vedere tutto.',
	step: 'Passo',
	invalidLink: { title: 'Link non valido', text: 'Questo link contiene una presentazione illeggibile. Controlla di averlo copiato tutto.', close: 'Chiudi' },
	metaDescription: 'mdpresenter: scrivi slide in Markdown e presentale dal browser, gratis e senza account.',
	error: { title: 'Pagina non trovata', text: "L'indirizzo non esiste o è stato spostato.", home: 'Torna alla home' },
	examples: {
		title: 'Esempi',
		intro: 'Cosa puoi fare con mdpresenter: premi un esempio per aprirlo nell’editor.',
		open: 'Apri nell’editor'
	},
	about: {
		title: 'Il progetto',
		paragraphs: [
			'mdpresenter trasforma testo Markdown in slide da presentare nel browser.',
			'Scrivi a sinistra, vedi le slide a destra. Le slide si separano con una linea ---.',
			'Il testo vive nell’indirizzo della pagina: condividi il link e chi lo apre vede la tua stessa presentazione.',
			'Nessun account, nessun server: tutto resta nel tuo browser. Il codice è aperto.'
		],
		repository: 'Repository GitHub'
	}
};

export type Texts = typeof it;

const en: Texts = {
	nav: { home: 'Home', examples: 'Examples', about: 'About' },
	language: 'Language',
	theme: 'Theme',
	themes: { light: 'Light', dark: 'Dark', vivid: 'Vivid' },
	tabs: { editor: 'Editor', preview: 'Preview' },
	toolbar: { screen: 'Screen', fullscreen: 'Fullscreen', exitFullscreen: 'Exit fullscreen', pdf: 'PDF' },
	sharing: { copy: 'Copy from here', copyFromStart: 'Copy from start', copied: 'Copied!', manual: 'Copy this link' },
	editorLabel: 'Presentation Markdown text',
	previousSlide: 'Previous slide',
	nextSlide: 'Next slide',
	currentSlide: 'Current slide',
	library: {
		title: 'Saved presentations',
		empty: 'No presentations yet: write in the editor and this one is saved here.',
		rename: 'Rename',
		save: 'Save',
		delete: 'Delete',
		confirm: 'Delete it?',
		cancel: 'Cancel',
		quota: 'Browser storage is full: the text stays here and in the link, but not in the library.',
		corrupt: 'The saved data was unreadable: the library starts empty.',
		untitled: 'Untitled'
	},
	transfer: {
		export: 'Export',
		import: 'Import',
		chooseTitle: 'What should we do with this file?',
		chooseText: 'You can open it as a new presentation or replace the one you have open.',
		newPresentation: 'New presentation',
		replace: 'Replace this one',
		cancel: 'Cancel',
		unreadable: 'The file could not be read: nothing changed.'
	},
	format: {
		label: 'Formatting',
		groups: { inline: 'Inline', blocks: 'Blocks', structure: 'Presentation' },
		bold: 'Bold',
		boldTitle: 'Bold (Ctrl+B)',
		italic: 'Italic',
		italicTitle: 'Italic (Ctrl+I)',
		code: 'Inline code',
		codeTitle: 'Inline code',
		heading: 'Heading',
		headingTitle: 'Section heading',
		list: 'List',
		listTitle: 'Bullet list',
		quote: 'Quote',
		quoteTitle: 'Quote',
		codeBlock: 'Code block',
		codeBlockTitle: 'Code block',
		separator: 'Separator',
		separatorTitle: 'Slide separator',
		step: 'Step',
		stepTitle: 'Step block',
		columns: 'Columns',
		columnsTitle: 'Columns block',
		link: 'Link',
		linkTitle: 'Link (Ctrl+K)'
	},
	footer: 'Code on GitHub',
	invalidDiagram: 'Invalid diagram: check the mermaid syntax.',
	overflow: 'Slide taller than the screen: scroll to see it all.',
	step: 'Step',
	invalidLink: { title: 'Invalid link', text: 'This link holds an unreadable presentation. Check you copied it whole.', close: 'Dismiss' },
	metaDescription: 'mdpresenter: write Markdown slides and present them from the browser, free with no account.',
	error: { title: 'Page not found', text: 'This address does not exist or was moved.', home: 'Back to home' },
	examples: {
		title: 'Examples',
		intro: 'What you can do with mdpresenter: open an example in the editor.',
		open: 'Open in the editor'
	},
	about: {
		title: 'The project',
		paragraphs: [
			'mdpresenter turns Markdown text into slides you present from the browser.',
			'Write on the left, see the slides on the right. Slides are separated with a --- line.',
			'The text lives in the page address: share the link and whoever opens it sees your presentation.',
			'No account, no server: everything stays in your browser. The code is open.'
		],
		repository: 'GitHub repository'
	}
};

export const texts: Record<Language, Texts> = { it, en };
