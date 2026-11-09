<script lang="ts">
	import { Bold } from 'lucide-svelte';
	import type { FormatActionId } from './editing';

	/**
	 * One button of the bar: what it does, how it looks, what it says. The page builds the list,
	 * so the bar carries no state and never touches the editor. Icons are lucide components,
	 * typed by one of them: they all take the same props.
	 */
	export type FormatAction = {
		id: FormatActionId;
		icon: typeof Bold;
		label: string;
		title: string;
		group: 'inline' | 'blocks' | 'structure';
	};

	let {
		actions,
		label,
		onaction
	}: {
		actions: FormatAction[];
		label: string;
		onaction: (id: FormatActionId) => void;
	} = $props();

	/** Fixed order: the visual grouping follows it, whatever order the actions arrive in. */
	const groups = ['inline', 'blocks', 'structure'] as const;
</script>

<div class="format-bar" role="toolbar" aria-label={label}>
	{#each groups as group (group)}
		{#if actions.some((action) => action.group === group)}
			{#if group !== 'inline'}<span class="divider" aria-hidden="true"></span>{/if}
			<div class="group">
				{#each actions.filter((action) => action.group === group) as action (action.id)}
					{@const Icon = action.icon}
					<button
						type="button"
						aria-label={action.label}
						title={action.title}
						onclick={() => onaction(action.id)}
					>
						<Icon size={18} />
					</button>
				{/each}
			</div>
		{/if}
	{/each}
</div>

<style>
	.format-bar {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		gap: 0.15rem;
		overflow-x: auto;
		padding: 0.15rem;
		border: 1px solid var(--border);
		border-radius: 12px;
		background: var(--surface);
		scrollbar-width: thin;
	}
	.group {
		display: flex;
		flex: 0 0 auto;
		gap: 0.15rem;
	}
	.divider {
		flex: 0 0 auto;
		width: 1px;
		height: 24px;
		margin: 0 0.3rem;
		background: var(--border);
	}
	button {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		min-width: 44px;
		min-height: 44px;
		border: none;
		border-radius: 8px;
		background: transparent;
		color: var(--text);
		cursor: pointer;
		transition:
			background-color 150ms ease,
			color 150ms ease;
	}
	button:hover {
		background: var(--code-bg);
		color: var(--accent);
	}
	button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: -2px;
	}
</style>
