<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import { trpc } from '$lib/clientTRPC';
	import { page } from '$app/stores';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import DataWrapper from '$lib/components/DataWrapper.svelte';
	import SpreadButtons from '$lib/components/SpreadButtons.svelte';
	import Button from '$lib/components/Button.svelte';
	import Title from '$lib/components/Title.svelte';

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

<CenterCard title="User" maxWidthRem={50}
	><DataWrapper>
		<Title level={1}>User id:</Title>
		<p>{data.user.user.userId}</p>
		<Title level={1}>Username:</Title>
		<p>{data.user.user.username}</p>
	</DataWrapper>

	<DataWrapper>
		<Title level={1}>TRPC Data Sources</Title>
		<p>Page Server Data : {data.trpcUser}</p>
		<p>Page Data : {data.trpcClient}</p>
		<p>
			Streaming Data : {#await data.streaming.trpcUserStreaming}Loading...{:then value}{value}{/await}
		</p>
		<p>
			Local Request : {#if loading}Loading...{:else}{localData}
			{/if}
		</p>
	</DataWrapper>
	<SpreadButtons>
		<form use:enhance method="post" action="?/logout">
			<Button type="submit" style="primary">Sign out</Button>
		</form>
		<Button type="button" style="secondary" on:click={invalidate}>Refresh Data</Button>
	</SpreadButtons>
</CenterCard>
