<script lang="ts">
	import NavItem from './NavItem.svelte';
	import NavMenu from './NavMenu.svelte';
	import { goto } from '$app/navigation';
	import { urlGenerator } from '$lib/routes';
	import Button from '$lib/components/Button.svelte';
	import { browser } from '$app/environment';

	// Props
	let {
		user = undefined,
		homePage = false,
		paramsPage = false,
		ssePage = false,
		wsPage = false,
		userPage = false,
		usersPage = false,
		loginPage = false
	} = $props();

	// Mobile menu state
	let mobileMenuOpen = $state(false);

	// Dark mode state
	let isDarkMode = $state(false);

	// Initialize dark mode from localStorage or system preference
	$effect(() => {
		if (browser) {
			const stored = localStorage.getItem('darkMode');
			if (stored !== null) {
				isDarkMode = stored === 'true';
			} else {
				isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
			}
			updateDarkMode();
		}
	});

	// Update dark mode class on document
	function updateDarkMode() {
		if (browser) {
			if (isDarkMode) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
			localStorage.setItem('darkMode', isDarkMode.toString());
		}
	}

	// Toggle dark mode
	function toggleDarkMode() {
		isDarkMode = !isDarkMode;
		updateDarkMode();
	}

	// Toggle mobile menu
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	// Close mobile menu when clicking on a nav item
	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

</script>

