<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import LinkButton from '$lib/components/LinkButton.svelte';

	export let data;
</script>

<CenterCard title="User - {data.currentUser.username}">
	<slot />
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
