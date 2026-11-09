import { describe, expect, it } from 'vitest';
import {
	applyFormatAction,
	applyLinePrefix,
	applyLink,
	insertDirectiveBlock,
	insertSlideBreak,
	wrapInline,
	type EditState
} from './editing';
import { splitSlides } from './slides';

/** Readable assertion: the field content and the selection after the action. */
function expectEdit(state: EditState, text: string, start: number, end: number): void {
	expect(state.text).toBe(text);
	expect(state.start).toBe(start);
	expect(state.end).toBe(end);
	expect(state.text.slice(state.start, state.end)).toBe(text.slice(start, end));
}

describe('wrapInline', () => {
	it('wraps the selection and keeps it on the word', () => {
		expectEdit(wrapInline({ text: 'parola', start: 0, end: 6 }, '**'), '**parola**', 2, 8);
	});

	it('wraps a word in the middle of the text', () => {
		expectEdit(wrapInline({ text: 'un parola qui', start: 3, end: 9 }, '**'), 'un **parola** qui', 5, 11);
	});

	it('inserts the pair with the caret between, when nothing is selected', () => {
		expectEdit(wrapInline({ text: 'parola', start: 0, end: 0 }, '**'), '****parola', 2, 2);
	});

	it('takes the pair away when the caret is already between it', () => {
		expectEdit(wrapInline({ text: '****', start: 2, end: 2 }, '**'), '', 0, 0);
	});

	it('takes the markers away when the selection carries them', () => {
		expectEdit(wrapInline({ text: '**parola**', start: 0, end: 10 }, '**'), 'parola', 0, 6);
	});

	it('takes the markers away when they sit right outside the selection', () => {
		expectEdit(wrapInline({ text: '**parola**', start: 2, end: 8 }, '**'), 'parola', 0, 6);
	});

	it('never rewrites a partial selection halfway', () => {
		expectEdit(wrapInline({ text: '**parola**', start: 3, end: 6 }, '**'), '**p**aro**la**', 5, 8);
	});

	it('wraps every line separately on a two-line selection', () => {
		expectEdit(
			wrapInline({ text: 'prima\nseconda', start: 0, end: 13 }, '`'),
			'`prima`\n`seconda`',
			1,
			16
		);
	});

	it('leaves an empty line alone on a multi-line selection', () => {
		expectEdit(wrapInline({ text: 'a\n\nb', start: 0, end: 4 }, '*'), '*a*\n\n*b*', 1, 7);
	});

	it('works at the very start and at the very end of the text', () => {
		expectEdit(wrapInline({ text: 'abc', start: 0, end: 1 }, '*'), '*a*bc', 1, 2);
		expectEdit(wrapInline({ text: 'abc', start: 2, end: 3 }, '*'), 'ab*c*', 3, 4);
	});

	it('tolerates an empty text and out-of-range positions', () => {
		expectEdit(wrapInline({ text: '', start: 0, end: 0 }, '**'), '****', 2, 2);
		expectEdit(wrapInline({ text: 'ab', start: 99, end: 120 }, '`'), 'ab``', 3, 3);
	});
});

describe('applyLinePrefix', () => {
	it('puts the heading prefix on the current line and keeps the caret on the text', () => {
		expectEdit(applyLinePrefix({ text: 'titolo', start: 2, end: 2 }, '# '), '# titolo', 4, 4);
	});

	it('removes the prefix when the line already has it', () => {
		expectEdit(applyLinePrefix({ text: '# titolo', start: 4, end: 4 }, '# '), 'titolo', 2, 2);
	});

	it('prefixes only the caret line, not its neighbours', () => {
		expectEdit(applyLinePrefix({ text: 'uno\ndue\ntre', start: 5, end: 5 }, '> '), 'uno\n> due\ntre', 7, 7);
	});

	it('prefixes every line of the selection', () => {
		expectEdit(applyLinePrefix({ text: 'uno\ndue', start: 0, end: 7 }, '- '), '- uno\n- due', 2, 11);
	});

	it('does not prefix a line that already has the prefix, when the selection is mixed', () => {
		expectEdit(applyLinePrefix({ text: '- uno\ndue', start: 0, end: 9 }, '- '), '- uno\n- due', 0, 11);
	});

	it('takes the prefix away from every selected line', () => {
		expectEdit(applyLinePrefix({ text: '- uno\n- due', start: 0, end: 11 }, '- '), 'uno\ndue', 0, 7);
	});

	it('prefixes an empty line without complaining', () => {
		expectEdit(applyLinePrefix({ text: '', start: 0, end: 0 }, '# '), '# ', 2, 2);
	});

	it('works with the caret at the end of the text', () => {
		expectEdit(applyLinePrefix({ text: 'ciao', start: 4, end: 4 }, '> '), '> ciao', 6, 6);
	});

	it('fences the current line and takes the fence away on a second press', () => {
		const fenced = applyLinePrefix({ text: 'codice', start: 2, end: 2 }, '```');
		expect(fenced.text).toBe('```\ncodice\n```');
		expectEdit(applyLinePrefix(fenced, '```'), 'codice', 2, 2);
	});
});

