<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import DataWrapper from '$lib/components/DataWrapper.svelte';
	import EditButton from '$lib/components/EditButton.svelte';
	import RemoveUserButton from '$lib/components/RemoveUserButton.svelte';
	import { flip } from 'svelte/animate';

	export let data;

	$: console.log('layout data', data);
</script>

<CenterCard title="Users" maxWidthRem={30}>
	{#if data.users.length === 0}
		<div class="no-users">No users found</div>
	{:else}
		<div class="list">
			{#each data.users as user}
				<DataWrapper>
					<div class="listWrapper">
						<div class="group">
							<div class="list-item__name">{user.username}</div>
							<div class="list-item__email">{user.id}</div>
						</div>
						{#if user.id !== data.user.user.userId}
							<RemoveUserButton userId={user.id} />
						{/if}
						<a href="/users/updatePassword/{user.id}"><EditButton message="Update Password" /></a>
					</div>
				</DataWrapper>
			{/each}
		</div>
	{/if}
</CenterCard>

<slot />

<div class="bottom" />

<style>
	.group {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}
	.listWrapper {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}
	.bottom {
		height: 2rem;
	}
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
