<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let {
		class: className = '',
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> = $props();

	const baseClasses = 'rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm';
	const classes = `${baseClasses} ${className}`;
</script>

<div
	class={classes}
	{...restProps}
>
	{@render children?.()}
</div>