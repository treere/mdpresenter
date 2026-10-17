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
	it('roundtrip con caratteri unicode', () => {
		const testo = '# Ciao 👋\n\n---\n\nÈ un test';
		expect(decodifica(codifica(testo))).toBe(testo);
	});

	it('testo invalido ritorna null', () => {
		expect(decodifica('!!!non-base64!!!')).toBeNull();
	});
});
