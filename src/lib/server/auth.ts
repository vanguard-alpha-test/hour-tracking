import { betterAuth } from 'better-auth';
import Database from 'better-sqlite3';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export const auth = betterAuth({
	database: new Database(env.DATABASE_URL),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 60 * 60 * 24 * 7 // 7 days
		}
	}
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
