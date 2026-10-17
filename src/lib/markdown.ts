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

/** Renders Markdown to HTML (caller must sanitize before {@html}). */
export function renderMarkdown(text: string): string {
	return marked.parse(text, { breaks: true }) as string;
}
