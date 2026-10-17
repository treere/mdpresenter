import { describe, expect, it } from 'vitest';
import { codifica, decodifica, splitSlides } from './slides';

describe('splitSlides', () => {
	it('2 separatori restituiscono 3 slide', () => {
		expect(splitSlides('a\n---\nb\n---\nc')).toEqual(['a', 'b', 'c']);
	});

	it('senza separatori restituisce 1 slide', () => {
		expect(splitSlides('# Solo titolo')).toEqual(['# Solo titolo']);
	});

	it('testo vuoto restituisce 1 slide vuota', () => {
		expect(splitSlides('')).toEqual(['']);
	});

	it('il separatore deve stare su linea propria', () => {
		expect(splitSlides('a --- b')).toEqual(['a --- b']);
	});
});

describe('codifica/decodifica', () => {
	it('roundtrip con caratteri unicode', async () => {
		const testo = '# Ciao 👋\n\n---\n\nÈ un test';
		expect(await decodifica(await codifica(testo))).toBe(testo);
	});

	it('testo invalido ritorna null', async () => {
		expect(await decodifica('!!!non-base64!!!')).toBeNull();
	});

	it('testo corto resta in chiaro con prefisso 0', async () => {
		const c = await codifica('ciao');
		expect(c.startsWith('0')).toBe(true);
		expect(await decodifica(c)).toBe('ciao');
	});

	it('testo lungo è compresso e più corto del chiaro', async () => {
		const testo = '# Titolo\n\nParagrafo ripetuto. '.repeat(30);
		const c = await codifica(testo);
		expect(c.startsWith('1')).toBe(true);
		expect(c.length).toBeLessThan(testo.length);
		expect(await decodifica(c)).toBe(testo);
	});
});
