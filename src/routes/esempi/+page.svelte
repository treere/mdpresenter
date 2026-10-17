<script lang="ts">
	import { BookOpen } from 'lucide-svelte';
	import { resolve } from '$app/paths';
	import { appoggio, preferenze } from '../../lib/condiviso.svelte';
	import { ESEMPI } from '../../lib/esempi';
	import { testi } from '../../lib/i18n';

	const t = $derived(testi[preferenze.lingua]);
	const esempi = $derived(ESEMPI[preferenze.lingua]);
</script>

<svelte:head>
	<title>{t.esempi.titolo} · mdpresenter</title>
</svelte:head>

<h1>{t.esempi.titolo}</h1>
<p>{t.esempi.intro}</p>

<ul>
	{#each esempi as e}
		<li>
			<strong>{e.titolo}</strong>
			<span>{e.descrizione}</span>
			<a href={resolve('/')} onclick={() => (appoggio.testoDaAprire = e.testo)}>
				<BookOpen size={16} />
				{t.esempi.apri}
			</a>
		</li>
	{/each}
</ul>

<style>
	h1 {
		font-size: 1.6rem;
		margin: 0 0 0.5rem;
	}
	p {
		color: var(--testo-debole);
		margin: 0 0 1.5rem;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
	}
	li {
		border: 1px solid var(--bordo);
		border-radius: 16px;
		padding: 1.25rem;
		background: var(--superficie);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	li span {
		color: var(--testo-debole);
		flex: 1;
	}
	a {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--accento);
		font-weight: 600;
		text-decoration: none;
	}
</style>
