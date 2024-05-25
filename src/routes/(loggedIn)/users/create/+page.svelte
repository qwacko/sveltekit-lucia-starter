<script lang="ts">
	import { goto } from '$app/navigation';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { superForm } from 'sveltekit-superforms';
	import * as Card from '$lib/components/shadcn/ui/card/';
	import Button from '$lib/components/shadcn/ui/button/button.svelte';

	let { data } = $props();

	const { form, errors, constraints, message, enhance } = superForm(data.form, {
		taintedMessage: null,
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				await goto('/users');
			}
		}
	});
</script>

<Card.Root class="w-full max-w-sm m-4 self-center">
	<form method="POST" autocomplete="off" use:enhance>
		<Card.Header>
			<Card.Title class="text-2xl">Create User</Card.Title>
		</Card.Header>
		<Card.Content class="grid gap-4">
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
		</Card.Content>

		<Card.Footer class="flex-col gap-2">
			<Button type="submit" class="w-full">Create</Button>
			<Button variant="link" href="/users" class="w-full">Cancel</Button>
		</Card.Footer>
	</form>
</Card.Root>
