<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import DataWrapper from '$lib/components/DataWrapper.svelte';

	export let data;
</script>

<CenterCard title="Users" maxWidthRem={30}>
	{#if data.users.length === 0}
		<div class="no-users">No users found</div>
	{:else}
		<div class="list">
			{#each data.users as user}
				<DataWrapper>
					<div class="list-item__name">{user.username}</div>
					<div class="list-item__email">{user.id}</div>
				</DataWrapper>
			{/each}
		</div>
	{/if}
</CenterCard>

<style>
	.list {
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}

	.list-item__name {
		font-size: 1.2rem;
		font-weight: 600;
	}

	.list-item__email {
		font-size: 1rem;
		font-weight: 400;
	}
</style>
