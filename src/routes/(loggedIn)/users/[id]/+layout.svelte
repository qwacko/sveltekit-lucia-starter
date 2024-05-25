<script lang="ts">
	import * as Card from '$lib/components/shadcn/ui/card/';
	import Button from '$lib/components/shadcn/ui/button/button.svelte';
	import { urlGenerator } from '$lib/routes';

	let { data, children } = $props();
</script>

<Card.Root class="w-full max-w-lg m-4 self-center">
	<Card.Header>
		<Card.Title class="text-2xl">Update User - {data.user?.username}</Card.Title>
	</Card.Header>
	<Card.Content class="grid gap-4">
		{@render children()}
	</Card.Content>
	<Card.Footer class="flex-col gap-2">
		<Button variant="link" href={urlGenerator({ address: '/(loggedIn)/users' }).url}
			>Users List</Button
		>
	</Card.Footer>
</Card.Root>
