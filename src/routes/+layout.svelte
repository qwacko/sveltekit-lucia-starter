<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { pwaInfo } from 'virtual:pwa-info';
	import { onMount } from 'svelte';
	import { authGuardFrontend } from '$lib/authGuard/authGuardConfig';
	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		//@ts-expect-error startViewTransition is not defined on Document
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			//@ts-expect-error startViewTransition is not defined on Document
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	export let data;

	$: authGuardFrontend($page, { admin: data.user?.admin || false, user: data.user ? true : false });

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

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';
	$: homePage = $page.url.pathname === '/';
	$: user = $page.url.pathname.startsWith(`/users/${data?.user?.userId}`);
	$: backup = $page.route.id?.startsWith('/(loggedIn)/backup');
	$: users = $page.route.id?.startsWith('/(loggedIn)/users') && !user;
	$: login = $page.route.id?.startsWith('/(loggedOut)');
	$: paramsPage = $page.route.id?.startsWith('/(open)/params');
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

<div class="col">
	<div class="nav">
		<a href="/" class:bold={homePage}>Home</a>
		<a href="/params" class:bold={paramsPage}>Search Params</a>
		{#if data.user}
			<a href="/backup" class:bold={backup}>Backups</a>
			<a href="/users/{data.user.userId}" class:bold={user}>User</a>
			<a href="/users" class:bold={users}>Users</a>
			<form action="/?/logout" method="post">
				<button type="submit" class:bold={login}>Logout</button>
			</form>
		{:else}
			<a href="/login" class:bold={login}>Login</a>
		{/if}
	</div>

	<slot />
</div>

<style>
	.bold {
		font-weight: bold;
	}

	.nav {
		background-color: rgb(212, 230, 250);
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 3.5rem;
		padding: 0 1rem;
	}

	.nav a,
	button {
		color: blue;
		font-size: 1rem;
		text-decoration: none;
		padding: 0.75rem;
		border-radius: 0.375rem;

		transition: background-color 0.3s ease-in-out;
	}

	.nav a:hover,
	button:hover {
		background-color: #9dc0fd;
	}

	.col {
		display: flex;
		flex-direction: column;
	}
</style>
