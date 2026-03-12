// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Session, User } from 'better-auth';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: { session: Session; user: User } | null;
			user: User | null;
		}
		interface PageData {
			user?: { id: string; name: string; email: string } | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
