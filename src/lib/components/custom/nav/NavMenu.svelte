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
		class="px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer text-white/90 hover:text-white
			{active ? 'bg-white/20 text-white shadow-sm' : 'hover:bg-white/10'}
			focus:outline-none focus:ring-2 focus:ring-white/50"
		onclick={toggleMenu}
		onkeydown={(e) => e.key === 'Enter' && toggleMenu()}
		role="button"
		tabindex="0"
		aria-haspopup="true"
		aria-expanded={isOpen}
	>
		{typeof trigger === 'function' ? trigger() : trigger}
		<svg class="inline w-4 h-4 ml-1 transform transition-transform {isOpen ? 'rotate-180' : ''}" fill="currentColor" viewBox="0 0 20 20">
			<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
		</svg>
	</div>

	{#if isOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<div
			class="absolute left-0 mt-2 w-48 rounded-lg shadow-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 z-50 backdrop-blur-sm"
			role="menu"
			tabindex="-1"
			onclick={(e) => {
				e.stopPropagation();
				// Close the dropdown when a menu item is clicked
				isOpen = false;
			}}
		>
			<div class="py-2 [&_a]:text-gray-700 [&_a]:dark:text-gray-200 [&_a]:hover:bg-gray-100 [&_a]:dark:hover:bg-gray-700 [&_a]:hover:text-gray-900 [&_a]:dark:hover:text-white" role="none">
				{@render children()}
			</div>
		</div>
	{/if}
</div>