<script lang="ts">
	import { goto } from '$app/navigation';

	// Props
	let { href = '', active = false, onClick = undefined, children } = $props();

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
	class="block px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer text-white/90 hover:text-white
		{active ? 'bg-white/20 text-white shadow-sm' : 'hover:bg-white/10'}
		focus:outline-none focus:ring-2 focus:ring-white/50"
	onclick={handleClick}
	role="menuitem"
	tabindex="0"
>
	{@render children()}
</a>
