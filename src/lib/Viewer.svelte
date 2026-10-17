<script lang="ts">
	import DOMPurify from 'dompurify';
	import 'highlight.js/styles/github.css';
	import { resolve } from '$app/paths';
	import { Check, ChevronLeft, ChevronRight, FileDown, Link2, Maximize, Minimize } from 'lucide-svelte';
	import { preferences } from './shared.svelte';
	import { texts } from './i18n';
	import { renderMarkdown } from './markdown';
	import { encode } from './slides';

	let { slides }: { slides: string[] } = $props();
	const t = $derived(texts[preferences.language]);

	let index = $state(0);
	let startX = $state<number | null>(null);
	let container: HTMLDivElement | undefined = $state();
	let fullscreen = $state(false);

	const isBrowser = typeof window !== 'undefined';

	const total = $derived(slides.length);
	const current = $derived(slides[Math.min(index, total - 1)] ?? '');
	// HTML computed in $effect (not $derived): isBrowser is not reactive and
	// the empty prerendered {@html} would not update on hydration.
	let html = $state('');
	let allHtml: string[] = $state([]);
	$effect(() => {
		const c = current;
		const ss = slides;
		if (!isBrowser) return;
		html = DOMPurify.sanitize(renderMarkdown(c));
		allHtml = ss.map((s) => DOMPurify.sanitize(renderMarkdown(s)));
	});

	$effect(() => {
		if (index > total - 1) index = Math.max(total - 1, 0);
	});

	function next() {
		if (index < total - 1) index += 1;
	}

	function prev() {
		if (index > 0) index -= 1;
	}

	function handleKey(e: KeyboardEvent) {
		const target = e.target as HTMLElement | null;
		if (target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')) return;
		if (e.key === 'ArrowRight') next();
		if (e.key === 'ArrowLeft') prev();
	}

	async function toggleFullscreen() {
		if (!isBrowser || !container) return;
		if (document.fullscreenElement) await document.exitFullscreen();
		else await container.requestFullscreen();
	}

	function print() {
		if (isBrowser) window.print();
	}

	let copied = $state(false);
	let showLink = $state(false);
	let manualLink = $state('');

	async function copyLink() {
		if (!isBrowser) return;
		showLink = false;
		const url =
			location.origin + resolve('/v') + '#' + (await encode(slides.join('\n---\n')));
		try {
			await navigator.clipboard.writeText(url);
			copied = true;
			window.setTimeout(() => (copied = false), 2000);
		} catch {
			manualLink = url;
			showLink = true;
		}
	}
</script>

<svelte:window
	onkeydown={handleKey}
	onfullscreenchange={() => (fullscreen = isBrowser && !!document.fullscreenElement)}
/>

<div class="app">
<div class="toolbar">
	<button onclick={toggleFullscreen} aria-label={fullscreen ? t.toolbar.exitFullscreen : t.toolbar.fullscreen}>
		{#if fullscreen}<Minimize size={18} />{:else}<Maximize size={18} />{/if}
		<span>{t.toolbar.screen}</span>
	</button>
	<button onclick={print} aria-label="Esporta PDF">
		<FileDown size={18} />
		<span>{t.toolbar.pdf}</span>
	</button>
	<button onclick={copyLink} aria-label={t.sharing.copy}>
		{#if copied}<Check size={18} />{:else}<Link2 size={18} />{/if}
		<span>{copied ? t.sharing.copied : t.sharing.copy}</span>
	</button>
</div>
{#if showLink}
	<div class="manual-link">
		<label>
			{t.sharing.manual}
			<input readonly value={manualLink} onfocus={(e) => e.currentTarget.select()} />
		</label>
	</div>
{/if}
<div class="viewer" bind:this={container}>
	<button class="navbtn left" onclick={prev} aria-label={t.previousSlide}>
		<ChevronLeft size={28} />
	</button>
	<div
		class="slide"
		role="region"
		aria-label={t.currentSlide}
		ontouchstart={(e) => (startX = e.touches[0].clientX)}
		ontouchend={(e) => {
			if (startX === null) return;
			const dx = e.changedTouches[0].clientX - startX;
			startX = null;
			if (dx < -40) next();
			if (dx > 40) prev();
		}}
	>
		{@html html}
	</div>
	<button class="navbtn right" onclick={next} aria-label={t.nextSlide}>
		<ChevronRight size={28} />
	</button>
	<p class="counter">{index + 1}/{total}</p>
</div>
<div class="print" aria-hidden="true">
	{#each allHtml as h}
		<div class="print-page">{@html h}</div>
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
		color: var(--text);
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
	.navbtn {
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
	.navbtn:hover {
		background: var(--codice-sfondo);
	}
	.navbtn:active {
		transform: scale(0.94);
	}
	.navbtn:focus-visible,
	.toolbar button:focus-visible {
		outline: 2px solid var(--accento);
		outline-offset: 2px;
	}
	.counter {
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
	.toolbar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}
	.toolbar button {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.5rem 0.9rem;
		min-height: 44px;
		border: 1px solid var(--bordo);
		border-radius: 999px;
		background: var(--sfondo);
		color: var(--text);
		font-size: 0.9rem;
		cursor: pointer;
		transition:
			background-color 150ms ease,
			border-color 150ms ease;
	}
	.toolbar button:hover {
		border-color: var(--accento);
	}
	.manual-link {
		margin-bottom: 0.75rem;
	}
	.manual-link label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.9rem;
		color: var(--text);
	}
	.manual-link input {
		padding: 0.5rem 0.8rem;
		border: 1px solid var(--bordo);
		border-radius: 8px;
		background: var(--superficie);
		color: var(--text);
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
	.print {
		display: none;
	}
</style>
