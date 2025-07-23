<script lang="ts">
	import type { HTMLLabelAttributes } from "svelte/elements";

	let {
		class: className = '',
		children,
		...restProps
	}: HTMLLabelAttributes = $props();

	const baseClasses = 'text-sm font-semibold leading-none text-gray-900 dark:text-gray-100 peer-disabled:cursor-not-allowed peer-disabled:opacity-70';
	const classes = `${baseClasses} ${className}`;
</script>

<label
	class={classes}
	{...restProps}
>
	{@render children?.()}
</label>