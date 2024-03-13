import { backupDB } from '../db/db';
import { logging } from '../logging';
import { auth } from '../lucia';
import { serverEnv } from '../serverEnv';
import type { CronJob } from './cron';

export const cronJobs: CronJob[] = [
	{
		name: 'Backup SQLite Database',
		schedule: serverEnv.BACKUP_SCHEDULE,
		job: async () => {
			await backupDB('Scheduled Backup');
		}
	},
	{
		name: 'Cleanup Sessions',
		schedule: '0 0 * * *',
		job: async () => {
			await auth.deleteExpiredSessions();
		}
	}
];
