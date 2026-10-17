<script lang="ts">
	import { Eye, Pencil } from 'lucide-svelte';
	import Viewer from '../lib/Viewer.svelte';
	import { pending, preferences } from '../lib/shared.svelte';
	import { texts } from '../lib/i18n';
	import { SAMPLE, encode, decode, readQuery, splitSlides, writeQuery } from '../lib/slides';

	let text = $state(SAMPLE);
	let tab: 'editor' | 'preview' = $state('editor');
	let firstRun = true;
	let ready = $state(false);
	let invalidLink = $state(false);
	let slideIndex = $state(0);

	const isBrowser = typeof window !== 'undefined';
	const t = $derived(texts[preferences.language]);

	if (isBrowser) {
		void (async () => {
			if (pending.textToOpen !== null) {
				text = pending.textToOpen;
				pending.textToOpen = null;
			} else {
				const { raw, slide } = readQuery();
				if (raw !== null) {
					const decoded = await decode(raw);
					if (decoded !== null) {
						text = decoded;
						slideIndex = slide;
					} else {
						text = '';
						invalidLink = true;
					}
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
		const t = text;
		const s = slideIndex;
		if (firstRun) {
			firstRun = false;
			return;
		}
		const mine = ++encodeSeq;
		const timer = window.setTimeout(() => {
			void encode(t).then((c) => {
				if (mine === encodeSeq) writeQuery(c, s);
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
{#if invalidLink}
	<div class="warning" role="alert">
		<strong>{t.invalidLink.title}</strong>
		<span>{t.invalidLink.text}</span>
		<button onclick={() => (invalidLink = false)}>{t.invalidLink.close}</button>
	</div>
{/if}
<div class="panels" data-tab={tab}>
	<textarea
		class="editor"
		bind:value={text}
		aria-label={t.editorLabel}
		spellcheck={false}
	></textarea>
	<div class="preview">
		<Viewer {slides} bind:index={slideIndex} />
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
