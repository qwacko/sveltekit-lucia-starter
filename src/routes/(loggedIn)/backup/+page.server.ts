import { authGuard } from '$lib/authGuard/authGuardConfig';
import { backupDB, deleteBackup, getBackupList, restoreDB } from '$lib/server/db/db.js';

export const load = async (data) => {
	authGuard(data);
	const backupFiles = getBackupList();

	return { backupFiles };
};

export const actions = {
	backup: async ({ request }) => {
		const formData = await request.formData();
		const backupName = formData.get('backupName')?.toString();

		const backupNameValidated = backupName && backupName.length > 0 ? backupName : 'Manual Backup';

		await backupDB(backupNameValidated);
	},
	restore: async ({ request }) => {
		const formData = await request.formData();
		const backupName = formData.get('backupName')?.toString();

		if (backupName) {
			await restoreDB(backupName);
		}
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const backupName = formData.get('backupName')?.toString();

		if (backupName) {
			await deleteBackup(backupName);
		}
	}
};
