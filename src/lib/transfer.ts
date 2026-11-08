/**
 * Moving a presentation to and from a Markdown file.
 *
 * Plain functions only, no DOM and no runes: the component keeps the reactive state, so this
 * module stays testable in vitest without mounting anything.
 */

/** Extension every exported file carries, added once. */
export const MARKDOWN_EXTENSION = '.md';

/** Name used when the presentation name gives nothing usable. */
export const FALLBACK_FILE_NAME = 'presentazione';

/** Longest name kept, extension excluded. */
const NAME_LIMIT = 60;

/** Characters the common file systems refuse, control characters included. */
const FORBIDDEN = /[/\\:*?"<>|\u0000-\u001f\u007f]/g;

const BOM = '\uFEFF';

function stripBom(text: string): string {
	return text.startsWith(BOM) ? text.slice(BOM.length) : text;
}

/**
 * File name for an exported presentation: spaces and forbidden characters become `-`, repeated
 * dashes collapse, the ends are trimmed. Case and accents are kept, the extension is added once.
 */
export function exportFileName(name: string): string {
	const trimmed = name.trim();
	const withoutExtension = trimmed.toLowerCase().endsWith(MARKDOWN_EXTENSION)
		? trimmed.slice(0, trimmed.length - MARKDOWN_EXTENSION.length)
		: trimmed;
	const base = withoutExtension
		.replace(FORBIDDEN, '-')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.slice(0, NAME_LIMIT)
		.replace(/^-+|-+$/g, '');
	return `${base.length > 0 ? base : FALLBACK_FILE_NAME}${MARKDOWN_EXTENSION}`;
}

/**
 * Text of an imported file: the leading BOM goes away, CRLF and lone CR become LF so the
 * editor shows the same line breaks the author saw.
 */
export function normalizeImportedText(raw: string): string {
	return stripBom(raw).replace(/\r\n?/g, '\n');
}
