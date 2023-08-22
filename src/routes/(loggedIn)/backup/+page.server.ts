import { backupDB } from '$lib/server/db/db.js';

export const actions = {
	backup: async () => {
		await backupDB();
	}
};
