<script lang="ts">
	import ErrorText from '$lib/components/ErrorText.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { superForm } from 'sveltekit-superforms';
	import * as Card from '$lib/components/shadcn/ui/card/';
	import Button from '$lib/components/shadcn/ui/button/button.svelte';
	import { urlGenerator } from '$lib/routes';

	let { data } = $props();
	const { form, errors, constraints, message, enhance } = superForm(data.form, {
		taintedMessage: null
	});
</script>

<Card.Root class="w-full max-w-sm m-4 self-center">
	<form method="POST" use:enhance>
		<Card.Header>
			<Card.Title class="text-2xl">Login</Card.Title>
			<Card.Description>Enter your email below to login to your account.</Card.Description>
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
			<ErrorText message={$message} />
		</Card.Content>

		<Card.Footer class="flex-col gap-2">
			<Button class="w-full">Sign in</Button>
			<Button
				class="w-full"
				variant="ghost"
				href={urlGenerator({ address: '/(loggedOut)/signup' }).url}>Sign Up</Button
			>
		</Card.Footer>
	</form>
</Card.Root>
