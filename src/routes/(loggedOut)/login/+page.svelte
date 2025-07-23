<script lang="ts">
	import ErrorText from '$lib/components/ErrorText.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { superForm } from 'sveltekit-superforms';
	import Card from '$lib/components/Card.svelte';
	import CardHeader from '$lib/components/CardHeader.svelte';
	import CardTitle from '$lib/components/CardTitle.svelte';
	import CardDescription from '$lib/components/CardDescription.svelte';
	import CardContent from '$lib/components/CardContent.svelte';
	import CardFooter from '$lib/components/CardFooter.svelte';
	import Button from '$lib/components/Button.svelte';
	import { urlGenerator } from '$lib/routes';

	let { data } = $props();
	const { form, errors, constraints, message, enhance } = superForm(data.form, {
		taintedMessage: null
	});
</script>

<div class="flex-1 flex items-center justify-center min-h-screen p-4">
<Card class="w-full max-w-sm">
	<form method="POST" use:enhance>
		<CardHeader>
			<CardTitle class="text-2xl">Login</CardTitle>
			<CardDescription>Enter your email below to login to your account.</CardDescription>
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
			<ErrorText message={$message} />
		</CardContent>

		<CardFooter class="flex-col gap-2">
			<Button class="w-full" type="submit">Sign in</Button>
			<Button
				class="w-full"
				variant="ghost"
				href={urlGenerator({ address: '/(loggedOut)/signup' }).url}>Sign Up</Button
			>
		</CardFooter>
	</form>
</Card>
</div>
