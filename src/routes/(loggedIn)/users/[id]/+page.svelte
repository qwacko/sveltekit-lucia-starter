<script lang="ts">
	import { enhance } from '$app/forms';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import Button from '$lib/components/shadcn/ui/button/button.svelte';

	let { data } = $props();
</script>

{#if data.currentUser && data.user}
	<div class="flex flex-row gap-2 justify-between p-2 items-center">
		{data.currentUser.username}
		{#if data.currentUser.admin}
			(Admin)
		{/if}
		<div class="flex flex-grow"></div>
		{#if data.user.admin && data.user.id !== data.currentUser.id}
			{#if !data.currentUser.admin}
				<form action="?/setAdmin" method="POST" use:enhance>
					<Button variant="outline" type="submit">Set Admin</Button>
				</form>
			{:else}
				<form action="?/removeAdmin" method="POST" use:enhance>
					<Button variant="outline" type="submit">Remove Admin</Button>
				</form>
			{/if}
		{/if}

		{#if data.user}
			{#if data.user.admin || data.user.id === data.currentUser.id}
				<Button variant="outline" href="/users/{data.currentUser.id}/password">Edit Password</Button
				>
			{/if}
		{/if}
	</div>

	{#if data.user?.admin && data.user.id !== data.currentUser.id}
		<div class="flex justify-center items-center p-2">
			<Button variant="destructive" href="/users/{data.currentUser.id}/delete">Delete User</Button>
		</div>
	{/if}
{:else}
	<ErrorText message="User Not Found" />
{/if}
