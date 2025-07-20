import { auth } from '../lucia';
import type { CronJob } from './cron';

export const cronJobs: CronJob[] = [
	{
		name: 'Cleanup Sessions',
		schedule: '0 0 * * *',
		job: async () => {
			await auth.deleteExpiredSessions();
		}
	}
];
