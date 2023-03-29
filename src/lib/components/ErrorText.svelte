<script lang="ts">
	export let message: string | string[] | null = null;
</script>

{#if message && message.length > 0}
	<div class="box">
		<span class="text">{message}</span>
	</div>
{/if}

<style>
	.box {
		display: flex;
		align-self: stretch;
		background-color: #ffa1a1;
		justify-content: center;
		align-items: center;
		border-radius: 0.375rem;
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
		padding: 0.5rem;
	}

	.text {
		display: flex;
		color: #ef4444;
		font-size: 0.875rem;
		font-weight: 700;
	}
</style>
