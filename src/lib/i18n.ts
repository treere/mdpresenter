export type Lingua = 'it' | 'en';
export type Tema = 'chiaro' | 'scuro' | 'vivace';

const it = {
	nav: { home: 'Home', esempi: 'Esempi', progetto: 'Progetto' },
	lingua: 'Lingua',
	tema: 'Tema',
	temi: { chiaro: 'Chiaro', scuro: 'Scuro', vivace: 'Vivace' },
	schede: { editor: 'Editor', anteprima: 'Anteprima' },
	barra: { schermo: 'Schermo', schermoIntero: 'Schermo intero', esciSchermo: 'Esci da schermo intero', pdf: 'PDF' },
	condivisione: { copia: 'Copia link presentazione', copiato: 'Copiato!', manuale: 'Copia questo link' },
	editorEtichetta: 'Testo Markdown della presentazione',
	slidePrecedente: 'Slide precedente',
	slideSuccessiva: 'Slide successiva',
	slideCorrente: 'Slide corrente',
	footer: 'Codice su GitHub',
	metaDescrizione: 'mdpresenter: scrivi slide in Markdown e presentale dal browser, gratis e senza account.',
	errore: { titolo: 'Pagina non trovata', testo: "L'indirizzo non esiste o è stato spostato.", home: 'Torna alla home' },
	esempi: {
		titolo: 'Esempi',
		intro: 'Cosa puoi fare con mdpresenter: premi un esempio per aprirlo nell’editor.',
		apri: 'Apri nell’editor'
	},
	progetto: {
		titolo: 'Il progetto',
		righe: [
			'mdpresenter trasforma testo Markdown in slide da presentare nel browser.',
			'Scrivi a sinistra, vedi le slide a destra. Le slide si separano con una linea ---.',
			'Il testo vive nell’indirizzo della pagina: condividi il link e chi lo apre vede la tua stessa presentazione.',
			'Nessun account, nessun server: tutto resta nel tuo browser. Il codice è aperto.'
		],
		repo: 'Repository GitHub'
	}
};

export type Testi = typeof it;

const en: Testi = {
	nav: { home: 'Home', esempi: 'Examples', progetto: 'About' },
	lingua: 'Language',
	tema: 'Theme',
	temi: { chiaro: 'Light', scuro: 'Dark', vivace: 'Vivid' },
	schede: { editor: 'Editor', anteprima: 'Preview' },
	barra: { schermo: 'Screen', schermoIntero: 'Fullscreen', esciSchermo: 'Exit fullscreen', pdf: 'PDF' },
	condivisione: { copia: 'Copy presentation link', copiato: 'Copied!', manuale: 'Copy this link' },
	editorEtichetta: 'Presentation Markdown text',
	slidePrecedente: 'Previous slide',
	slideSuccessiva: 'Next slide',
	slideCorrente: 'Current slide',
	footer: 'Code on GitHub',
	metaDescrizione: 'mdpresenter: write Markdown slides and present them from the browser, free with no account.',
	errore: { titolo: 'Page not found', testo: 'This address does not exist or was moved.', home: 'Back to home' },
	esempi: {
		titolo: 'Examples',
		intro: 'What you can do with mdpresenter: open an example in the editor.',
		apri: 'Open in the editor'
	},
	progetto: {
		titolo: 'The project',
		righe: [
			'mdpresenter turns Markdown text into slides you present from the browser.',
			'Write on the left, see the slides on the right. Slides are separated with a --- line.',
			'The text lives in the page address: share the link and whoever opens it sees your presentation.',
			'No account, no server: everything stays in your browser. The code is open.'
		],
		repo: 'GitHub repository'
	}
};

export const testi: Record<Lingua, Testi> = { it, en };
