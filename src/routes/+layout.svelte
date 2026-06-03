<script lang="ts">
	import '../app.css';
	import { store } from '$lib/store.svelte';
	import FilterBar from '$lib/components/filters/FilterBar.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	let theme = $state<'light' | 'dark'>('light');

	$effect(() => {
		const saved = localStorage.getItem('theme');
		theme =
			saved === 'dark'
				? 'dark'
				: saved === 'light'
					? 'light'
					: window.matchMedia('(prefers-color-scheme: dark)').matches
						? 'dark'
						: 'light';
	});

	$effect(() => {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	});

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
	}
</script>

<div class="app-shell">
	<header class="app-header">
		{#if store.sets.length > 0}
			<div class="header-filter">
				<FilterBar />
			</div>
		{/if}

		<div class="header-right">
			{#if store.sets.length > 0}
				<button class="btn-ghost danger" onclick={() => store.clearSets()}
					><i class="fa-solid fa-trash-can"></i> Clear Data
				</button>
			{/if}
			<button
				class="btn-icon"
				onclick={toggleTheme}
				title="{theme === 'light' ? 'Switch to dark' : 'Switch to light'} mode"
				aria-label="Toggle theme"
			>
				<i class={theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'}></i>
			</button>
		</div>
	</header>

	<div class="app-body">
		{@render children()}
	</div>
</div>

<style>
	.app-shell {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.app-header {
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
		padding: 0 1.5rem;
		height: 48px;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		box-shadow: var(--shadow-sm);
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.header-filter {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: center;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-left: auto;
	}

	.btn-ghost {
		background: none;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		padding: 0.3rem 0.75rem;
		font-size: 0.8rem;
		color: var(--color-text-secondary);
		transition: all var(--transition);
	}

	.btn-ghost:hover {
		border-color: var(--color-border);
		background: var(--color-surface-hover);
	}

	.btn-ghost.danger:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
		background: var(--color-primary-subtle);
	}

	.btn-icon {
		width: 28px;
		height: 28px;
		display: grid;
		place-items: center;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		color: var(--color-text-secondary);
		font-size: 0;
		transition: all var(--transition);
		flex-shrink: 0;
	}

	.btn-icon :global(i) {
		font-size: 0.75rem;
		display: block;
		line-height: 1;
		text-align: center;
	}

	.btn-icon:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.app-body {
		flex: 1;
		display: flex;
		overflow: hidden;
		height: calc(100vh - 48px);
	}

	@media (max-width: 640px) {
		.app-header {
			padding: 0.5rem 1rem;
		}
	}
</style>
