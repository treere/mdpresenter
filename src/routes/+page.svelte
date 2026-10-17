<script lang="ts">
	import Visualizzatore from '../lib/Visualizzatore.svelte';
	import { ESEMPIO, codifica, decodifica, splitSlides } from '../lib/slides';

	let testo = $state(ESEMPIO);
	let scheda: 'editor' | 'anteprima' = $state('anteprima');
	let primoAvvio = true;

	const suBrowser = typeof window !== 'undefined';

	if (suBrowser && location.hash.length > 1) {
		const daUrl = decodifica(location.hash.slice(1));
		if (daUrl !== null) testo = daUrl;
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

<main>
	<h1>mdpresenter</h1>
	<nav>
		<button class:active={scheda === 'editor'} onclick={() => (scheda = 'editor')}>Editor</button>
		<button class:active={scheda === 'anteprima'} onclick={() => (scheda = 'anteprima')}>
			Anteprima
		</button>
	</nav>
	<div class="pannelli" data-scheda={scheda}>
		<textarea
			class="editor"
			bind:value={testo}
			aria-label="Testo Markdown della presentazione"
			spellcheck={false}
		></textarea>
		<div class="anteprima">
			<Visualizzatore {slides} />
		</div>
	</div>
</main>

<style>
	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		font-family: system-ui, sans-serif;
	}
	h1 {
		font-size: 1.2rem;
		margin: 0 0 0.5rem;
	}
	nav {
		display: none;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
		padding: 0.25rem;
		border-radius: 999px;
		background: #eef1f6;
	}
	nav button {
		flex: 1;
		padding: 0.6rem;
		min-height: 44px;
		border: none;
		border-radius: 999px;
		background: transparent;
		font-size: 0.95rem;
		font-weight: 600;
		color: #5b6472;
		cursor: pointer;
		transition:
			background-color 150ms ease,
			color 150ms ease;
	}
	nav button.active {
		background: #fff;
		color: #1f2430;
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
		border: 1px solid #e3e6eb;
		border-radius: 16px;
		background: #f7f9fc;
		resize: vertical;
		transition:
			border-color 150ms ease,
			box-shadow 150ms ease;
	}
	.editor:focus {
		outline: none;
		border-color: #4f6df5;
		box-shadow: 0 0 0 3px rgb(79 109 245 / 0.15);
		background: #fff;
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
