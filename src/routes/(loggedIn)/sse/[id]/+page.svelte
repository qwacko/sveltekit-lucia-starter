<script lang="ts">
	import { source } from 'sveltekit-sse';
	import MouseCanvas from '../../../../lib/components/MouseCanvas.svelte';

	import { nanoid } from 'nanoid';
	import { kvMouseSchema } from '$lib/kvMouseSchema';
	import { untrack } from 'svelte';

	let { data } = $props();

	const connection = source(`/sse/${data.id}/getData`);
	const mouseData = connection.select('mouse');

	const myId1 = nanoid();
	const myId2 = nanoid();

	let otherCursors1 = $state<
		{ x: number; y: number; id: string; name: string; time: number; onScreen: boolean }[]
	>([]);
	let otherCursors2 = $state<
		{ x: number; y: number; id: string; name: string; time: number; onScreen: boolean }[]
	>([]);

	$effect(() => {
		if ($mouseData.length === 0) return;
		const parsedData = kvMouseSchema.safeParse(JSON.parse($mouseData));

		if (parsedData.success) {
			const data = parsedData.data;

			if (parsedData.data.id !== myId1) {
				const targetCursor = untrack(() => otherCursors1).find((item) => item.id === data.id);
				if (targetCursor) {
					targetCursor.x = data.x;
					targetCursor.y = data.y;
					targetCursor.name = data.name;
					targetCursor.time = data.time;
					targetCursor.onScreen = data.onScreen;
				} else {
					otherCursors1.push(data);
				}
			}
			if (parsedData.data.id !== myId2) {
				const targetCursor = untrack(() => otherCursors2).find((item) => item.id === data.id);
				if (targetCursor) {
					targetCursor.x = data.x;
					targetCursor.y = data.y;
					targetCursor.name = data.name;
					targetCursor.time = data.time;
					targetCursor.onScreen = data.onScreen;
				} else {
					otherCursors2.push(data);
				}
			}
		}
	});

	const debouncems = 100;
</script>

<div class="flex-1 p-8">
	<div class="max-w-6xl mx-auto">
		<!-- Header Section -->
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
				Server-Sent Events Demo
			</h1>
			<div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
				<p class="text-gray-700 dark:text-gray-300 leading-relaxed">
					Real-time mouse cursor sharing between multiple users using Server-Sent Events. Mouse positions are sent to the server every 
					<code class="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded font-mono text-sm">{debouncems}ms</code>
					and broadcasted to all connected clients.
				</p>
				<div class="mt-3 text-sm text-blue-600 dark:text-blue-400 font-medium">
					Room: <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{data.id}</code>
				</div>
			</div>
		</div>

		<!-- Canvas Section -->
		<div class="grid lg:grid-cols-2 gap-8">
			<div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-200">
				<div class="flex items-center gap-3 mb-4">
					<div class="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
					<h3 class="font-semibold text-gray-900 dark:text-gray-100">Person 1 Canvas</h3>
				</div>
				<div class="rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
					<MouseCanvas
						{debouncems}
						otherCursors={otherCursors1}
						onnewposition={(x, y) => {
							fetch(`/sse/${data.id}/setData`, {
								method: 'post',
								body: JSON.stringify({
									x,
									y,
									name: 'Person 1',
									id: myId1,
									time: Date.now(),
									onScreen: true
								})
							});
						}}
						onmouseleave={() => {
							fetch(`/sse/${data.id}/setData`, {
								method: 'post',
								body: JSON.stringify({
									x: 0,
									y: 0,
									name: 'Person 1',
									id: myId1,
									time: Date.now(),
									onScreen: false
								})
							});
						}}
					/>
				</div>
				<p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
					Move your mouse over this canvas
				</p>
			</div>

			<div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-200">
				<div class="flex items-center gap-3 mb-4">
					<div class="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
					<h3 class="font-semibold text-gray-900 dark:text-gray-100">Person 2 Canvas</h3>
				</div>
				<div class="rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
					<MouseCanvas
						{debouncems}
						otherCursors={otherCursors2}
						onnewposition={(x, y) => {
							fetch(`/sse/${data.id}/setData`, {
								method: 'post',
								body: JSON.stringify({
									x,
									y,
									name: 'Person 2',
									id: myId2,
									time: Date.now(),
									onScreen: true
								})
							});
						}}
						onmouseleave={() => {
							fetch(`/sse/${data.id}/setData`, {
								method: 'post',
								body: JSON.stringify({
									x: 0,
									y: 0,
									name: 'Person 2',
									id: myId2,
									time: Date.now(),
									onScreen: false
								})
							});
						}}
					/>
				</div>
				<p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
					Move your mouse over this canvas
				</p>
			</div>
		</div>

		<!-- Info Section -->
		<div class="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
			<h3 class="font-semibold text-blue-900 dark:text-blue-100 mb-3">How it works:</h3>
			<ul class="space-y-2 text-sm text-blue-800 dark:text-blue-200">
				<li class="flex items-start gap-2">
					<span class="text-blue-500 mt-1">•</span>
					<span>Each canvas represents a different user's view</span>
				</li>
				<li class="flex items-start gap-2">
					<span class="text-blue-500 mt-1">•</span>
					<span>Mouse movements are sent to the server via HTTP POST requests</span>
				</li>
				<li class="flex items-start gap-2">
					<span class="text-blue-500 mt-1">•</span>
					<span>Server broadcasts the data to all connected clients via Server-Sent Events</span>
				</li>
				<li class="flex items-start gap-2">
					<span class="text-blue-500 mt-1">•</span>
					<span>Other users' cursors appear in real-time on your canvas</span>
				</li>
			</ul>
		</div>
	</div>
</div>
