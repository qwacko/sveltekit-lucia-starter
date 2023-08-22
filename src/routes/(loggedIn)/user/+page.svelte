<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Profile</h1>

{#if data?.user}
	<CenterCard title="User Details">
		<div>Username: {data.user.username}</div>
	</CenterCard>
{/if}
