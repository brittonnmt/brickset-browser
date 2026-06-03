<script lang="ts">
	import { store } from '$lib/store.svelte';
	import type { LegoSet } from '$lib/types';
	import { localPath, filenameFromUrl, cacheImage } from '$lib/imageCache';

	let { onselect }: { onselect: (set: LegoSet) => void } = $props();

	const MIN_WIDTH = 150;
	const MAX_WIDTH = 480;
	const COLLAPSED_WIDTH = 32;
	const DEFAULT_WIDTH = 220;

	let width = $state(parseInt(localStorage.getItem('sidebar-width') ?? String(DEFAULT_WIDTH)));
	let collapsed = $state(localStorage.getItem('sidebar-collapsed') === 'true');
	let resizing = $state(false);
	let startX = 0;
	let startWidth = 0;

	let dragOver = $state(false);

	function onResizeStart(e: MouseEvent) {
		if (collapsed) return;
		resizing = true;
		startX = e.clientX;
		startWidth = width;
		document.body.style.cursor = 'col-resize';
		document.body.style.userSelect = 'none';
		e.preventDefault();
	}

	function onMouseMove(e: MouseEvent) {
		if (!resizing) return;
		width = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth + (e.clientX - startX)));
	}

	function onMouseUp() {
		if (resizing) {
			resizing = false;
			localStorage.setItem('sidebar-width', String(width));
			document.body.style.cursor = '';
			document.body.style.userSelect = '';
		}
	}

	function toggleCollapse() {
		collapsed = !collapsed;
		localStorage.setItem('sidebar-collapsed', String(collapsed));
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault();
		dragOver = true;
	}

	function onDragLeave() {
		dragOver = false;
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		const id = parseInt(e.dataTransfer?.getData('text/plain') ?? '', 10);
		if (!isNaN(id)) {
			const set = store.getById(id);
			if (set) store.addToList(set);
		}
	}
</script>

<svelte:window onmousemove={onMouseMove} onmouseup={onMouseUp} />

<aside
	class="sidebar"
	class:drag-over={dragOver && !collapsed}
	class:collapsed
	class:is-resizing={resizing}
	style="width: {collapsed ? COLLAPSED_WIDTH : width}px"
	ondragover={onDragOver}
	ondragleave={onDragLeave}
	ondrop={onDrop}
	role="region"
	aria-label="My list"
