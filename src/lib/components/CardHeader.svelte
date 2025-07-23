<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let {
		class: className = '',
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> = $props();

	const baseClasses = 'flex flex-col space-y-1.5 p-6';
	const classes = `${baseClasses} ${className}`;
</script>

<div
	class={classes}
	{...restProps}
>
	{@render children?.()}
</div>