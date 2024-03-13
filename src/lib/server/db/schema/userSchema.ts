import { sqliteTable, text, blob, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').notNull().primaryKey(),
	username: text('username').notNull().unique(),
	admin: integer('admin', { mode: 'boolean' }).notNull().default(false),
	hashedPassword: text('hashed_password').notNull()
});

export const session = sqliteTable('user_session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at').notNull()
});
