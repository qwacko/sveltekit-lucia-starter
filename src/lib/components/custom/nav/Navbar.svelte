<script lang="ts">
	import NavItem from './NavItem.svelte';
	import NavMenu from './NavMenu.svelte';
	import { goto } from '$app/navigation';
	import { urlGenerator } from '$lib/routes';
	import Button from '$lib/components/Button.svelte';

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

</script>

<nav class="bg-background border-b border-border shadow-sm">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
			<div class="flex items-center space-x-4">
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
			
			{#if user}
				<div class="flex items-center space-x-4">
					<div class="text-sm text-gray-700 dark:text-gray-300">
						Welcome, <span class="font-medium">{user.name || user.email || 'User'}</span>
						{#if user.admin}
							<span class="ml-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">Admin</span>
						{/if}
					</div>
					<form action="/?/logout" method="post">
						<Button type="submit" variant="ghost" class="px-3 py-2 text-sm">Logout</Button>
					</form>
				</div>
			{:else}
				<NavItem href="/login" active={loginPage}>Login</NavItem>
			{/if}
		</div>
	</div>
</nav>