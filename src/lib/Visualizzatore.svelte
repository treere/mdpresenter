<script lang="ts">
	import DOMPurify from 'dompurify';
	import 'highlight.js/styles/github.css';
	import { renderMarkdown } from '../lib/markdown';

	let { slides }: { slides: string[] } = $props();

	let indice = $state(0);
	let xInizio = $state<number | null>(null);
	let contenitore: HTMLDivElement | undefined = $state();
	let schermoIntero = $state(false);

	const suBrowser = typeof window !== 'undefined';

	const TEMI = ['chiaro', 'scuro', 'vivace'] as const;
	type Tema = (typeof TEMI)[number];
	let tema: Tema = $state('chiaro');

	if (suBrowser) {
		const salvato = localStorage.getItem('mdpresenter-tema');
		if (salvato === 'scuro' || salvato === 'vivace' || salvato === 'chiaro') tema = salvato;
	}

	const totale = $derived(slides.length);
	const corrente = $derived(slides[Math.min(indice, totale - 1)] ?? '');
	// HTML calcolato in $effect (e non in $derived): suBrowser non è reattivo e
	// l'{@html} prerenderizzato vuoto non verrebbe aggiornato all'hydration.
	let html = $state('');
	let tutteHtml: string[] = $state([]);
	$effect(() => {
		const c = corrente;
		const ss = slides;
		if (!suBrowser) return;
		html = DOMPurify.sanitize(renderMarkdown(c));
		tutteHtml = ss.map((s) => DOMPurify.sanitize(renderMarkdown(s)));
	});

	$effect(() => {
		if (indice > totale - 1) indice = Math.max(totale - 1, 0);
	});

	$effect(() => {
		if (suBrowser) localStorage.setItem('mdpresenter-tema', tema);
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

	async function alternaSchermoIntero() {
		if (!suBrowser || !contenitore) return;
		if (document.fullscreenElement) await document.exitFullscreen();
		else await contenitore.requestFullscreen();
	}

	function stampa() {
		if (suBrowser) window.print();
	}
</script>

<svelte:window
	onkeydown={tasto}
	onfullscreenchange={() => (schermoIntero = suBrowser && !!document.fullscreenElement)}
/>

<div class="barra">
	<button onclick={alternaSchermoIntero}>
		{schermoIntero ? 'Esci da schermo intero' : 'Schermo intero'}
	</button>
	<button onclick={stampa}>PDF</button>
	<label class="tema">
		Tema
		<select bind:value={tema} aria-label="Tema delle slide">
			<option value="chiaro">Chiaro</option>
			<option value="scuro">Scuro</option>
			<option value="vivace">Vivace</option>
		</select>
	</label>
</div>
<div class="viewer" bind:this={contenitore} data-tema={tema}>
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
<div class="stampa" aria-hidden="true">
	{#each tutteHtml as h}
		<div class="pagina-stampa">{@html h}</div>
	{/each}
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
	.viewer {
		--sfondo: #fff;
		--testo: #222;
		--bordo: #ddd;
		--accento: #888;
		--codice-sfondo: #f6f8fa;
		--tabella-intestazione: #f0f0f0;
		background: var(--sfondo);
	}
	.viewer[data-tema='scuro'] {
		--sfondo: #1e1e1e;
		--testo: #e8e8e8;
		--bordo: #555;
		--accento: #aaa;
		--codice-sfondo: #2d2d2d;
		--tabella-intestazione: #2a2a2a;
	}
	.viewer[data-tema='vivace'] {
		--sfondo: #0f2a5c;
		--testo: #ffffff;
		--bordo: #ffd43b;
		--accento: #ffd43b;
		--codice-sfondo: #1b3f7d;
		--tabella-intestazione: #1b3f7d;
	}
	.slide {
		background: var(--sfondo);
		color: var(--testo);
		padding: 2rem;
		overflow-y: auto;
	}
	.viewer[data-tema='scuro'] .slide :global(.hljs),
	.viewer[data-tema='vivace'] .slide :global(.hljs) {
		background: var(--codice-sfondo);
		color: var(--testo);
	}
	.slide :global(pre) {
		background: var(--codice-sfondo);
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
		border: 1px solid var(--bordo);
		padding: 0.4rem 0.8rem;
		text-align: left;
	}
	.slide :global(thead) {
		background: var(--tabella-intestazione);
	}
	.zona {
		background: var(--sfondo);
		border: none;
		font-size: 2rem;
		cursor: pointer;
		padding: 0 0.5rem;
		color: var(--accento);
	}
	.contatore {
		position: absolute;
		bottom: 0.5rem;
		right: 1rem;
		margin: 0;
		color: #888;
		font-size: 0.85rem;
	}
	.barra {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}
	.barra button {
		padding: 0.4rem 0.8rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		background: #f5f5f5;
		cursor: pointer;
	}
	.viewer:fullscreen {
		background: var(--sfondo);
		padding: 2rem;
	}
	.viewer:fullscreen .slide {
		max-width: 900px;
		margin: 0 auto;
		font-size: 1.4rem;
	}
	.stampa {
		display: none;
	}
</style>
