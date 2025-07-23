<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import CardHeader from '$lib/components/CardHeader.svelte';
	import CardTitle from '$lib/components/CardTitle.svelte';
	import CardContent from '$lib/components/CardContent.svelte';
	import CardFooter from '$lib/components/CardFooter.svelte';
	import Button from '$lib/components/Button.svelte';
	import { urlGenerator } from '$lib/routes';

	let { data, children } = $props();
</script>

<Card class="w-full max-w-lg m-4 self-center">
	<CardHeader>
		<CardTitle class="text-2xl">Update User - {data.currentUser?.name}</CardTitle>
	</CardHeader>
	<CardContent class="grid gap-4">
		{@render children()}
	</CardContent>
	<CardFooter class="flex-col gap-2">
		<Button variant="link" href={urlGenerator({ address: '/(loggedIn)/users' }).url}
			>Users List</Button
		>
	</CardFooter>
</Card>
