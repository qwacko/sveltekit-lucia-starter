<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import { trpc } from '$lib/clientTRPC';
	import { page } from '$app/stores';

	export let data: PageData;

	let loading = false;
	let localData: null | string = null;

	const isBrowser = typeof window !== 'undefined';

	const invalidate = () => {
		invalidateAll();
		loadData();
	};

	const loadData = async () => {
		loading = true;
		localData = await trpc($page).greetingProtected.query(3000);
		loading = false;
	};

	if (isBrowser) {
		loadData();
	}
</script>

<div class="flex justify-center items-center h-screen">
	<div class="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
		<h1 class="text-2xl font-semibold mb-6">Profile</h1>
		<div class="bg-gray-100 rounded-lg p-4 mb-6">
			<p class="font-semibold">User id:</p>
			<p>{data.user.user.userId}</p>
			<p class="font-semibold">Username:</p>
			<p>{data.user.user.username}</p>
		</div>

		<div class="bg-gray-100 rounded-lg p-4 mb-6">
			<p class="font-semibold">TRPC Data Sources</p>
			<p>Page Server Data : {data.trpcUser}</p>
			<p>Page Data : {data.trpcClient}</p>
			<p>
				Streaming Data : {#await data.streaming.trpcUserStreaming}Loading...{:then value}{value}{/await}
			</p>
			<p>
				Local Request : {#if loading}Loading...{:else}{localData}
				{/if}
			</p>
		</div>
		<div class="flex flex-row justify-between">
			<form use:enhance method="post" action="?/logout">
				<button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
					>Sign out</button
				>
			</form>
			<button
				type="button"
				on:click={invalidate}
				class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Refresh Data</button
			>
		</div>
	</div>
</div>
