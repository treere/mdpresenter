import { describe, expect, it } from 'vitest';
import { renderMarkdown } from './markdown';

describe('renderMarkdown', () => {
	it('highlights code with a language', () => {
		const html = renderMarkdown('```js\nconst a = 1;\n```');
		expect(html).toContain('hljs');
		expect(html).toContain('language-js');
	});

	it('renders a block without language', () => {
		const html = renderMarkdown('```\nplain text\n```');
		expect(html).toContain('plain text');
	});

	it('renders tables', () => {
		const html = renderMarkdown('| A | B |\n|---|---|\n| 1 | 2 |');
		expect(html).toContain('<table>');
		expect(html).toContain('<th>A</th>');
	});

	it('renders links', () => {
		const html = renderMarkdown('[Svelte](https://svelte.dev)');
		expect(html).toContain('<a href="https://svelte.dev"');
	});

	it('renders images', () => {
		const html = renderMarkdown('![Alt](https://picsum.photos/seed/x/600/400)');
		expect(html).toContain('<img');
		expect(html).toContain('picsum.photos');
	});
	// Note: sanitizing (e.g. blocking javascript:) happens with DOMPurify
	// nel visualizzatore, non in renderMarkdown.

	it('emits a placeholder for mermaid blocks', () => {
		const html = renderMarkdown('```mermaid\ngraph TD\nA-->B\n```');
		expect(html).toContain('mermaid-block');
		expect(html).toContain('data-source');
	});

	it('shows mermaid-code as a code block', () => {
		const html = renderMarkdown('```mermaid-code\ngraph TD\n```');
		expect(html).not.toContain('mermaid-block');
		expect(html).toContain('graph TD');
	});

	it('renders two-column blocks', () => {
		const html = renderMarkdown('::: colonne\n::: sinistra\nciao\n:::\n::: destra\nPippo\n:::\n');
		expect(html).toContain('colonne');
		expect(html).toContain('ciao');
		expect(html).toContain('Pippo');
	});

	it('leaves unclosed column blocks as text', () => {
		const html = renderMarkdown('::: colonne\ntext without end');
		expect(html).not.toContain('colonne"><div');
	});
});
