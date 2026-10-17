<script lang="ts">
	import { resolve } from '$app/paths';
	import { preferenze } from '../lib/condiviso.svelte';
	import { testi } from '../lib/i18n';

	const t = $derived(testi[preferenze.lingua]);
</script>

<svelte:head>
	<title>404 · mdpresenter</title>
</svelte:head>

<h1>{t.errore.titolo}</h1>
<p>{t.errore.testo}</p>
<p><a href={resolve('/')}>{t.errore.home}</a></p>

<style>
	h1 {
		font-size: 1.6rem;
	}
	a {
		color: var(--accento);
		font-weight: 600;
	}
</style>
