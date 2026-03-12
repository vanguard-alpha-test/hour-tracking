// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { User } from '$lib/server/auth';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: {
				user: User;
				session: {
					id: string;
					userId: string;
					expiresAt: Date;
					token: string;
				};
			} | null;
		}
		interface PageData {
			session?: App.Locals['session'];
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
