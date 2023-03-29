<script>
	import { page } from '$app/stores';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';
</script>

{#if $page.error?.message}
	<CenterCard title="Error">
		<ErrorText message={$page.error.message} />
	</CenterCard>
{/if}
