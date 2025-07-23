<script lang="ts">
	export let message: string | string[] | null = null;
</script>

{#if message && message.length > 0}
	<div class="flex self-stretch justify-center text-red-800 dark:text-red-200 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg px-3 py-2 text-sm font-medium">
		{message}
	</div>
{/if}
