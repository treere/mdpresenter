<script lang="ts">
	import { Download, Eye, Pencil } from 'lucide-svelte';
	import Viewer from '../lib/Viewer.svelte';
	import LibraryPanel from '../lib/Library.svelte';
	import { pending, preferences } from '../lib/shared.svelte';
	import { texts } from '../lib/i18n';
	import { SAMPLE, encode, decode, readQuery, splitSlides, writeQuery } from '../lib/slides';
	import { exportFileName } from '../lib/transfer';
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

	const isBrowser = typeof window !== 'undefined';
	const t = $derived(texts[preferences.language]);

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
</div>
<div class="panels" data-tab={tab}>
	<textarea
		class="editor"
		bind:value={text}
		aria-label={t.editorLabel}
		spellcheck={false}
	></textarea>
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
		.panels[data-tab='preview'] .editor {
			display: none;
		}
	}
</style>
