export const SAMPLE = `# Benvenuto\n\nScrivi qui la tua presentazione.\n\n---\n\n# Seconda slide\n\n- Un punto\n- Un altro punto\n\n---\n\n# Terza slide\n\n**Grassetto** e *corsivo* funzionano.`;

/** Below this length text stays raw: compressing would make it longer. */
export const COMPRESSION_THRESHOLD = 200;

/** Splits text into slides on the `---` line (ignored inside fenced code). Always returns at least 1 slide. */
export function splitSlides(text: string): string[] {
	const slides: string[] = [];
	let current: string[] = [];
	let inFence = false;
	for (const line of text.split('\n')) {
		if (/^(`{3,}|~{3,})/.test(line.trim())) inFence = !inFence;
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

async function comprimi(bytes: Uint8Array): Promise<Uint8Array> {
	const stream = new CompressionStream('gzip');
	const writer = stream.writable.getWriter();
	await writer.write(bytes.slice());
	await writer.close();
	return new Uint8Array(await new Response(stream.readable).arrayBuffer());
}

async function decomprimi(bytes: Uint8Array): Promise<Uint8Array> {
	const stream = new DecompressionStream('gzip');
	const writer = stream.writable.getWriter();
	await writer.write(bytes.slice());
	await writer.close();
	return new Uint8Array(await new Response(stream.readable).arrayBuffer());
}

/**
 * Codifica per l'URL: `0` + light sotto soglia, `1` + gzip sopra.
 * I vecchi link senza prefisso non sono supportati.
 */
export async function encode(text: string): Promise<string> {
	if (text.length < COMPRESSION_THRESHOLD) {
		return '0' + toBase64Url(new TextEncoder().encode(text));
	}
	return '1' + toBase64Url(await comprimi(new TextEncoder().encode(text)));
}

/** Decodes `0`/`1`. Returns null on invalid format or missing gzip. */
export async function decode(hash: string): Promise<string | null> {
	try {
		if (hash.startsWith('0')) {
			return new TextDecoder().decode(fromBase64Url(hash.slice(1)));
		}
		if (hash.startsWith('1')) {
			return new TextDecoder().decode(await decomprimi(fromBase64Url(hash.slice(1))));
		}
		return null;
	} catch {
		return null;
	}
}
