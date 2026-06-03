<script lang="ts">
	import Dialog from '$lib/components/dialogs/Dialog.svelte';
	import ImageLightbox from '$lib/components/dialogs/ImageLightbox.svelte';
	import Pagination from '$lib/components/table/Pagination.svelte';
	import SetDetail from '$lib/components/dialogs/SetDetail.svelte';
	import SetTable from '$lib/components/table/SetTable.svelte';
	import Sidebar from '$lib/components/sidebar/Sidebar.svelte';
	import WelcomeScreen from '$lib/components/WelcomeScreen.svelte';
	import { localPath, filenameFromUrl } from '$lib/imageCache';
	import { store } from '$lib/store.svelte';
	import type { FilterState, LegoSet } from '$lib/types';

	let selectedSet = $state<LegoSet | null>(null);
	let selectedSource = $state<'table' | 'sidebar'>('table');
	let lightboxSet = $state<LegoSet | null>(null);

	// Navigation list: sidebar-opened sets browse the list, table-opened browse the full sorted results
	const browseList = $derived(selectedSource === 'sidebar' ? store.list : store.sorted);

	const selectedIdx = $derived(
		selectedSet !== null ? browseList.findIndex((s) => s.setId === selectedSet!.setId) : -1
	);
	const prevSet = $derived(selectedIdx > 0 ? browseList[selectedIdx - 1] : null);
	const nextSet = $derived(
		selectedIdx !== -1 && selectedIdx < browseList.length - 1 ? browseList[selectedIdx + 1] : null
	);

	// Lightbox opened from the detail dialog inherits the same browse context;
	// opened directly from the table always browses store.sorted
	const lightboxList = $derived(selectedSet !== null ? browseList : store.sorted);
	const lightboxIdx = $derived(
		lightboxSet !== null ? lightboxList.findIndex((s) => s.setId === lightboxSet!.setId) : -1
	);
	const lightboxPrev = $derived(lightboxIdx > 0 ? lightboxList[lightboxIdx - 1] : null);
	const lightboxNext = $derived(
		lightboxIdx !== -1 && lightboxIdx < lightboxList.length - 1
			? lightboxList[lightboxIdx + 1]
			: null
	);

	function applyFilterAndClose(f: Partial<FilterState>) {
		store.setFilter(f);
		selectedSet = null;
	}
</script>

<svelte:head>
	<title>BrickSet Browser</title>
</svelte:head>

{#if store.sets.length === 0}
	<WelcomeScreen />
{:else}
	<Sidebar
		onselect={(set) => {
			selectedSet = set;
			selectedSource = 'sidebar';
		}}
	/>

	<main class="browser-main">
		{#if store.filtered.length === 0}
			<div class="no-results">
				<div class="no-results-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
				<p>No sets match your current filters.</p>
				<button class="reset-link" onclick={() => store.resetFilters()}>Clear Filters</button>
			</div>
		{:else}
			<SetTable
				onselect={(set) => {
					selectedSet = set;
					selectedSource = 'table';
				}}
				onimageclick={(set) => (lightboxSet = set)}
			/>

			<div class="table-footer">
				<Pagination />
				<div class="footer-right">
					<span class="page-size-label">
						{#if store.pageSize === Infinity}
							Showing all {store.filtered.length.toLocaleString()} sets
						{:else}
							Showing {Math.min((store.page - 1) * store.pageSize + 1, store.filtered.length)}
							–{Math.min(store.page * store.pageSize, store.filtered.length)}
							of {store.filtered.length.toLocaleString()}
						{/if}
					</span>
					<div class="per-page">
						<span class="per-page-label">Per page</span>
						{#each [25, 50, 100, 200, 500] as n}
							<button
								class="per-page-btn"
								class:active={store.pageSize === n}
								onclick={() => store.setPageSize(n)}>{n}</button
							>
						{/each}
						<button
							class="per-page-btn"
							class:active={store.pageSize === Infinity}
							onclick={() => store.setPageSize(Infinity)}
							>All
						</button>
					</div>
				</div>
			</div>
		{/if}
	</main>
{/if}

{#if lightboxSet?.imageUrl}
	{@const _filename = filenameFromUrl(lightboxSet.imageUrl)}
	<ImageLightbox
		src={localPath(_filename) ?? lightboxSet.imageUrl}
		alt={lightboxSet.name}
		onclose={() => (lightboxSet = null)}
		onprev={lightboxPrev ? () => (lightboxSet = lightboxPrev) : null}
		onnext={lightboxNext ? () => (lightboxSet = lightboxNext) : null}
	/>
{/if}

<Dialog open={selectedSet !== null} onclose={() => (selectedSet = null)}>
	{#if selectedSet}
		<SetDetail
			set={selectedSet}
			onfilter={applyFilterAndClose}
			onprev={prevSet ? () => (selectedSet = prevSet) : null}
			onnext={nextSet ? () => (selectedSet = nextSet) : null}
			onimageclick={() => {
				if (selectedSet) lightboxSet = selectedSet;
			}}
		/>
	{/if}
</Dialog>

<style>
	.browser-main {
		flex: 1;
		overflow-y: auto;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0;
		min-width: 0;
		min-height: 0;
	}

	.no-results {
		text-align: center;
		padding: 4rem 1rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.no-results-icon {
		font-size: 2.5rem;
		margin-bottom: 0.75rem;
		color: var(--color-text-muted);
	}

	.no-results p {
		color: var(--color-text-secondary);
		margin-bottom: 0.75rem;
	}

	.reset-link {
		background: none;
		border: none;
		color: var(--color-primary);
		font-size: 0.9rem;
		text-decoration: underline;
		cursor: pointer;
		padding: 0;
	}

	.table-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border-top: 1px solid var(--color-border);
		background: var(--color-surface);
		flex-shrink: 0;
	}

	.footer-right {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-left: auto;
	}

	.page-size-label {
		font-size: 0.8rem;
		color: var(--color-text-muted);
	}

	.per-page {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.per-page-label {
		font-size: 0.75rem;
		color: var(--color-text-muted);
		margin-right: 0.15rem;
	}

	.per-page-btn {
		min-width: 32px;
		height: 24px;
		padding: 0 0.4rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		font-size: 0.72rem;
		color: var(--color-text-secondary);
		transition: all var(--transition);
		line-height: 1;
	}

	.per-page-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.per-page-btn.active {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: white;
		font-weight: 600;
	}
</style>
