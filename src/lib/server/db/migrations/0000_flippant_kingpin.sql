CREATE TABLE `user_key` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`hashed_password` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`active_expires` blob NOT NULL,
	`idle_expires` blob NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`admin` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);