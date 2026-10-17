<script lang="ts">
	import { resolve } from '$app/paths';
	import { preferences } from '../lib/shared.svelte';
	import { texts } from '../lib/i18n';

	const t = $derived(texts[preferences.language]);
</script>

<svelte:head>
	<title>404 · mdpresenter</title>
</svelte:head>

<h1>{t.error.title}</h1>
<p>{t.error.text}</p>
<p><a href={resolve('/')}>{t.error.home}</a></p>

<style>
	h1 {
		font-size: 1.6rem;
	}
	a {
		color: var(--accent);
		font-weight: 600;
	}
</style>
