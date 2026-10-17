<script lang="ts">
	import favicon from '#lib/assets/favicon.svg';
	import { resolve } from '$app/paths';
	import { Menu, X } from 'lucide-svelte';
	import { preferences } from '../lib/shared.svelte';
	import { texts, type Language, type Theme } from '../lib/i18n';
	import type { LayoutProps } from './$types';
	import '../print.css';
	import '../theme.css';

	let { children }: LayoutProps = $props();
	let menuAperto = $state(false);

	const isBrowser = typeof window !== 'undefined';
	const t = $derived(texts[preferences.language]);

	if (isBrowser) {
		const language = localStorage.getItem('mdpresenter-language');
		if (language === 'it' || language === 'en') preferences.language = language;
		const theme = localStorage.getItem('mdpresenter-theme');
		if (theme === 'light' || theme === 'dark' || theme === 'vivid') preferences.theme = theme;
	}

	$effect(() => {
		if (!isBrowser) return;
		document.documentElement.dataset.theme = preferences.theme;
		document.documentElement.lang = preferences.language;
		localStorage.setItem('mdpresenter-theme', preferences.theme);
		localStorage.setItem('mdpresenter-language', preferences.language);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="description" content={t.metaDescription} />
</svelte:head>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') menuAperto = false;
	}}
/>

<div class="site">
	<header data-aperto={menuAperto}>
		<a class="brand" href={resolve('/')}>mdpresenter</a>
		<button
			class="menu-button"
			onclick={() => (menuAperto = !menuAperto)}
			aria-expanded={menuAperto}
			aria-label="Menu"
		>
			{#if menuAperto}<X size={22} />{:else}<Menu size={22} />{/if}
		</button>
		<div class="menu">
		<nav aria-label="Pagine">
			<a href={resolve('/')} onclick={() => (menuAperto = false)}>{t.nav.home}</a>
			<a href={resolve('/examples')} onclick={() => (menuAperto = false)}>{t.nav.examples}</a>
			<a href={resolve('/about')} onclick={() => (menuAperto = false)}>{t.nav.about}</a>
		</nav>
		<div class="controls">
			<label>
				<span class="visually-hidden">{t.language}</span>
				<select
					aria-label={t.language}
					value={preferences.language}
					onchange={(e) => (preferences.language = e.currentTarget.value as Language)}
				>
					<option value="it">IT</option>
					<option value="en">EN</option>
				</select>
			</label>
			<label>
				<span class="visually-hidden">{t.theme}</span>
				<select
					aria-label={t.theme}
					value={preferences.theme}
					onchange={(e) => (preferences.theme = e.currentTarget.value as Theme)}
				>
					<option value="light">{t.themes.light}</option>
					<option value="dark">{t.themes.dark}</option>
					<option value="vivid">{t.themes.vivid}</option>
				</select>
			</label>
		</div>
		</div>
	</header>

	<div class="content">
		{@render children()}
	</div>

	<footer>
		<a href="https://github.com/treere/mdpresenter">{t.footer}</a>
	</footer>
</div>

<style>
	.site {
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
	.menu-button {
		display: none;
	}
	.brand {
		font-weight: 800;
		font-size: 1.1rem;
		text-decoration: none;
		color: var(--text);
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
		color: var(--text-muted);
		font-weight: 600;
	}
	header nav a:hover {
		color: var(--text);
		background: var(--code-bg);
	}
	.controls {
		margin-left: auto;
		display: flex;
		gap: 0.5rem;
	}
	.controls select {
		padding: 0.5rem 0.7rem;
		min-height: 44px;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: var(--surface);
		color: var(--text);
		cursor: pointer;
	}
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}
	.content {
		flex: 1;
	}
	footer {
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border);
		text-align: center;
	}
	footer a {
		color: var(--text-muted);
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
		.menu-button {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			margin-left: auto;
			width: 44px;
			height: 44px;
			border: 1px solid var(--border);
			border-radius: 12px;
			background: var(--surface);
			color: var(--text);
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
		.controls {
			margin-left: 0;
		}
		header nav a {
			padding: 0.5rem;
		}
	}
</style>
