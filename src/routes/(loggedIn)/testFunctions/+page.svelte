<script lang="ts">
	import { enhance } from '$app/forms';
</script>

This Is A test Page

<form use:enhance method="post">
	<button type="submit">Submit</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	button {
		margin-top: 1rem;
	}
</style>
