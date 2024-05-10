<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	let {
		level = 1,
		children,
		...headerProps
	}: { children: Snippet; level: 1 | 2 | 3 | 4 | 5 | 6 } & HTMLAttributes<any> = $props();
</script>

{#if level === 1}<h1 {...headerProps}>{@render children()}</h1>
{:else if level === 2}<h2 {...headerProps}>{@render children()}</h2>
{:else if level === 3}<h3 {...headerProps}>{@render children()}</h3>
{:else if level === 4}<h4 {...headerProps}>{@render children()}</h4>
{:else if level === 5}<h5 {...headerProps}>{@render children()}</h5>
{:else if level === 6}<h6 {...headerProps}>{@render children()}</h6>
{/if}

<style>
	h1 {
		font-weight: 600;
	}

	h2 {
		font-weight: 600;
	}

	h3 {
		font-weight: 600;
	}

	h4 {
		font-weight: 600;
	}

	h5 {
		font-weight: 600;
	}

	h6 {
		font-weight: 600;
	}
</style>
