<script lang="ts">
	import { onMount } from 'svelte';

	let {
		trigger,
		children,
		active = false
	}: {
		trigger: (() => string) | string;
		children: any;
		active?: boolean;
	} = $props();

	// State for dropdown visibility
	let isOpen = $state(false);
	let menuElement: HTMLDivElement;

	// Toggle dropdown visibility
	function toggleMenu() {
		isOpen = !isOpen;
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event: Event) {
		if (isOpen && menuElement && !menuElement.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	// Close dropdown on escape key
	function handleEscape(event: KeyboardEvent) {
		if (event.key === 'Escape' && isOpen) {
			isOpen = false;
		}
	}

	// Add/remove event listeners when component mounts/unmounts
	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		document.addEventListener('keydown', handleEscape);

		return () => {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('keydown', handleEscape);
		};
	});
</script>

<div class="relative" bind:this={menuElement}>
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
		{typeof trigger === 'function' ? trigger() : trigger}
	</div>

	{#if isOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<div
			class="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 z-50"
			role="menu"
			tabindex="-1"
			onclick={(e) => {
				e.stopPropagation();
				// Close the dropdown when a menu item is clicked
				isOpen = false;
			}}
		>
			<div class="py-1" role="none">
				{@render children()}
			</div>
		</div>
	{/if}
</div>