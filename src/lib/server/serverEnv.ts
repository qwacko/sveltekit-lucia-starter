import { env } from '$env/dynamic/private';
import { z } from 'zod';
import { dev } from '$app/environment';

const serverEnvValidation = z.object({
	DEV: z.coerce.boolean(),
	LOGGING: z.coerce.boolean().optional(),
	LOGGING_CLASSES: z
		.string()
		.optional()
		.default('ERROR,WARN,INFO')
		.transform((data) => data.split(',').map((d) => d.trim().toUpperCase())),
	BACKUP_DIR: z.string().optional().default('./backup'),
	BACKUP_SCHEDULE: z.string().optional().default('0 0 * * *')
});

export const serverEnv = serverEnvValidation.parse({
	DEV: dev,
	LOGGING: dev || env.LOGGING,
	LOOGGING_CLASSES: env.DEBUG_CLASSES,
	BACKUP_DIR: env.BACKUP_DIR,
	BACKUP_SCHEDULE: env.BACKUP_SCHEDULE
});
