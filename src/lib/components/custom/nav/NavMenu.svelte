<script lang="ts">
	let {
		trigger,
		children,
		active = false
	} = $props();

	// State for dropdown visibility
	let isOpen = $state(false);

	// Toggle dropdown visibility
	function toggleMenu() {
		isOpen = !isOpen;
	}

	// Close dropdown when clicking outside
	function handleClickOutside(e: Event) {
		if (isOpen) {
			isOpen = false;
		}
	}

	// Close dropdown on escape key
	function handleEscape(e: KeyboardEvent) {
		if (e.key === 'Escape' && isOpen) {
			isOpen = false;
		}
	}
</script>

<div class="relative">
	<div
		class="px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer
			{active ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}
			focus:outline-none focus:ring-2 focus:ring-accent"
		onclick={toggleMenu}
		onkeydown={(e) => e.key === 'Enter' && toggleMenu()}
		role="button"
		tabindex="0"
		aria-haspopup="true"
		aria-expanded={isOpen}
	>
		{@render trigger()}
	</div>

	{#if isOpen}
		<div
			class="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-popover text-popover-foreground border border-border z-50"
			role="menu"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="py-1" role="none">
				{@render children()}
			</div>
		</div>
	{/if}
</div>