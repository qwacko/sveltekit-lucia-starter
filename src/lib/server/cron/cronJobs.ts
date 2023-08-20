import type { CronJob } from './cron';

export const cronJobs: CronJob[] = [
	{
		name: 'test',
		schedule: '*/1 * * * *',
		job: () => {
			const currentTime = new Date();
			console.log('Test Cron Job', currentTime);
		}
	}
];
