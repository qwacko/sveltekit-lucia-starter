<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
</script>

<div class="flex justify-center items-center h-screen">
	<div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
		<h1 class="text-2xl font-semibold mb-6">Profile</h1>
		<div class="bg-gray-100 rounded-lg p-4 mb-6">
			<p class="font-semibold">User id:</p>
			<p>{data.user.user.userId}</p>
			<p class="font-semibold">Username:</p>
			<p>{data.user.user.username}</p>
		</div>
		<form use:enhance method="post" action="?/logout">
			<button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
				>Sign out</button
			>
		</form>
	</div>
</div>
