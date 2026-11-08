export const SAMPLE = `# Benvenuto\n\nScrivi qui la tua presentazione.\n\n---\n\n# Seconda slide\n\n- Un punto\n- Un altro punto\n\n---\n\n# Terza slide\n\n**Grassetto** e *corsivo* funzionano.`;

/** Below this length text stays raw: compressing would make it longer. */
export const COMPRESSION_THRESHOLD = 200;

/** A directive line: `::: step` / `::: columns` open, `::: part` separates, `::: end` closes. */
export type Directive =
	| { kind: 'open'; name: 'step' | 'columns' }
	| { kind: 'separator'; name: 'part' }
	| { kind: 'close' };

/** Classifies a directive line; names are case-insensitive, spaces tolerated. Unknown names are text. */
export function directiveOf(line: string): Directive | null {
	const match = /^:::[ 	]+([a-z]+)[ 	]*$/i.exec(line.trim());
	if (!match) return null;
	const name = match[1].toLowerCase();
	if (name === 'step' || name === 'columns') return { kind: 'open', name };
	if (name === 'part') return { kind: 'separator', name: 'part' };
	if (name === 'end') return { kind: 'close' };
	return null;
}

/** True for a line that opens or closes a fenced code block. */
export function isFenceLine(line: string): boolean {
	return /^(`{3,}|~{3,})/.test(line.trim());
}

/** Splits text into slides on the `---` line (ignored inside fenced code). Always returns at least 1 slide. */
export function splitSlides(text: string): string[] {
	const slides: string[] = [];
	let current: string[] = [];
	let inFence = false;
	for (const line of text.split('\n')) {
		if (isFenceLine(line)) inFence = !inFence;
		if (!inFence && line.trim() === '---') {
			slides.push(current.join('\n'));
			current = [];
		} else {
			current.push(line);
		}
	}
	slides.push(current.join('\n'));
	const filtered = slides.map((s) => s.trim()).filter((s) => s.length > 0);
	return filtered.length > 0 ? filtered : [''];
}

/**
 * Number of steps shown when a slide opens: `1` when the slide begins with a step (never open on
 * an empty screen), `0` when there is content before the first step or the slide has no steps.
 */
export function initialRevealed(text: string): 0 | 1 {
	let inFence = false;
	let hasContent = false;
	for (const line of text.split('\n')) {
		if (isFenceLine(line)) {
			inFence = !inFence;
			hasContent = true;
			continue;
		}
		if (inFence) {
			if (line.trim().length > 0) hasContent = true;
			continue;
		}
		const directive = directiveOf(line);
		if (directive?.kind === 'open' && directive.name === 'step') return hasContent ? 0 : 1;
		if (line.trim().length > 0) hasContent = true;
	}
	return 0;
}

function toBase64Url(bytes: Uint8Array): string {
	let bin = '';
	for (const b of bytes) bin += String.fromCharCode(b);
	return btoa(bin).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): Uint8Array {
	let b64 = s.replaceAll('-', '+').replaceAll('_', '/');
	while (b64.length % 4 !== 0) b64 += '=';
	const bin = atob(b64);
	return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

// fflate puro JS: stesso formato gzip, ma funziona su ogni browser
// (le CompressionStream native mancano su alcuni Firefox).
import { gunzipSync, gzipSync } from 'fflate';

function compress(bytes: Uint8Array): Uint8Array {
	return gzipSync(bytes);
}

function decompress(bytes: Uint8Array): Uint8Array {
	return gunzipSync(bytes);
}

/**
 * Codifica per l'URL: `0` + light sotto soglia, `1` + gzip sopra.
 * I vecchi link senza prefisso non sono supportati.
 */
export async function encode(text: string): Promise<string> {
	if (text.length < COMPRESSION_THRESHOLD) {
		return '0' + toBase64Url(new TextEncoder().encode(text));
	}
	return '1' + toBase64Url(compress(new TextEncoder().encode(text)));
}


/** Reads share params from the URL query: t (text) and s (slide index). */
export function readQuery(): { raw: string | null; slide: number } {
	const q = new URLSearchParams(location.search);
	const s = Number.parseInt(q.get('s') ?? '', 10);
	return { raw: q.get('t'), slide: Number.isNaN(s) ? 0 : Math.max(0, s) };
}

/** Writes share params, keeping the current path (with base). */
export function writeQuery(encoded: string, slide: number): void {
	const q = new URLSearchParams();
	q.set('t', encoded);
	q.set('s', String(slide));
	history.replaceState(null, '', `${location.pathname}?${q.toString()}`);
}

/** Decodes `0`/`1`. Returns null on invalid format or missing gzip. */
export async function decode(hash: string): Promise<string | null> {
	try {
		if (hash.startsWith('0')) {
			return new TextDecoder().decode(fromBase64Url(hash.slice(1)));
		}
		if (hash.startsWith('1')) {
			return new TextDecoder().decode(decompress(fromBase64Url(hash.slice(1))));
		}
		return null;
	} catch {
		return null;
	}
}
