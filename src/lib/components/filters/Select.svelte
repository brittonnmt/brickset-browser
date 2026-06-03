<script lang="ts">
	let {
		value,
		options,
		placeholder = 'All',
		onchange,
		maxWidth = '160px'
	}: {
		value: string;
		options: string[];
		placeholder?: string;
		onchange: (value: string) => void;
		maxWidth?: string;
	} = $props();

	let open = $state(false);
	let wrapper = $state<HTMLDivElement | null>(null);

	const selectedLabel = $derived(value || placeholder);

	function select(v: string) {
		onchange(v);
		open = false;
	}

	function onWindowClick(e: MouseEvent) {
		if (wrapper && !wrapper.contains(e.target as Node)) {
			open = false;
		}
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') open = false;
	}
</script>

<svelte:window onclick={onWindowClick} onkeydown={onKeydown} />

<div class="select-wrap" bind:this={wrapper} style="max-width: {maxWidth}">
	<button
		class="select-btn"
		class:open
		class:active={!!value}
		onclick={() => (open = !open)}
		type="button"
		aria-haspopup="listbox"
		aria-expanded={open}
	>
		<span class="select-label">{selectedLabel}</span>
		<i class="fa-solid fa-chevron-down select-chevron"></i>
	</button>

	{#if open}
		<div class="dropdown" role="listbox">
			<button
				class="option"
				class:selected={value === ''}
				role="option"
				aria-selected={value === ''}
				onclick={() => select('')}
				type="button">{placeholder}</button
			>
			{#each options as opt}
				<button
					class="option"
					class:selected={value === opt}
					role="option"
					aria-selected={value === opt}
					onclick={() => select(opt)}
					type="button">{opt}</button
				>
			{/each}
		</div>
	{/if}
</div>

<style>
	.select-wrap {
		position: relative;
		flex-shrink: 0;
	}

	.select-btn {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		height: 28px;
		padding: 0 0.6rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		color: var(--color-text-secondary);
		font-size: 0.8rem;
		width: 100%;
		text-align: left;
		cursor: pointer;
		transition: all var(--transition);
		white-space: nowrap;
	}

	.select-btn.active {
		color: var(--color-text);
	}

	.select-btn.open {
		border-color: var(--color-border);
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	.select-btn:hover:not(.open) {
		border-color: var(--color-text-muted);
	}

	.select-label {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.select-chevron {
		font-size: 0.55rem;
		flex-shrink: 0;
		color: var(--color-text-muted);
		transition: transform var(--transition);
	}

	.select-btn.open .select-chevron {
		transform: rotate(180deg);
	}

	.dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		min-width: 100%;
		width: max-content;
		max-width: 320px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-top: none;
		border-radius: 0 0 var(--radius-sm) var(--radius-sm);
		box-shadow: var(--shadow-md);
		z-index: 200;
		max-height: 260px;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--color-border) transparent;
	}

	.dropdown::-webkit-scrollbar {
		width: 6px;
	}

	.dropdown::-webkit-scrollbar-track {
		background: transparent;
	}

	.dropdown::-webkit-scrollbar-thumb {
		background: var(--color-border);
		border-radius: 3px;
	}

	.dropdown::-webkit-scrollbar-thumb:hover {
		background: var(--color-text-muted);
	}

	.option {
		display: block;
		width: 100%;
		padding: 0.4rem 0.6rem;
		text-align: left;
		font-size: 0.8rem;
		color: var(--color-text);
		background: none;
		border: none;
		border-bottom: 1px solid var(--color-border);
		cursor: pointer;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		transition:
			background-color var(--transition),
			color var(--transition);
	}

	.option:last-child {
		border-bottom: none;
	}

	.option:hover {
		background: var(--color-surface-hover);
	}

	.option.selected {
		color: var(--color-primary);
		font-weight: 600;
		background: var(--color-primary-subtle);
	}
</style>
