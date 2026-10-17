export const ESEMPIO = `# Benvenuto\n\nScrivi qui la tua presentazione.\n\n---\n\n# Seconda slide\n\n- Un punto\n- Un altro punto\n\n---\n\n# Terza slide\n\n**Grassetto** e *corsivo* funzionano.`;

/** Sotto questa lunghezza resta in chiaro: comprimere allungherebbe. */
export const SOGLIA_COMPRESSIONE = 200;

/** Divide il testo in slide sulla linea `---`. Ritorna sempre almeno 1 slide. */
export function splitSlides(testo: string): string[] {
	const parti = testo.split(/^---$/m).map((s) => s.trim());
	const filtrate = parti.filter((s) => s.length > 0);
	return filtrate.length > 0 ? filtrate : [''];
}

function aBase64Url(bytes: Uint8Array): string {
	let bin = '';
	for (const b of bytes) bin += String.fromCharCode(b);
	return btoa(bin).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function daBase64Url(s: string): Uint8Array {
	const bin = atob(s.replaceAll('-', '+').replaceAll('_', '/'));
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
 * Codifica per l'URL: `0` + chiaro sotto soglia, `1` + gzip sopra.
 * I vecchi link senza prefisso non sono supportati.
 */
export async function codifica(testo: string): Promise<string> {
	if (testo.length < SOGLIA_COMPRESSIONE) {
		return '0' + aBase64Url(new TextEncoder().encode(testo));
	}
	return '1' + aBase64Url(await comprimi(new TextEncoder().encode(testo)));
}

/** Decodifica `0`/`1`. Ritorna null se formato invalido o gzip assente. */
export async function decodifica(hash: string): Promise<string | null> {
	try {
		if (hash.startsWith('0')) {
			return new TextDecoder().decode(daBase64Url(hash.slice(1)));
		}
		if (hash.startsWith('1')) {
			return new TextDecoder().decode(await decomprimi(daBase64Url(hash.slice(1))));
		}
		return null;
	} catch {
		return null;
	}
}
