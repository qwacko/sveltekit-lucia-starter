<script lang="ts">
	import ErrorText from './ErrorText.svelte';

	export let errorMessage: string | string[] | null | undefined;
	export let title: string | null;
	export let name: string;
</script>

<div>
	{#if title}
		<label for={name}>{title}</label>
	{/if}
	<input {...$$restProps} {name} />
	<ErrorText message={errorMessage} />
</div>

<style>
	div {
		margin-bottom: 0.75rem;
	}

	label {
		display: block;
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 0.2rem;
		color: rgb(51, 51, 51);
	}

	input {
		border-width: 1px;
		border-color: #d1d5db;
		padding: 0.5rem;
		width: 100%;
		border-radius: 0.5rem;
	}
</style>
