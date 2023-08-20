import type { CronJob } from './cron';

export const cronJobs: CronJob[] = [
	{
		name: 'test',
		schedule: '*/1 * * * *',
		job: () => {
			const currentTime = new Date();
			console.log('test 1..2..3..', currentTime);
		}
	}
];
