<script lang="ts">
	let {
		class: className = '',
		variant = 'default',
		size = 'default',
		href = undefined,
		type = 'button',
		disabled = false,
		children,
		...restProps
	}: {
		class?: string;
		variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
		size?: 'default' | 'sm' | 'lg' | 'icon';
		href?: string;
		type?: string;
		disabled?: boolean;
		children?: any;
		[key: string]: any;
	} = $props();

	const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm hover:shadow-md active:scale-[0.98]';

	const variantClasses = {
		default: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl',
		destructive: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-xl',
		outline: 'border-2 border-blue-300 dark:border-blue-600 bg-transparent text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-400 dark:hover:border-blue-500',
		secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-gray-100 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 border border-gray-300 dark:border-gray-600',
		ghost: 'hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200',
		link: 'text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline hover:text-blue-700 dark:hover:text-blue-300 shadow-none hover:shadow-none'
	};

	const sizeClasses = {
		default: 'h-11 px-6 py-2.5',
		sm: 'h-9 rounded-lg px-4 text-xs',
		lg: 'h-12 rounded-lg px-8 text-base',
		icon: 'h-11 w-11 rounded-lg'
	};

	const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
</script>

{#if href}
	<!-- svelte-ignore a11y_missing_attribute -->
	<a
		class={classes}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? 'link' : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		class={classes}
		type={type === 'button' || type === 'submit' || type === 'reset' ? type : 'button'}
		disabled={disabled}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}