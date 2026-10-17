<script lang="ts">
	import { Eye, Pencil } from 'lucide-svelte';
	import Visualizzatore from '../lib/Visualizzatore.svelte';
	import { appoggio, preferenze } from '../lib/condiviso.svelte';
	import { testi } from '../lib/i18n';
	import { ESEMPIO, codifica, decodifica, splitSlides } from '../lib/slides';

	let testo = $state(ESEMPIO);
	let scheda: 'editor' | 'anteprima' = $state('anteprima');
	let primoAvvio = true;

	const suBrowser = typeof window !== 'undefined';
	const t = $derived(testi[preferenze.lingua]);

	if (suBrowser) {
		if (appoggio.testoDaAprire !== null) {
			testo = appoggio.testoDaAprire;
			appoggio.testoDaAprire = null;
		} else if (location.hash.length > 1) {
			const daUrl = decodifica(location.hash.slice(1));
			if (daUrl !== null) testo = daUrl;
		}
	}

	const slides = $derived(splitSlides(testo));

	$effect(() => {
		if (!suBrowser) return;
		const t = testo;
		if (primoAvvio) {
			primoAvvio = false;
			return;
		}
		const timer = window.setTimeout(() => {
			history.replaceState(null, '', '#' + codifica(t));
		}, 500);
		return () => clearTimeout(timer);
	});
</script>

<svelte:head>
	<title>mdpresenter</title>
</svelte:head>

<nav>
	<button class:active={scheda === 'editor'} onclick={() => (scheda = 'editor')}>
		<Pencil size={16} />
		{t.schede.editor}
	</button>
	<button class:active={scheda === 'anteprima'} onclick={() => (scheda = 'anteprima')}>
		<Eye size={16} />
		{t.schede.anteprima}
	</button>
</nav>
<div class="pannelli" data-scheda={scheda}>
	<textarea
		class="editor"
		bind:value={testo}
		aria-label={t.editorEtichetta}
		spellcheck={false}
	></textarea>
	<div class="anteprima">
		<Visualizzatore {slides} />
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
		color: var(--testo-debole);
		cursor: pointer;
		transition:
			background-color 150ms ease,
			color 150ms ease;
	}
	nav button.active {
		background: var(--superficie);
		color: var(--testo);
		box-shadow: 0 1px 4px rgb(0 0 0 / 0.12);
	}
	.pannelli {
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
		color: var(--testo);
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
		.pannelli {
			grid-template-columns: 1fr;
		}
		.pannelli[data-scheda='editor'] .anteprima {
			display: none;
		}
		.pannelli[data-scheda='anteprima'] .editor {
			display: none;
		}
	}
</style>
