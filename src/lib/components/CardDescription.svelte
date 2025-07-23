<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let {
		class: className = '',
		children,
		...restProps
	}: HTMLAttributes<HTMLParagraphElement> = $props();

	const baseClasses = 'text-sm text-gray-600 dark:text-gray-400 leading-relaxed';
	const classes = `${baseClasses} ${className}`;
</script>

<p
	class={classes}
	{...restProps}
>
	{@render children?.()}
</p>