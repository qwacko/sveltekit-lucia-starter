import lucia from 'lucia-auth';
import prismaAdapter from '@lucia-auth/adapter-prisma';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { prisma } from './db';
import { sveltekit } from 'lucia-auth/middleware';

const useHTTPS = env.HTTPS ? env.HTTPS === 'true' : true;

export const auth = lucia({
	adapter: prismaAdapter(prisma),
	env: dev ? 'DEV' : useHTTPS ? 'PROD' : 'DEV',
	middleware: sveltekit(),
	transformUserData: (userData) => {
		return {
			userId: userData.id,
			username: userData.username
		};
	}
});

export type Auth = typeof auth;
