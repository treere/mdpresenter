<script lang="ts">
	import Viewer from '../../lib/Viewer.svelte';
	import { preferences } from '../../lib/shared.svelte';
	import { texts } from '../../lib/i18n';
	import { SAMPLE, decode, splitSlides } from '../../lib/slides';

	let text = $state(SAMPLE);
	let invalidLink = $state(false);
	const t = $derived(texts[preferences.language]);

	const isBrowser = typeof window !== 'undefined';

	if (isBrowser && location.hash.length > 1) {
		void decode(location.hash.slice(1)).then((decoded) => {
			if (decoded !== null) {
				text = decoded;
			} else {
				text = '';
				invalidLink = true;
			}
		});
	}

	const slides = $derived(splitSlides(text));
</script>

<svelte:head>
	<title>Presentazione · mdpresenter</title>
</svelte:head>

{#if invalidLink}
	<div class="warning" role="alert">
		<strong>{t.invalidLink.title}</strong>
		<span>{t.invalidLink.text}</span>
		<button onclick={() => (invalidLink = false)}>{t.invalidLink.close}</button>
	</div>
{/if}
<Viewer {slides} />

<style>
	.warning {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		margin-bottom: 0.75rem;
		border: 1px solid var(--border);
		border-radius: 12px;
		background: var(--surface);
		color: var(--text);
	}
	.warning button {
		margin-left: auto;
		padding: 0.4rem 0.8rem;
		min-height: 44px;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: transparent;
		color: var(--text);
		cursor: pointer;
	}
</style>