<nav class="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 shadow-lg border-b border-blue-700 dark:border-blue-900">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
			<!-- Logo/Brand -->
			<div class="flex items-center">
				<div class="flex-shrink-0 flex items-center">
					<h1 class="text-xl font-bold text-white">SvelteKit App</h1>
				</div>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex md:items-center md:space-x-1">
				<NavItem href="/" active={homePage}>Home</NavItem>
				<NavItem href="/params" active={paramsPage}>Search Params</NavItem>

				{#if user}
					<NavMenu active={ssePage} trigger="Server Sent Events">
						<NavItem
							onClick={() =>
								goto(
									urlGenerator({ address: '/(loggedIn)/sse/[id]', paramsValue: { id: 'room1' } }).url
								)}
						>
							Room 1
						</NavItem>
						<NavItem
							onClick={() =>
								goto(
									urlGenerator({ address: '/(loggedIn)/sse/[id]', paramsValue: { id: 'room2' } }).url
								)}
						>
							Room 2
						</NavItem>
					</NavMenu>

					<NavMenu active={wsPage} trigger="Websockets">
						<NavItem
							onClick={() =>
								goto(
									urlGenerator({ address: '/(loggedIn)/ws/[id]', paramsValue: { id: 'room1' } }).url
								)}
						>
							Room 1
						</NavItem>
						<NavItem
							onClick={() =>
								goto(
									urlGenerator({ address: '/(loggedIn)/ws/[id]', paramsValue: { id: 'room2' } }).url
								)}
						>
							Room 2
						</NavItem>
						<NavItem
							onClick={() =>
								goto(
									urlGenerator({
										address: '/(loggedIn)/ws/[id]',
										paramsValue: { id: 'disallowedRoom' }
									}).url
								)}
						>
							Disallowed Room
						</NavItem>
					</NavMenu>

					<NavItem
						onClick={() =>
							goto(
								urlGenerator({
									address: '/(loggedIn)/users/[id]',
									paramsValue: { id: user?.id || 'noid' }
								}).url
							)}
						active={userPage}
					>
						User
					</NavItem>

					<NavItem href="/users" active={usersPage}>Users</NavItem>
				{/if}
			</div>

			<!-- Desktop Right Side -->
			<div class="hidden md:flex md:items-center md:space-x-4">
				<!-- Dark Mode Toggle -->
				<button
					onclick={toggleDarkMode}
					class="p-2 rounded-md text-white hover:bg-white/10 transition-colors"
					aria-label="Toggle dark mode"
				>
					{#if isDarkMode}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
						</svg>
					{:else}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
						</svg>
					{/if}
				</button>

				{#if user}
					<div class="text-sm text-white/90">
						Welcome, <span class="font-medium text-white">{user.name || user.email || 'User'}</span>
						{#if user.admin}
							<span class="ml-1 text-xs bg-amber-500 text-amber-900 px-2 py-0.5 rounded-full font-medium">Admin</span>
						{/if}
					</div>
					<form action="/?/logout" method="post">
						<Button type="submit" variant="outline" class="text-white border-white/30 hover:bg-white/10 hover:border-white/50">Logout</Button>
					</form>
				{:else}
					<NavItem href="/login" active={loginPage}>Login</NavItem>
				{/if}
			</div>

			<!-- Mobile menu button -->
			<div class="md:hidden flex items-center space-x-2">
				<!-- Mobile Dark Mode Toggle -->
				<button
					onclick={toggleDarkMode}
					class="p-2 rounded-md text-white hover:bg-white/10 transition-colors"
					aria-label="Toggle dark mode"
				>
					{#if isDarkMode}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
						</svg>
					{:else}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
						</svg>
					{/if}
				</button>

				<!-- Hamburger Menu Button -->
				<button
					onclick={toggleMobileMenu}
					class="p-2 rounded-md text-white hover:bg-white/10 transition-colors"
					aria-label="Toggle mobile menu"
					aria-expanded={mobileMenuOpen}
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						{#if mobileMenuOpen}
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						{:else}
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						{/if}
					</svg>
				</button>
			</div>
		</div>

		<!-- Mobile menu -->
		{#if mobileMenuOpen}
			<div class="md:hidden bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-900 dark:to-purple-900 border-t border-blue-600 dark:border-blue-800">
				<div class="px-2 pt-2 pb-3 space-y-1">
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div onclick={closeMobileMenu}>
						<NavItem href="/" active={homePage}>Home</NavItem>
					</div>
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div onclick={closeMobileMenu}>
						<NavItem href="/params" active={paramsPage}>Search Params</NavItem>
					</div>

					{#if user}
						<!-- Mobile SSE Menu -->
						<div class="pt-2">
							<div class="text-white/70 text-xs font-medium uppercase tracking-wider px-3 py-2">Server Sent Events</div>
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div onclick={closeMobileMenu}>
								<NavItem
									onClick={() =>
										goto(
											urlGenerator({ address: '/(loggedIn)/sse/[id]', paramsValue: { id: 'room1' } }).url
										)}
								>
									SSE Room 1
								</NavItem>
							</div>
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div onclick={closeMobileMenu}>
								<NavItem
									onClick={() =>
										goto(
											urlGenerator({ address: '/(loggedIn)/sse/[id]', paramsValue: { id: 'room2' } }).url
										)}
								>
									SSE Room 2
								</NavItem>
							</div>
						</div>

						<!-- Mobile WS Menu -->
						<div class="pt-2">
							<div class="text-white/70 text-xs font-medium uppercase tracking-wider px-3 py-2">Websockets</div>
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div onclick={closeMobileMenu}>
								<NavItem
									onClick={() =>
										goto(
											urlGenerator({ address: '/(loggedIn)/ws/[id]', paramsValue: { id: 'room1' } }).url
										)}
								>
									WS Room 1
								</NavItem>
							</div>
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div onclick={closeMobileMenu}>
								<NavItem
									onClick={() =>
										goto(
											urlGenerator({ address: '/(loggedIn)/ws/[id]', paramsValue: { id: 'room2' } }).url
										)}
								>
									WS Room 2
								</NavItem>
							</div>
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div onclick={closeMobileMenu}>
								<NavItem
									onClick={() =>
										goto(
											urlGenerator({
												address: '/(loggedIn)/ws/[id]',
												paramsValue: { id: 'disallowedRoom' }
											}).url
										)}
								>
									Disallowed Room
								</NavItem>
							</div>
						</div>

						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div onclick={closeMobileMenu}>
							<NavItem
								onClick={() =>
									goto(
										urlGenerator({
											address: '/(loggedIn)/users/[id]',
											paramsValue: { id: user?.id || 'noid' }
										}).url
									)}
								active={userPage}
							>
								User
							</NavItem>
						</div>

						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div onclick={closeMobileMenu}>
							<NavItem href="/users" active={usersPage}>Users</NavItem>
						</div>

						<!-- Mobile User Info & Logout -->
						<div class="pt-4 mt-4 border-t border-white/20">
							<div class="px-3 py-2 text-sm text-white/90">
								Welcome, <span class="font-medium text-white">{user.name || user.email || 'User'}</span>
								{#if user.admin}
									<span class="ml-1 text-xs bg-amber-500 text-amber-900 px-2 py-0.5 rounded-full font-medium">Admin</span>
								{/if}
							</div>
							<div class="px-3 py-2">
								<form action="/?/logout" method="post">
									<Button type="submit" variant="outline" class="w-full text-white border-white/30 hover:bg-white/10 hover:border-white/50">Logout</Button>
								</form>
							</div>
						</div>
					{:else}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div onclick={closeMobileMenu}>
							<NavItem href="/login" active={loginPage}>Login</NavItem>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</nav>