<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let { ...buttonProps }: HTMLButtonAttributes = $props();
</script>

<button {...buttonProps} class="wrapper">
	<div class="arrow">
		<div class="line line1"></div>
		<div class="line line2"></div>
	</div>
</button>

<style>
	.wrapper {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.arrow {
		width: 24px;
		height: 24px;
		border-radius: 20px;
		transition: 0.4s ease-in-out;
		background-color: rgb(255, 220, 220);
		border: 1px solid rgb(255, 220, 220);
	}

	.line {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 13px;
		height: 2px;
		border-radius: 1px;
		background: hsl(0, 100%, 74%);
	}

	.line1 {
		transform: translate(-50%, -50%) rotate(45deg);
		transform-origin: center;
	}

	.line2 {
		transform-origin: center;
		transform: translate(-50%, -50%) rotate(-45deg);
	}

	.arrow:hover {
		transform: rotate(90deg) scale(1.2);
		border: 1px solid hsl(0, 100%, 74%);
	}
</style>
