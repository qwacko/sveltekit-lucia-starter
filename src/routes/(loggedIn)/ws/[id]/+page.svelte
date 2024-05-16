<script lang="ts">
	import { nanoid } from 'nanoid';
	import { getSocket } from './socket';
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

	const targetSocket = $derived(getSocket(data.id));

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
			const targetCursor = cursors.find((item) => item.id === parsedData.data.id);
			if (targetCursor) {
				targetCursor.x = parsedData.data.x;
				targetCursor.y = parsedData.data.y;
				targetCursor.name = parsedData.data.name;
				targetCursor.time = parsedData.data.time;
				targetCursor.onScreen = parsedData.data.onScreen;
			} else {
				cursors.push(parsedData.data);
			}
		}
	};

	$effect(() => {
		targetSocket.on('mouse', (data) => {
			const parsedData = kvMouseSchema.safeParse(data);
			if (parsedData.error) return;
			updateCursors({ cursors: untrack(() => otherCursors1), thisId: myId1, newData: data });
			updateCursors({ cursors: untrack(() => otherCursors2), thisId: myId2, newData: data });
		});
	});
</script>

<div class="centered">
	<b>Room: {data.id}</b>
</div>

<div class="row-gap">
	<MouseCanvas
		{debouncems}
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
<div class="centered">
	id1: {myId1} id2: {myId2}
</div>

<div class="centered">
	Demonstration of using websockets to share mouse positions between multiple users / windows. This
	is achieved by sending data about mouse position periodically (every {debouncems}ms) to the
	server, which then sends this information back to the web browser. Each "room" (which is selected
	by the last url segment in the path, currently "{data.id}") has its own set of cursors. Becuase
	values are not retransmitted back to the originating client, the update of the other cursor on the
	same page is done without using websockets.
</div>

<style>
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
