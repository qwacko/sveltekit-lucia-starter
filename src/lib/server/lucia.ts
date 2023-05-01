import lucia from 'lucia-auth';
import prismaAdapter from '@lucia-auth/adapter-prisma';
import { prisma } from './db';
import { sveltekit } from 'lucia-auth/middleware';
import { serverEnv } from './serverEnv';

import { logging } from './logging';

logging.info('Server Environment:', serverEnv);

export const auth = lucia({
	adapter: prismaAdapter(prisma),
	env: serverEnv.LUCIADEV,
	middleware: sveltekit(),
	transformDatabaseUser: (userData) => {
		return {
			userId: userData.id,
			username: userData.username
		};
	},
	origin: serverEnv.ORIGINS
});

export type Auth = typeof auth;
