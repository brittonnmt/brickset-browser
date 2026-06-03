<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		open,
		onclose,
		children
	}: {
		open: boolean;
		onclose: () => void;
		children: Snippet;
	} = $props();

	let dialog = $state<HTMLDialogElement | null>(null);

	$effect(() => {
		if (!dialog) return;
		if (open) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	});

	// Close when clicking the backdrop (the <dialog> element itself, not its content)
	function onBackdropClick(e: MouseEvent) {
		if (e.target === dialog) onclose();
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog bind:this={dialog} {onclose} onclick={onBackdropClick} class="modal">
	<div class="modal-inner">
		<button class="close-btn icon-btn" onclick={onclose} aria-label="Close"
			><i class="fa-solid fa-xmark"></i></button
		>
		{@render children()}
	</div>
</dialog>

<style>
	.modal {
		border: none;
		border-radius: var(--radius-sm);
		padding: 0;
		max-width: min(780px, calc(100vw - 2rem));
		width: 100%;
		max-height: calc(100dvh - 4rem);
		overflow: hidden;
		box-shadow: var(--shadow-lg);
		background: var(--color-bg);
		position: fixed;
		top: 50%;
		left: 50%;
		translate: -50% -50%;
		margin: 0;
	}

	.modal::backdrop {
		background: rgba(0, 0, 0, 0.45);
		backdrop-filter: blur(2px);
	}

	.modal-inner {
		position: relative;
		overflow-y: auto;
		max-height: calc(100dvh - 4rem);
		padding: 1.5rem;
	}

	.close-btn {
		top: -0.75rem;
		right: -0.75rem;
		position: relative;
		float: right;
		z-index: 10;
		width: 28px;
		height: 28px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		color: var(--color-text-secondary);
		display: grid;
		place-items: center;
		padding: 0;
		font-size: 0;
		margin-left: 0.5rem;
		margin-bottom: -28px;
		transition: all var(--transition);
		flex-shrink: 0;
	}

	.close-btn :global(i) {
		display: block;
		font-size: 0.75rem;
		line-height: 1;
		text-align: center;
	}

	.close-btn:hover {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: white;
	}
</style>
