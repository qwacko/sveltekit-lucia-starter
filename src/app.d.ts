/// <reference types="vite-plugin-pwa/info" />

import 'unplugin-icons/types/svelte';
// src/app.d.ts
declare global {
	namespace App {
		interface Locals {
			user: import('./lib/server/db/actions/getUser').User | undefined;
		}
	}
}

// THIS IS IMPORTANT!!!
export {};
