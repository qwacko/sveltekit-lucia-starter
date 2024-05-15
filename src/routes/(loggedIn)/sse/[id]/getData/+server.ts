import { kvMouse } from '$lib/server/unstorage/unstorage';
import { produce } from 'sveltekit-sse';

function delay(milliseconds: number) {
	return new Promise(function run(resolve) {
		setTimeout(resolve, milliseconds);
	});
}

export function POST({ params }) {
	const roomId = params.id;
	return produce(async function start({ emit, lock }) {
		const subscription = await kvMouse.subscribe({
			roomId,
			action: ({ data }) => {
				emit('mouse', JSON.stringify(data));
			}
		});

		const cancel = async () => {
			await subscription();
		};

		return cancel;
	});
}
