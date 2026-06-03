<script lang="ts">
	import { tick } from 'svelte';
	import { store } from '$lib/store.svelte';
	import type { LegoSet, SortField } from '$lib/types';
	import SetTableRow from './SetTableRow.svelte';

	let tableWrap = $state<HTMLDivElement | null>(null);

	$effect(() => {
		store.page; // subscribe to page changes
		tick().then(() => tableWrap?.scrollTo({ top: 0 }));
	});

	let {
		onselect,
		onimageclick
	}: {
		onselect: (set: LegoSet) => void;
		onimageclick?: (set: LegoSet) => void;
	} = $props();

	const columns: { label: string; field: SortField; align?: 'right' | 'center' }[] = [
		{ label: '', field: 'imageUrl' },
		{ label: 'ID', field: 'number' },
		{ label: 'Name', field: 'name' },
		{ label: 'Year', field: 'year', align: 'right' },
		{ label: 'Theme', field: 'theme' },
		{ label: 'Subtheme', field: 'subtheme' },
		{ label: '# Pieces', field: 'pieces', align: 'right' },
		{ label: '# Minifigs', field: 'minifigs', align: 'right' },
		{ label: 'Retail', field: 'usRetailPrice', align: 'right' },
		{ label: 'BrickLink', field: 'bricklinkSoldPriceUsed', align: 'right' }
	];

	const blFields: SortField[] = ['bricklinkSoldPriceUsed', 'bricklinkSoldPriceNew'];
	const blActive = $derived(blFields.includes(store.sort.field));
	let blPopoverOpen = $state(false);

	function openBlPopover(e: MouseEvent) {
		e.stopPropagation();
		blPopoverOpen = !blPopoverOpen;
	}

	function onWindowClick() {
		blPopoverOpen = false;
	}

	function sortBl(field: SortField) {
		store.setSort(field);
		blPopoverOpen = false;
	}

	function sortDir(field: SortField) {
		if (store.sort.field !== field) return null;
		return store.sort.direction;
	}

	let pageKeyRepeats = 0;

	function onKeydown(e: KeyboardEvent) {
		if (!tableWrap) return;
		if (e.key === 'PageDown' || e.key === 'PageUp') {
			e.preventDefault();
			if (e.repeat) {
				pageKeyRepeats++;
			} else {
				pageKeyRepeats = 0;
			}
			// accelerate: start at 90% viewport, ramp up to 3× after ~20 repeats
			const multiplier = e.repeat ? Math.min(1 + pageKeyRepeats * 0.1, 3) : 1;
			const amount = tableWrap.clientHeight * 0.9 * multiplier;
			const behavior = e.repeat ? 'instant' : 'smooth';
			tableWrap.scrollBy({ top: e.key === 'PageDown' ? amount : -amount, behavior });
		} else if (e.key === 'Home') {
			e.preventDefault();
			tableWrap.scrollTo({ top: 0, behavior: 'smooth' });
		} else if (e.key === 'End') {
			e.preventDefault();
			tableWrap.scrollTo({ top: tableWrap.scrollHeight, behavior: 'smooth' });
		}
	}

	function onKeyup(e: KeyboardEvent) {
		if (e.key === 'PageDown' || e.key === 'PageUp') pageKeyRepeats = 0;
	}
</script>

<svelte:window onclick={onWindowClick} onkeydown={onKeydown} onkeyup={onKeyup} />

