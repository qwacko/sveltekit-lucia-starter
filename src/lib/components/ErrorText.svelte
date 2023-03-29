<script lang="ts">
	export let message: string | string[] | null = null;
</script>

{#if message && message.length > 0}
	<div class="flex self-stretch bg-red-200 place-content-center rounded-md my-2 p-2">
		<span class="flex text-red-500 text-sm font-bold">{message}</span>
	</div>
{/if}
