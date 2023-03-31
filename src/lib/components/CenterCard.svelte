<script lang="ts">
	export let title: string | null;
	export let maxWidthRem: number = 50;
</script>

<div class="wrapper">
	<div class="card" style="--maxWidthVar: {maxWidthRem}rem">
		{#if title}<h1>{title}</h1>{/if}
		<slot />
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 1rem;
	}

	.card {
		background-color: white;
		width: 100%;
		max-width: var(--maxWidthVar);
		padding: 1rem;
		border-radius: 0.5rem;
		box-shadow: 0 0 0.5rem 0.125rem rgba(0, 0, 0, 0.1);
	}

	h1 {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
	}
</style>
