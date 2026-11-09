/**
 * Pure text transformations behind the formatting bar: from the text and its selection to the
 * new text and its selection. No DOM, no runes, so the edge cases can be tested in vitest.
 */

/** Text as the editor holds it: the whole value plus the selection to act on. */
export type EditState = {
	text: string;
	start: number;
	end: number;
};

/** Actions the bar and the keyboard shortcuts can ask for. */
export type FormatActionId =
	| 'bold'
	| 'italic'
	| 'code'
	| 'heading'
	| 'list'
	| 'quote'
	| 'codeBlock'
	| 'separator'
	| 'step'
	| 'columns'
	| 'link';

const MARKERS = { bold: '**', italic: '*', code: '`' } as const;

const PREFIXES = { heading: '# ', list: '- ', quote: '> ' } as const;

/** Blocks written as literals: if the grammar changes, these tests must break. */
const BLOCKS = {
	step: { body: '::: step\n\n::: end', caret: '::: step\n\n'.length },
	columns: {
		body: '::: columns\n::: part\n\n::: part\n\n::: end',
		caret: '::: columns\n::: part\n\n'.length
	}
} as const;

function clamp(position: number, text: string): number {
	return Math.max(0, Math.min(position, text.length));
}

/** Index of the newline that ends the line containing `position`. */
function lineEndOf(text: string, position: number): number {
	const found = text.indexOf('\n', position);
	return found === -1 ? text.length : found;
}

/** True for a line that opens or closes a fenced code block. */
function isFence(line: string): boolean {
	return /^(`{3,}|~{3,})/.test(line.trim());
}

type Edit = { at: number; remove: number; insert: string };

/** Where a position lands after the edits, so the caret and the selection can be restored. */
function mapPosition(edits: Edit[], position: number): number {
	let shift = 0;
	for (const edit of [...edits].sort((a, b) => a.at - b.at)) {
		if (edit.at + edit.remove <= position) shift += edit.insert.length - edit.remove;
		else if (edit.at > position) break;
		else return edit.at + edit.insert.length;
	}
	return position + shift;
}

/** Applies the edits from the end, so the earlier offsets stay valid. */
function withEdits(state: EditState, edits: Edit[]): EditState {
	let text = state.text;
	for (const edit of [...edits].sort((a, b) => b.at - a.at)) {
		text = text.slice(0, edit.at) + edit.insert + text.slice(edit.at + edit.remove);
	}
	return {
		text,
		start: mapPosition(edits, state.start),
		end: mapPosition(edits, state.end)
	};
}

/** Wraps every selected line on its own: one wrap of the whole block would make a code block. */
function wrapLines(state: EditState, marker: string): EditState {
	const { text, start, end } = state;
	const lines = text.slice(start, end).split('\n');
	let block = '';
	let wrapped = false;
	for (const [index, line] of lines.entries()) {
		if (index > 0) block += '\n';
		if (line.trim().length === 0) {
			block += line;
			continue;
		}
		block += marker + line + marker;
		wrapped = true;
	}
	if (!wrapped) return state;
	return {
		text: text.slice(0, start) + block + text.slice(end),
		start: start + marker.length,
		end: start + block.length - marker.length
	};
}

/**
 * Bold, italic and code: the markers wrap the selection, or land with the caret between them
 * when there is nothing selected. Pressing the same action again takes the markers away,
 * but only when they sit exactly outside the selection (or the selection carries them whole):
 * a partial selection is never rewritten halfway.
 */
export function wrapInline({ text, start, end }: EditState, marker: string): EditState {
	const from = clamp(start, text);
	const to = Math.max(from, clamp(end, text));
	const before = text.slice(0, from);
	const selected = text.slice(from, to);
	const after = text.slice(to);

	if (from === to) {
		// The caret already sits between a pair of markers: this is the second click.
		if (before.endsWith(marker) && after.startsWith(marker)) {
			return {
				text: before.slice(0, before.length - marker.length) + after.slice(marker.length),
				start: from - marker.length,
				end: from - marker.length
			};
		}
		return {
			text: text.slice(0, from) + marker + marker + after,
			start: from + marker.length,
			end: from + marker.length
		};
	}

	// The selection carries the markers itself: `**parola**` becomes `parola`.
	if (
		selected.length >= 2 * marker.length &&
		selected.startsWith(marker) &&
		selected.endsWith(marker)
	) {
		const inner = selected.slice(marker.length, selected.length - marker.length);
		return { text: before + inner + after, start: from, end: from + inner.length };
	}

	// The markers sit right outside the selection: `**|parola|**` loses them.
	if (before.endsWith(marker) && after.startsWith(marker)) {
		const moved = from - marker.length;
		return {
			text: before.slice(0, moved) + selected + after.slice(marker.length),
			start: moved,
			end: moved + selected.length
		};
	}

	if (selected.includes('\n')) return wrapLines({ text, start: from, end: to }, marker);

	return {
		text: before + marker + selected + marker + after,
		start: from + marker.length,
		end: to + marker.length
	};
}

/** Puts the block on lines of its own, leaving the caret inside it. */
function insertBlock({ text, start, end }: EditState, body: string, caretInside: number): EditState {
	const from = clamp(start, text);
	const to = Math.max(from, clamp(end, text));
	const before = text.slice(0, from);
	const after = text.slice(to);
	const lead = from === 0 || before.endsWith('\n') ? '' : '\n';
	const tail = after === '' || after.startsWith('\n') ? '' : '\n';
	const caret = from + lead.length + caretInside;
	return {
		text: before + lead + body + tail + after,
		start: caret,
		end: caret
	};
}

/** `---` on a line of its own, with a blank line on each side: the slide count grows by one. */
export function insertSlideBreak({ text, start, end }: EditState): EditState {
	const from = clamp(start, text);
	const to = Math.max(from, clamp(end, text));
	const before = text.slice(0, from);
	const after = text.slice(to);
	const lead = before === '' || before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n';
	const tail = after.startsWith('\n\n') ? '' : after.startsWith('\n') ? '\n' : '\n\n';
	const insert = lead + '---' + tail;
	const caret = from + insert.length;
	return { text: before + insert + after, start: caret, end: caret };
}

/** `::: step` and `::: columns` complete, with the caret on the first line of content. */
export function insertDirectiveBlock(state: EditState, kind: 'step' | 'columns'): EditState {
	const block = BLOCKS[kind];
	return insertBlock(state, block.body, block.caret);
}

/** Fence around the current lines, or away when the fence is already there. */
function toggleCodeFence({ text, start, end }: EditState): EditState {
	const from = clamp(start, text);
	const to = Math.max(from, clamp(end, text));
	const lineStart = text.lastIndexOf('\n', from - 1) + 1;
	const lineEnd = lineEndOf(text, to);
	const lines = text.split('\n');
	const first = text.slice(0, lineStart).split('\n').length - 1;
	const last = text.slice(0, lineEnd).split('\n').length - 1;
	const fenced =
		first > 0 && isFence(lines[first - 1]) && last < lines.length - 1 && isFence(lines[last + 1]);
	if (fenced) {
		lines.splice(last + 1, 1);
		lines.splice(first - 1, 1);
	} else {
		lines.splice(last + 1, 0, '```');
		lines.splice(first, 0, '```');
	}
	const shift = fenced ? -4 : 4;
	return {
		text: lines.join('\n'),
		start: Math.max(0, start + shift),
		end: Math.max(0, end + shift)
	};
}

