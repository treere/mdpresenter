<script lang="ts">
	import favicon from '#lib/assets/favicon.svg';
	import { resolve } from '$app/paths';
	import { Menu, X } from 'lucide-svelte';
	import { preferenze } from '../lib/condiviso.svelte';
	import { testi, type Lingua, type Tema } from '../lib/i18n';
	import type { LayoutProps } from './$types';
	import '../stampa.css';
	import '../tema.css';

	let { children }: LayoutProps = $props();
	let menuAperto = $state(false);

	const suBrowser = typeof window !== 'undefined';
	const t = $derived(testi[preferenze.lingua]);

	if (suBrowser) {
		const lingua = localStorage.getItem('mdpresenter-lingua');
		if (lingua === 'it' || lingua === 'en') preferenze.lingua = lingua;
		const tema = localStorage.getItem('mdpresenter-tema');
		if (tema === 'chiaro' || tema === 'scuro' || tema === 'vivace') preferenze.tema = tema;
	}

	$effect(() => {
		if (!suBrowser) return;
		document.documentElement.dataset.tema = preferenze.tema;
		document.documentElement.lang = preferenze.lingua;
		localStorage.setItem('mdpresenter-tema', preferenze.tema);
		localStorage.setItem('mdpresenter-lingua', preferenze.lingua);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="description" content={t.metaDescrizione} />
</svelte:head>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') menuAperto = false;
	}}
/>

<div class="sito">
	<header data-aperto={menuAperto}>
		<a class="marchio" href={resolve('/')}>mdpresenter</a>
		<button
			class="menu-pulsante"
			onclick={() => (menuAperto = !menuAperto)}
			aria-expanded={menuAperto}
			aria-label="Menu"
		>
			{#if menuAperto}<X size={22} />{:else}<Menu size={22} />{/if}
		</button>
		<div class="menu">
		<nav aria-label="Pagine">
			<a href={resolve('/')} onclick={() => (menuAperto = false)}>{t.nav.home}</a>
			<a href={resolve('/esempi')} onclick={() => (menuAperto = false)}>{t.nav.esempi}</a>
			<a href={resolve('/progetto')} onclick={() => (menuAperto = false)}>{t.nav.progetto}</a>
		</nav>
		<div class="scelte">
			<label>
				<span class="nascosto">{t.lingua}</span>
				<select
					aria-label={t.lingua}
					value={preferenze.lingua}
					onchange={(e) => (preferenze.lingua = e.currentTarget.value as Lingua)}
				>
					<option value="it">IT</option>
					<option value="en">EN</option>
				</select>
			</label>
			<label>
				<span class="nascosto">{t.tema}</span>
				<select
					aria-label={t.tema}
					value={preferenze.tema}
					onchange={(e) => (preferenze.tema = e.currentTarget.value as Tema)}
				>
					<option value="chiaro">{t.temi.chiaro}</option>
					<option value="scuro">{t.temi.scuro}</option>
					<option value="vivace">{t.temi.vivace}</option>
				</select>
			</label>
		</div>
		</div>
	</header>

	<div class="contenuto">
		{@render children()}
	</div>

	<footer>
		<a href="https://github.com/treere/mdpresenter">{t.footer}</a>
	</footer>
</div>

<style>
	.sito {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		font-family: system-ui, sans-serif;
	}
	header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}
	.menu-pulsante {
		display: none;
	}
	.marchio {
		font-weight: 800;
		font-size: 1.1rem;
		text-decoration: none;
		color: var(--testo);
	}
	header nav {
		display: flex;
		gap: 0.25rem;
	}
	header nav a {
		padding: 0.5rem 0.8rem;
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		border-radius: 999px;
		text-decoration: none;
		color: var(--testo-debole);
		font-weight: 600;
	}
	header nav a:hover {
		color: var(--testo);
		background: var(--codice-sfondo);
	}
	.scelte {
		margin-left: auto;
		display: flex;
		gap: 0.5rem;
	}
	.scelte select {
		padding: 0.5rem 0.7rem;
		min-height: 44px;
		border: 1px solid var(--bordo);
		border-radius: 999px;
		background: var(--superficie);
		color: var(--testo);
		cursor: pointer;
	}
	.nascosto {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}
	.contenuto {
		flex: 1;
	}
	footer {
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 1px solid var(--bordo);
		text-align: center;
	}
	footer a {
		color: var(--testo-debole);
	}
	@media print {
		header,
		footer {
			display: none;
		}
	}
	.menu {
		display: contents;
	}
	@media (max-width: 700px) {
		header {
			flex-wrap: wrap;
		}
		.menu-pulsante {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			margin-left: auto;
			width: 44px;
			height: 44px;
			border: 1px solid var(--bordo);
			border-radius: 12px;
			background: var(--superficie);
			color: var(--testo);
			cursor: pointer;
		}
		.menu {
			display: none;
			flex-basis: 100%;
			flex-direction: column;
			gap: 0.75rem;
			padding: 0.75rem 0;
		}
		header[data-aperto='true'] .menu {
			display: flex;
		}
		header nav {
			flex-direction: column;
		}
		.scelte {
			margin-left: 0;
		}
		header nav a {
			padding: 0.5rem;
		}
	}
</style>
