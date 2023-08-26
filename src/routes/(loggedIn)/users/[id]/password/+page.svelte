<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { passwordSchemaType } from './+page.server.js';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import SpreadButtons from '$lib/components/SpreadButtons.svelte';
	import Button from '$lib/components/Button.svelte';
	import LinkButton from '$lib/components/LinkButton.svelte';
	import { page } from '$app/stores';

	export let data;

	const { form, errors, constraints, message, enhance, allErrors } = superForm<passwordSchemaType>(
		data.form,
		{
			taintedMessage: null
		}
	);
</script>

<h1>Change Password</h1>
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
	<SpreadButtons>
		<Button type="submit" style="primary">Update</Button>
		<LinkButton href="/users/{$page.params.id}" style="secondary">Cancel</LinkButton>
	</SpreadButtons>
</form>

<style>
	h1 {
		text-align: center;
		font-size: xx-large;
	}
</style>
