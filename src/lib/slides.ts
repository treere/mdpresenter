export const ESEMPIO = `# Benvenuto\n\nScrivi qui la tua presentazione.\n\n---\n\n# Seconda slide\n\n- Un punto\n- Un altro punto\n\n---\n\n# Terza slide\n\n**Grassetto** e *corsivo* funzionano.`;

/** Divide il testo in slide sulla linea `---`. Ritorna sempre almeno 1 slide. */
export function splitSlides(testo: string): string[] {
	const parti = testo.split(/^---$/m).map((s) => s.trim());
	const filtrate = parti.filter((s) => s.length > 0);
	return filtrate.length > 0 ? filtrate : [''];
}

/** Codifica UTF-8 in base64url (sicura per l'URL). */
export function codifica(testo: string): string {
	const bytes = new TextEncoder().encode(testo);
	let bin = '';
	for (const b of bytes) bin += String.fromCharCode(b);
	return btoa(bin).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

/** Decodifica base64url in UTF-8. Ritorna null se invalida. */
export function decodifica(hash: string): string | null {
	try {
		const b64 = hash.replaceAll('-', '+').replaceAll('_', '/');
		const bin = atob(b64);
		const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
		return new TextDecoder().decode(bytes);
	} catch {
		return null;
	}
}
