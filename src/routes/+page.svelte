<script lang="ts">
	import {
		Bold,
		Code,
		CodeXml,
		Columns2,
		Download,
		Eye,
		Heading1,
		Italic,
		Link,
		List,
		Minus,
		Pencil,
		Play,
		Quote,
		Upload
	} from 'lucide-svelte';
	import Viewer from '../lib/Viewer.svelte';
	import LibraryPanel from '../lib/Library.svelte';
	import FormatBar, { type FormatAction } from '../lib/FormatBar.svelte';
	import { applyFormatAction, type EditState, type FormatActionId } from '../lib/editing';
	import { pending, preferences } from '../lib/shared.svelte';
	import { texts } from '../lib/i18n';
	import { SAMPLE, encode, decode, readQuery, splitSlides, writeQuery } from '../lib/slides';
	import { exportFileName, normalizeImportedText } from '../lib/transfer';
	import {
		addPresentation,
		createPresentation,
		deletePresentation,
		emptyLibrary,
		findPresentation,
		loadLibrary,
		renamePresentation,
		saveLibrary,
		sortedPresentations,
		updatePresentation,
		type Library
	} from '../lib/library';

	let text = $state(SAMPLE);
	let tab: 'editor' | 'preview' = $state('editor');
	let firstRun = true;
	let ready = $state(false);
	let invalidLink = $state(false);
	let slideIndex = $state(0);
	let library = $state<Library>(emptyLibrary());
	let currentId = $state<string | null>(null);
	let quotaWarning = $state(false);
	/** Text that arrived without an edit (link, sample): it enters the library only when touched. */
	let silentText: string | null = SAMPLE;
	/** Hidden file picker, opened by the Import button. */
	let fileInput = $state<HTMLInputElement | null>(null);
	/** The editor itself: its selection and focus are what the formatting bar acts on. */
	let editorEl = $state<HTMLTextAreaElement | null>(null);
	/** File waiting for a choice: the editor is untouched until the choice is made. */
	let pendingImport = $state<{ name: string; text: string } | null>(null);
	let importWarning = $state(false);

	const isBrowser = typeof window !== 'undefined';
	const t = $derived(texts[preferences.language]);

	/** The bar is a list, not markup: labels and titles follow the language. */
	const formatActions: FormatAction[] = $derived([
		{ id: 'bold', icon: Bold, label: t.format.bold, title: t.format.boldTitle, group: 'inline' },
		{ id: 'italic', icon: Italic, label: t.format.italic, title: t.format.italicTitle, group: 'inline' },
		{ id: 'code', icon: Code, label: t.format.code, title: t.format.codeTitle, group: 'inline' },
		{ id: 'heading', icon: Heading1, label: t.format.heading, title: t.format.headingTitle, group: 'blocks' },
		{ id: 'list', icon: List, label: t.format.list, title: t.format.listTitle, group: 'blocks' },
		{ id: 'quote', icon: Quote, label: t.format.quote, title: t.format.quoteTitle, group: 'blocks' },
		{ id: 'codeBlock', icon: CodeXml, label: t.format.codeBlock, title: t.format.codeBlockTitle, group: 'blocks' },
		{ id: 'separator', icon: Minus, label: t.format.separator, title: t.format.separatorTitle, group: 'structure' },
		{ id: 'step', icon: Play, label: t.format.step, title: t.format.stepTitle, group: 'structure' },
		{ id: 'columns', icon: Columns2, label: t.format.columns, title: t.format.columnsTitle, group: 'structure' },
		{ id: 'link', icon: Link, label: t.format.link, title: t.format.linkTitle, group: 'structure' }
	]);

	function openAt(presentation: { id: string; text: string; slide: number }): void {
		currentId = presentation.id;
		silentText = null;
		text = presentation.text;
		slideIndex = Math.max(0, Math.min(presentation.slide, splitSlides(presentation.text).length - 1));
	}

	if (isBrowser) {
		void (async () => {
			library = loadLibrary();
			if (pending.textToOpen !== null) {
				text = pending.textToOpen;
				silentText = text;
				pending.textToOpen = null;
			} else {
				const { raw, slide } = readQuery();
				if (raw !== null) {
					const decoded = await decode(raw);
					if (decoded !== null) {
						text = decoded;
						silentText = decoded;
						slideIndex = slide;
					} else {
						text = '';
						silentText = '';
						invalidLink = true;
					}
				} else if (!library.unavailable) {
					const last = findPresentation(library, library.lastOpenedId);
					if (last !== null) openAt(last);
				}
			}
			ready = true;
		})();
	}

	const slides = $derived(splitSlides(text));

	// Anti-overtake counter: only the latest started encode wins.
	let encodeSeq = 0;

	$effect(() => {
		if (!isBrowser || !ready) return;
		const value = text;
		const slide = slideIndex;
		if (firstRun) {
			firstRun = false;
			return;
		}
		const mine = ++encodeSeq;
		const timer = window.setTimeout(() => {
			void encode(value).then((c) => {
				if (mine === encodeSeq) writeQuery(c, slide);
			});
			if (mine === encodeSeq) persist(value, slide);
		}, 500);
		return () => clearTimeout(timer);
	});

	/**
	 * Keeps the open presentation in step with the editor. Text that arrived without an edit
	 * (a shared link, the sample) is not copied into the library by itself.
	 */
	function persist(value: string, slide: number): void {
		if (library.unavailable) return;
		const open = findPresentation(library, currentId);
		if (open !== null && open.text === value && open.slide === slide) return;
		if (open !== null) {
			library = updatePresentation(library, open.id, { text: value, slide });
		} else {
			if (currentId === null && value === silentText) return;
			const created = createPresentation(value, slide, t.library.untitled);
			library = addPresentation(library, created);
			currentId = created.id;
			silentText = null;
		}
		quotaWarning = !saveLibrary(library);
	}

	function openPresentation(id: string): void {
		const chosen = findPresentation(library, id);
		if (chosen === null) return;
		openAt(chosen);
		library = { ...library, lastOpenedId: chosen.id };
		void saveLibrary(library);
	}

	function renamePresentationTo(id: string, name: string): void {
		const before = findPresentation(library, id)?.name;
		library = renamePresentation(library, id, name);
		if (findPresentation(library, id)?.name !== before) void saveLibrary(library);
	}

	/** Deleting the open presentation hands the editor to the next one, or to the sample. */
	function removePresentation(id: string): void {
		const wasOpen = id === currentId;
		library = deletePresentation(library, id);
		void saveLibrary(library);
		if (!wasOpen) return;
		const next = sortedPresentations(library)[0] ?? null;
		if (next !== null) {
			openAt(next);
			library = { ...library, lastOpenedId: next.id };
			void saveLibrary(library);
			return;
		}
		currentId = null;
		text = SAMPLE;
		silentText = SAMPLE;
		slideIndex = 0;
	}

	/** Name of the open presentation; empty when there is none, so the helper picks the default. */
	function openName(): string {
		return findPresentation(library, currentId)?.name ?? '';
	}

	/** Downloads the editor text as it is: separators, directives and code blocks untouched. */
	function exportPresentation(): void {
		const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = exportFileName(openName());
		document.body.append(link);
		link.click();
		link.remove();
		URL.revokeObjectURL(url);
	}

	function chooseFile(): void {
		importWarning = false;
		fileInput?.click();
	}

	/** Reads the chosen file and opens the choice; nothing in the editor changes yet. */
	async function readFile(event: Event): Promise<void> {
		const input = event.currentTarget as HTMLInputElement;
		const chosen = input.files?.[0] ?? null;
		// Cleared at once: choosing the same file twice must fire `change` again.
		input.value = '';
		if (chosen === null) return;
		try {
			pendingImport = { name: chosen.name, text: normalizeImportedText(await chosen.text()) };
		} catch {
			pendingImport = null;
			importWarning = true;
		}
	}

	function cancelImport(): void {
		pendingImport = null;
	}

	/**
	 * Applies the chosen file: "new" gains a library entry named from the content, "replace"
	 * keeps the open one and its name. Both save at once, so a reload right after the import
	 * still shows the imported text (the debounce would arrive too late).
	 */
	function applyImport(kind: 'new' | 'replace'): void {
		const incoming = pendingImport;
		if (incoming === null) return;
		pendingImport = null;
		const open = findPresentation(library, currentId);
		text = incoming.text;
		silentText = null;
		slideIndex = 0;
		if (library.unavailable) {
			// No library to write into: the text lives in the editor and in the link only.
			currentId = null;
			return;
		}
		if (kind === 'new' || open === null) {
			const created = createPresentation(incoming.text, 0, t.library.untitled);
			library = addPresentation(library, created);
			currentId = created.id;
		} else {
			library = updatePresentation(library, open.id, { text: incoming.text, slide: 0 });
			currentId = open.id;
		}
		quotaWarning = !saveLibrary(library);
	}

	/** Applies a bar action to the current selection, then hands the field back its caret. */
	function applyFormat(id: FormatActionId): void {
		const el = editorEl;
		if (el === null) return;
		writeToEditor(
			el,
			applyFormatAction(
				{ text: el.value, start: el.selectionStart ?? 0, end: el.selectionEnd ?? 0 },
				id
			)
		);
	}

	/**
	 * Writes through the field's own input path, so the action lands in the undo history as one
	 * more typing step: assigning `value` would wipe Ctrl+Z for everything typed before it.
	 */
	function writeToEditor(el: HTMLTextAreaElement, next: EditState): void {
		const previous = el.value;
		el.focus();
		if (next.text === previous) {
			el.setSelectionRange(next.start, next.end);
			return;
		}
		el.setSelectionRange(0, previous.length);
		let written = false;
		try {
			written = document.execCommand('insertText', false, next.text);
		} catch {
			written = false;
		}
		if (!written || el.value === previous) {
			// execCommand is deprecated: without it the text still changes, but this step is not undoable.
			el.setRangeText(next.text, 0, previous.length, 'preserve');
			el.dispatchEvent(new Event('input', { bubbles: true }));
		}
		el.setSelectionRange(next.start, next.end);
	}
	/**
	 * Ctrl/Cmd shortcuts, only while the caret is in the editor: outside it the keyboard keeps
	 * doing what it did — the arrow keys still walk the slides, handled by `Viewer`.
	 */
	function onEditorKeydown(event: KeyboardEvent): void {
		if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) return;
		const key = event.key.toLowerCase();
		const action: FormatActionId | null =
			key === 'b' ? 'bold' : key === 'i' ? 'italic' : key === 'k' ? 'link' : null;
		if (action === null) return;
		event.preventDefault();
		applyFormat(action);
	}
