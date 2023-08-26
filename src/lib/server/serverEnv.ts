import { env } from '$env/dynamic/private';
import { z } from 'zod';
import { dev } from '$app/environment';

const parseEnvStringToBoolean = ({
	defaultBoolean = true,
	optional = true
}: { defaultBoolean?: boolean; optional?: boolean } = {}) => {
	const validation = z.string().transform((data) => {
		return Boolean(JSON.parse(data));
	});
	const defaultString = defaultBoolean ? 'true' : 'false';

	if (optional) {
		return validation.optional().default(defaultString);
	}

	return validation.default(defaultString);
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
	ALLOW_SIGNUP: parseEnvStringToBoolean({ defaultBoolean: true, optional: true })
});

export const serverEnv = serverEnvValidation.parse({
	DEV: dev,
	LOGGING: env.LOGGING,
	LOOGGING_CLASSES: env.DEBUG_CLASSES,
	BACKUP_DIR: env.BACKUP_DIR,
	BACKUP_SCHEDULE: env.BACKUP_SCHEDULE,
	ALLOW_SIGNUP: env.ALLOW_SIGNUP
});
