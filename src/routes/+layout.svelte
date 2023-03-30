<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';

	export let data;

	$: homePage = $page.route.id?.startsWith('/(open)');
	$: users = $page.route.id?.startsWith('/(loggedIn)/users');
	$: user = $page.route.id?.startsWith('/(loggedIn)/user') && !users;
	$: login = $page.route.id?.startsWith('/(loggedOut)');
</script>

<div class="col">
	<div class="nav">
		<a href="/" class:bold={homePage}>Home</a>
		{#if data.user.user}
			<a href="/user" class:bold={user}>User</a>
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
