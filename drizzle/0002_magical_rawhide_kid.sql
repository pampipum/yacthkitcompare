CREATE TABLE `boat_costs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`boat_id` integer NOT NULL,
	`category` text NOT NULL,
	`item` text NOT NULL,
	`cost` real NOT NULL,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`boat_id`) REFERENCES `boats`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `boats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`make` text,
	`model` text,
	`year` integer,
	`length` real,
	`image_url` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `email_verification_token`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
DROP TABLE `signin`;--> statement-breakpoint
DROP TABLE `user`;