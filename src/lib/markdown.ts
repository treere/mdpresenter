import hljs from 'highlight.js/lib/common';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

const marked = new Marked(
	markedHighlight({
		langPrefix: 'hljs language-',
		highlight(code, lang) {
			const language = hljs.getLanguage(lang) ? lang : 'plaintext';
			return hljs.highlight(code, { language }).value;
		}
	})
);

/** Rende Markdown in HTML (da sanificare dal chiamante prima del {@html}). */
export function renderMarkdown(testo: string): string {
	return marked.parse(testo, { breaks: true }) as string;
}
