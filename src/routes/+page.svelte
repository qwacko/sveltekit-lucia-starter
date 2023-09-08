<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<div>
	<h1>Welcome to SvelteKit</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

	<form action="?/logout" method="post" use:enhance>
		<button type="submit">Logout</button>
	</form>

	<form action="?/testFunction" method="post" use:enhance>
		<button type="submit">Test Function</button>
	</form>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: star;
		height: 100vh;
		padding: 1rem;
	}

	button {
		display: block;
		margin: 0 auto;
		background: blue;
		margin: 0.75rem;
		border-radius: 4px;
		border: none;
		color: #fff;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
		padding: 0.75rem 1.5rem;
		transition: background 0.1s ease;
	}
</style>