/**
 * Heading, list, quote and code block: the prefix goes on the current line, or on every line of
 * the selection, and the same action takes it away. Only the pressed prefix is touched.
 */
export function applyLinePrefix(state: EditState, prefix: string): EditState {
	if (prefix === '```') return toggleCodeFence(state);
	const { text, start, end } = state;
	const from = clamp(start, text);
	const to = Math.max(from, clamp(end, text));
	const lineStart = text.lastIndexOf('\n', from - 1) + 1;
	const lineEnd = lineEndOf(text, to);
	const lines = text.slice(lineStart, lineEnd).split('\n');
	const all = lines.every((line) => line.startsWith(prefix));
	const edits: Edit[] = [];
	let offset = lineStart;
	for (const line of lines) {
		const present = line.startsWith(prefix);
		if (all && present) edits.push({ at: offset, remove: prefix.length, insert: '' });
		else if (!all && !present) edits.push({ at: offset, remove: 0, insert: prefix });
		offset += line.length + 1;
	}
	return withEdits({ text, start: from, end: to }, edits);
}

/**
 * `[testo](url)`: a selection becomes the label and the placeholder URL stays selected, ready to
 * be typed over; with no selection the label is selected first.
 */
export function applyLink({ text, start, end }: EditState): EditState {
	const from = clamp(start, text);
	const to = Math.max(from, clamp(end, text));
	const selected = text.slice(from, to);
	const label = selected.length > 0 ? selected : 'testo';
	const url = 'url';
	const insert = `[${label}](${url})`;
	const labelStart = from + 1;
	const urlStart = labelStart + label.length + 2;
	const caret = selected.length > 0 ? { start: urlStart, end: urlStart + url.length } : { start: labelStart, end: labelStart + label.length };
	return {
		text: text.slice(0, from) + insert + text.slice(to),
		start: caret.start,
		end: caret.end
	};
}

/** The single entry point the page calls for a bar button or a keyboard shortcut. */
export function applyFormatAction(state: EditState, action: FormatActionId): EditState {
	switch (action) {
		case 'bold':
			return wrapInline(state, MARKERS.bold);
		case 'italic':
			return wrapInline(state, MARKERS.italic);
		case 'code':
			return wrapInline(state, MARKERS.code);
		case 'heading':
			return applyLinePrefix(state, PREFIXES.heading);
		case 'list':
			return applyLinePrefix(state, PREFIXES.list);
		case 'quote':
			return applyLinePrefix(state, PREFIXES.quote);
		case 'codeBlock':
			return applyLinePrefix(state, '```');
		case 'separator':
			return insertSlideBreak(state);
		case 'step':
			return insertDirectiveBlock(state, 'step');
		case 'columns':
			return insertDirectiveBlock(state, 'columns');
		case 'link':
			return applyLink(state);
	}
}
