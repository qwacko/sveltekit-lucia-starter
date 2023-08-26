// src/lib/server/lucia.ts
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';

import { sqliteDatabase } from './db/db.js';
import { betterSqlite3 } from '@lucia-auth/adapter-sqlite';
import { serverEnv } from './serverEnv.js';

const luciaEnvDev = dev || serverEnv.DEV_OVERRIDE;
const luciaCSRF = !(luciaEnvDev || !serverEnv.CSRF_CHECK_ORIGIN);

// expect error
export const auth = lucia({
	adapter: betterSqlite3(sqliteDatabase, {
		key: 'user_key',
		session: 'user_session',
		user: 'user'
	}),
	env: luciaEnvDev ? 'DEV' : 'PROD',
	csrfProtection: luciaCSRF,
	middleware: sveltekit(),
	getUserAttributes: (data) => {
		return {
			username: data.username,
			admin: Boolean(data.admin)
		};
	}
});

export type Auth = typeof auth;
