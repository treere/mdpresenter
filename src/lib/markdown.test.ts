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

	it('renders two columns', () => {
		const html = renderMarkdown('::: columns\n\n::: part\n\nciao\n\n::: part\n\nPippo\n\n::: end\n');
		expect(html).toContain('class="columns"');
		expect(html.match(/<div>/g)).toHaveLength(2);
		expect(html).toContain('<p>ciao</p>');
		expect(html).toContain('<p>Pippo</p>');
	});

	it('renders three columns from three parts', () => {
		const html = renderMarkdown('::: columns\n\n::: part\n\na\n\n::: part\n\nb\n\n::: part\n\nc\n\n::: end\n');
		expect(html.match(/<div>/g)).toHaveLength(3);
		expect(html).toContain('<p>a</p>');
		expect(html).toContain('<p>b</p>');
		expect(html).toContain('<p>c</p>');
	});

	it('renders one full-width column without parts', () => {
		const html = renderMarkdown('::: columns\n\nsolo\n\n::: end\n');
		expect(html).toContain('class="columns"');
		expect(html.match(/<div>/g)).toHaveLength(1);
		expect(html).toContain('<p>solo</p>');
	});

	it('renders a step as a block', () => {
		const html = renderMarkdown('# Titolo\n\n::: step\n\ndopo\n\n::: end\n');
		expect(html).toContain('<div class="step">');
		expect(html).toContain('dopo');
		expect(html).not.toContain(':::');
	});

	it('lets a step contain a columns block', () => {
		const html = renderMarkdown('::: step\n\n::: columns\n\n::: part\n\na\n\n::: part\n\nb\n\n::: end\n\n::: end\n');
		expect(html).toContain('<div class="step">');
		expect(html).toContain('class="columns"');
		expect(html).toContain('<p>a</p>');
		expect(html).toContain('<p>b</p>');
	});

	it('lets a column contain a step', () => {
		const html = renderMarkdown('::: columns\n\n::: part\n\nsubito\n\n::: part\n\n::: step\n\ndopo\n\n::: end\n\n::: end\n');
		expect(html).toContain('class="columns"');
		expect(html).toContain('<p>subito</p>');
		expect(html).toContain('<div class="step">');
		expect(html).toContain('<p>dopo</p>');
	});

	it('shows a step nested in a step as text', () => {
		const html = renderMarkdown('::: step\n\nfuori\n\n::: step\n\ndentro\n\n::: end\n\n::: end\n');
		expect(html.match(/class="step"/g)).toHaveLength(1);
		expect(html).toContain('::: step');
	});

	it('shows the old syntax as text', () => {
		const html = renderMarkdown('::: colonne\n::: left\nciao\n::: right\nPippo\n:::\n');
		expect(html).not.toContain('class="columns"');
		expect(html).toContain('::: left');
		expect(html).toContain('::: right');
	});

	it('leaves directives inside a fence intact', () => {
		const html = renderMarkdown('```\n::: step\n::: end\n```');
		expect(html).not.toContain('class="step"');
		expect(html).toContain('::: step');
	});

	it('leaves unclosed blocks as text', () => {
		const html = renderMarkdown('::: columns\n\ntext without end');
		expect(html).not.toContain('class="columns"');
		expect(html).toContain('::: columns');
	});
});