>
	{#if collapsed}
		<div class="collapsed-bar">
			<button
				class="collapse-btn icon-btn"
				onclick={toggleCollapse}
				title="Expand sidebar"
				aria-label="Expand sidebar"
			>
				<i class="fa-solid fa-chevron-right"></i>
			</button>
			{#if store.list.length > 0}
				<span class="list-count-vert">{store.list.length}</span>
			{/if}
		</div>
	{:else}
		<div class="sidebar-header">
			<span class="sidebar-title">List</span>
			{#if store.list.length > 0}
				<span class="list-count">{store.list.length}</span>
				<button class="clear-btn icon-btn" onclick={() => store.clearList()} title="Clear list"
					><i class="fa-solid fa-xmark"></i></button
				>
			{/if}
			<button
				class="collapse-btn icon-btn"
				onclick={toggleCollapse}
				title="Collapse sidebar"
				aria-label="Collapse sidebar"
			>
				<i class="fa-solid fa-chevron-left"></i>
			</button>
		</div>

		{#if store.list.length === 0}
			<div class="empty">
				<p>Drag sets here</p>
			</div>
		{:else}
			<ul class="list-items">
				{#each store.list as set (set.setId)}
					<li class="list-item">
						<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
						<div class="item-body" onclick={() => onselect(set)}>
							{#if set.imageUrl}
								{@const filename = filenameFromUrl(set.imageUrl)}
								{@const src = localPath(filename) ?? set.imageUrl}
								<img
									{src}
									alt={set.name}
									class="item-img"
									onload={() => cacheImage(set.imageUrl, filename)}
									onerror={(e) => {
										(e.currentTarget as HTMLImageElement).style.display = 'none';
									}}
								/>
							{:else}
								<div class="item-img no-img"></div>
							{/if}
							<div class="item-info">
								<span class="item-num">{set.number}-{set.variant}</span>
								<span class="item-name">{set.name}</span>
							</div>
						</div>
						<button
							class="remove-btn icon-btn"
							onclick={() => store.removeFromList(set.setId)}
							aria-label="Remove from list"><i class="fa-solid fa-xmark"></i></button
						>
					</li>
				{/each}
			</ul>
		{/if}

		<!-- Resize handle -->
		<div
			class="resize-handle"
			onmousedown={onResizeStart}
			role="separator"
			aria-label="Resize sidebar"
		></div>
	{/if}
</aside>

<style>
	.sidebar {
		flex-shrink: 0;
		background: var(--color-surface);
		border-right: 1px solid var(--color-border);
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
		position: relative;
		transition:
			width 200ms ease,
			background-color 200ms ease,
			color 200ms ease,
			border-color 200ms ease;
	}

	.sidebar.is-resizing {
		transition:
			background-color 200ms ease,
			color 200ms ease,
			border-color 200ms ease;
		user-select: none;
	}

	.sidebar.drag-over {
		background: var(--color-primary-subtle);
		border-right-color: var(--color-primary);
	}

	/* ===== Collapsed state ===== */
	.collapsed-bar {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.5rem 0;
		gap: 0.75rem;
		height: 100%;
	}

	.list-count-vert {
		font-size: 0.65rem;
		font-weight: 700;
		background: var(--color-primary);
		color: white;
		border-radius: var(--radius-sm);
		padding: 0.15rem 0.3rem;
		line-height: 1.2;
	}

	/* ===== Header ===== */
	.sidebar-header {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.65rem 0.75rem;
		border-bottom: 1px solid var(--color-border);
		flex-shrink: 0;
	}

	.sidebar-title {
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-secondary);
		flex: 1;
	}

	.list-count {
		font-size: 0.72rem;
		font-weight: 600;
		background: var(--color-primary);
		color: white;
		border-radius: var(--radius-sm);
		padding: 0.1rem 0.45rem 0.15rem;
	}

	.collapse-btn {
		width: 20px;
		height: 20px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		color: var(--color-text-muted);
		display: grid;
		place-items: center;
		padding: 0;
		font-size: 0;
		transition: all var(--transition);
	}

	.collapse-btn :global(i) {
		font-size: 0.55rem;
		display: block;
		line-height: 1;
		text-align: center;
	}

	.collapse-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.clear-btn {
		width: 20px;
		height: 20px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		color: var(--color-text-muted);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		transition: all var(--transition);
	}

	.clear-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	/* ===== Empty state ===== */
	.empty {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1.5rem 0.75rem;
		text-align: center;
		color: var(--color-text-muted);
		font-size: 0.8rem;
		border: 2px dashed var(--color-border);
		margin: 0.75rem;
		border-radius: var(--radius-lg);
	}

	/* ===== List ===== */
	.list-items {
		list-style: none;
		padding: 0;
		margin: 0;
		overflow-y: auto;
		flex: 1;
	}

	.list-item {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.35rem 0.5rem 0.35rem 0.6rem;
		border-bottom: 1px solid var(--color-border);
	}

	.list-item:hover {
		background: var(--color-surface-hover);
	}

	.item-body {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		flex: 1;
		min-width: 0;
		cursor: pointer;
	}

	.item-img {
		width: 36px;
		height: 36px;
		padding: 0.15em;
		object-fit: contain;
		border-radius: var(--radius-sm);
		background: var(--color-img-bg);
		border: 1px solid var(--color-border);
		flex-shrink: 0;
	}

	.no-img {
		background: var(--color-img-bg);
	}

	.item-info {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.item-num {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		color: var(--color-text-muted);
	}

	.item-name {
		font-size: 0.75rem;
		color: var(--color-text);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.remove-btn {
		width: 18px;
		height: 18px;
		border: none;
		background: none;
		color: var(--color-text-muted);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		flex-shrink: 0;
		opacity: 0;
		transition:
			opacity 150ms ease,
			color 150ms ease;
	}

	.list-item:hover .remove-btn {
		opacity: 1;
	}

	.remove-btn:hover {
		color: var(--color-primary);
	}

	/* ===== Resize handle ===== */
	.resize-handle {
		position: absolute;
		top: 0;
		right: 0;
		width: 4px;
		height: 100%;
		cursor: col-resize;
		background: transparent;
		transition: background-color 150ms ease;
		z-index: 1;
	}

	.resize-handle:hover {
		background: var(--color-primary);
		opacity: 0.4;
	}
</style>
