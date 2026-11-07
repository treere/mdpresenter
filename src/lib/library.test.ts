// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	LIBRARY_KEY,
	addPresentation,
	createPresentation,
	defaultName,
	deletePresentation,
	emptyLibrary,
	loadLibrary,
	renamePresentation,
	saveLibrary,
	sortedPresentations,
	updatePresentation
} from './library';

const UNTITLED = 'Senza titolo';

beforeEach(() => {
	localStorage.clear();
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe('defaultName', () => {
	it('takes the first heading', () => {
		expect(defaultName('# Progetto estate\n\ntesto', UNTITLED)).toBe('Progetto estate');
	});

	it('falls back to the first non-empty line', () => {
		expect(defaultName('\n\n  riga senza titolo  \n', UNTITLED)).toBe('riga senza titolo');
	});

	it('shortens a long name', () => {
		const name = defaultName(`# ${'a'.repeat(80)}`, UNTITLED);
		expect(name.length).toBeLessThanOrEqual(40);
		expect(name.endsWith('…')).toBe(true);
	});

	it('uses the untitled text for empty content', () => {
		expect(defaultName('   \n\n', UNTITLED)).toBe(UNTITLED);
	});
});

describe('library storage', () => {
	it('saves and reads back', () => {
		const p = createPresentation('# Prima\n\ntesto', 2, UNTITLED, 1000);
		const library = addPresentation(emptyLibrary(), p);
		expect(saveLibrary(library)).toBe(true);

		const loaded = loadLibrary();
		expect(loaded.corrupt).toBe(false);
		expect(loaded.unavailable).toBe(false);
		expect(loaded.lastOpenedId).toBe(p.id);
		expect(loaded.presentations).toEqual([p]);
	});

	it('returns an empty library when nothing is stored', () => {
		const loaded = loadLibrary();
		expect(loaded.presentations).toEqual([]);
		expect(loaded.lastOpenedId).toBeNull();
		expect(loaded.corrupt).toBe(false);
	});

	it('reports corrupt data instead of throwing', () => {
		localStorage.setItem(LIBRARY_KEY, '{not json');
		const loaded = loadLibrary();
		expect(loaded.presentations).toEqual([]);
		expect(loaded.corrupt).toBe(true);
	});

	it('rejects valid json with an unexpected shape', () => {
		localStorage.setItem(LIBRARY_KEY, JSON.stringify({ version: 1, presentations: 'nope' }));
		expect(loadLibrary().corrupt).toBe(true);
	});

	it('reports unavailable storage without throwing', () => {
		vi.spyOn(globalThis, 'localStorage', 'get').mockImplementation(() => {
			throw new Error('denied');
		});
		const loaded = loadLibrary();
		expect(loaded.unavailable).toBe(true);
		expect(saveLibrary(loaded)).toBe(false);
	});

	it('returns false when the quota is exceeded', () => {
		vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new DOMException('quota', 'QuotaExceededError');
		});
		expect(saveLibrary(emptyLibrary())).toBe(false);
	});
});

describe('library operations', () => {
	const base = () => {
		const first = createPresentation('# Prima\n\nuno', 0, UNTITLED, 1000);
		const second = createPresentation('# Seconda\n\ndue', 3, UNTITLED, 2000);
		return addPresentation(addPresentation(emptyLibrary(), first), second);
	};

	it('keeps the newest first', () => {
		const library = base();
		expect(sortedPresentations(library).map((p) => p.name)).toEqual(['Seconda', 'Prima']);
	});

	it('ignores an empty rename', () => {
		const library = base();
		const id = library.presentations[0].id;
		expect(renamePresentation(library, id, '   ', 5000)).toBe(library);
	});

	it('renames and persists the new name', () => {
		const library = base();
		const id = library.presentations[0].id;
		const renamed = renamePresentation(library, id, '  Titolo nuovo  ', 5000);
		expect(renamed.presentations.find((p) => p.id === id)?.name).toBe('Titolo nuovo');
		saveLibrary(renamed);
		expect(loadLibrary().presentations.find((p) => p.id === id)?.name).toBe('Titolo nuovo');
	});

	it('updates text, slide and timestamp of the open presentation', () => {
		const library = base();
		const id = library.presentations[0].id;
		const updated = updatePresentation(library, id, { text: 'nuovo', slide: 4 }, 9000);
		const p = updated.presentations.find((item) => item.id === id)!;
		expect(p.text).toBe('nuovo');
		expect(p.slide).toBe(4);
		expect(p.updatedAt).toBe(9000);
		expect(p.name).toBe('Seconda');
	});

	it('drops a deleted presentation for good', () => {
		const library = base();
		const id = library.presentations[0].id;
		const removed = deletePresentation(library, id);
		saveLibrary(removed);
		expect(loadLibrary().presentations.map((p) => p.id)).not.toContain(id);
	});

	it('moves lastOpenedId to the most recent survivor', () => {
		const library = base();
		const open = library.presentations[0];
		const removed = deletePresentation(library, open.id);
		expect(removed.lastOpenedId).toBe(library.presentations[1].id);
	});

	it('clears lastOpenedId when the library empties', () => {
		const library = base();
		const empty = deletePresentation(deletePresentation(library, library.presentations[0].id), library.presentations[1].id);
		expect(empty.presentations).toEqual([]);
		expect(empty.lastOpenedId).toBeNull();
	});
});
