import { serverEnv } from './serverEnv';

type logClasses = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE';
type logParams = Parameters<typeof console.log>;
export const loggingFunction = (logClass: logClasses = 'INFO', ...params: logParams) => {
	if (serverEnv.LOGGING) {
		const time = new Date().toISOString();
		console.log(`${time} - ${logClass} : `, ...params);
	}
};

export const logging = {
	error: (...params: logParams) => {
		if (serverEnv.LOGGING_CLASSES.includes('ERROR')) loggingFunction('ERROR', ...params);
	},
	warn: (...params: logParams) => {
		if (serverEnv.LOGGING_CLASSES.includes('WARN')) loggingFunction('WARN', ...params);
	},
	info: (...params: logParams) => {
		if (serverEnv.LOGGING_CLASSES.includes('INFO')) loggingFunction('INFO', ...params);
	},
	debug: (...params: logParams) => {
		if (serverEnv.LOGGING_CLASSES.includes('DEBUG')) loggingFunction('DEBUG', ...params);
	},
	trace: (...params: logParams) => {
		if (serverEnv.LOGGING_CLASSES.includes('TRACE')) loggingFunction('TRACE', ...params);
	}
};
logging.info('Server Environment:', serverEnv);
