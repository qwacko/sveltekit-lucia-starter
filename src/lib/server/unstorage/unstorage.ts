import { createStorage } from 'unstorage';
import memoryDriver from 'unstorage/drivers/memory';
import { z } from 'zod';
import { kvMouseSchema } from '$lib/kvMouseSchema';

const kvStore = createStorage({
	driver: memoryDriver()
});

type KVMouseSchemaType = z.infer<typeof kvMouseSchema>;

export const kvMouse = {
	update: ({
		userId,
		roomId,
		data
	}: {
		userId: string;
		roomId: string;
		data: KVMouseSchemaType;
	}) => {
		const parsedData = kvMouseSchema.safeParse(data);
		if (parsedData.success) {
			const data = kvStore.setItem(`mouse:${roomId}:${userId}`, parsedData.data);
		} else {
			console.error('Error Parsing kvMouse Value: ', parsedData.error.message);
		}
	},
	subscribe: ({
		roomId,
		action
	}: {
		roomId: string;
		action: (data: {
			key: string;
			userId: string;
			roomId: string;
			data: KVMouseSchemaType;
			event: 'update' | 'delete';
		}) => void;
	}) => {
		return kvStore.watch(async (event, key) => {
			if (key.startsWith(`mouse:${roomId}`)) {
				const [_, roomIdFound, userId] = key.split(':');
				if (event === 'remove') {
					action({
						key,
						userId,
						roomId,
						data: { id: userId, x: 0, y: 0, onScreen: false, name: '', time: Date.now() },
						event: 'delete'
					});
				} else {
					const value = await kvStore.getItem(key);
					const parsedData = kvMouseSchema.safeParse(value);
					if (parsedData.success) {
						action({ key, userId, roomId, data: parsedData.data, event: 'update' });
					}
				}
			}
		});
	}
};
