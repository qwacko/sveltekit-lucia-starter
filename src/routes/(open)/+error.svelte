<script>
	import { page } from '$app/stores';
</script>

{#if $page.error}
	<div class="fixed inset-0 z-50 flex items-center justify-center">
		<div class="bg-red-200 max-w-md rounded-lg p-8 text-center shadow-xl border-red-800 border-2">
			<p class="text-black font-bold text-lg mb-4">Error</p>
			<p class="text-black">{JSON.stringify($page.error)}</p>
		</div>
	</div>
{/if}
