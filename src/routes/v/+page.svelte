<script lang="ts">
	import Viewer from '../../lib/Viewer.svelte';
	import { SAMPLE, decode, splitSlides } from '../../lib/slides';

	let text = $state(SAMPLE);

	const suBrowser = typeof window !== 'undefined';

	if (suBrowser && location.hash.length > 1) {
		void decode(location.hash.slice(1)).then((daUrl) => {
			if (daUrl !== null) text = daUrl;
		});
	}

	const slides = $derived(splitSlides(text));
</script>

<svelte:head>
	<title>Presentazione · mdpresenter</title>
</svelte:head>

<Viewer {slides} />
