import hljs from 'highlight.js';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { directiveOf, isFenceLine } from './slides';

interface DirectiveToken {
	type: 'directives';
	raw: string;
	name: 'step' | 'columns';
	tokens: unknown[];
	parts: unknown[][];
}

/** Depth of `::: step` blocks being lexed: a step inside a step stays text. */
let stepDepth = 0;

/** A `::: part` with nothing before or after it adds no column: drop those edges. */
function trimEmptyParts(chunks: string[][]): string[][] {
	const blank = (chunk: string[]) => chunk.every((line) => line.trim().length === 0);
	let start = 0;
	let stop = chunks.length;
	while (stop - start > 1 && blank(chunks[start])) start += 1;
	while (stop - start > 1 && blank(chunks[stop - 1])) stop -= 1;
	return chunks.slice(start, stop);
}

const directivesExtension = {
	name: 'directives',
	level: 'block',
	start(src: string) {
		const i = src.search(/^:::[ \t]+(?:step|columns)[ \t]*$/im);
		return i === -1 ? undefined : i;
	},
	tokenizer(this: any, src: string) {
		const lines = src.split('\n');
		const open = directiveOf(lines[0] ?? '');
		if (open?.kind !== 'open') return undefined;
		if (open.name === 'step' && stepDepth > 0) return undefined;

		// The block ends at the `::: end` that empties the stack, not the first one met.
		const stack: Array<'step' | 'columns'> = [open.name];
		let inFence = false;
		let end = -1;
		for (let i = 1; i < lines.length; i += 1) {
			const line = lines[i];
			if (isFenceLine(line)) {
				inFence = !inFence;
				continue;
			}
			if (inFence) continue;
			const directive = directiveOf(line);
			if (!directive) continue;
			if (directive.kind === 'open') {
				stack.push(directive.name);
			} else if (directive.kind === 'close') {
				stack.pop();
				if (stack.length === 0) {
					end = i;
					break;
				}
			}
		}
		if (end === -1) return undefined;

		const raw = lines.slice(0, end + 1).join('\n');
		const inner = lines.slice(1, end);

		if (open.name === 'step') {
			stepDepth += 1;
			let tokens: unknown[];
			try {
				tokens = this.lexer.blockTokens(inner.join('\n'));
			} finally {
				stepDepth -= 1;
			}
			return { type: 'directives', raw, name: 'step', tokens, parts: [] } as DirectiveToken;
		}

		// `::: columns`: split on the `::: part` lines at this block's own depth.
		const chunks: string[][] = [[]];
		inFence = false;
		let depth = 0;
		for (const line of inner) {
			if (isFenceLine(line)) {
				inFence = !inFence;
				chunks[chunks.length - 1].push(line);
				continue;
			}
			if (!inFence) {
				const directive = directiveOf(line);
				if (directive?.kind === 'open') depth += 1;
				else if (directive?.kind === 'close') depth -= 1;
				else if (directive?.kind === 'separator' && depth === 0) {
					chunks.push([]);
					continue;
				}
			}
			chunks[chunks.length - 1].push(line);
		}

		return {
			type: 'directives',
			raw,
			name: 'columns',
			tokens: [],
			parts: trimEmptyParts(chunks).map((chunk) => this.lexer.blockTokens(chunk.join('\n')))
		} as unknown as DirectiveToken;
	},
	renderer(this: any, token: any) {
		if (token.name === 'columns') {
			const cells = token.parts
				.map((part: unknown[]) => `<div>${this.parser.parse(part)}</div>`)
				.join('');
			return `<div class="columns">${cells}</div>`;
		}
		return `<div class="step">${this.parser.parse(token.tokens)}</div>`;
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

marked.use({ extensions: [directivesExtension] });

/** Renders Markdown to HTML (caller must sanitize before {@html}). */
export function renderMarkdown(text: string): string {
	return marked.parse(text, { breaks: true }) as string;
}
