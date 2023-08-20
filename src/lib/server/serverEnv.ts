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
		.transform((data) => data.split(',').map((d) => d.trim().toUpperCase()))
});

export const serverEnv = serverEnvValidation.parse({
	DEV: dev,
	LOGGING: env.DEBUG,
	LOOGGING_CLASSES: env.DEBUG_CLASSES
});
