import schedule from 'node-schedule';
import { logging } from '../logging';
import { cronJobs } from './cronJobs';

export type CronJob = {
	name: string;
	schedule: string;
	job: () => void;
};

export const processCronJobs = (cronJobs: CronJob[]) => {
	return cronJobs.map((cronJob) => {
		return schedule.scheduleJob(cronJob.name, cronJob.schedule, cronJob.job);
	});
};

export const initateCronJobs = () => {
	//Cancels all the jobs befor starting them again
	schedule.gracefulShutdown();

	return processCronJobs(cronJobs);
};
