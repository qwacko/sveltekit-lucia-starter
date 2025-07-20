import { env } from '$env/dynamic/private';
import { z } from 'zod/v4';
import { dev } from '$app/environment';

const parseEnvStringToBoolean = ({
	defaultBoolean = true,
	optional = true
}: { defaultBoolean?: boolean; optional?: boolean } = {}) => {
	const validation = z.string().transform((data) => {
		return Boolean(JSON.parse(data));
	});

	if (optional) {
		return validation.optional().default(defaultBoolean);
	}

	return validation.default(defaultBoolean);
};

const serverEnvValidation = z.object({
	DEV: z.boolean().optional().default(false),
	LOGGING: parseEnvStringToBoolean({ defaultBoolean: true, optional: true }),
	LOGGING_CLASSES: z
		.string()
		.optional()
		.default('ERROR,WARN,INFO')
		.transform((data) => data.split(',').map((d) => d.trim().toUpperCase())),
	BACKUP_DIR: z.string().optional().default('./backup'),
	BACKUP_SCHEDULE: z.string().optional().default('0 0 * * *'),
	ALLOW_SIGNUP: parseEnvStringToBoolean({ defaultBoolean: true, optional: true }),
	DEV_OVERRIDE: parseEnvStringToBoolean({ defaultBoolean: false, optional: true }),
	CSRF_CHECK_ORIGIN: parseEnvStringToBoolean({ defaultBoolean: true, optional: true }),
	DATABASE_FILE: z.string().optional().default('./db.db'),
	ENABLE_TRANSITIONS: parseEnvStringToBoolean({ defaultBoolean: false, optional: true })
});

export const serverEnv = serverEnvValidation.parse({
	DEV: dev,
	LOOGGING_CLASSES: env.DEBUG_CLASSES,
	...env
});
