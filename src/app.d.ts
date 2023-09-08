/// <reference types="vite-plugin-pwa/info" />

import 'unplugin-icons/types/svelte';
// src/app.d.ts
/// <reference types="lucia" />
declare global {
	namespace App {
		interface Locals {
			auth: import('lucia').AuthRequest;
			user: import('lucia').User | undefined;
		}
	}

	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			username: string;
			admin: boolean;
		};
		type DatabaseSessionAttributes = Record<string, never>;
	}
}

// THIS IS IMPORTANT!!!
export {};
