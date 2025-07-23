<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { superForm } from 'sveltekit-superforms';
	import Card from '$lib/components/Card.svelte';
	import CardHeader from '$lib/components/CardHeader.svelte';
	import CardTitle from '$lib/components/CardTitle.svelte';
	import CardDescription from '$lib/components/CardDescription.svelte';
	import CardContent from '$lib/components/CardContent.svelte';
	import CardFooter from '$lib/components/CardFooter.svelte';
	import { urlGenerator } from '$lib/routes.js';

	let { data } = $props();
	const { form, errors, constraints, message, enhance } = superForm(data.form, {
		taintedMessage: null
	});
</script>

<div class="flex-1 flex items-center justify-center min-h-screen p-4">
	<Card class="w-full max-w-sm">
		<form method="POST" autocomplete="off" use:enhance>
			<CardHeader>
				<CardTitle class="text-2xl">Create Account</CardTitle>
				<CardDescription>Enter your details below to create your account.</CardDescription>
			</CardHeader>
			<CardContent class="grid gap-4">
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
			</CardContent>

			<CardFooter class="flex-col gap-2">
				<Button class="w-full" type="submit">Create Account</Button>
				<Button
					class="w-full"
					variant="ghost"
					href={urlGenerator({ address: '/(loggedOut)/login' }).url}>Sign In</Button
				>
			</CardFooter>
		</form>
	</Card>
</div>
