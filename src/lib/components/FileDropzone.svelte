<script lang="ts">
	import { parseBricksetCsv } from '$lib/csv';
	import { store } from '$lib/store.svelte';

	let isDragging = $state(false);
	let isLoading = $state(false);
	let errors = $state<string[]>([]);
	let fileInput = $state<HTMLInputElement | null>(null);

	async function handleFile(file: File) {
		if (!file.name.endsWith('.csv')) {
			errors = ['Please select a CSV file.'];
			return;
		}
		isLoading = true;
		errors = [];
		const result = await parseBricksetCsv(file);
		isLoading = false;
		if (result.sets.length === 0 && result.errors.length > 0) {
			errors = result.errors;
		} else {
			store.importSets(result.sets);
			if (result.errors.length > 0) {
				errors = result.errors;
			}
		}
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function onDragLeave() {
		isDragging = false;
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		const file = e.dataTransfer?.files[0];
		if (file) handleFile(file);
	}

	function onFileChange(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (file) handleFile(file);
	}
</script>

<div
	class="dropzone"
	class:dragging={isDragging}
	class:loading={isLoading}
	ondragover={onDragOver}
	ondragleave={onDragLeave}
	ondrop={onDrop}
	role="region"
	aria-label="CSV drop zone"
>
	{#if isLoading}
		<div class="state">
			<div class="spinner"></div>
			<p>Parsing CSV…</p>
		</div>
	{:else}
		<div class="state">
			<div class="icon">📦</div>
			<p class="headline">Drop your Brickset CSV here</p>
			<p class="sub">or click to browse</p>
			<button class="btn-primary" onclick={() => fileInput?.click()}> Choose File </button>
			<input
				bind:this={fileInput}
				type="file"
				accept=".csv"
				class="hidden-input"
				onchange={onFileChange}
			/>
		</div>
	{/if}
</div>

{#if errors.length > 0}
	<div class="errors">
		<strong>Parse warnings:</strong>
		<ul>
			{#each errors.slice(0, 5) as err}
				<li>{err}</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	.dropzone {
		border: 2px dashed var(--color-border);
		border-radius: var(--radius-xl);
		padding: 3rem 2rem;
		text-align: center;
		background: var(--color-surface);
		transition:
			border-color var(--transition),
			background var(--transition);
		cursor: pointer;
		max-width: 540px;
		margin: 0 auto;
	}

	.dropzone.dragging {
		border-color: var(--color-primary);
		background: var(--color-primary-subtle);
	}

	.state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.icon {
		font-size: 3rem;
		line-height: 1;
	}

	.headline {
		font-size: 1.15rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.sub {
		color: var(--color-text-secondary);
		font-size: 0.9rem;
	}

	.btn-primary {
		margin-top: 0.5rem;
		padding: 0.5rem 1.5rem;
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: 0.9rem;
		font-weight: 600;
		transition: background var(--transition);
	}

	.btn-primary:hover {
		background: var(--color-primary-dark);
	}

	.hidden-input {
		display: none;
	}

	.spinner {
		width: 2rem;
		height: 2rem;
		border: 3px solid var(--color-border);
		border-top-color: var(--color-primary);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.errors {
		max-width: 540px;
		margin: 1rem auto 0;
		background: #fff3cd;
		border: 1px solid #ffc107;
		border-radius: var(--radius-md);
		padding: 0.75rem 1rem;
		font-size: 0.85rem;
		color: #6d4c00;
	}

	.errors ul {
		margin: 0.25rem 0 0 1rem;
	}
</style>
