<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { trpc } from '$lib/clientTRPC';
	import CancelButton from './CancelButton.svelte';
	export let userId: string;

	let loading = false;

	const removeUser = async () => {
		loading = true;
		await trpc($page).users.removeUser.mutate({ id: userId });
		invalidateAll();
		loading = false;
	};
</script>

<CancelButton on:click={removeUser} />
