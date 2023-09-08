<script lang="ts">
	import { enhance } from '$app/forms';
	import CenterCard from '$lib/components/CenterCard.svelte';

	export let data;

	let pageNo = 1;
	let perPage = 10;

	$: displayFiles = data.backupFiles.slice((pageNo - 1) * perPage, pageNo * perPage);
	$: numberPages = Math.ceil(data.backupFiles.length / perPage);
</script>

<CenterCard title="Backups">
	<div class="column-div">
		{#each displayFiles as backup}
			<div class="row-div">
				<form action="?/restore" method="post" use:enhance>
					<input type="hidden" name="backupName" value={backup} />
					<button type="submit">Restore</button>
				</form>
				<form action="?/delete" method="post" use:enhance>
					<input type="hidden" name="backupName" value={backup} />
					<button class="delete-button" type="submit">Delete</button>
				</form>
				<div class="flex-div">{backup}</div>
			</div>
		{/each}
		<div class="row-div">
			{#if pageNo > 1}
				<button
					on:click={() => {
						if (pageNo > 1) pageNo--;
					}}
				>
					Previous
				</button>
			{/if}
			<div>Page {pageNo} of {numberPages}</div>
			{#if pageNo < numberPages}
				<button
					on:click={() => {
						if (pageNo < numberPages) pageNo++;
					}}
				>
					Next
				</button>
			{/if}
			<div class="input-wrap">
				<form action="?/backup" method="post" use:enhance>
					<input type="text" name="backupName" placeholder="Backup Name" />
					<button type="submit">Create New Backup</button>
				</form>
			</div>
		</div>
	</div></CenterCard
>

<style>
	.row-div {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.2rem;
		align-items: start;
		height: 100%;
	}
	.column-div {
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: start;
		height: 100%;
		width: 100%;
	}

	.flex-div {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 100%;
	}

	.delete-button {
		background-color: #ff0000;
		padding: 0.5rem;
		border-radius: 0.375rem;
	}

	button {
		background-color: #9dc0fd;
		padding: 0.5rem;
		border-radius: 0.375rem;
	}

	input {
		padding: 0.5rem;
		border-radius: 0.375rem;
		border: 1px solid #9dc0fd;
		margin-right: 0.5rem;
	}

	.input-wrap {
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 0.8rem;
	}
</style>