describe('insertSlideBreak', () => {
	it('grows the slide count between two blocks', () => {
		const result = insertSlideBreak({ text: 'a\n\nb', start: 1, end: 1 });
		expect(result.text).toBe('a\n\n---\n\nb');
		expect(splitSlides(result.text).length).toBe(splitSlides('a\n\nb').length + 1);
	});

	it('leaves a blank line on the new slide when the caret is at the end of the text', () => {
		const result = insertSlideBreak({ text: 'a', start: 1, end: 1 });
		expect(result.text).toBe('a\n\n---\n\n');
		expect(result.start).toBe(result.text.length);
	});

	it('replaces a selection instead of keeping it', () => {
		const result = insertSlideBreak({ text: 'aXXb', start: 1, end: 3 });
		expect(result.text).toBe('a\n\n---\n\nb');
	});

	it('does not double the blank lines that are already there', () => {
		expect(insertSlideBreak({ text: 'a\n\nb', start: 3, end: 3 }).text).toBe('a\n\n---\n\nb');
	});
});

describe('insertDirectiveBlock', () => {
	it('inserts a step block with the caret inside', () => {
		const result = insertDirectiveBlock({ text: '', start: 0, end: 0 }, 'step');
		expect(result.text).toBe('::: step\n\n::: end');
		expect(result.start).toBe('::: step\n\n'.length);
		expect(result.end).toBe(result.start);
	});

	it('inserts a step block in the middle of a slide, on lines of its own', () => {
		const result = insertDirectiveBlock({ text: 'prima\nseconda', start: 6, end: 6 }, 'step');
		expect(result.text).toBe('prima\n::: step\n\n::: end\nseconda');
		expect(result.text.slice(result.start, result.end)).toBe('');
	});

	it('inserts a complete columns block with the caret in the first column', () => {
		const result = insertDirectiveBlock({ text: '', start: 0, end: 0 }, 'columns');
		expect(result.text).toBe('::: columns\n::: part\n\n::: part\n\n::: end');
		const lines = result.text.split('\n');
		expect(lines[0]).toBe('::: columns');
		expect(lines[1]).toBe('::: part');
		expect(lines[3]).toBe('::: part');
		expect(lines[5]).toBe('::: end');
		expect(result.text.slice(0, result.start).split('\n').length).toBe(4);
	});
});

describe('applyLink', () => {
	it('turns the selection into the label and selects the URL placeholder', () => {
		expectEdit(applyLink({ text: 'testo', start: 0, end: 5 }), '[testo](url)', 8, 11);
	});

	it('wraps a selection in the middle of the text', () => {
		expectEdit(applyLink({ text: 'vedi testo qui', start: 5, end: 10 }), 'vedi [testo](url) qui', 13, 16);
	});

	it('selects the label first when nothing is selected', () => {
		expectEdit(applyLink({ text: '', start: 0, end: 0 }), '[testo](url)', 1, 6);
	});
});

describe('applyFormatAction', () => {
	it('routes every action to its transformation', () => {
		const state = { text: 'parola', start: 0, end: 6 };
		expect(applyFormatAction(state, 'bold').text).toBe('**parola**');
		expect(applyFormatAction(state, 'italic').text).toBe('*parola*');
		expect(applyFormatAction(state, 'code').text).toBe('`parola`');
		expect(applyFormatAction(state, 'heading').text).toBe('# parola');
		expect(applyFormatAction({ text: 'parola', start: 0, end: 0 }, 'list').text).toBe('- parola');
		expect(applyFormatAction({ text: 'parola', start: 0, end: 0 }, 'quote').text).toBe('> parola');
		expect(applyFormatAction({ text: 'a', start: 1, end: 1 }, 'separator').text).toBe('a\n\n---\n\n');
		expect(applyFormatAction({ text: '', start: 0, end: 0 }, 'step').text).toBe('::: step\n\n::: end');
		expect(applyFormatAction({ text: '', start: 0, end: 0 }, 'columns').text).toContain('::: columns');
		expect(applyFormatAction(state, 'link').text).toBe('[parola](url)');
	});
});
