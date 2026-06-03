<script lang="ts">
	let {
		src,
		alt,
		onclose,
		onprev,
		onnext
	}: {
		src: string;
		alt: string;
		onclose: () => void;
		onprev?: (() => void) | null;
		onnext?: (() => void) | null;
	} = $props();

	let dialog = $state<HTMLDialogElement | null>(null);

	$effect(() => {
		dialog?.showModal();
	});

	function onBackdropClick(e: MouseEvent) {
		if (e.target === dialog) onclose();
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') onprev?.();
		else if (e.key === 'ArrowRight') onnext?.();
	}
</script>

<svelte:window onkeydown={onKeydown} />

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	class="lightbox"
	{onclose}
	onclick={onBackdropClick}
	aria-label="Image preview"
>
	<div class="lightbox-inner">
		<button class="close-btn icon-btn" onclick={onclose} aria-label="Close"
			><i class="fa-solid fa-xmark"></i></button
		>
		<img {src} {alt} class="lightbox-img" />

		{#if onprev || onnext}
			<div class="nav-row">
				<button class="nav-btn" onclick={onprev} disabled={!onprev} aria-label="Previous image">
					<i class="fa-solid fa-chevron-left"></i>
				</button>
				<button class="nav-btn" onclick={onnext} disabled={!onnext} aria-label="Next image">
					<i class="fa-solid fa-chevron-right"></i>
				</button>
			</div>
		{/if}
	</div>
</dialog>

<style>
	.lightbox {
		border: none;
		padding: 0;
		background: transparent;
		max-width: 100vw;
		max-height: 100dvh;
		position: fixed;
		top: 50%;
		left: 50%;
		translate: -50% -50%;
		margin: 0;
	}

	.lightbox::backdrop {
		background: rgba(0, 0, 0, 0.82);
		backdrop-filter: blur(4px);
	}

	.lightbox-inner {
		position: relative;
		max-width: min(600px, calc(100vw - 2rem));
		max-height: calc(100dvh - 3rem);
		background: var(--color-surface);
		border-radius: var(--radius-sm);
		padding: 1rem;
		box-shadow: var(--shadow-lg);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
	}

	.lightbox-img {
		display: block;
		max-width: 100%;
		max-height: calc(100dvh - 10rem);
		object-fit: contain;
		border-radius: var(--radius-sm);
	}

	.close-btn {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		width: 28px;
		height: 28px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		color: var(--color-text-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all var(--transition);
		z-index: 1;
		padding: 0;
	}

	.close-btn i {
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
		line-height: 0;
	}

	.close-btn:hover {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: white;
	}

	.nav-row {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
	}

	.nav-btn {
		width: 32px;
		height: 32px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		color: var(--color-text-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all var(--transition);
		padding: 0;
		font-size: 0.75rem;
	}

	.nav-btn:hover:not(:disabled) {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.nav-btn:disabled {
		opacity: 0.35;
		cursor: default;
	}
</style>
