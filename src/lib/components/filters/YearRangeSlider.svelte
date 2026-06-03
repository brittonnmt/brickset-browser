<script lang="ts">
	import { untrack } from 'svelte';

	let {
		years,
		yearMin,
		yearMax,
		onchange
	}: {
		years: number[];
		yearMin: number | null;
		yearMax: number | null;
		onchange: (min: number | null, max: number | null) => void;
	} = $props();

	const maxIdx = $derived(years.length - 1);

	let loIdx = $state(0);
	let hiIdx = $state(0);

	let loInput = $state<HTMLInputElement | null>(null);
	let hiInput = $state<HTMLInputElement | null>(null);

	$effect(() => {
		const newLo =
			yearMin !== null
				? Math.max(
						0,
						years.findIndex((y) => y >= yearMin!)
					)
				: 0;
		const newHi =
			yearMax !== null
				? Math.max(
						0,
						years.findLastIndex((y) => y <= yearMax!)
					)
				: maxIdx;
		untrack(() => {
			loIdx = newLo;
			hiIdx = newHi;
		});
	});

	function setLo(v: number) {
		loIdx = Math.min(v, hiIdx);
		// force the DOM thumb back to the clamped position
		if (loInput) loInput.value = String(loIdx);
		emit();
	}

	function setHi(v: number) {
		hiIdx = Math.max(v, loIdx);
		if (hiInput) hiInput.value = String(hiIdx);
		emit();
	}

	function emit() {
		onchange(
			loIdx === 0 ? null : (years[loIdx] ?? null),
			hiIdx === maxIdx ? null : (years[hiIdx] ?? null)
		);
	}
</script>

{#if years.length > 1}
	<div class="year-range">
		<span class="yr">{years[loIdx]}</span>

		<input
			type="range"
			bind:this={loInput}
			min={0}
			max={maxIdx}
			step={1}
			value={loIdx}
			oninput={(e) => setLo(+(e.currentTarget as HTMLInputElement).value)}
			aria-label="Year from"
		/>

		<input
			type="range"
			bind:this={hiInput}
			min={0}
			max={maxIdx}
			step={1}
			value={hiIdx}
			oninput={(e) => setHi(+(e.currentTarget as HTMLInputElement).value)}
			aria-label="Year to"
		/>

		<span class="yr">{years[hiIdx]}</span>
	</div>
{/if}

<style>
	.year-range {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		flex: 1;
	}

	.yr {
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--color-text-secondary);
		white-space: nowrap;
		flex-shrink: 0;
		min-width: 2.5rem;
		text-align: center;
	}

	input[type='range'] {
		flex: 1;
		min-width: 60px;
		height: 4px;
		accent-color: var(--color-primary);
		cursor: pointer;
	}
</style>
