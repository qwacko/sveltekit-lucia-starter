<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';

	export let data;
</script>

<CenterCard title="User">
	{#if data.currentUser}
		{data.currentUser.username}
	{:else}
		<ErrorText message="User Not Found" />
	{/if}
</CenterCard>
