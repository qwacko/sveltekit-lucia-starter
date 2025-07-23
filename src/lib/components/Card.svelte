<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let {
		class: className = '',
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> = $props();

	const baseClasses = 'rounded-lg border bg-card text-card-foreground shadow-sm';
	const classes = `${baseClasses} ${className}`;
</script>

<div
	class={classes}
	{...restProps}
>
	{@render children?.()}
</div>