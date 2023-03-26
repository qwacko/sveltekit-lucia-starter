<script lang="ts">
	import '../app.postcss';
	import { page } from '$app/stores';
	import { handleSession } from '@lucia-auth/sveltekit/client';

	handleSession(page);
</script>

<slot />
