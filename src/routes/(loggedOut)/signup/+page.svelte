<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import LinkButton from '$lib/components/LinkButton.svelte';
	import SpreadButtons from '$lib/components/SpreadButtons.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { signupSchemaType } from './signupSchema';

	export let data;
	const { form, errors, constraints, message } = superForm<signupSchemaType>(data.form);
</script>

<CenterCard title="Create Account" maxWidthRem={30}>
	<form method="POST" use:enhance>
		<TextInput
			title="Username"
			errorMessage={$errors.username}
			id="username"
			name="username"
			type="text"
			data-invalid={$errors.username}
			bind:value={$form.username}
			{...$constraints.username}
		/>
		<TextInput
			title="Password"
			errorMessage={$errors.password}
			id="password"
			name="password"
			type="password"
			data-invalid={$errors.password}
			bind:value={$form.password}
			{...$constraints.password}
		/>
		<TextInput
			title="Confirm Password"
			errorMessage={$errors.confirmPassword}
			id="checkPassword"
			name="confirmPassword"
			type="password"
			data-invalid={$errors.confirmPassword}
			bind:value={$form.confirmPassword}
			{...$constraints.confirmPassword}
		/>
		<ErrorText message={$message} />
		<SpreadButtons>
			<Button type="submit" style="primary">Sign Up</Button>
			<LinkButton style="secondary" href="/login">Login</LinkButton>
		</SpreadButtons>
	</form>
</CenterCard>
