<script lang="ts">
	import type { FilterState, LegoSet } from '$lib/types';
	import { formatNumber, formatPrice, formatDate, formatAvailability } from '$lib/formatting';
	import { store } from '$lib/store.svelte';
	import { localPath, filenameFromUrl, cacheImage } from '$lib/imageCache';

	let {
		set,
		onfilter,
		onprev,
		onnext,
		onimageclick
	}: {
		set: LegoSet;
		onfilter?: (f: Partial<FilterState>) => void;
		onprev?: (() => void) | null;
		onnext?: (() => void) | null;
		onimageclick?: () => void;
	} = $props();
</script>

<div class="detail">
	<!-- ===== Two-column top: image left, info right ===== -->
	<div class="detail-top">
		<div class="img-col">
			{#if set.imageUrl}
				{@const filename = filenameFromUrl(set.imageUrl)}
				{@const src = localPath(filename) ?? set.imageUrl}
				<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
				<img
					{src}
					alt={set.name}
					class="hero-img"
					class:clickable={!!onimageclick}
					onclick={() => onimageclick?.()}
					onload={() => cacheImage(set.imageUrl, filename)}
					onerror={(e) => {
						(e.currentTarget as HTMLImageElement).src = '';
					}}
				/>
			{:else}
				<div class="no-img">No image</div>
			{/if}
		</div>

		<div class="side-col">
			<h2 class="set-name">{set.name}</h2>

			<div class="tags">
				{#if set.theme}
					<button
						class="tag theme-tag"
						onclick={() => onfilter?.({ theme: set.theme, subtheme: '' })}>{set.theme}</button
					>
				{/if}
				{#if set.subtheme}
					<button
						class="tag sub-tag"
						onclick={() => onfilter?.({ theme: set.theme, subtheme: set.subtheme })}
						>{set.subtheme}</button
					>
				{/if}
				{#if set.year}
					<button
						class="tag year-tag"
						onclick={() => onfilter?.({ yearMin: set.year, yearMax: set.year })}>{set.year}</button
					>
				{/if}
			</div>

			<div class="stats">
				{#if set.minifigs !== null}
					<div class="stat">
						<span class="stat-val">{formatNumber(set.minifigs)}</span>
						<span class="stat-lbl">Minifigs</span>
					</div>
				{/if}
				{#if set.usRetailPrice !== null}
					<div class="stat">
						<span class="stat-val price">{formatPrice(set.usRetailPrice)}</span>
						<span class="stat-lbl">Retail</span>
					</div>
				{/if}
				{#if set.bricklinkSoldPriceNew !== null}
					<div class="stat">
						<span class="stat-val price">{formatPrice(set.bricklinkSoldPriceNew)}</span>
						<span class="stat-lbl">Bricklink New</span>
					</div>
				{/if}
				{#if set.bricklinkSoldPriceUsed !== null}
					<div class="stat">
						<span class="stat-val price">{formatPrice(set.bricklinkSoldPriceUsed)}</span>
						<span class="stat-lbl">Bricklink Used</span>
					</div>
				{/if}
			</div>

			<button
				class="list-btn"
				class:in-list={store.isInList(set.setId)}
				onclick={() =>
					store.isInList(set.setId) ? store.removeFromList(set.setId) : store.addToList(set)}
			>
				<i class={store.isInList(set.setId) ? 'fa-solid fa-check' : 'fa-solid fa-plus'}></i>
				{store.isInList(set.setId) ? 'In list' : 'Add to list'}
			</button>

			<!-- Info card lives in the right column -->
			<section class="card">
				<h3>Info</h3>
				<dl>
					<div class="row">
						<dt>Number</dt>
						<dd class="mono">{set.number}-{set.variant}</dd>
					</div>
					{#if set.pieces !== null}
						<div class="row">
							<dt>Pieces</dt>
							<dd class="mono">{formatNumber(set.pieces)}</dd>
						</div>
					{/if}
					{#if formatDate(set.launchDate) || set.year}
						<div class="row">
							<dt>Available</dt>
							<dd class="mono">
								{formatDate(set.launchDate)
									? formatAvailability(set.launchDate, set.exitDate)
									: set.year}
							</dd>
						</div>
					{/if}
					<div class="row">
						<dt>Brickset</dt>
						<dd>
							<a
								href="https://brickset.com/sets/{set.number}-{set.variant}"
								target="_blank"
								rel="noopener noreferrer"
								class="brickset-link"
								><i class="fa-solid fa-arrow-up-right-from-square"></i> View on Brickset</a
							>
						</dd>
					</div>
					<div class="row">
						<dt>BrickLink</dt>
						<dd>
							<a
								href="https://www.bricklink.com/v2/catalog/catalogitem.page?S={set.number}-{set.variant}"
								target="_blank"
								rel="noopener noreferrer"
								class="brickset-link"
								><i class="fa-solid fa-arrow-up-right-from-square"></i> View on BrickLink</a
							>
						</dd>
					</div>
				</dl>
			</section>
		</div>
	</div>

	<!-- ===== Notes ===== -->
	{#if set.userNotes}
		<section class="card">
			<h3>Notes</h3>
			<p class="notes">{set.userNotes}</p>
		</section>
	{/if}

	<!-- ===== Prev / Next nav ===== -->
	{#if onprev || onnext}
		<div class="nav-row">
			<button class="nav-btn" onclick={onprev} disabled={!onprev} aria-label="Previous set"
				><i class="fa-solid fa-chevron-left"></i> Prev
			</button>
			<button class="nav-btn" onclick={onnext} disabled={!onnext} aria-label="Next set"
				>Next <i class="fa-solid fa-chevron-right"></i></button
			>
		</div>
	{/if}
</div>

<style>
	.detail {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	/* ===== Two-column top layout ===== */
	.detail-top {
		display: flex;
		gap: 1.5rem;
		align-items: stretch;
	}

	.img-col {
		flex-shrink: 0;
		width: 260px;
		display: flex;
	}

	.hero-img {
		width: 100%;
		height: 100%;
		min-height: 200px;
		padding: 0.75em;
		object-fit: contain;
		border-radius: var(--radius-sm);
		background: var(--color-img-bg);
		display: block;
		border: 1px solid var(--color-border);
	}

	.hero-img.clickable {
		cursor: zoom-in;
	}

	.no-img {
		width: 100%;
		background: var(--color-img-bg);
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-border);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-muted);
		font-size: 0.85rem;
	}

	.side-col {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		min-width: 0;
		flex: 1;
	}

	/* Info card fills remaining space so the two columns reach equal height */
	.side-col .card:last-child {
		flex: 1;
	}

	.list-btn {
		font-size: 0.75rem;
		font-weight: 600;
		padding: calc(0.5rem - 1px) 1.25rem;
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-border);
		background: var(--color-surface);
		color: var(--color-text-secondary);
		transition: all var(--transition);
		white-space: nowrap;
	}

	.list-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.list-btn.in-list {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: white;
	}

	.set-name {
		font-size: 1.35rem;
		font-weight: 700;
		line-height: 1.25;
		color: var(--color-text);
		margin: 0;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.tag {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: var(--radius-sm);
		font-size: 0.75rem;
		font-weight: 500;
		border: none;
		cursor: pointer;
		transition:
			opacity 150ms ease,
			outline 150ms ease;
		outline: 2px solid transparent;
	}

	.tag:hover {
		opacity: 0.75;
	}

	.tag:focus-visible {
		outline-color: currentColor;
	}

	.theme-tag {
		background: #e3f2fd;
		color: #1565c0;
		border: 1px solid #b3d4fc;
	}

	.sub-tag {
		background: #f3e5f5;
		color: #6a1b9a;
		border: 1px solid #e1bee7;
	}

	.year-tag {
		background: var(--color-surface-hover);
		color: var(--color-text-secondary);
		border: 1px solid var(--color-border);
		font-family: var(--font-mono);
	}

	:global([data-theme='dark']) .theme-tag {
		background: #0d2237;
		color: #7eb8f7;
		border-color: #1a3d5c;
	}

	:global([data-theme='dark']) .sub-tag {
		background: #1f0d2e;
		color: #c47ef5;
		border-color: #3d1a5c;
	}

	.stats {
		display: flex;
		gap: 2.25rem;
		flex-wrap: wrap;
		margin-top: 0.1rem;
	}

	.stat {
		display: flex;
		flex-direction: column;
	}

	.stat-val {
		font-family: var(--font-mono);
		font-size: 1.2rem;
		font-weight: 700;
		color: var(--color-text);
		font-variant-numeric: tabular-nums;
		line-height: 1.2;
	}

	.stat-val.price {
		color: var(--color-success);
	}

	.stat-lbl {
		font-size: 0.7rem;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* ===== Cards ===== */
	.card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		padding: 1rem 1.1rem;
	}

	.card h3 {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--color-text-muted);
		font-weight: 600;
		margin-bottom: 0.65rem;
	}

	dl {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.row {
		display: flex;
		gap: 0.5rem;
		font-size: 0.85rem;
		align-items: baseline;
	}

	dt {
		flex: 0 0 90px;
		color: var(--color-text-secondary);
		font-weight: 500;
	}

	dd {
		flex: 1;
		color: var(--color-text);
	}

	dd.mono {
		font-family: var(--font-mono);
		font-size: 0.8rem;
	}

	.brickset-link {
		font-size: 0.85rem;
		color: var(--color-primary);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
	}

	.brickset-link:hover {
		text-decoration: underline;
	}

	/* ===== Notes ===== */
	.notes {
		font-size: 0.875rem;
		line-height: 1.65;
		white-space: pre-wrap;
		color: var(--color-text);
	}

	/* ===== Prev / Next nav ===== */
	.nav-row {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.nav-btn {
		padding: 0.6rem 1rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: all var(--transition);
	}

	.nav-btn:hover:not(:disabled) {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.nav-btn:disabled {
		opacity: 0.35;
		cursor: default;
	}

	/* ===== Responsive ===== */
	@media (max-width: 560px) {
		.detail-top {
			flex-direction: column;
		}

		.img-col {
			width: 100%;
			height: 220px;
		}

		.hero-img {
			min-height: unset;
		}
	}
</style>
