<script lang="ts">
	import { store } from '$lib/store.svelte';
	import YearRangeSlider from './YearRangeSlider.svelte';
	import Select from './Select.svelte';

	function reset() {
		store.resetFilters();
	}

	const hasFilters = $derived(
		store.filter.search !== '' ||
			store.filter.theme !== '' ||
			store.filter.subtheme !== '' ||
			store.filter.yearMin !== null ||
			store.filter.yearMax !== null
	);
</script>

<div class="filter-bar">
	<div class="search-wrap">
		<i class="fa-solid fa-magnifying-glass search-icon"></i>
		<input
			type="text"
			placeholder="Search…"
			value={store.filter.search}
			oninput={(e) => store.setFilter({ search: (e.currentTarget as HTMLInputElement).value })}
			class="search-input"
		/>
		{#if store.filter.search}
			<button
				class="search-clear icon-btn"
				onclick={() => store.setFilter({ search: '' })}
				aria-label="Clear search"
			>
				<i class="fa-solid fa-xmark"></i>
			</button>
		{/if}
	</div>

	<Select
		value={store.filter.theme}
		options={store.themes}
		placeholder="All Themes"
		onchange={(v) => store.setFilter({ theme: v, subtheme: '' })}
	/>

	<Select
		value={store.filter.subtheme}
		options={store.subthemes}
		placeholder="All Subthemes"
		onchange={(v) => store.setFilter({ subtheme: v })}
	/>

	{#if store.yearOptions.length > 1}
		<div class="year-wrap">
			<span class="year-label">Year</span>
			<YearRangeSlider
				years={store.yearOptions}
				yearMin={store.filter.yearMin}
				yearMax={store.filter.yearMax}
				onchange={(min, max) => store.setFilter({ yearMin: min, yearMax: max })}
			/>
		</div>
	{/if}

	<span class="result-count"
		>{store.filtered.length.toLocaleString()}/{store.sets.length.toLocaleString()}</span
	>

	{#if hasFilters}
		<button class="reset-btn icon-btn" onclick={reset} title="Clear filters"
			><i class="fa-solid fa-xmark"></i></button
		>
	{/if}
</div>

<style>
	.filter-bar {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		flex-wrap: nowrap;
	}

	.search-wrap {
		position: relative;
		flex-shrink: 0;
	}

	.search-icon {
		position: absolute;
		left: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		font-size: 0.65rem;
		color: var(--color-text-muted);
		pointer-events: none;
	}

	.search-input {
		width: 160px;
		padding: 0.28rem 1.6rem 0.28rem 1.6rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: 0.8rem;
		color: var(--color-text);
		background: var(--color-surface);
		outline: none;
		transition:
			background-color var(--transition),
			color var(--transition),
			border-color var(--transition);
		height: 28px;
	}

	.search-input:focus {
		border-color: var(--color-text-muted);
	}

	.search-clear {
		position: absolute;
		right: 0.3rem;
		top: 50%;
		transform: translateY(-50%);
		width: 18px;
		height: 18px;
		display: grid;
		place-items: center;
		border: none;
		background: none;
		color: var(--color-text-muted);
		font-size: 0;
		padding: 0;
		transition: color var(--transition);
	}

	.search-clear :global(i) {
		font-size: 0.65rem;
		display: block;
		line-height: 1;
		text-align: center;
	}

	.search-clear:hover {
		color: var(--color-text);
	}

	.year-wrap {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.2rem 0.5rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		height: 28px;
		flex-shrink: 0;
	}

	.year-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text-secondary);
		white-space: nowrap;
	}

	.result-count {
		font-size: 0.75rem;
		color: var(--color-text-muted);
		white-space: nowrap;
		flex-shrink: 0;
		margin-left: 0.2rem;
	}

	.reset-btn {
		width: 24px;
		height: 24px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		color: var(--color-text-secondary);
		transition: all var(--transition);
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	.reset-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}
</style>
