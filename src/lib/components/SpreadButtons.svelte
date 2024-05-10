<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div>{@render children()}</div>

<style>
	div {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
