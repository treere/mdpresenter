<script lang="ts">
	import DOMPurify from 'dompurify';
	import 'highlight.js/styles/github.css';
	import { resolve } from '$app/paths';
	import { Check, ChevronLeft, ChevronRight, FileDown, Link2, Maximize, Minimize } from 'lucide-svelte';
	import { preferenze } from './condiviso.svelte';
	import { testi } from './i18n';
	import { renderMarkdown } from '../lib/markdown';
	import { codifica } from '../lib/slides';

	let { slides }: { slides: string[] } = $props();
	const t = $derived(testi[preferenze.lingua]);

	let indice = $state(0);
	let xInizio = $state<number | null>(null);
	let contenitore: HTMLDivElement | undefined = $state();
	let schermoIntero = $state(false);

	const suBrowser = typeof window !== 'undefined';

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

	let copiato = $state(false);
	let mostraLink = $state(false);
	const link = $derived(
		suBrowser ? location.origin + resolve('/v') + '#' + codifica(slides.join('\n---\n')) : ''
	);

	async function copiaLink() {
		if (!suBrowser) return;
		mostraLink = false;
		try {
			await navigator.clipboard.writeText(link);
			copiato = true;
			window.setTimeout(() => (copiato = false), 2000);
		} catch {
			mostraLink = true;
		}
	}
</script>

<svelte:window
	onkeydown={tasto}
	onfullscreenchange={() => (schermoIntero = suBrowser && !!document.fullscreenElement)}
/>

<div class="app">
<div class="barra">
	<button onclick={alternaSchermoIntero} aria-label={schermoIntero ? t.barra.esciSchermo : t.barra.schermoIntero}>
		{#if schermoIntero}<Minimize size={18} />{:else}<Maximize size={18} />{/if}
		<span>{t.barra.schermo}</span>
	</button>
	<button onclick={stampa} aria-label="Esporta PDF">
		<FileDown size={18} />
		<span>{t.barra.pdf}</span>
	</button>
	<button onclick={copiaLink} aria-label={t.condivisione.copia}>
		{#if copiato}<Check size={18} />{:else}<Link2 size={18} />{/if}
		<span>{copiato ? t.condivisione.copiato : t.condivisione.copia}</span>
	</button>
</div>
{#if mostraLink}
	<div class="link-manuale">
		<label>
			{t.condivisione.manuale}
			<input readonly value={link} onfocus={(e) => e.currentTarget.select()} />
		</label>
	</div>
{/if}
<div class="viewer" bind:this={contenitore}>
	<button class="zona sinistra" onclick={indietro} aria-label={t.slidePrecedente}>
		<ChevronLeft size={28} />
	</button>
	<div
		class="slide"
		role="region"
		aria-label={t.slideCorrente}
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
	<button class="zona destra" onclick={avanti} aria-label={t.slideSuccessiva}>
		<ChevronRight size={28} />
	</button>
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
		grid-template-columns: 44px 1fr 44px;
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
	.slide :global(.hljs) {
		background: var(--codice-sfondo);
		color: var(--hl-base);
	}
	.slide :global(.hljs-keyword),
	.slide :global(.hljs-selector-tag) {
		color: var(--hl-keyword);
	}
	.slide :global(.hljs-string),
	.slide :global(.hljs-regexp),
	.slide :global(.hljs-addition) {
		color: var(--hl-string);
	}
	.slide :global(.hljs-comment),
	.slide :global(.hljs-quote) {
		color: var(--hl-comment);
	}
	.slide :global(.hljs-title),
	.slide :global(.hljs-title-function_),
	.slide :global(.hljs-section) {
		color: var(--hl-title);
	}
	.slide :global(.hljs-number),
	.slide :global(.hljs-literal) {
		color: var(--hl-number);
	}
	.slide :global(.hljs-built_in),
	.slide :global(.hljs-attr),
	.slide :global(.hljs-attribute) {
		color: var(--hl-builtin);
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
	.barra button:focus-visible {
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
	.barra button {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
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
	.barra button:hover {
		border-color: var(--accento);
	}
	.link-manuale {
		margin-bottom: 0.75rem;
	}
	.link-manuale label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.9rem;
		color: var(--testo);
	}
	.link-manuale input {
		padding: 0.5rem 0.8rem;
		border: 1px solid var(--bordo);
		border-radius: 8px;
		background: var(--superficie);
		color: var(--testo);
		font-size: 0.85rem;
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
