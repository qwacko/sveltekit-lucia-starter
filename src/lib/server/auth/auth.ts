import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../db/db';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite' // or "mysql", "sqlite"
	}),
	emailAndPassword: {
		enabled: true
	},
	plugins: [sveltekitCookies(async () => getRequestEvent())]
});
