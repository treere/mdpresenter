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
});
