CREATE TABLE `partners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`logo` varchar(255),
	`blur_image` varchar(255),
	`tier` varchar(255) NOT NULL,
	`website` varchar(255),
	`description` text NOT NULL,
	`is_deleted` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`modified_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partner_tiers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`is_deleted` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`modified_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partner_tiers_id` PRIMARY KEY(`id`)
);
