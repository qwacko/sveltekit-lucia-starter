import { env } from '$env/dynamic/private';
import { z } from 'zod';
import { dev } from '$app/environment';

const serverEnvValidation = z
	.object({
		ORIGIN: z.string().url().optional(),
		HTTPS: z.coerce.boolean(),
		DEV: z.coerce.boolean(),
		DEV_OVERRIDE: z.coerce.boolean().optional().default(false),
		CSRF_CHECK_ORIGIN: z.coerce.boolean(),
		LOGGING: z.coerce.boolean().optional(),
		LOGGING_CLASSES: z
			.string()
			.optional()
			.default('ERROR,WARN,INFO')
			.transform((data) => data.split(',').map((d) => d.trim().toUpperCase()))
	})
	.transform((data) => {
		const isDev = data.DEV || data.DEV_OVERRIDE;
		return {
			...data,
			LOGGING: data.DEV ? true : data.LOGGING,
			DEV: isDev,
			LUCIADEV: (isDev ? 'DEV' : 'PROD') as 'DEV' | 'PROD',
			ORIGINS: data.ORIGIN ? data.ORIGIN.split(',') : undefined
		};
	});

export const serverEnv = serverEnvValidation.parse({
	ORIGIN: env.ORIGIN,
	HTTPS: env.HTTPS,
	DEV: dev,
	DEV_OVERRIDE: env.DEV,
	CSRF_CHECK_ORIGIN: env.CSRF_CHECK_ORIGIN,
	DEBUG: env.DEBUG,
	DEBUG_CLASSES: env.DEBUG_CLASSES
});
