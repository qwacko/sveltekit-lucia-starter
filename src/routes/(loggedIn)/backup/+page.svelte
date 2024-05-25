<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Card from '$lib/components/shadcn/ui/card/';
	import Button from '$lib/components/shadcn/ui/button/button.svelte';
	import Input from '$lib/components/shadcn/ui/input/input.svelte';

	let { data } = $props();

	let pageNo = $state(1);
	let perPage = $state(10);

	let displayFiles = $derived(data.backupFiles.slice((pageNo - 1) * perPage, pageNo * perPage));
	let numberPages = $derived(Math.ceil(data.backupFiles.length / perPage));
</script>

<Card.Root class="min-w-96 m-4 p-4 self-center">
	<div class="flex flex-col gap-2 items-start">
		{#each displayFiles as backup}
			<div class="flex flex-row items-center gap-2">
				<form action="?/restore" method="post" use:enhance>
					<input type="hidden" name="backupName" value={backup} />
					<Button type="submit">Restore</Button>
				</form>
				<form action="?/delete" method="post" use:enhance>
					<input type="hidden" name="backupName" value={backup} />
					<Button class="delete-button" type="submit">Delete</Button>
				</form>
				<div class="flex text-sm">{backup}</div>
			</div>
		{/each}
		<div class="flex flex-row items-center self-center">
			{#if pageNo > 1}
				<button
					onclick={() => {
						if (pageNo > 1) pageNo--;
					}}
				>
					Previous
				</button>
			{/if}
			<div>Page {pageNo} of {numberPages}</div>
			{#if pageNo < numberPages}
				<Button
					onclick={() => {
						if (pageNo < numberPages) pageNo++;
					}}
				>
					Next
				</Button>
			{/if}
		</div>
		<form action="?/backup" method="post" use:enhance class="flex w-full">
			<div class="flex flex-row gap-2 items-center w-full">
				<Input type="text" name="backupName" placeholder="Backup Name" class="flex flex-grow" />
				<Button type="submit" class="flex">Create New Backup</Button>
			</div>
		</form>
	</div>
</Card.Root>
