<script lang="ts">
	import DOMPurify from 'dompurify';
	import 'highlight.js/styles/github.css';
	import { resolve } from '$app/paths';
	import { Check, ChevronLeft, ChevronRight, FileDown, Home, Link2, Maximize, Minimize } from 'lucide-svelte';
	import { preferences } from './shared.svelte';
	import { texts } from './i18n';
	import { tick } from 'svelte';
	import { renderMarkdown } from './markdown';
	import { encode, initialRevealed } from './slides';

	let {
		slides,
		index = $bindable(0),
		showAllSteps = false
	}: { slides: string[]; index?: number; showAllSteps?: boolean } = $props();
	const t = $derived(texts[preferences.language]);

	let startX = $state<number | null>(null);
	let container: HTMLDivElement | undefined = $state();
	let fullscreen = $state(false);

	const isBrowser = typeof window !== 'undefined';

	const total = $derived(slides.length);
	const current = $derived(slides[Math.min(index, total - 1)] ?? '');
	// HTML computed in $effect (not $derived): isBrowser is not reactive and
	// the empty prerendered {@html} would not update on hydration.
	let html = $state('');
	// Print pages hold the whole deck. They are refilled after the last edit, never during it:
	// rebuilding them on every keystroke was most of the typing cost.
	let allHtml: string[] = $state([]);
	let overflowing = $state(false);
	let slideEl: HTMLDivElement | undefined = $state();
	let printEl: HTMLDivElement | undefined = $state();
	let renderSeq = 0;
	let mermaidSeq = 0;
	let renderedHtml = '';
	let renderedTheme = '';
	let builtTheme = '';
	const printCache = new Map<string, string>();
	let printTimer: ReturnType<typeof setTimeout> | undefined;
	let mermaidReady: Promise<unknown> | null = null;

	// Steps: `revealed` is how many are shown; Infinity means all (when coming back to a slide).
	let revealed = $state(0);
	let stepCount = $state(0);
	let revealAllNext = false;
	const shownSteps = $derived(Math.min(revealed, stepCount));
	const hasSteps = $derived(stepCount > 1);

	$effect(() => {
		const c = current;
		// The diagram colours are baked into the SVG, so a theme switch re-renders them too.
		void preferences.theme;
		// Any edit dirties the print pages, also when it lands on a slide that is not the current one.
		void slides.length;
		if (!isBrowser) return;
		html = DOMPurify.sanitize(renderMarkdown(c));
		const mine = ++renderSeq;
		void tick().then(() => {
			checkOverflow();
			// The diagram is redrawn only when the slide HTML or the theme really changed: a
			// keystroke landing on another slide must not re-render this one's diagram.
			const theme = document.documentElement.dataset.theme ?? '';
			if (mine === renderSeq && (html !== renderedHtml || theme !== renderedTheme)) {
				renderedHtml = html;
				renderedTheme = theme;
				// Forced: the HTML is new (or the theme changed), so every block in the slide must redraw.
				void renderMermaid(slideEl, true).then(() => checkOverflow());
			}
		});
		schedulePrintPages();
	});

	// Reset the revealed count on slide change only: a theme switch re-renders, it does not rewind.
	$effect(() => {
		void current;
		if (!isBrowser) return;
		revealed = revealAllNext ? Number.POSITIVE_INFINITY : initialRevealed(current);
		revealAllNext = false;
	});

	// The visibility is applied to the sanitized DOM, so the numbered steps are the ones really rendered.
	$effect(() => {
		void html;
		void revealed;
		void showAllSteps;
		if (!isBrowser) return;
		void tick().then(applySteps);
	});

	function applySteps() {
		if (!slideEl) return;
		const steps = Array.from(slideEl.querySelectorAll<HTMLElement>('.step'));
		stepCount = steps.length;
		for (const [i, el] of steps.entries()) {
			el.classList.toggle('is-hidden', !showAllSteps && i >= revealed);
		}
	}

	async function getMermaid() {
		if (!mermaidReady) {
			mermaidReady = import('mermaid').then((m) => m.default);
		}
		const mermaid = (await mermaidReady) as {
			initialize: (config: Record<string, unknown>) => void;
			render: (id: string, code: string) => Promise<{ svg: string }>;
		};
		const dark = document.documentElement.dataset.theme === 'dark';
		mermaid.initialize({
			startOnLoad: false,
			theme: dark ? 'dark' : 'default',
			htmlLabels: false,
			securityLevel: 'strict'
		});
		return mermaid;
	}

	const diagrams = new Map<string, { id: string; svg: string }>();

	async function renderMermaid(scope: HTMLElement | undefined, force = false) {
		const blocks = Array.from(scope?.querySelectorAll('.mermaid-block') ?? []).filter(
			// Already drawn blocks are left alone: the SVG does not change until the source does.
			(el) => force || !el.firstElementChild
		);
		if (blocks.length === 0) return;
		const theme = document.documentElement.dataset.theme ?? '';
		try {
			const mermaid = await getMermaid();
			for (const el of blocks) {
				const source = decodeURIComponent(el.getAttribute('data-source') ?? '');
				const id = `mermaid-${++mermaidSeq}`;
				const cached = diagrams.get(`${theme}|${source}`);
				if (cached) {
					// Reusing a diagram means reusing its internal ids too: rename them, or two copies
					// of the same source (visible slide and print page) would collide in the document.
					el.innerHTML = DOMPurify.sanitize(cached.svg.split(cached.id).join(id));
					continue;
				}
				try {
					const { svg } = await mermaid.render(id, source);
					diagrams.set(`${theme}|${source}`, { id, svg });
					if (diagrams.size > 40) {
						const oldest = diagrams.keys().next();
						if (!oldest.done) diagrams.delete(oldest.value);
					}
					el.innerHTML = DOMPurify.sanitize(svg);
				} catch {
					el.innerHTML = DOMPurify.sanitize(
						`<div class="mermaid-error"><strong>${t.invalidDiagram}</strong><pre></pre></div>`
					);
					el.querySelector('pre')?.append(document.createTextNode(source));
				}
			}
		} catch {
			// mermaid failed to load: blocks stay empty without breaking the slide
		}
	}

	// Filling the print pages means parsing every slide: deferred after the last edit, and
	// repeated right before the export, so they are never stale and never on the typing path.
	function schedulePrintPages() {
		if (!isBrowser) return;
		clearTimeout(printTimer);
		printTimer = setTimeout(() => {
			printTimer = undefined;
			void buildPrintPages();
		}, 200);
	}

	async function buildPrintPages() {
		const sources = slides;
		// Rendered markdown is cached per slide text: an edit renders the slide it touched, not the deck.
		const pages = sources.map((s) => {
			const cached = printCache.get(s);
			if (cached !== undefined) return cached;
			const rendered = DOMPurify.sanitize(renderMarkdown(s));
			printCache.set(s, rendered);
			return rendered;
		});
		if (printCache.size > pages.length) {
			const live = new Set(sources);
			for (const key of printCache.keys()) if (!live.has(key)) printCache.delete(key);
		}
		allHtml = pages;
		await tick();
		// Pages that really changed have empty blocks: the others keep their diagram. A theme
		// change invalidates all of them, so in that case every block is redrawn.
		const theme = document.documentElement.dataset.theme ?? '';
		const redraw = theme !== builtTheme;
		builtTheme = theme;
		await renderMermaid(printEl, redraw);
	}

	$effect(() => {
		if (index > total - 1) index = Math.max(total - 1, 0);
	});

	function next() {
		if (!showAllSteps && revealed < stepCount) {
			revealed += 1;
			return;
		}
		if (index < total - 1) index += 1;
	}

	function prev() {
		if (!showAllSteps && Number.isFinite(revealed) && revealed > initialRevealed(current)) {
			revealed -= 1;
			return;
		}
		if (index > 0) {
			// A slide we already left is shown again with all of its steps.
			revealAllNext = true;
			index -= 1;
		}
	}

	function handleKey(e: KeyboardEvent) {
		const target = e.target as HTMLElement | null;
		if (target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')) return;
		if (e.key === 'ArrowRight' || e.key === 'PageDown') {
			e.preventDefault();
			next();
		}
		if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
			e.preventDefault();
			prev();
		}
	}

	async function toggleFullscreen() {
		if (!isBrowser || !container) return;
		if (document.fullscreenElement) await document.exitFullscreen();
		else await container.requestFullscreen();
	}

	async function print() {
		if (!isBrowser) return;
		clearTimeout(printTimer);
		printTimer = undefined;
		// The export is the only moment the print pages need fresh HTML and diagrams in the right theme.
		await buildPrintPages();
		await renderMermaid(printEl, true);
		window.print();
	}

	let copied = $state(false);
	let showLink = $state(false);
	let manualLink = $state('');

	function checkOverflow() {
		if (!slideEl) {
			overflowing = false;
			return;
		}
		overflowing = slideEl.scrollHeight > slideEl.clientHeight + 4;
	}

	async function copyLink(fromStart = false) {
		if (!isBrowser) return;
		showLink = false;
		const q = new URLSearchParams();
		q.set('t', await encode(slides.join('\n---\n')));
		q.set('s', String(fromStart ? 0 : index));
		const url = location.origin + resolve('/v') + '?' + q.toString();
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
	onresize={() => checkOverflow()}
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
	<button onclick={() => copyLink(false)} aria-label={t.sharing.copy}>
		{#if copied}<Check size={18} />{:else}<Link2 size={18} />{/if}
		<span>{copied ? t.sharing.copied : t.sharing.copy}</span>
	</button>
	<button onclick={() => copyLink(true)} aria-label={t.sharing.copyFromStart}>
		<Home size={18} />
		<span>{t.sharing.copyFromStart}</span>
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
		bind:this={slideEl}
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
	<p class="counter">{index + 1}/{total}{#if hasSteps && !showAllSteps}<span class="steps-counter" aria-label={`${t.step} ${shownSteps}/${stepCount}`}> · {shownSteps}/{stepCount}</span>{/if}{#if overflowing}<span class="overflow" title={t.overflow}>!</span>{/if}</p>
</div>
<div class="print" bind:this={printEl} aria-hidden="true">
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
		grid-template-rows: minmax(0, 1fr);
		height: 70vh;
		border: none;
		border-radius: 16px;
		overflow: hidden;
		background: var(--background);
		box-shadow:
			0 1px 2px rgb(0 0 0 / 0.06),
			0 8px 24px rgb(0 0 0 / 0.1);
		transition:
			background-color 150ms ease,
			box-shadow 150ms ease;
	}
	.slide {
		background: var(--background);
		color: var(--text);
		min-height: 0;
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
		background: var(--code-bg);
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
		background: var(--code-bg);
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
		border: 1px solid var(--border);
		padding: 0.4rem 0.8rem;
		text-align: left;
	}
	.slide :global(thead) {
		background: var(--table-head);
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
		color: var(--accent);
		transition:
			background-color 150ms ease,
			transform 150ms ease;
	}
	.navbtn:hover {
		background: var(--code-bg);
	}
	.navbtn:active {
		transform: scale(0.94);
	}
	.navbtn:focus-visible,
	.toolbar button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
	.counter {
		position: absolute;
		bottom: 0.75rem;
		right: 1rem;
		margin: 0;
		padding: 0.15rem 0.7rem;
		border-radius: 999px;
		background: var(--code-bg);
		color: var(--accent);
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
		border: 1px solid var(--border);
		border-radius: 999px;
		background: var(--background);
		color: var(--text);
		font-size: 0.9rem;
		cursor: pointer;
		transition:
			background-color 150ms ease,
			border-color 150ms ease;
	}
	.toolbar button:hover {
		border-color: var(--accent);
	}
	:global(.mermaid-error) {
		padding: 1rem;
		border: 1px solid var(--border);
		border-radius: 8px;
		background: var(--code-bg);
	}
	:global(.mermaid-error) :global(pre) {
		margin: 0.5rem 0 0;
		white-space: pre-wrap;
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
		border: 1px solid var(--border);
		border-radius: 8px;
		background: var(--surface);
		color: var(--text);
		font-size: 0.85rem;
	}
	.slide :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 8px;
	}
	/* Steps not shown yet keep their space: nothing moves between one step and the next. */
	.slide :global(.step.is-hidden) {
		visibility: hidden;
	}
	:global(.columns) {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
		gap: 1rem;
	}
	.overflow {
		display: inline-flex;
		margin-left: 0.4rem;
		width: 1.2em;
		height: 1.2em;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: var(--accent);
		color: var(--surface);
		font-weight: 800;
	}
	@media (max-width: 700px) {
		:global(.columns) {
			grid-template-columns: 1fr;
		}
	}
	.viewer:fullscreen {
		background: var(--background);
		padding: 2rem;
		height: 100%;
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
