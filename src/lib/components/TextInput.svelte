<script lang="ts">
	import ErrorText from './ErrorText.svelte';
	import Input from '$lib/components/Input.svelte';
	import Label from '$lib/components/Label.svelte';

	let {
		errorMessage,
		title,
		name,
		value = $bindable(),
		type = 'text',
		...inputProps
	}: {
		errorMessage: string | string[] | null | undefined;
		title?: string;
		name: string;
		type?: string;
		value?: any;
		[key: string]: any;
	} = $props();
</script>

<div class="grid gap-2">
	{#if title}
		<Label for={name}>{title}</Label>
	{/if}
	<Input {name} {type} bind:value {...inputProps} />
	<ErrorText message={errorMessage} />
</div>