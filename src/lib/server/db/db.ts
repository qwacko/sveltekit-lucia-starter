import { drizzle } from 'drizzle-orm/better-sqlite3';
import sqlite from 'better-sqlite3';
import * as schema from './schema';
import { DATABASE_URL } from '$env/static/private';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { logging } from '../logging';
import { serverEnv } from '../serverEnv';
import fs from 'fs/promises';

export const sqliteDatabase = sqlite(DATABASE_URL);

sqliteDatabase.pragma('journal_mode = WAL');

export const db = drizzle(sqliteDatabase, { schema });

logging.info('Migrating DB!!');

migrate(db, { migrationsFolder: './src/lib/server/db/migrations' });

export const backupDB = async (title = 'backup') => {
	const date = new Date();
	try {
		await sqliteDatabase.backup(`${serverEnv.BACKUP_DIR}/${date.toISOString()}-${title}.sqlite3`);
		return;
	} catch {
		logging.error('Backup Failed');
		return;
	}
};

export const restoreDB = async (backupName: string) => {
	const targetDir = serverEnv.BACKUP_DIR;

	const backupFile = (await fs.readdir(targetDir, { recursive: true })).find(
		(file) => file === backupName
	);

	if (!backupFile) {
		throw new Error('Backup File Not Found');
	}

	await backupDB('Before Restore');

	// if (sqliteDatabase.open) {
	// 	sqliteDatabase.close();
	// }

	await fs.copyFile(`${targetDir}/${backupFile}`, DATABASE_URL);

	// sqliteDatabase = sqlite(DATABASE_URL);
	// console.log('DB Open', sqliteDatabase.open);
	// sqliteDatabase.pragma('journal_mode = WAL');

	// db = drizzle(sqliteDatabase, { schema });

	// migrate(db, { migrationsFolder: './src/lib/server/db/migrations' });

	const testData = db.select().from(schema.user).all();
	console.log('Test Data', testData);

	const data = sqliteDatabase.exec("SELECT * FROM sqlite_master WHERE type='table';");
	console.log('Data', data);

	return;
};

export const deleteBackup = async (backupName: string) => {
	const targetDir = serverEnv.BACKUP_DIR;

	const backupFile = (await fs.readdir(targetDir, { recursive: true })).find(
		(file) => file === backupName
	);

	if (!backupFile) {
		throw new Error('Backup File Not Found');
	}

	await fs.unlink(`${targetDir}/${backupFile}`);

	return;
};

export const getBackupList = async () => {
	const targetDir = serverEnv.BACKUP_DIR;

	return (await fs.readdir(targetDir, { recursive: true })).sort((a, b) => b.localeCompare(a));
};
