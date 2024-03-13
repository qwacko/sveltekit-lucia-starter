// src/lib/server/lucia.ts
import { Lucia, TimeSpan } from 'lucia';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { dev } from '$app/environment';

import { db } from './db/db.js';
import { serverEnv } from './serverEnv.js';
import { session, user } from './db/schema/userSchema.js';

const luciaEnvDev = dev || serverEnv.DEV_OVERRIDE;
// const luciaCSRF = !(luciaEnvDev || !serverEnv.CSRF_CHECK_ORIGIN);

const adapter = new DrizzleSQLiteAdapter(db, session, user);
export const auth = new Lucia(adapter, {
	sessionExpiresIn: new TimeSpan(30, 'd'),
	sessionCookie: {
		attributes: {
			secure: !luciaEnvDev
		}
	},
	getUserAttributes: (data) => {
		return {
			username: data.username,
			userId: data.userId,
			admin: Boolean(data.admin)
		};
	},
	getSessionAttributes: (data) => data
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof auth;
		DatabaseSessionAttributes: DatabaseSessionAttributes;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseSessionAttributes {}
interface DatabaseUserAttributes {
	userId: string;
	username: string;
	admin: boolean;
}
