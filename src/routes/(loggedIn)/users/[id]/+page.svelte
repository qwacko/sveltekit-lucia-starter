<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import LinkButton from '$lib/components/LinkButton.svelte';

	export let data;
</script>

{#if data.currentUser}
	<div class="thisRow">
		{data.currentUser.username}
		{#if data.currentUser.admin}
			(Admin)
		{/if}
		<div class="growGap" />
		{#if data.user?.admin && data.user.userId !== data.currentUser.id}
			{#if !data.currentUser.admin}
				<form action="?/setAdmin" method="POST" use:enhance>
					<Button type="submit">Set Admin</Button>
				</form>
			{:else}
				<form action="?/removeAdmin" method="POST" use:enhance>
					<Button type="submit">Remove Admin</Button>
				</form>
			{/if}
		{/if}

		{#if data.user}
			{#if data.user.admin || data.user.userId === data.currentUser.id}
				<LinkButton href="/users/{data.currentUser.id}/password">Edit Password</LinkButton>
			{/if}
		{/if}
	</div>

	{#if data.user?.admin && data.user.userId !== data.currentUser.id}
		<form action="?/deleteUser" method="POST" use:enhance>
			<Button type="submit" style="secondary">Delete User</Button>
		</form>
	{/if}
{:else}
	<ErrorText message="User Not Found" />
{/if}

<style>
	.thisRow {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		padding: 10px;
	}

	.growGap {
		flex-grow: 1;
	}
</style>
