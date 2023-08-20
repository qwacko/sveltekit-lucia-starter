<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Profile</h1>
{#if data?.user}
	{data.user.username}
{/if}
