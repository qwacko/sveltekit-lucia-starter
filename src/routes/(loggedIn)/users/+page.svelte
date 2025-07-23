<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { urlGenerator } from '$lib/routes.js';

	let { data } = $props();
</script>

<div class="flex-1 p-8">
	<div class="max-w-4xl mx-auto">
		<div class="flex justify-between items-center mb-8">
			<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Users</h1>
			<Button href={urlGenerator({ address: '/(loggedIn)/users/create' }).url}>Create User</Button>
		</div>

		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each data.users as currentUser}
				<div
					class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-200"
				>
					<div class="flex items-center justify-between mb-4">
						<div class="flex items-center gap-3">
							<div
								class="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold"
							>
								{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
							</div>
							<div>
								<h3 class="font-semibold text-gray-900 dark:text-gray-100">
									{currentUser.name || 'User'}
								</h3>
								{#if currentUser.admin}
									<span
										class="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full font-medium"
										>Admin</span
									>
								{/if}
							</div>
						</div>
					</div>

					<div class="mb-4">
						<Button
							size="sm"
							class="w-full"
							href={urlGenerator({
								address: '/(loggedIn)/users/[id]',
								paramsValue: { id: currentUser.id }
							}).url}
						>
							View Details
						</Button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
