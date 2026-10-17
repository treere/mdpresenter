<script lang="ts">
	import { BookOpen } from 'lucide-svelte';
	import { resolve } from '$app/paths';
	import { pending, preferences } from '../../lib/shared.svelte';
	import { EXAMPLES } from '../../lib/examples';
	import { texts } from '../../lib/i18n';

	const t = $derived(texts[preferences.language]);
	const examples = $derived(EXAMPLES[preferences.language]);
</script>

<svelte:head>
	<title>{t.examples.title} · mdpresenter</title>
</svelte:head>

<h1>{t.examples.title}</h1>
<p>{t.examples.intro}</p>

<ul>
	{#each examples as e}
		<li>
			<strong>{e.title}</strong>
			<span>{e.description}</span>
			<a href={resolve('/')} onclick={() => (pending.textToOpen = e.text)}>
				<BookOpen size={16} />
				{t.examples.open}
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
		color: var(--text-debole);
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
		color: var(--text-debole);
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
