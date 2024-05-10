<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import LinkButton from '$lib/components/LinkButton.svelte';

	let { data } = $props();
</script>

<CenterCard title="Users">
	{#each data.users as currentUser}
		<div class="userRow">
			<a href="/users/{currentUser.id}">{currentUser.username}</a>
			{#if currentUser.admin}
				(Admin)
			{/if}
		</div>
	{/each}

	<div class="gap"></div>

	<LinkButton href="/users/create">Create User</LinkButton>
</CenterCard>

<style>
	.gap {
		height: 20px;
	}

	.userRow {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		border-bottom: 1px solid #ccc;
	}
</style>
