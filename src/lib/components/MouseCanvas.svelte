<script lang="ts">
	import { untrack } from 'svelte';

	let {
		otherCursors = [],
		debouncems = 0,
		onnewposition,
		onmouseleave,
		title = 'Unknown Canvas'
	}: {
		otherCursors?: { x: number; y: number; name: string; time: number; onScreen: boolean }[];
		onnewposition?: (x: number, y: number) => Promise<void> | void;
		onmouseleave?: () => Promise<void> | void;
		debouncems?: number;
		title?: string;
	} = $props();

	let wrapper = $state<HTMLElement>();
	let canvas = $state<HTMLCanvasElement>();
	let ctx = $state<CanvasRenderingContext2D | null>();
	let isHovering = $state<boolean>(false);
	let mouseX = $state<number>(0);
	let mouseY = $state<number>(0);
	let lastUpdate = $state<number>(0);
	let currentTimeout = $state<NodeJS.Timeout>();
	let currentTime = $state<number>();

	const updateTimeout = () => {
		clearTimeout(currentTimeout);
		currentTimeout = setTimeout(() => {
			currentTime = Date.now();
			updateTimeout();
		}, 1000);
	};

	$effect(() => untrack(() => updateTimeout()));

	function updateMousePosition(event: MouseEvent): void {
		if (canvas && wrapper) {
			const rect = canvas.getBoundingClientRect();
			const wrapperRect = wrapper.getBoundingClientRect();
			mouseX = event.clientX - wrapperRect.left;
			mouseY = event.clientY - wrapperRect.top;

			const currentTime = Date.now();
			if (currentTime - lastUpdate > debouncems) {
				lastUpdate = currentTime;
				onnewposition && onnewposition(mouseX, mouseY);
			}
		}
	}

	function mouseEnter(): void {
		if (canvas) {
			isHovering = true;
			canvas.style.backgroundColor = 'white';
		}
	}

	function mouseLeave(): void {
		if (canvas) {
			isHovering = false;
			canvas.style.backgroundColor = 'lightgrey';
			onmouseleave && onmouseleave();
		}
	}

	$effect(() => {
		if (canvas) {
			ctx = canvas.getContext('2d');
		}
	});
</script>

<div bind:this={wrapper} class="canvas-wrapper">
	<canvas
		bind:this={canvas}
		onmousemove={updateMousePosition}
		onmouseenter={mouseEnter}
		onmouseleave={mouseLeave}
	></canvas>

	{#if isHovering}
		<div class="mouse-position" style="left: {mouseX + 15}px; top: {mouseY + 20}px;">
			My Cursor: ({mouseX}, {mouseY})
		</div>
	{/if}

	{#each otherCursors as cursor, i}
		{#if cursor.onScreen && currentTime && cursor.time > currentTime - 1000}
			<div class="other-cursor" style="left: {cursor.x}px; top: {cursor.y}px;">
				{cursor.name}: ({cursor.x}, {cursor.y})
			</div>
		{/if}
	{/each}
</div>

<style>
	.canvas-wrapper {
		position: relative;
		width: 400px;
		height: 300px;
		border: 1px solid black;
	}

	canvas {
		width: 100%;
		height: 100%;
		background-color: lightgrey;
	}

	.mouse-position,
	.other-cursor {
		position: absolute;
		background-color: rgba(255, 255, 255, 0.8);
		padding: 2px 5px;
		border-radius: 5px;
		pointer-events: none;
	}
</style>
