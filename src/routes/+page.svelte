<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';

	let { data } = $props();
</script>

<div class="flex-1 flex flex-col items-center justify-center p-8">
	<div class="max-w-4xl w-full text-center mb-12">
		<h1
			class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
		>
			Welcome to SvelteKit
		</h1>
		<p class="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
			A modern, full-stack application with authentication, real-time features, and beautiful
			design.
		</p>
	</div>

	<div class="flex flex-wrap gap-4 justify-center mb-12">
		{#if data.user}
			<form action="?/logout" method="post" use:enhance>
				<Button type="submit" variant="outline">Logout</Button>
			</form>
		{/if}

		<form action="?/testFunction" method="post" use:enhance>
			<Button type="submit">Test Functions</Button>
		</form>
	</div>

	{#if data.user}
		<div class="w-full max-w-2xl">
			<div
				class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg"
			>
				<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">User Data</h2>
				<pre
					class="text-sm text-gray-700 dark:text-gray-300 overflow-auto max-h-96 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">{JSON.stringify(
						data,
						null,
						2
					)}</pre>
			</div>
		</div>
	{:else}
		<div class="w-full max-w-md">
			<div
				class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg text-center"
			>
				<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Get Started</h2>
				<p class="text-gray-600 dark:text-gray-300 mb-4">Please log in to access all features.</p>
				<Button href="/login" class="w-full">Login</Button>
			</div>
		</div>
	{/if}
</div>
