// src/app.d.ts
/// <reference types="lucia" />
declare global {
	namespace App {
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
	}

	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		//TODO Need to remove these tests. They are just here to make sure the types are working.
		type DatabaseUserAttributes = {
			username: string;
			admin: number;
		};
		type DatabaseSessionAttributes = {};
	}
}

// THIS IS IMPORTANT!!!
export {};
