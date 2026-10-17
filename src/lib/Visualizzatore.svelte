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

<div class="app" data-tema={tema}>
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
<div class="viewer" bind:this={contenitore}>
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
</div>

<style>
	.viewer {
		position: relative;
		display: grid;
		grid-template-columns: auto 1fr auto;
		min-height: 60vh;
		border: none;
		border-radius: 16px;
		overflow: hidden;
		background: var(--sfondo);
		box-shadow:
			0 1px 2px rgb(0 0 0 / 0.06),
			0 8px 24px rgb(0 0 0 / 0.1);
		transition:
			background-color 150ms ease,
			box-shadow 150ms ease;
	}
	.app {
		--sfondo: #fff;
		--testo: #1f2430;
		--bordo: #e3e6eb;
		--accento: #4f6df5;
		--codice-sfondo: #f4f6fa;
		--tabella-intestazione: #eef1f6;
		--ombra: 0 1px 2px rgb(0 0 0 / 0.06), 0 8px 24px rgb(0 0 0 / 0.1);
		color: var(--testo);
	}
	.app[data-tema='scuro'] {
		--sfondo: #1e1e1e;
		--testo: #e8e8e8;
		--bordo: #555;
		--accento: #aaa;
		--codice-sfondo: #2d2d2d;
		--tabella-intestazione: #2a2a2a;
	}
	.app[data-tema='vivace'] {
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
		padding: 2.5rem clamp(1.25rem, 5vw, 3.5rem);
		overflow-y: auto;
		line-height: 1.6;
		font-size: 1.05rem;
		transition:
			background-color 150ms ease,
			color 150ms ease;
	}
	.slide :global(h1),
	.slide :global(h2),
	.slide :global(p),
	.slide :global(ul),
	.slide :global(ol) {
		max-width: 44rem;
	}
	.slide :global(h1) {
		font-size: 1.9rem;
		line-height: 1.25;
		margin: 0 0 1rem;
		letter-spacing: -0.01em;
	}
	.slide :global(h2) {
		font-size: 1.45rem;
		line-height: 1.3;
		margin: 1.5rem 0 0.75rem;
	}
	.slide :global(p),
	.slide :global(li) {
		margin: 0 0 0.6rem;
	}
	.app[data-tema='scuro'] .slide :global(.hljs),
	.app[data-tema='vivace'] .slide :global(.hljs) {
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
		background: transparent;
		border: none;
		border-radius: 12px;
		font-size: 1.8rem;
		line-height: 1;
		cursor: pointer;
		padding: 0 0.5rem;
		min-width: 44px;
		min-height: 44px;
		align-self: center;
		color: var(--accento);
		transition:
			background-color 150ms ease,
			transform 150ms ease;
	}
	.zona:hover {
		background: var(--codice-sfondo);
	}
	.zona:active {
		transform: scale(0.94);
	}
	.zona:focus-visible,
	.barra button:focus-visible,
	.barra select:focus-visible {
		outline: 2px solid var(--accento);
		outline-offset: 2px;
	}
	.contatore {
		position: absolute;
		bottom: 0.75rem;
		right: 1rem;
		margin: 0;
		padding: 0.15rem 0.7rem;
		border-radius: 999px;
		background: var(--codice-sfondo);
		color: var(--accento);
		font-size: 0.85rem;
		font-weight: 600;
	}
	.barra {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}
	.barra button,
	.barra select {
		padding: 0.5rem 0.9rem;
		min-height: 44px;
		border: 1px solid var(--bordo);
		border-radius: 999px;
		background: var(--sfondo);
		color: var(--testo);
		font-size: 0.9rem;
		cursor: pointer;
		transition:
			background-color 150ms ease,
			border-color 150ms ease;
	}
	.barra button:hover,
	.barra select:hover {
		border-color: var(--accento);
	}
	.tema {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		color: var(--testo);
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
