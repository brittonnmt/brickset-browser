<script lang="ts">
	import { store } from '$lib/store.svelte';
	import type { LegoSet } from '$lib/types';
	import { formatNumber, formatPrice } from '$lib/formatting';
	import { localPath, filenameFromUrl, cacheImage } from '$lib/imageCache';

	let {
		set,
		onselect,
		onimageclick
	}: {
		set: LegoSet;
		onselect: (set: LegoSet) => void;
		onimageclick?: (set: LegoSet) => void;
	} = $props();
</script>

<tr
	class="set-row"
	draggable="true"
	ondragstart={(e) => e.dataTransfer?.setData('text/plain', String(set.setId))}
	onclick={() => onselect(set)}
>
	<td class="add-col">
		<button
			class="add-btn"
			class:in-list={store.isInList(set.setId)}
			onclick={(e) => {
				e.stopPropagation();
				store.isInList(set.setId) ? store.removeFromList(set.setId) : store.addToList(set);
			}}
			aria-label="Add to list"
			title={store.isInList(set.setId) ? 'In list' : 'Add to list'}
			class:icon-btn={true}
			><i class={store.isInList(set.setId) ? 'fa-solid fa-check' : 'fa-solid fa-plus'}></i></button
		>
	</td>
	<td class="img-cell">
		{#if set.imageUrl}
			{@const filename = filenameFromUrl(set.imageUrl)}
			{@const src = localPath(filename) ?? set.imageUrl}
			<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
			<img
				{src}
				alt={set.name}
				class="thumb"
				class:clickable={!!onimageclick}
				loading="lazy"
				onload={() => cacheImage(set.imageUrl, filename)}
				onerror={(e) => {
					(e.currentTarget as HTMLImageElement).style.display = 'none';
				}}
				onclick={(e) => {
					if (onimageclick) {
						e.stopPropagation();
						onimageclick(set);
					}
				}}
			/>
		{:else}
			<div class="no-img">?</div>
		{/if}
	</td>
	<td class="mono">{set.number}-{set.variant}</td>
	<td class="name-cell">{set.name}</td>
	<td class="right">{set.year ?? '—'}</td>
	<td class="truncate theme-cell">{set.theme || '—'}</td>
	<td class="truncate sub-cell">{set.subtheme || '—'}</td>
	<td class="right">{formatNumber(set.pieces)}</td>
	<td class="right">{formatNumber(set.minifigs)}</td>
	<td class="right price">{formatPrice(set.usRetailPrice)}</td>
	<td class="right bl-cell">
		{#if set.bricklinkSoldPriceUsed !== null || set.bricklinkSoldPriceNew !== null}
			{#if set.bricklinkSoldPriceUsed !== null}
				<div class="bl-row">
					<span class="bl-lbl">Used</span><span class="price"
						>{formatPrice(set.bricklinkSoldPriceUsed)}</span
					>
				</div>
			{/if}
			{#if set.bricklinkSoldPriceNew !== null}
				<div class="bl-row">
					<span class="bl-lbl">New</span><span class="price"
						>{formatPrice(set.bricklinkSoldPriceNew)}</span
					>
				</div>
			{/if}
		{:else}
			<span class="price">—</span>
		{/if}
	</td>
</tr>

<style>
	.add-col {
		width: 28px;
		padding: 0 0.25rem;
	}

	.add-btn {
		width: 20px;
		height: 20px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-border);
		background: var(--color-surface);
		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		color: var(--color-text-muted);
		transition: all var(--transition);
		opacity: 0;
	}

	.set-row:hover .add-btn {
		opacity: 1;
	}

	.add-btn i {
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
		line-height: 0;
	}

	.add-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.add-btn.in-list {
		opacity: 1;
		border-color: var(--color-primary);
		background: var(--color-primary);
		color: white;
	}

	.set-row {
		cursor: pointer;
		transition:
			background-color var(--transition),
			color var(--transition),
			border-color var(--transition);
	}

	.set-row:hover {
		background: var(--color-surface-hover);
	}

	.set-row:hover .name-cell {
		color: var(--color-primary);
	}

	td {
		padding: 0.5rem 0.75rem;
		vertical-align: middle;
	}

	.img-cell {
		width: 56px;
		padding: 0.3rem 0.5rem;
	}

	.thumb {
		display: block;
		width: 48px;
		height: 48px;
		object-fit: contain;
		border-radius: var(--radius-sm);
		background: var(--color-img-bg);
	}

	.thumb.clickable {
		cursor: zoom-in;
	}

	.no-img {
		width: 48px;
		height: 48px;
		background: var(--color-img-bg);
		border-radius: var(--radius-sm);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-muted);
		font-size: 1.2rem;
	}

	.mono {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--color-text-secondary);
		white-space: nowrap;
	}

	.name-cell {
		min-width: 160px;
		max-width: 280px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: 500;
		transition: color var(--transition);
	}

	.theme-cell {
		max-width: 120px;
	}

	.sub-cell {
		max-width: 120px;
		color: var(--color-text-secondary);
	}

	.price {
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
		color: var(--color-success);
		font-weight: 500;
	}

	td.right {
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
		font-size: 0.8rem;
	}

	.bl-cell {
		white-space: nowrap;
	}

	.bl-row {
		display: flex;
		align-items: baseline;
		justify-content: flex-end;
		gap: 0.35rem;
	}

	.bl-lbl {
		font-size: 0.65rem;
		color: var(--color-text-muted);
		font-weight: 500;
	}

	.truncate {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.right {
		text-align: right;
	}
</style>
