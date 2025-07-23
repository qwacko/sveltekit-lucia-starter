<script lang="ts">
	import { goto } from '$app/navigation';

	// Props
	let {
		href = '',
		active = false,
		onClick = undefined,
		children
	} = $props();

	// Handle click event
	function handleClick() {
		if (onClick) {
			onClick();
		} else if (href) {
			goto(href);
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_missing_attribute -->
<a
	class="block px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer
		{active ? 'bg-accent text-accent-foreground' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
		focus:outline-none focus:ring-2 focus:ring-accent"
	onclick={handleClick}
	role="menuitem"
	tabindex="0"
>
	{@render children()}
</a>