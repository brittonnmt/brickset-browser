<script lang="ts">
	import FileDropzone from './FileDropzone.svelte';
</script>

<div class="welcome">
	<div class="welcome-header">
		<h1>BrickSet Browser</h1>
		<p>Import a Brickset CSV export to browse your LEGO collection.</p>
	</div>

	<FileDropzone />

	<div class="how-to">
		<h2>How to export from Brickset</h2>
		<ol>
			<li>
				Go to <a href="https://brickset.com" target="_blank" rel="noopener noreferrer" class="link"
					>brickset.com</a
				>
				and log in.
			</li>
			<li>Open <strong>My Sets → Export sets</strong>.</li>
			<li>Choose <strong>CSV</strong> and download the file.</li>
			<li>Drag it onto the area above.</li>
		</ol>
	</div>
</div>

<style>
	.welcome {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2.5rem;
		padding: 3rem 1rem;
		text-align: center;
		flex: 1;
	}

	.welcome-header h1 {
		font-size: 2rem;
		font-weight: 800;
		color: var(--color-text);
		margin-bottom: 0.5rem;
	}

	.welcome-header p {
		color: var(--color-text-secondary);
		font-size: 1.05rem;
	}

	.how-to {
		max-width: 420px;
		text-align: left;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: 1.25rem 1.5rem;
	}

	.how-to h2 {
		font-size: 0.9rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
		margin-bottom: 0.75rem;
	}

	.how-to ol {
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.how-to li {
		font-size: 0.9rem;
		color: var(--color-text-secondary);
		line-height: 1.5;
	}

	.link {
		color: var(--color-primary);
		text-decoration: none;
	}

	.link:hover {
		text-decoration: underline;
	}
</style>
