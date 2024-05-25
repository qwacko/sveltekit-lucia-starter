<script lang="ts">
	import Button from '$lib/components/shadcn/ui/button/button.svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
</script>

<h1 class="font-semibold">Delete User?</h1>
<form method="POST" use:enhance>
	<div class="flex flex-row justify-between">
		<Button variant="destructive" type="submit">Delete User</Button>
		<Button variant="outline" href="/users/{$page.params.id}" style="secondary">Cancel</Button>
	</div>
</form>
