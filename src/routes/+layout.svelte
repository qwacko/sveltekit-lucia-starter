<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { pwaInfo } from 'virtual:pwa-info';
	import { onMount } from 'svelte';
	import { authGuardFrontend } from '$lib/authGuard/authGuardConfig';
	import { onNavigate } from '$app/navigation';
	import * as Menubar from '$lib/components/shadcn/ui/menubar';
	import { urlGenerator } from '$lib/routes';
	import Button from '$lib/components/shadcn/ui/button/button.svelte';
	import { goto } from '$app/navigation';

	let { data, children } = $props();

	onNavigate((navigation) => {
		if (!data.viewTransitions) return;
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	$effect(() => {
		authGuardFrontend($page, { admin: data.user?.admin || false, user: data.user ? true : false });
	});

	onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({
				immediate: true,
				onRegistered(r) {
					// uncomment following code if you want check for updates
					// r && setInterval(() => {
					//    console.log('Checking for sw update')
					//    r.update()
					// }, 20000 /* 20s for testing purposes */)
					console.log(`SW Registered: ${r}`);
				},
				onRegisterError(error) {
					console.log('SW registration error', error);
				}
			});
		}
	});

	let webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');
	let homePage = $derived($page.url.pathname === '/');
	let user = $derived($page.url.pathname.startsWith(`/users/${data.user?.id}`));
	let backup = $derived($page.route.id?.startsWith('/(loggedIn)/backup'));
	let users = $derived($page.route.id?.startsWith('/(loggedIn)/users') && !user);
	let login = $derived($page.route.id?.startsWith('/(loggedOut)'));
	let paramsPage = $derived($page.route.id?.startsWith('/(open)/params'));
	let ssePage = $derived($page.route.id?.startsWith('/(loggedIn)/sse'));
	let wsPage = $derived($page.route.id?.startsWith('/(loggedIn)/ws'));
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

<div class="flex flex-col">
	<Menubar.Root>
		<Menubar.Menu>
			<Menubar.Item onclick={() => goto('/')} class={homePage ? 'bg-accent' : ''}>Home</Menubar.Item
			>
		</Menubar.Menu>

		<Menubar.Menu>
			<Menubar.Item onclick={() => goto('/params')} class={paramsPage ? 'bg-accent' : ''}
				>Search Params</Menubar.Item
			>
		</Menubar.Menu>

		{#if data.user}
			<Menubar.Menu>
				<Menubar.Trigger class={ssePage ? 'bg-accent' : ''}>Server Sent Events</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item
						onclick={() =>
							goto(
								urlGenerator({ address: '/(loggedIn)/sse/[id]', paramsValue: { id: 'room1' } }).url
							)}
					>
						Room 1
					</Menubar.Item>

					<Menubar.Item
						onclick={() =>
							goto(
								urlGenerator({ address: '/(loggedIn)/sse/[id]', paramsValue: { id: 'room2' } }).url
							)}
					>
						Room 2
					</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
			<Menubar.Menu>
				<Menubar.Trigger class={wsPage ? 'bg-accent' : ''}>Websockets</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item
						onclick={() =>
							goto(
								urlGenerator({ address: '/(loggedIn)/ws/[id]', paramsValue: { id: 'room1' } }).url
							)}
					>
						Room 1
					</Menubar.Item>
					<Menubar.Item
						onclick={() =>
							goto(
								urlGenerator({ address: '/(loggedIn)/ws/[id]', paramsValue: { id: 'room2' } }).url
							)}
					>
						Room 2
					</Menubar.Item>
					<Menubar.Item
						onclick={() =>
							goto(
								urlGenerator({
									address: '/(loggedIn)/ws/[id]',
									paramsValue: { id: 'disallowedRoom' }
								}).url
							)}
					>
						Disallowed Room
					</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
			<Menubar.Menu>
				<Menubar.Item
					onclick={() =>
						goto(
							urlGenerator({
								address: '/(loggedIn)/users/[id]',
								paramsValue: { id: data?.user?.id || 'noid' }
							}).url
						)}
					class={user ? 'bg-accent' : ''}
				>
					User
				</Menubar.Item>
			</Menubar.Menu>
			<Menubar.Menu>
				<Menubar.Item onclick={() => goto('/users')} class={users ? 'bg-accent' : ''}
					>Users</Menubar.Item
				>
			</Menubar.Menu>
			<Menubar.Menu>
				<Menubar.Trigger class={wsPage ? 'bg-accent' : ''}>Logout</Menubar.Trigger>
				<Menubar.Content>
					<form action="/?/logout" method="post">
						<Button type="submit" class="w-full">Logout</Button>
					</form>
				</Menubar.Content>
			</Menubar.Menu>
		{:else}
			<Menubar.Menu>
				<Menubar.Item onclick={() => goto('/login')} class={login ? 'bg-accent' : ''}
					>Login</Menubar.Item
				>
			</Menubar.Menu>
		{/if}
	</Menubar.Root>

	{@render children()}
</div>
