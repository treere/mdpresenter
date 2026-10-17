<script lang="ts">
	import { Eye, Pencil } from 'lucide-svelte';
	import Viewer from '../lib/Viewer.svelte';
	import { pending, preferences } from '../lib/shared.svelte';
	import { texts } from '../lib/i18n';
	import { SAMPLE, encode, decode, splitSlides } from '../lib/slides';

	let text = $state(SAMPLE);
	let tab: 'editor' | 'preview' = $state('editor');
	let firstRun = true;
	let ready = $state(false);

	const isBrowser = typeof window !== 'undefined';
	const t = $derived(texts[preferences.language]);

	if (isBrowser) {
		void (async () => {
			if (pending.textToOpen !== null) {
				text = pending.textToOpen;
				pending.textToOpen = null;
			} else if (location.hash.length > 1) {
				const daUrl = await decode(location.hash.slice(1));
				if (daUrl !== null) text = daUrl;
			}
			ready = true;
		})();
	}

	const slides = $derived(splitSlides(text));

	// Anti-overtake counter: only the latest started encode wins.
	let sequenzaCodifica = 0;

	$effect(() => {
		if (!isBrowser || !ready) return;
		const t = text;
		if (firstRun) {
			firstRun = false;
			return;
		}
		const mia = ++sequenzaCodifica;
		const timer = window.setTimeout(() => {
			void encode(t).then((c) => {
				if (mia === sequenzaCodifica) history.replaceState(null, '', '#' + c);
			});
		}, 500);
		return () => clearTimeout(timer);
	});
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
<div class="panels" data-tab={tab}>
	<textarea
		class="editor"
		bind:value={text}
		aria-label={t.editorLabel}
		spellcheck={false}
	></textarea>
	<div class="preview">
		<Viewer {slides} />
	</div>
</div>

<style>
	nav {
		display: none;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
		padding: 0.25rem;
		border-radius: 999px;
		background: var(--codice-sfondo);
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
		color: var(--text-debole);
		cursor: pointer;
		transition:
			background-color 150ms ease,
			color 150ms ease;
	}
	nav button.active {
		background: var(--superficie);
		color: var(--text);
		box-shadow: 0 1px 4px rgb(0 0 0 / 0.12);
	}
	.panels {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		align-items: start;
	}
	.editor {
		min-height: 60vh;
		font-family: ui-monospace, monospace;
		font-size: 0.95rem;
		line-height: 1.6;
		padding: 1.25rem;
		border: 1px solid var(--bordo);
		border-radius: 16px;
		background: var(--superficie);
		color: var(--text);
		resize: vertical;
		transition:
			border-color 150ms ease,
			box-shadow 150ms ease,
			background-color 150ms ease;
	}
	.editor:focus {
		outline: none;
		border-color: var(--accento);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--accento) 25%, transparent);
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
