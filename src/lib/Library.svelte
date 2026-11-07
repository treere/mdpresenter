<script lang="ts">
	import { Check, Pencil, Trash2, X } from 'lucide-svelte';
	import { preferences } from './shared.svelte';
	import { texts } from './i18n';
	import { sortedPresentations, type Library } from './library';

	let {
		library,
		currentId,
		onopen,
		onrename,
		ondelete
	}: {
		library: Library;
		currentId: string | null;
		onopen: (id: string) => void;
		onrename: (id: string, name: string) => void;
		ondelete: (id: string) => void;
	} = $props();

	const t = $derived(texts[preferences.language]);
	const items = $derived(sortedPresentations(library));
	let renaming = $state<string | null>(null);
	let draft = $state('');
	let confirming = $state<string | null>(null);

	const rtf = $derived(new Intl.RelativeTimeFormat(preferences.language, { numeric: 'auto' }));
	const UNITS: ReadonlyArray<readonly [Intl.RelativeTimeFormatUnit, number]> = [
		['year', 31_536_000_000],
		['month', 2_592_000_000],
		['week', 604_800_000],
		['day', 86_400_000],
		['hour', 3_600_000],
		['minute', 60_000]
	];

	function when(timestamp: number): string {
		const diff = timestamp - Date.now();
		for (const [unit, ms] of UNITS) {
			if (Math.abs(diff) >= ms) return rtf.format(Math.round(diff / ms), unit);
		}
		return rtf.format(0, 'minute');
	}

	function startRename(id: string, name: string): void {
		renaming = id;
		draft = name;
		confirming = null;
	}

	function commitRename(): void {
		if (renaming === null) return;
		onrename(renaming, draft);
		renaming = null;
	}
</script>

{#if !library.unavailable}
	<details class="library" open={items.length > 0}>
		<summary>
			<span>{t.library.title}</span>
			<span class="count">{items.length}</span>
		</summary>
		{#if library.corrupt}
			<p class="warning" role="status">{t.library.corrupt}</p>
		{/if}
		{#if items.length === 0}
			<p class="empty">{t.library.empty}</p>
		{:else}
			<ul>
				{#each items as item (item.id)}
					<li class:current={item.id === currentId}>
						{#if renaming === item.id}
							<input
								bind:value={draft}
								aria-label={t.library.rename}
								onkeydown={(event) => {
									if (event.key === 'Enter') commitRename();
									if (event.key === 'Escape') renaming = null;
								}}
							/>
							<button title={t.library.save} aria-label={t.library.save} onclick={commitRename}>
								<Check size={16} />
							</button>
							<button title={t.library.cancel} aria-label={t.library.cancel} onclick={() => (renaming = null)}>
								<X size={16} />
							</button>
						{:else}
							<button class="name" onclick={() => onopen(item.id)}>
								<span class="label">{item.name}</span>
								<span class="when">{when(item.updatedAt)}</span>
							</button>
							<button
								title={t.library.rename}
								aria-label={t.library.rename}
								onclick={() => startRename(item.id, item.name)}
							>
								<Pencil size={16} />
							</button>
							{#if confirming === item.id}
								<button class="danger" onclick={() => { confirming = null; ondelete(item.id); }}>
									{t.library.confirm}
								</button>
								<button onclick={() => (confirming = null)}>{t.library.cancel}</button>
							{:else}
								<button
									title={t.library.delete}
									aria-label={t.library.delete}
									onclick={() => { confirming = item.id; renaming = null; }}
								>
									<Trash2 size={16} />
								</button>
							{/if}
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</details>
{/if}

<style>
	.library {
		margin-bottom: 1rem;
		border: 1px solid var(--border);
		border-radius: 16px;
		background: var(--surface);
	}
	summary {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		min-height: 44px;
		font-weight: 600;
		cursor: pointer;
		list-style: none;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	.count {
		margin-left: auto;
		padding: 0 0.5rem;
		border-radius: 999px;
		background: var(--code-bg);
		color: var(--text-muted);
		font-size: 0.85rem;
	}
	ul {
		margin: 0;
		padding: 0 0.5rem 0.5rem;
		list-style: none;
	}
	li {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem;
		border-radius: 12px;
	}
	li.current {
		background: color-mix(in srgb, var(--accent) 12%, transparent);
	}
	li button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 44px;
		min-height: 44px;
		border: none;
		border-radius: 10px;
		background: transparent;
		color: var(--text-muted);
		font-size: 0.9rem;
		cursor: pointer;
	}
	li button:hover {
		background: var(--code-bg);
		color: var(--text);
	}
	li button.danger {
		color: #c0392b;
		font-weight: 600;
	}
	.name {
		flex: 1;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.1rem;
		padding: 0.4rem 0.6rem;
		color: var(--text);
		text-align: left;
	}
	.label {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: 600;
	}
	.when {
		font-size: 0.8rem;
		color: var(--text-muted);
	}
	input {
		flex: 1;
		min-height: 44px;
		padding: 0.4rem 0.6rem;
		border: 1px solid var(--accent);
		border-radius: 10px;
		background: var(--surface);
		color: var(--text);
		font: inherit;
	}
	.empty,
	.warning {
		margin: 0;
		padding: 0 1rem 0.9rem;
		color: var(--text-muted);
		font-size: 0.9rem;
	}
	.warning {
		color: #c0392b;
	}
</style>
