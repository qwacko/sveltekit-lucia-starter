/// <reference types="vite-plugin-pwa/info" />

import 'unplugin-icons/types/svelte';
// src/app.d.ts
/// <reference types="lucia" />
declare global {
	namespace App {
		interface Locals {
			user: import('lucia').User | undefined;
			session: import('lucia').Session | undefined;
		}
	}
}

// THIS IS IMPORTANT!!!
export {};
