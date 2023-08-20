import { logging } from '../logging';
import type { CronJob } from './cron';

export const cronJobs: CronJob[] = [
	{
		name: 'test',
		schedule: '*/1 * * * *',
		job: () => {
			const currentTime = new Date();
			logging.info('Test Cron Job', currentTime);
		}
	}
];
