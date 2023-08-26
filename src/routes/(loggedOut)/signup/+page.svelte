<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import LinkButton from '$lib/components/LinkButton.svelte';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import SpreadButtons from '$lib/components/SpreadButtons.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { signupSchemaType } from '$lib/schema/signupSchema.js';

	export let data;
	const { form, errors, constraints, message, enhance } = superForm<signupSchemaType>(data.form, {
		taintedMessage: null
	});
</script>

<CenterCard title="Create Account" maxWidthRem={30}>
	<form method="POST" autocomplete="off" use:enhance>
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
			<Button type="submit" style="primary">Create</Button>
			<LinkButton href="/login" style="secondary">Login</LinkButton>
		</SpreadButtons>
	</form>
</CenterCard>