</script>

<svelte:head>
	<title>mdpresenter</title>
</svelte:head>

<nav>
	<button class:active={tab === 'editor'} onclick={() => (tab = 'editor')}>
		<Pencil size={16} />
		{t.tabs.editor}
	</button>
	<button class:active={tab === 'preview'} onclick={() => (tab = 'preview')}>
		<Eye size={16} />
		{t.tabs.preview}
	</button>
</nav>
{#if invalidLink}
	<div class="warning" role="alert">
		<strong>{t.invalidLink.title}</strong>
		<span>{t.invalidLink.text}</span>
		<button onclick={() => (invalidLink = false)}>{t.invalidLink.close}</button>
	</div>
{/if}
{#if quotaWarning}
	<div class="warning" role="alert">{t.library.quota}</div>
{/if}
{#if ready}
	<LibraryPanel
		{library}
		{currentId}
		onopen={openPresentation}
		onrename={renamePresentationTo}
		ondelete={removePresentation}
	/>
{/if}
<div class="actions">
	<button onclick={exportPresentation}>
		<Download size={16} />
		{t.transfer.export}
	</button>
	<button onclick={chooseFile}>
		<Upload size={16} />
		{t.transfer.import}
	</button>
	<input
		bind:this={fileInput}
		type="file"
		accept=".md,.markdown,.txt,text/markdown,text/plain"
		hidden
		onchange={readFile}
	/>
</div>
{#if importWarning}
	<div class="warning" role="alert">{t.transfer.unreadable}</div>
{/if}
{#if pendingImport}
	<div class="choice" role="group" aria-label={t.transfer.chooseTitle}>
		<p class="choice-title">{t.transfer.chooseTitle}</p>
		<p class="choice-text">{t.transfer.chooseText} <code>{pendingImport.name}</code></p>
		<div class="actions">
			<button onclick={() => applyImport('new')}>{t.transfer.newPresentation}</button>
			<button onclick={() => applyImport('replace')}>{t.transfer.replace}</button>
			<button onclick={cancelImport}>{t.transfer.cancel}</button>
		</div>
	</div>
{/if}
<div class="panels" data-tab={tab}>
	<div class="editor-panel">
		<FormatBar actions={formatActions} label={t.format.label} onaction={applyFormat} />
		<textarea
			class="editor"
			bind:this={editorEl}
			bind:value={text}
			aria-label={t.editorLabel}
			spellcheck={false}
			onkeydown={onEditorKeydown}
		></textarea>
	</div>
	<div class="preview">
		<Viewer {slides} bind:index={slideIndex} showAllSteps />
	</div>
</div>

<style>
	nav {
		display: none;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
		padding: 0.25rem;
		border-radius: 999px;
		background: var(--code-bg);
	}
	nav button {
		flex: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		padding: 0.6rem;
		min-height: 44px;
		border: none;
		border-radius: 999px;
		background: transparent;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text-muted);
		cursor: pointer;
		transition:
			background-color 150ms ease,
			color 150ms ease;
	}
	nav button.active {
		background: var(--surface);
		color: var(--text);
		box-shadow: 0 1px 4px rgb(0 0 0 / 0.12);
	}
	.panels {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		align-items: start;
	}
	/* The bar belongs to the editor column: one row above the textarea, which stays the part that grows. */
	.editor-panel {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 0;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}
	.actions button {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0 0.9rem;
		min-height: 44px;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: var(--surface);
		color: var(--text);
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			border-color 150ms ease,
			background-color 150ms ease;
	}
	.actions button:hover {
		border-color: var(--accent);
	}
	.choice {
		margin-bottom: 0.75rem;
		padding: 0.75rem 1rem;
		border: 1px solid var(--accent);
		border-radius: 12px;
		background: var(--surface);
		color: var(--text);
	}
	.choice-title {
		margin: 0 0 0.25rem;
		font-weight: 600;
	}
	.choice-text {
		margin: 0 0 0.6rem;
		color: var(--text-muted);
	}
	.choice code {
		padding: 0.1rem 0.35rem;
		border-radius: 6px;
		background: var(--code-bg);
		font-size: 0.9em;
	}
	.editor {
		min-height: 60vh;
		font-family: ui-monospace, monospace;
		font-size: 0.95rem;
		line-height: 1.6;
		padding: 1.25rem;
		border: 1px solid var(--border);
		border-radius: 16px;
		background: var(--surface);
		color: var(--text);
		resize: vertical;
		transition:
			border-color 150ms ease,
			box-shadow 150ms ease,
			background-color 150ms ease;
	}
	.warning {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		margin-bottom: 0.75rem;
		border: 1px solid var(--border);
		border-radius: 12px;
		background: var(--surface);
		color: var(--text);
	}
	.warning button {
		margin-left: auto;
		padding: 0.4rem 0.8rem;
		min-height: 44px;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: transparent;
		color: var(--text);
		cursor: pointer;
	}
	.editor:focus {
		outline: none;
		border-color: var(--accent);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 25%, transparent);
	}
	@media (max-width: 700px) {
		nav {
			display: flex;
		}
		.panels {
			grid-template-columns: 1fr;
		}
		.panels[data-tab='editor'] .preview {
			display: none;
		}
		.panels[data-tab='preview'] .editor-panel {
			display: none;
		}
	}
</style>
