<script lang="ts">
	import type { HTMLLabelAttributes } from "svelte/elements";

	let {
		class: className = '',
		children,
		...restProps
	}: HTMLLabelAttributes = $props();

	const baseClasses = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';
	const classes = `${baseClasses} ${className}`;
</script>

<label
	class={classes}
	{...restProps}
>
	{@render children?.()}
</label>