<div class="table-wrap" bind:this={tableWrap}>
	<table>
		<thead>
			<tr>
				<th class="add-col"></th>
				{#each columns as col}
					{#if col.field === 'bricklinkSoldPriceUsed'}
						<!-- svelte-ignore a11y_interactive_supports_focus -->
						<th
							class="sortable right bl-th"
							class:active={blActive}
							onclick={openBlPopover}
							role="columnheader"
						>
							BrickLink
							<span class="sort-arrow">
								{#if blActive}{sortDir(store.sort.field) === 'asc' ? '↑' : '↓'}{:else}⇅{/if}
							</span>
							{#if blPopoverOpen}
								<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
								<div class="bl-popover" onclick={(e) => e.stopPropagation()}>
									<button
										class:active={store.sort.field === 'bricklinkSoldPriceUsed'}
										onclick={() => sortBl('bricklinkSoldPriceUsed')}
									>
										Used {store.sort.field === 'bricklinkSoldPriceUsed'
											? store.sort.direction === 'asc'
												? '↑'
												: '↓'
											: ''}
									</button>
									<button
										class:active={store.sort.field === 'bricklinkSoldPriceNew'}
										onclick={() => sortBl('bricklinkSoldPriceNew')}
									>
										New {store.sort.field === 'bricklinkSoldPriceNew'
											? store.sort.direction === 'asc'
												? '↑'
												: '↓'
											: ''}
									</button>
								</div>
							{/if}
						</th>
					{:else}
						<th
							class:sortable={col.field !== 'imageUrl'}
							class:active={store.sort.field === col.field}
							class:right={col.align === 'right'}
							class:center={col.align === 'center'}
							onclick={() => col.field !== 'imageUrl' && store.setSort(col.field)}
						>
							{col.label}
							{#if col.field !== 'imageUrl'}
								<span class="sort-arrow">
									{#if sortDir(col.field) === 'asc'}↑{:else if sortDir(col.field) === 'desc'}↓{:else}⇅{/if}
								</span>
							{/if}
						</th>
					{/if}
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each store.currentPage as set (set.setId)}
				<SetTableRow {set} {onselect} {onimageclick} />
			{:else}
				<tr>
					<td colspan={columns.length} class="empty-row"> No sets match your filters. </td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.table-wrap {
		overflow-x: auto;
		overflow-y: auto;
		flex: 1;
		scrollbar-width: thin;
		scrollbar-color: var(--color-border) transparent;
	}

	.table-wrap::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	.table-wrap::-webkit-scrollbar-track {
		background: transparent;
	}

	.table-wrap::-webkit-scrollbar-thumb {
		background: var(--color-border);
		border-radius: 4px;
	}

	.table-wrap::-webkit-scrollbar-thumb:hover {
		background: var(--color-text-muted);
	}

	.table-wrap::-webkit-scrollbar-corner {
		background: transparent;
	}

	.add-col {
		width: 28px;
		padding: 0 0.25rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
		background: var(--color-surface);
	}

	thead {
		position: sticky;
		top: 0;
		z-index: 1;
	}

	th {
		background: var(--color-header-bg);
		padding: 0.6rem 0.75rem;
		text-align: left;
		font-weight: 600;
		font-size: 0.8rem;
		white-space: nowrap;
		color: var(--color-text);
		border-bottom: 2px solid var(--color-border);
		user-select: none;
	}

	th.sortable {
		cursor: pointer;
	}

	th.sortable:hover {
		background: var(--color-header-hover);
	}

	th.active {
		background: var(--color-header-active);
		color: var(--color-primary-dark);
	}

	th.right {
		text-align: right;
	}

	.sort-arrow {
		margin-left: 4px;
		font-size: 0.7rem;
		color: var(--color-text-muted);
	}

	th.active .sort-arrow {
		color: var(--color-primary);
	}

	tr {
		border-bottom: 1px solid var(--color-border);
	}

	tbody tr:last-child {
		border-bottom: none;
	}

	.bl-th {
		position: relative;
	}

	.bl-popover {
		position: absolute;
		top: calc(100% + 4px);
		right: 0;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-md);
		display: flex;
		flex-direction: column;
		min-width: 110px;
		z-index: 20;
		overflow: hidden;
	}

	.bl-popover button {
		padding: 0.45rem 0.75rem;
		text-align: left;
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--color-text);
		background: none;
		border: none;
		border-bottom: 1px solid var(--color-border);
		transition:
			background-color var(--transition),
			color var(--transition),
			border-color var(--transition);
	}

	.bl-popover button:last-child {
		border-bottom: none;
	}

	.bl-popover button:hover {
		background: var(--color-surface-hover);
	}

	.bl-popover button.active {
		color: var(--color-primary);
		background: var(--color-primary-subtle);
	}

	.empty-row {
		text-align: center;
		padding: 3rem 1rem;
		color: var(--color-text-muted);
		font-style: italic;
	}
</style>
