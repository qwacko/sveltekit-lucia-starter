<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/shadcn/ui/button/button.svelte';

	let { data } = $props();
</script>

<div class="flex flex-row gap-4 self-center p-10">
	<div class="flex">
		{#if data.user}
			<form action="?/logout" method="post" use:enhance>
				<Button type="submit">Logout</Button>
			</form>
		{/if}
	</div>

	<div class="flex">
		<form action="?/testFunction" method="post" use:enhance>
			<Button type="submit">Test Function</Button>
		</form>
	</div>
</div>
