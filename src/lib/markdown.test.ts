import { describe, expect, it } from 'vitest';
import { renderMarkdown } from './markdown';

describe('renderMarkdown', () => {
	it('evidenzia il codice con linguaggio', () => {
		const html = renderMarkdown('```js\nconst a = 1;\n```');
		expect(html).toContain('hljs');
		expect(html).toContain('language-js');
	});

	it('blocco senza linguaggio senza errori', () => {
		const html = renderMarkdown('```\ntesto semplice\n```');
		expect(html).toContain('testo semplice');
	});

	it('rende le tabelle', () => {
		const html = renderMarkdown('| A | B |\n|---|---|\n| 1 | 2 |');
		expect(html).toContain('<table>');
		expect(html).toContain('<th>A</th>');
	});
});
