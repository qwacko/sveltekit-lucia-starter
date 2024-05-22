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

<div class="centered">
	Demonstration of using server sent events to share mouse positions between two users. This is
	achieved by sending data about mouse position periodically (every {debouncems}ms) to the server,
	which then sends this information back to the web browser. Each "room" (which is selected by the
	last url segment in the path, currently "{data.id}") has its own set of cursors.
</div>

<div class="row-gap">
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
