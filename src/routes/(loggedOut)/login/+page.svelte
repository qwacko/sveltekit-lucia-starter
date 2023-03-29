<script lang="ts">
	import { enhance } from '$app/forms';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { loginSchemaType } from './loginSchema';

	export let data;
	const { form, errors, constraints, message } = superForm<loginSchemaType>(data.form);
</script>

<div class="flex justify-center items-center h-screen">
	<div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
		<h1 class="text-2xl font-semibold mb-6">Sign in</h1>
		<form method="POST" use:enhance>
			<div class="mb-4">
				<label for="username" class="block text-gray-700 font-semibold mb-2">Username</label>
				<input
					id="username"
					name="username"
					type="text"
					data-invalid={$errors.username}
					bind:value={$form.username}
					{...$constraints.username}
					class="border border-gray-300 p-2 w-full rounded-lg"
				/>
				<ErrorText message={$errors.username} />
			</div>
			<div class="mb-4">
				<label for="password" class="block text-gray-700 font-semibold mb-2">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					data-invalid={$errors.password}
					bind:value={$form.password}
					{...$constraints.password}
					class="border border-gray-300 p-2 w-full rounded-lg"
				/>
				<ErrorText message={$errors.password} />
			</div>
			<ErrorText message={$message} />
			<div class="flex justify-between">
				<button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
					>Sign In</button
				>
				<a href="/signup" class="text-blue-500 hover:text-blue-600 font-semibold">Create account</a>
			</div>
		</form>
	</div>
</div>
