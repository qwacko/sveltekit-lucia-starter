<script lang="ts">
	import Button from '$lib/components/shadcn/ui/button/button.svelte';
	import { urlGenerator } from '$lib/routes.js';

	let { data } = $props();
</script>

<div class="flex flex-col gap-2 items-center p-10">
	{#each data.users as currentUser}
		<div class="flex flex-row gap-2 items-center justify-between">
			<Button
				variant="outline"
				href={urlGenerator({
					address: '/(loggedIn)/users/[id]',
					paramsValue: { id: currentUser.id }
				}).url}
			>
				{currentUser.username}
			</Button>
			{#if currentUser.admin}
				(Admin)
			{/if}
		</div>
	{/each}

	<div class="flex flex-grow"></div>

	<Button variant="link" href={urlGenerator({ address: '/(loggedIn)/users/create' }).url}
		>Create User</Button
	>
</div>
