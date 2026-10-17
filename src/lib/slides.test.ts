import { describe, expect, it } from 'vitest';
import { encode, decode, splitSlides } from './slides';

describe('splitSlides', () => {
	it('splits 2 separators into 3 slides', () => {
		expect(splitSlides('a\n---\nb\n---\nc')).toEqual(['a', 'b', 'c']);
	});

	it('returns 1 slide without separators', () => {
		expect(splitSlides('# Solo title')).toEqual(['# Solo title']);
	});

	it('returns 1 empty slide for empty text', () => {
		expect(splitSlides('')).toEqual(['']);
	});

	it('requires the separator on its own line', () => {
		expect(splitSlides('a --- b')).toEqual(['a --- b']);
	});

	it('ignores separators inside fenced code', () => {
		expect(splitSlides('```\n---\n```\n---\ntext')).toEqual(['```\n---\n```', 'text']);
	});
});

describe('encode/decode', () => {
	it('roundtrips unicode characters', async () => {
		const text = '# Ciao 👋\n\n---\n\nÈ un test';
		expect(await decode(await encode(text))).toBe(text);
	});

	it('returns null for invalid input', async () => {
		expect(await decode('!!!non-base64!!!')).toBeNull();
	});

	it('keeps short text raw with prefix 0', async () => {
		const c = await encode('ciao');
		expect(c.startsWith('0')).toBe(true);
		expect(await decode(c)).toBe('ciao');
	});

	it('compresses long text shorter than raw', async () => {
		const text = '# Titolo\n\nParagrafo ripetuto. '.repeat(30);
		const c = await encode(text);
		expect(c.startsWith('1')).toBe(true);
		expect(c.length).toBeLessThan(text.length);
		expect(await decode(c)).toBe(text);
	});
});
