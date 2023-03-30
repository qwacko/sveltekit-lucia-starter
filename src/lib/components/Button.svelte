<script lang="ts">
	export let style: 'primary' | 'secondary' = 'primary';
</script>

<button
	class:primary={style === 'primary'}
	class:secondary={style === 'secondary'}
	{...$$restProps}
	on:click
>
	<slot />
</button>

<style>
	button {
		padding-left: 1rem;
		padding-right: 1rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		border-radius: 0.5rem;
		border-width: 1px;
		transition: background-color 0.2s, border-color 0.2s, color 0.2s ease-in-out;
	}

	.primary {
		background-color: #3b82f6;
		color: #fff;
		border-color: #3b82f6;
	}

	.secondary {
		background-color: white;
		color: #3b82f6;
		border-color: white;
	}

	.primary:hover {
		background-color: white;
		color: #3b82f6;
		border-color: #3b82f6;
	}

	.secondary:hover {
		background-color: #76aafd;
		color: #fff;
		border-color: white;
	}
</style>
