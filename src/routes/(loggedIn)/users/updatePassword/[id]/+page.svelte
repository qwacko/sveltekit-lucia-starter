<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import LinkButton from '$lib/components/LinkButton.svelte';
	import SpreadButtons from '$lib/components/SpreadButtons.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import type { updatePasswordSchemaType } from '$lib/schema/updatePasswordSchema';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;
	const { form, enhance, errors, constraints } = superForm<updatePasswordSchemaType>(data.form, {
		taintedMessage: null
	});
</script>

<CenterCard title="Update Password for {data.user.user.username}">
	<form use:enhance method="POST">
		<input type="hidden" name="id" bind:value={$page.params.id} />
		<TextInput
			title="Password"
			name="password"
			label="Password"
			type="password"
			bind:value={$form.password}
			errorMessage={$errors.password}
			{...$constraints.password}
		/>
		<TextInput
			title="Confirm Password"
			name="confirmPassword"
			label="Confirm Password"
			type="password"
			bind:value={$form.confirmPassword}
			errorMessage={$errors.confirmPassword}
			{...$constraints.confirmPassword}
		/>
		<SpreadButtons>
			<Button type="submit">Update Password</Button>
			<LinkButton href="/users" style="secondary">Cancel</LinkButton>
		</SpreadButtons>
	</form>
</CenterCard>
