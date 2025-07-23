<script lang="ts">
	import { nanoid } from 'nanoid';
	import { getSocket } from './socket.svelte';
	import MouseCanvas from '$lib/components/MouseCanvas.svelte';
	import { kvMouseSchema } from '$lib/kvMouseSchema';

	let { data } = $props();

	const debouncems = 100;
	const myId1 = nanoid();
	const myId2 = nanoid();

	type CursorInformation = {
		x: number;
		y: number;
		id: string;
		name: string;
		time: number;
		onScreen: boolean;
	};

	let otherCursors1 = $state<CursorInformation[]>([]);
	let otherCursors2 = $state<CursorInformation[]>([]);

	const {
		socket: targetSocket,
		socketState,
		roomName
	} = getSocket((newData) => {
		const parsedData = kvMouseSchema.safeParse(newData);
		if (parsedData.error) {
			return;
		}
		updateCursors({ cursors: otherCursors1, thisId: myId1, newData: parsedData.data });
		updateCursors({ cursors: otherCursors2, thisId: myId2, newData: parsedData.data });
	});

	$effect(() => {
		if (roomName.name !== data.id) {
			roomName.name = data.id;
		}
	});

	const updateCursors = ({
		cursors,
		thisId,
		newData
	}: {
		cursors: CursorInformation[];
		thisId: string;
		newData: any;
	}) => {
		const parsedData = kvMouseSchema.safeParse(newData);
		if (parsedData.error) return;

		if (parsedData.data.id !== thisId) {
			const targetCursor = cursors.findIndex((item) => item.id === parsedData.data.id);
			if (targetCursor == -1) {
				cursors.push({ ...parsedData.data });
			} else {
				cursors[targetCursor] = { ...parsedData.data };
			}
		}
	};
</script>

