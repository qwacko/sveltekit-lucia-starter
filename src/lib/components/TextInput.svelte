<script lang="ts">
	import ErrorText from './ErrorText.svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Input } from '$lib/components/shadcn/ui/input/index.js';
	import { Label } from '$lib/components/shadcn/ui/label/index.js';

	let {
		errorMessage,
		title,
		name,
		value = $bindable(),
		...inputProps
	}: {
		errorMessage: string | string[] | null | undefined;
		title?: string;
		name: string;
	} & HTMLInputAttributes = $props();
</script>

<div class="grid gap-2">
	{#if title}
		<Label for={name}>{title}</Label>
	{/if}
	<Input {...inputProps} {name} bind:value={value} />
	<ErrorText message={errorMessage} />
</div>
