<script lang="ts">
	import { preferences } from '../../lib/shared.svelte';
	import { texts } from '../../lib/i18n';

	const t = $derived(texts[preferences.language]);
</script>

<svelte:head>
	<title>{t.about.title} · mdpresenter</title>
</svelte:head>

<h1>{t.about.title}</h1>

{#each t.about.paragraphs as riga}
	<p>{riga}</p>
{/each}

<p>
	<a href="https://github.com/treere/mdpresenter">{t.about.repository}</a>
</p>

<style>
	h1 {
		font-size: 1.6rem;
		margin: 0 0 1rem;
	}
	p {
		max-width: 44rem;
		line-height: 1.6;
	}
	a {
		color: var(--accent);
		font-weight: 600;
	}
</style>
