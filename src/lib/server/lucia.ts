// src/lib/server/lucia.ts
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';

import { sqliteDatabase } from './db/db.js';
import { betterSqlite3 } from '@lucia-auth/adapter-sqlite';

// expect error
export const auth = lucia({
	adapter: betterSqlite3(sqliteDatabase, {
		key: 'user_key',
		session: 'user_session',
		user: 'user'
	}),
	env: dev ? 'DEV' : 'PROD',
	csrfProtection: !dev,
	middleware: sveltekit(),
	getUserAttributes: (data) => {
		return {
			username: data.username,
			admin: data.admin
		};
	}
});

export type Auth = typeof auth;
