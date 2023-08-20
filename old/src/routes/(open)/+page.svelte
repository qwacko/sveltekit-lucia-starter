<script>
	import EditButton from '$lib/components/EditButton.svelte';

	export let data;
</script>

<div>Hello</div>
<EditButton />
{JSON.stringify(data)}
