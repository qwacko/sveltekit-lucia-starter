<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import LinkButton from '$lib/components/LinkButton.svelte';

	let { data, children } = $props();
</script>

<CenterCard title="User - {data.currentUser.username}">
	{@render children()}
</CenterCard>
<div class="buttonSize">
	<LinkButton href="/users">Users List</LinkButton>
</div>

<style>
	.buttonSize {
		width: 100%;
		display: flex;
		justify-content: center;
	}
</style>
