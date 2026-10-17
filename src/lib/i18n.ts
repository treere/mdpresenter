export type Language = 'it' | 'en';
export type Theme = 'light' | 'dark' | 'vivid';

const it = {
	nav: { home: 'Home', examples: 'Esempi', about: 'Progetto' },
	language: 'Language',
	theme: 'Theme',
	themes: { light: 'Chiaro', dark: 'Scuro', vivid: 'Vivace' },
	tabs: { editor: 'Editor', preview: 'Anteprima' },
	toolbar: { screen: 'Schermo', fullscreen: 'Schermo intero', exitFullscreen: 'Esci da screen intero', pdf: 'PDF' },
	sharing: { copia: 'Copia link presentazione', copied: 'Copiato!', manuale: 'Copia questo link' },
	editorLabel: 'Testo Markdown della presentazione',
	previousSlide: 'Slide previous',
	nextSlide: 'Slide next',
	currentSlide: 'Slide current',
	footer: 'Codice su GitHub',
	metaDescription: 'mdpresenter: scrivi slide in Markdown e presentale dal browser, gratis e senza account.',
	error: { title: 'Pagina non trovata', text: "L'indirizzo non esiste o è stato spostato.", home: 'Torna alla home' },
	examples: {
		title: 'Esempi',
		intro: 'Cosa puoi fare con mdpresenter: premi un esempio per aprirlo nell’editor.',
		open: 'Apri nell’editor'
	},
	about: {
		title: 'Il about',
		paragraphs: [
			'mdpresenter trasforma text Markdown in slide da presentare nel browser.',
			'Scrivi a left, vedi le slide a right. Le slide si separano con una linea ---.',
			'Il text vive nell’indirizzo della pagina: condividi il link e chi lo apre vede la tua stessa presentazione.',
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
	sharing: { copia: 'Copy presentation link', copied: 'Copied!', manuale: 'Copy this link' },
	editorLabel: 'Presentation Markdown text',
	previousSlide: 'Previous slide',
	nextSlide: 'Next slide',
	currentSlide: 'Current slide',
	footer: 'Code on GitHub',
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
