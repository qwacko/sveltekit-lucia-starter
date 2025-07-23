<script lang="ts">
	let {
		value = $bindable(),
		type = 'text',
		files = $bindable(),
		class: className = '',
		...restProps
	}: {
		value?: any;
		type?: string;
		files?: FileList;
		class?: string;
		[key: string]: any;
	} = $props();

	const baseClasses =
		'flex h-11 w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-700 shadow-sm focus:shadow-md hover:border-gray-400 dark:hover:border-gray-500';
	const classes = `${baseClasses} ${className}`;
</script>

{#if type === 'file'}
	<input class={classes} type="file" bind:files bind:value {...restProps} />
{:else}
	<input class={classes} {type} bind:value {...restProps} />
{/if}
