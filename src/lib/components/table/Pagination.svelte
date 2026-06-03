<script lang="ts">
	import { store } from '$lib/store.svelte';

	function pages(): (number | '…')[] {
		const total = store.totalPages;
		const cur = store.page;
		if (total <= 21) return Array.from({ length: total }, (_, i) => i + 1);

		const HEAD = 3; // always show first N pages
		const TAIL = 3; // always show last N pages
		const WING = 5; // pages each side of current

		const shown = new Set<number>();
		for (let i = 1; i <= Math.min(HEAD, total); i++) shown.add(i);
		for (let i = Math.max(1, total - TAIL + 1); i <= total; i++) shown.add(i);
		for (let i = Math.max(1, cur - WING); i <= Math.min(total, cur + WING); i++) shown.add(i);

		const sorted = Array.from(shown).sort((a, b) => a - b);
		const result: (number | '…')[] = [];
		for (let i = 0; i < sorted.length; i++) {
			if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('…');
			result.push(sorted[i]);
		}
		return result;
	}
</script>

<nav class="pagination" aria-label="Pagination" class:hidden={store.totalPages <= 1}>
	<button
		class="page-btn arrow"
		disabled={store.page === 1}
		onclick={() => store.setPage(store.page - 1)}
		aria-label="Previous page"
		>‹
	</button>

	{#each pages() as p}
		{#if p === '…'}
			<span class="ellipsis">…</span>
		{:else}
			<button
				class="page-btn"
				class:active={store.page === p}
				onclick={() => store.setPage(p as number)}
				aria-current={store.page === p ? 'page' : undefined}>{p}</button
			>
		{/if}
	{/each}

	<button
		class="page-btn arrow"
		disabled={store.page === store.totalPages}
		onclick={() => store.setPage(store.page + 1)}
		aria-label="Next page"
		>›
	</button>

	<span class="page-info">
		Page {store.page} of {store.totalPages}
	</span>
</nav>

<style>
	.pagination {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		flex-wrap: wrap;
		opacity: 1;
		transition: opacity 200ms ease;
	}

	.pagination.hidden {
		opacity: 0;
		pointer-events: none;
	}

	.page-btn {
		min-width: 32px;
		height: 32px;
		padding: 0 0.4rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		font-size: 0.65rem;
		color: var(--color-text);
		transition: all var(--transition);
		line-height: 1;
	}

	.page-btn:hover:not(:disabled):not(.active) {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.page-btn.active {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: white;
		font-weight: 600;
	}

	.page-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	.arrow {
		font-size: 1.1rem;
	}

	.ellipsis {
		padding: 0 0.25rem;
		color: var(--color-text-muted);
		font-size: 0.85rem;
	}

	.page-info {
		margin-left: 0.5rem;
		font-size: 0.8rem;
		color: var(--color-text-muted);
	}
</style>
