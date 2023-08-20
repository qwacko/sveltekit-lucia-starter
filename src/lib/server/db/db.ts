import { drizzle } from 'drizzle-orm/better-sqlite3';
import sqlite from 'better-sqlite3';
import * as schema from './schema';
import { DATABASE_URL } from '$env/static/private';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { logging } from '../logging';

export const sqliteDatabase = sqlite(DATABASE_URL);
sqliteDatabase.pragma('journal_mode = WAL');

export const db = drizzle(sqliteDatabase, { schema });

logging.info('Migrating DB!!');

migrate(db, { migrationsFolder: './src/lib/server/db/migrations' });
