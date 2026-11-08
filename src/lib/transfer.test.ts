import { describe, expect, it } from 'vitest';
import { FALLBACK_FILE_NAME, MARKDOWN_EXTENSION, exportFileName, normalizeImportedText } from './transfer';

describe('exportFileName', () => {
	it('keeps the title and adds the extension', () => {
		expect(exportFileName('Lezione 3 reti')).toBe('Lezione-3-reti.md');
	});

	it('replaces characters file systems refuse', () => {
		expect(exportFileName('Lezione 3: reti / parte 2')).toBe('Lezione-3-reti-parte-2.md');
		expect(exportFileName('a\\b*c?d"e<f>g|h')).toBe('a-b-c-d-e-f-g-h.md');
	});

	it('keeps accents and does not force lowercase', () => {
		expect(exportFileName('Perché è così')).toBe('Perché-è-così.md');
	});

	it('compresses repeated spaces and trims the dashes at the ends', () => {
		expect(exportFileName('  Reti   e   protocolli  ')).toBe('Reti-e-protocolli.md');
	});

	it('falls back to a default name when the name is empty', () => {
		expect(exportFileName('')).toBe(`${FALLBACK_FILE_NAME}.md`);
		expect(exportFileName('   ')).toBe(`${FALLBACK_FILE_NAME}.md`);
	});

	it('falls back to a default name when only forbidden characters remain', () => {
		expect(exportFileName('***')).toBe(`${FALLBACK_FILE_NAME}.md`);
		expect(exportFileName(' / \\ ')).toBe(`${FALLBACK_FILE_NAME}.md`);
	});

	it('truncates a very long name to sixty characters plus the extension', () => {
		const name = exportFileName('parola '.repeat(40));
		expect(name.endsWith(MARKDOWN_EXTENSION)).toBe(true);
		expect(name.length).toBe(60 + MARKDOWN_EXTENSION.length);
		expect(name.slice(0, -MARKDOWN_EXTENSION.length).endsWith('-')).toBe(false);
	});

	it('adds the extension once when the name already has it', () => {
		expect(exportFileName('slide.md')).toBe('slide.md');
		expect(exportFileName('slide.MD')).toBe('slide.md');
	});
});

describe('normalizeImportedText', () => {
	it('leaves LF text untouched', () => {
		expect(normalizeImportedText('# Titolo\n\nTesto\n')).toBe('# Titolo\n\nTesto\n');
	});

	it('turns CRLF into LF', () => {
		expect(normalizeImportedText('# Titolo\r\n\r\nTesto\r\n')).toBe('# Titolo\n\nTesto\n');
	});

	it('turns a lone CR into LF', () => {
		expect(normalizeImportedText('# Titolo\rTesto')).toBe('# Titolo\nTesto');
	});

	it('removes the leading BOM only', () => {
		expect(normalizeImportedText('\uFEFF# Titolo')).toBe('# Titolo');
		expect(normalizeImportedText('# Titolo \uFEFF')).toBe('# Titolo \uFEFF');
	});

	it('keeps an empty text empty', () => {
		expect(normalizeImportedText('')).toBe('');
		expect(normalizeImportedText('\r\n')).toBe('\n');
	});
});
