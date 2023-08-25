<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import CancelButton from './CancelButton.svelte';
	export let userId: string;

	let loading = false;

	const removeUser = async () => {
		loading = true;
		//TODO : Remove This Line
		userId = userId;
		// await trpc($page).users.removeUser.mutate({ id: userId });
		invalidateAll();
		loading = false;
	};
</script>

<CancelButton on:click={removeUser} />
