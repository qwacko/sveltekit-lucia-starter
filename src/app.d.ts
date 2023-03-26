// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
		interface Locals {
			validate: import('@lucia-auth/sveltekit').Validate;
			validateUser: import('@lucia-auth/sveltekit').ValidateUser;
			setSession: import('@lucia-auth/sveltekit').SetSession;
		}
	}
}

/// <reference types="lucia-auth" />
declare namespace Lucia {
	type Auth = import('$lib/server/lucia').Auth;
	type UserAttributes = {
		username: string;
	};
}

export {};
