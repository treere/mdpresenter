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
		margin-bottom: 0.5rem;
	}
	nav button {
		flex: 1;
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		background: #f5f5f5;
	}
	nav button.active {
		background: #333;
		color: #fff;
	}
	.pannelli {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
	.editor {
		min-height: 60vh;
		font-family: monospace;
		padding: 1rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		resize: vertical;
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
