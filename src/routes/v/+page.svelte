<script lang="ts">
	import Visualizzatore from '../../lib/Visualizzatore.svelte';
	import { ESEMPIO, decodifica, splitSlides } from '../../lib/slides';

	let testo = $state(ESEMPIO);

	const suBrowser = typeof window !== 'undefined';

	if (suBrowser && location.hash.length > 1) {
		const daUrl = decodifica(location.hash.slice(1));
		if (daUrl !== null) testo = daUrl;
	}

	const slides = $derived(splitSlides(testo));
</script>

<svelte:head>
	<title>Presentazione · mdpresenter</title>
</svelte:head>

<Visualizzatore {slides} />
