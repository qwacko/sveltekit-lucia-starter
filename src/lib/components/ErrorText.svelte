<script lang="ts">
	export let message: string | string[] | null = null;
</script>

{#if message && message.length > 0}
	<div class="flex self-stretch justify-center text-red-700 bg-red-200 rounded-sm">
		{message}
	</div>
{/if}
