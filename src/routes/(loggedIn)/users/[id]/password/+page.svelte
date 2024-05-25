<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import TextInput from '$lib/components/TextInput.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';

	import Button from '$lib/components/shadcn/ui/button/button.svelte';

	import { page } from '$app/stores';

	let { data } = $props();

	const { form, errors, constraints, message, enhance, allErrors } = superForm(data.form, {
		taintedMessage: null
	});
</script>

<h1 class="font-semibold">Change Password</h1>
<form method="POST" use:enhance>
	<TextInput
		title="Password"
		errorMessage={$errors.password}
		type="password"
		id="password"
		name="password"
		data-invalid={$errors.password}
		bind:value={$form.password}
		{...$constraints.password}
	/>
	<TextInput
		title="Confirm Password"
		errorMessage={$errors.confirmPassword}
		type="password"
		id="confirmPassword"
		name="confirmPassword"
		data-invalid={$errors.confirmPassword}
		bind:value={$form.confirmPassword}
		{...$constraints.confirmPassword}
	/>

	<ErrorText message={$message} />
	<div class="flex flex-row gap-2">
		<Button type="submit" class="flex flex-grow">Update</Button>
		<Button variant="link" href="/users/{$page.params.id}" class="flex flex-grow">Cancel</Button>
	</div>
</form>
