<script lang="ts">
	import { preferenze } from '../../lib/condiviso.svelte';
	import { testi } from '../../lib/i18n';

	const t = $derived(testi[preferenze.lingua]);
</script>

<svelte:head>
	<title>{t.progetto.titolo} · mdpresenter</title>
</svelte:head>

<h1>{t.progetto.titolo}</h1>

{#each t.progetto.righe as riga}
	<p>{riga}</p>
{/each}

<p>
	<a href="https://github.com/treere/mdpresenter">{t.progetto.repo}</a>
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
		color: var(--accento);
		font-weight: 600;
	}
</style>