<div class="flex-1 p-8">
	<div class="max-w-6xl mx-auto">
		<!-- Header Section -->
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
				WebSocket Demo
			</h1>
			<div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg mb-6">
				<p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
					Real-time mouse cursor sharing using WebSockets. Unlike Server-Sent Events, WebSockets provide bidirectional communication for instant updates.
				</p>
				
				<!-- Room Navigation -->
				<div class="flex flex-wrap justify-center gap-3 mb-4">
					<a class="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/40 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-lg font-medium transition-colors" href="/ws/room1">Room 1</a>
					<a class="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/40 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-lg font-medium transition-colors" href="/ws/room2">Room 2</a>
					<a class="bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 text-red-800 dark:text-red-200 px-4 py-2 rounded-lg font-medium transition-colors" href="/ws/disallowedRoom3">Disallowed Room</a>
				</div>
			</div>
			
			<!-- Connection Status -->
			<div class="grid md:grid-cols-3 gap-4 mb-8">
				<div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
					<div class="flex items-center gap-3">
						<div class:dot-green={socketState.connected} class:dot-red={!socketState.connected}></div>
						<span class="text-sm font-medium text-gray-700 dark:text-gray-300">Server Connection</span>
					</div>
				</div>
				<div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
					<div class="flex items-center gap-3">
						<div class:dot-green={socketState.userConnected} class:dot-red={!socketState.userConnected}></div>
						<span class="text-sm font-medium text-gray-700 dark:text-gray-300">User Authentication</span>
					</div>
				</div>
				<div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
					<div class="flex items-center gap-3">
						<div class:dot-green={socketState.roomConnected} class:dot-red={!socketState.roomConnected}></div>
						<span class="text-sm font-medium text-gray-700 dark:text-gray-300">Room Connection</span>
					</div>
				</div>
			</div>
			
			{#if socketState.socketError}
				<div class="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
					<div class="flex items-center gap-2">
						<svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
						</svg>
						<span class="text-red-800 dark:text-red-200 font-medium">{socketState.socketError}</span>
					</div>
				</div>
			{/if}
		</div>

		{#if targetSocket && socketState.connected && socketState.userConnected && socketState.roomConnected}
			<!-- Room Info -->
			<div class="text-center mb-8">
				<div class="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-2 rounded-lg font-medium">
					<div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
					Connected to Room: <code class="bg-green-200 dark:bg-green-800 px-2 py-1 rounded">{data.id}</code>
				</div>
			</div>

			<!-- Canvas Section -->
			<div class="grid lg:grid-cols-2 gap-8 mb-8">
				<div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-200">
					<div class="flex items-center gap-3 mb-4">
						<div class="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
						<h3 class="font-semibold text-gray-900 dark:text-gray-100">User 1 Canvas</h3>
					</div>
					<div class="rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
						<MouseCanvas
							{debouncems}
							title={'Canvas 1'}
							otherCursors={otherCursors1}
							onnewposition={(x, y) => {
								const data = {
									x,
									y,
									id: myId1,
									name: 'User 1',
									time: Date.now(),
									onScreen: true
								};
								targetSocket.emit('mouse', data);

								updateCursors({
									cursors: otherCursors2,
									thisId: myId2,
									newData: data
								});
							}}
							onmouseleave={() => {
								const data = {
									x: 0,
									y: 0,
									id: myId1,
									name: 'User 1',
									time: Date.now(),
									onScreen: false
								};
								targetSocket.emit('mouse', data);
								updateCursors({
									cursors: otherCursors2,
									thisId: myId2,
									newData: data
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
						<h3 class="font-semibold text-gray-900 dark:text-gray-100">User 2 Canvas</h3>
					</div>
					<div class="rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
						<MouseCanvas
							{debouncems}
							otherCursors={otherCursors2}
							title={'Canvas 2'}
							onnewposition={(x, y) => {
								const data = {
									x,
									y,
									id: myId2,
									name: 'User 2',
									time: Date.now(),
									onScreen: true
								};
								targetSocket.emit('mouse', data);
								updateCursors({
									cursors: otherCursors1,
									thisId: myId1,
									newData: data
								});
							}}
							onmouseleave={() => {
								const data = {
									x: 0,
									y: 0,
									id: myId2,
									name: 'User 2',
									time: Date.now(),
									onScreen: false
								};
								targetSocket.emit('mouse', data);
								updateCursors({
									cursors: otherCursors1,
									thisId: myId1,
									newData: data
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
			<div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border border-purple-200 dark:border-purple-800 p-6">
				<h3 class="font-semibold text-purple-900 dark:text-purple-100 mb-3">WebSocket Features:</h3>
				<div class="grid md:grid-cols-2 gap-4 text-sm text-purple-800 dark:text-purple-200">
					<div>
						<h4 class="font-medium mb-2">Real-time Communication:</h4>
						<ul class="space-y-1">
							<li class="flex items-start gap-2">
								<span class="text-purple-500 mt-1">•</span>
								<span>Bidirectional WebSocket connection</span>
							</li>
							<li class="flex items-start gap-2">
								<span class="text-purple-500 mt-1">•</span>
								<span>Mouse positions sent every {debouncems}ms</span>
							</li>
							<li class="flex items-start gap-2">
								<span class="text-purple-500 mt-1">•</span>
								<span>Room-based cursor isolation</span>
							</li>
						</ul>
					</div>
					<div>
						<h4 class="font-medium mb-2">Technical Details:</h4>
						<ul class="space-y-1">
							<li class="flex items-start gap-2">
								<span class="text-purple-500 mt-1">•</span>
								<span>Local cursor updates bypass WebSocket</span>
							</li>
							<li class="flex items-start gap-2">
								<span class="text-purple-500 mt-1">•</span>
								<span>User authentication required</span>
							</li>
							<li class="flex items-start gap-2">
								<span class="text-purple-500 mt-1">•</span>
								<span>Connection status monitoring</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.dot-green {
		background: linear-gradient(135deg, #10b981, #059669);
		width: 12px;
		height: 12px;
		border-radius: 50%;
		box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
		animation: pulse 2s infinite;
	}

	.dot-red {
		background: linear-gradient(135deg, #ef4444, #dc2626);
		width: 12px;
		height: 12px;
		border-radius: 50%;
		box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
	}

	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}
</style>
