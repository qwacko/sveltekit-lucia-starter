import { backupDB } from '../db/db';
import { logging } from '../logging';
import { serverEnv } from '../serverEnv';
import type { CronJob } from './cron';

export const cronJobs: CronJob[] = [
	{
		name: 'test',
		schedule: '*/1 * * * *',
		job: () => {
			const currentTime = new Date();
			logging.info('Test Cron Job', currentTime);
		}
	},
	{
		name: 'Backup SQLite Database',
		schedule: serverEnv.BACKUP_SCHEDULE,
		job: async () => {
			await backupDB();
		}
	}
];
