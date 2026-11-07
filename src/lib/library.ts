/**
 * Local library of presentations, kept in the browser's `localStorage`.
 *
 * Plain functions only, no runes: the reactive state lives in `+page.svelte`, so this
 * module stays testable in vitest without mounting a component.
 */

export const LIBRARY_KEY = 'mdpresenter-library';
export const LIBRARY_VERSION = 1;

/** Longest name derived from the content, in characters. */
const NAME_LIMIT = 40;

export interface Presentation {
	id: string;
	name: string;
	text: string;
	slide: number;
	updatedAt: number;
}

export interface Library {
	presentations: Presentation[];
	lastOpenedId: string | null;
	/** Stored data existed but was not readable as a library. */
	corrupt: boolean;
	/** The browser refused access to `localStorage`. */
	unavailable: boolean;
}

export function emptyLibrary(): Library {
	return { presentations: [], lastOpenedId: null, corrupt: false, unavailable: false };
}

/** `localStorage`, or null when the browser denies access (private mode, blocked cookies). */
function storage(): Storage | null {
	try {
		const store = globalThis.localStorage;
		if (!store) return null;
		store.getItem(LIBRARY_KEY);
		return store;
	} catch {
		return null;
	}
}

function isPresentation(value: unknown): value is Presentation {
	if (typeof value !== 'object' || value === null) return false;
	const p = value as Record<string, unknown>;
	return (
		typeof p.id === 'string' &&
		typeof p.name === 'string' &&
		typeof p.text === 'string' &&
		typeof p.slide === 'number' &&
		Number.isFinite(p.slide) &&
		typeof p.updatedAt === 'number' &&
		Number.isFinite(p.updatedAt)
	);
}

export function loadLibrary(): Library {
	const store = storage();
	if (store === null) return { ...emptyLibrary(), unavailable: true };
	let raw: string | null;
	try {
		raw = store.getItem(LIBRARY_KEY);
	} catch {
		return { ...emptyLibrary(), unavailable: true };
	}
	if (raw === null) return emptyLibrary();
	try {
		const parsed: unknown = JSON.parse(raw);
		if (typeof parsed !== 'object' || parsed === null) return { ...emptyLibrary(), corrupt: true };
		const shape = parsed as Record<string, unknown>;
		if (shape.version !== LIBRARY_VERSION) return { ...emptyLibrary(), corrupt: true };
		const items = shape.presentations;
		if (!Array.isArray(items) || !items.every(isPresentation)) return { ...emptyLibrary(), corrupt: true };
		return {
			presentations: items.map((p) => ({ ...p })),
			lastOpenedId: typeof shape.lastOpenedId === 'string' ? shape.lastOpenedId : null,
			corrupt: false,
			unavailable: false
		};
	} catch {
		return { ...emptyLibrary(), corrupt: true };
	}
}

/** Writes the whole library back. False when the quota is exceeded or storage is gone. */
export function saveLibrary(library: Library): boolean {
	const store = storage();
	if (store === null) return false;
	const payload = {
		version: LIBRARY_VERSION,
		presentations: library.presentations,
		lastOpenedId: library.lastOpenedId
	};
	try {
		store.setItem(LIBRARY_KEY, JSON.stringify(payload));
		return true;
	} catch {
		return false;
	}
}

function newId(): string {
	const c = globalThis.crypto;
	if (c && typeof c.randomUUID === 'function') return c.randomUUID();
	return `p-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

/**
 * Name taken from the content: first heading, else first non-empty line, else the caller's
 * untitled text. Flattened and shortened so it fits one row of the list.
 */
export function defaultName(text: string, untitled: string): string {
	const lines = text.split('\n');
	const heading = lines.find((line) => /^#{1,6}\s+\S/.test(line.trim()));
	const raw = heading
		? heading.trim().replace(/^#{1,6}\s+/, '')
		: (lines.find((line) => line.trim().length > 0) ?? '').trim();
	const flat = raw.replace(/\s+/g, ' ').trim();
	if (flat.length === 0) return untitled;
	return flat.length > NAME_LIMIT ? `${flat.slice(0, NAME_LIMIT - 1).trimEnd()}…` : flat;
}

export function createPresentation(text: string, slide: number, untitled: string, now = Date.now()): Presentation {
	return { id: newId(), name: defaultName(text, untitled), text, slide, updatedAt: now };
}

/** Presentations ordered from the most recently changed. */
export function sortedPresentations(library: Library): Presentation[] {
	return [...library.presentations].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function findPresentation(library: Library, id: string | null): Presentation | null {
	if (id === null) return null;
	return library.presentations.find((p) => p.id === id) ?? null;
}

export function addPresentation(library: Library, presentation: Presentation): Library {
	return {
		...library,
		presentations: [presentation, ...library.presentations],
		lastOpenedId: presentation.id
	};
}

/** Rename; an empty or blank name keeps the previous one. */
export function renamePresentation(library: Library, id: string, name: string, now = Date.now()): Library {
	const clean = name.replace(/\s+/g, ' ').trim();
	if (clean.length === 0) return library;
	return {
		...library,
		presentations: library.presentations.map((p) => (p.id === id ? { ...p, name: clean, updatedAt: now } : p))
	};
}

/** Updates text and slide of the open presentation, if it exists. */
export function updatePresentation(
	library: Library,
	id: string,
	patch: { text?: string; slide?: number },
	now = Date.now()
): Library {
	return {
		...library,
		presentations: library.presentations.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: now } : p))
	};
}

/** Removes a presentation; the last opened one falls back to the most recent survivor. */
export function deletePresentation(library: Library, id: string): Library {
	const presentations = library.presentations.filter((p) => p.id !== id);
	const lastOpenedId =
		library.lastOpenedId === id
			? (sortedPresentations({ ...library, presentations })[0]?.id ?? null)
			: library.lastOpenedId;
	return { ...library, presentations, lastOpenedId };
}
