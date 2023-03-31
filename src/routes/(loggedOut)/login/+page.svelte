<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import LinkButton from '$lib/components/LinkButton.svelte';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import SpreadButtons from '$lib/components/SpreadButtons.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { loginSchemaType } from '$lib/schema/loginSchema';

	export let data;
	const { form, errors, constraints, message } = superForm<loginSchemaType>(data.form);
</script>

<CenterCard title="Login" maxWidthRem={30}>
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
			type="password"
			id="password"
			name="password"
			data-invalid={$errors.password}
			bind:value={$form.password}
			{...$constraints.password}
		/>
		<ErrorText message={$message} />
		<SpreadButtons>
			<Button type="submit" style="primary">Sign In</Button>
			{#if data.firstUser.allowSignup}
				<LinkButton href="/signup" style="secondary">Sign Up</LinkButton>
			{/if}
		</SpreadButtons>
	</form>
</CenterCard>
