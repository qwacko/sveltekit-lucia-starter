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

<a
	class="px-3 py-2 rounded-md text-sm font-medium transition-colors
		{active ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}
		focus:outline-none focus:ring-2 focus:ring-accent"
	onclick={handleClick}
>
	{@render children()}
</a>