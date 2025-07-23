<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let {
		class: className = '',
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> = $props();

	const baseClasses = 'p-6 pt-0';
	const classes = `${baseClasses} ${className}`;
</script>

<div
	class={classes}
	{...restProps}
>
	{@render children?.()}
</div>