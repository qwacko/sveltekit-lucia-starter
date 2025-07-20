import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import * as schema from './schema';
import { logging } from '../logging';
import { serverEnv } from '../serverEnv';
import { createClient } from '@libsql/client';

const client = createClient({ url: serverEnv.DATABASE_FILE });
export const db = drizzle(client, { schema });

logging.info('Migrating DB!!');

migrate(db, { migrationsFolder: './src/lib/server/db/migrations' });
