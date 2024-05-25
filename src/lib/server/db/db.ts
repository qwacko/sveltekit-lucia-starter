import { drizzle } from 'drizzle-orm/better-sqlite3';
import sqlite from 'better-sqlite3';
import * as schema from './schema';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { logging } from '../logging';
import { serverEnv } from '../serverEnv';
import fs from 'fs/promises';

export const sqliteDatabase = sqlite(serverEnv.DATABASE_FILE);

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

	await fs.copyFile(`${targetDir}/${backupFile}`, serverEnv.DATABASE_FILE);

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

	//CHeck if director exists before reading data from it
	try {
		await fs.access(targetDir);
	} catch {
		await fs.mkdir(targetDir);
	}

	return (await fs.readdir(targetDir, { recursive: true })).sort((a, b) => b.localeCompare(a));
};
