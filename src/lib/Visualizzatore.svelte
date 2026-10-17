<script lang="ts">
	import DOMPurify from 'dompurify';
	import 'highlight.js/styles/github.css';
	import { renderMarkdown } from '../lib/markdown';

	let { slides }: { slides: string[] } = $props();

	let indice = $state(0);
	let xInizio = $state<number | null>(null);

	const suBrowser = typeof window !== 'undefined';
	const totale = $derived(slides.length);
	const corrente = $derived(slides[Math.min(indice, totale - 1)] ?? '');
	const html = $derived(suBrowser ? DOMPurify.sanitize(renderMarkdown(corrente)) : '');

	$effect(() => {
		if (indice > totale - 1) indice = Math.max(totale - 1, 0);
	});

	function avanti() {
		if (indice < totale - 1) indice += 1;
	}

	function indietro() {
		if (indice > 0) indice -= 1;
	}

	function tasto(e: KeyboardEvent) {
		if (e.key === 'ArrowRight') avanti();
		if (e.key === 'ArrowLeft') indietro();
	}
</script>

<svelte:window onkeydown={tasto} />

<div class="viewer">
	<button class="zona sinistra" onclick={indietro} aria-label="Slide precedente">‹</button>
	<div
		class="slide"
		role="region"
		aria-label="Slide corrente"
		ontouchstart={(e) => (xInizio = e.touches[0].clientX)}
		ontouchend={(e) => {
			if (xInizio === null) return;
			const dx = e.changedTouches[0].clientX - xInizio;
			xInizio = null;
			if (dx < -40) avanti();
			if (dx > 40) indietro();
		}}
	>
		{@html html}
	</div>
	<button class="zona destra" onclick={avanti} aria-label="Slide successiva">›</button>
	<p class="contatore">{indice + 1}/{totale}</p>
</div>

<style>
	.viewer {
		position: relative;
		display: grid;
		grid-template-columns: auto 1fr auto;
		min-height: 60vh;
		border: 1px solid #ddd;
		border-radius: 8px;
		overflow: hidden;
	}
	.slide {
		padding: 2rem;
		overflow-y: auto;
	}
	.slide :global(pre) {
		background: #f6f8fa;
		padding: 1rem;
		border-radius: 8px;
		overflow-x: auto;
	}
	.slide :global(table) {
		display: block;
		width: max-content;
		max-width: 100%;
		overflow-x: auto;
		border-collapse: collapse;
		margin: 1rem 0;
	}
	.slide :global(th),
	.slide :global(td) {
		border: 1px solid #ddd;
		padding: 0.4rem 0.8rem;
		text-align: left;
	}
	.slide :global(thead) {
		background: #f0f0f0;
	}
	.zona {
		background: none;
		border: none;
		font-size: 2rem;
		cursor: pointer;
		padding: 0 0.5rem;
		color: #888;
	}
	.contatore {
		position: absolute;
		bottom: 0.5rem;
		right: 1rem;
		margin: 0;
		color: #888;
		font-size: 0.85rem;
	}
</style>
