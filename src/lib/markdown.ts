import hljs from 'highlight.js';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

interface ColonneToken {
	type: 'colonne';
	raw: string;
	left: string;
	right: string;
}

const colonneExtension = {
	name: 'colonne',
	level: 'block',
	start(src: string) {
		return src.indexOf('::: colonne');
	},
	tokenizer(this: any, src: string) {
		const match = /^::: colonne\n([\s\S]*?)\n:::\s*(?:\n|$)/.exec(src);
		if (!match) return undefined;
		const inner = match[1].split('\n');
		let side: 'left' | 'right' | null = null;
		const left: string[] = [];
		const right: string[] = [];
		for (const line of inner) {
			if (/^::: sinistra\s*$/.test(line)) {
				side = 'left';
				continue;
			}
			if (/^::: destra\s*$/.test(line)) {
				side = 'right';
				continue;
			}
			(side === 'right' ? right : left).push(line);
		}
		if (side === null) return undefined;
		return {
			type: 'colonne',
			raw: match[0],
			left: this.lexer.blockTokens(left.join('\n')),
			right: this.lexer.blockTokens(right.join('\n'))
		} as unknown as ColonneToken;
	},
	renderer(this: any, token: any) {
		return `<div class="colonne"><div>${this.parser.parse(token.left)}</div><div>${this.parser.parse(token.right)}</div></div>`;
	}
};

const marked = new Marked(
	markedHighlight({
		langPrefix: 'hljs language-',
		highlight(code, lang) {
			if (lang === 'mermaid') {
				return `<pre class="mermaid-block" data-source="${encodeURIComponent(code)}"></pre>`;
			}
			const language = hljs.getLanguage(lang) ? lang : 'plaintext';
			return hljs.highlight(code, { language }).value;
		}
	})
);

marked.use({ extensions: [colonneExtension] });

/** Renders Markdown to HTML (caller must sanitize before {@html}). */
export function renderMarkdown(text: string): string {
	return marked.parse(text, { breaks: true }) as string;
}
