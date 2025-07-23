<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let {
		class: className = '',
		children,
		...restProps
	}: HTMLAttributes<HTMLHeadingElement> = $props();

	const baseClasses = 'text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-100';
	const classes = `${baseClasses} ${className}`;
</script>

<h3
	class={classes}
	{...restProps}
>
	{@render children?.()}
</h3>