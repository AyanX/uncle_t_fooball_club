CREATE TABLE `news_category` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` varchar(255) NOT NULL,
	`image` varchar(255) NOT NULL,
	`is_deleted` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`modified_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `news_category_id` PRIMARY KEY(`id`)
);
