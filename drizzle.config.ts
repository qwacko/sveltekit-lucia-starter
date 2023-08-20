import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
	schema: './src/lib/server/db/schema/index.ts',
	driver: 'better-sqlite',
	out: './src/lib/server/db/migrations',
	dbCredentials: {
		url: process.env.DATABASE_URL || ''
	}
} satisfies Config;
