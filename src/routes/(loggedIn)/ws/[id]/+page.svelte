<script lang="ts">
	import { nanoid } from 'nanoid';
	import { getSocket } from './socket.svelte';
	import MouseCanvas from '$lib/components/MouseCanvas.svelte';
	import { kvMouseSchema } from '$lib/kvMouseSchema';
	import { untrack } from 'svelte';

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
	} = getSocket(
		() => pageName,
		(newData) => {
			const parsedData = kvMouseSchema.safeParse(newData);
			if (parsedData.error) {
				return;
			}
			updateCursors({ cursors: otherCursors1, thisId: myId1, newData: parsedData.data });
			updateCursors({ cursors: otherCursors2, thisId: myId2, newData: parsedData.data });
		}
	);

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

<div class="centered">
	<div class="row-gap">
		<a href="/ws/room1">Room 1</a>
		<a href="/ws/room2">Room 2</a>
		<a href="/ws/disallowedRoom3">Disallowed Room</a>
	</div>
	<div class="row">
		<div class="row">
			<div class:dot-green={socketState.connected} class:dot-red={!socketState.connected}></div>
			Connected To Server
		</div>
		<div class="row">
			<div
				class:dot-green={socketState.userConnected}
				class:dot-red={!socketState.userConnected}
			></div>
			User Found
		</div>
		<div class="row">
			<div
				class:dot-green={socketState.roomConnected}
				class:dot-red={!socketState.roomConnected}
			></div>
			Connected To Room
		</div>
	</div>
	{#if socketState.socketError}
		<div class="error-text">{socketState.socketError}</div>
	{/if}
</div>

{#if targetSocket && socketState.connected && socketState.userConnected && socketState.roomConnected}
	<div class="centered">
		<b>Room: {data.id}</b>
	</div>

	<div class="row-gap">
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
	<!-- <div class="centered">
	id1: {myId1} id2: {myId2}
</div>

<div class="centered">
	cursors1: {JSON.stringify(otherCursors1)} cursors2: {JSON.stringify(otherCursors2)}
</div> -->
	<div class="centered">
		Demonstration of using websockets to share mouse positions between multiple users / windows.
		This is achieved by sending data about mouse position periodically (every {debouncems}ms) to the
		server, which then sends this information back to the web browser. Each "room" (which is
		selected by the last url segment in the path, currently "{data.id}") has its own set of cursors.
		Becuase values are not retransmitted back to the originating client, the update of the other
		cursor on the same page is done without using websockets.
	</div>
{/if}

<style>
	a {
		text-decoration: underline;
		color: blue;
		font-weight: bold;
		cursor: pointer;
	}

	.error-text {
		color: red;
	}

	.row {
		display: flex;
		flex-direction: row;
		gap: 5px;
		align-items: center;
	}

	.dot-green {
		background-color: green;
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.dot-red {
		background-color: red;
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.row-gap {
		display: flex;
		gap: 200px;
		flex-direction: row;
		width: 100%;
		justify-content: center;
		padding: 20px;
	}

	.centered {
		text-align: center;
		max-width: 800px;
		align-self: center;
	}
</style>
