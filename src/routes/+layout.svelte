<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { pwaInfo } from 'virtual:pwa-info';
	import { onMount } from 'svelte';
	import { authGuardFrontend } from '$lib/authGuard/authGuardConfig';
	import { onNavigate } from '$app/navigation';
	import Navbar from '$lib/components/custom/nav/Navbar.svelte';

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
	let userPage = $derived($page.url.pathname.startsWith(`/users/${data.user?.id}`));
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

<div class="flex flex-col">
	<Navbar
		{user}
		{homePage}
		{paramsPage}
		{ssePage}
		{wsPage}
		{userPage}
		usersPage={users}
		loginPage={login}
	/>

	{@render children()}
</div>
