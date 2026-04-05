CREATE TABLE `fixtures` (
	`id` int AUTO_INCREMENT NOT NULL,
	`home_team` varchar(255) NOT NULL,
	`away_team` varchar(255) NOT NULL,
	`date` date NOT NULL,
	`time` varchar(255) NOT NULL,
	`venue` varchar(255) NOT NULL,
	`competition` varchar(255) NOT NULL,
	`status` varchar(255) NOT NULL,
	`home_score` int DEFAULT 0,
	`away_score` int DEFAULT 0,
	`fans` int NOT NULL DEFAULT 0,
	`is_deleted` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`modified_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fixtures_id` PRIMARY KEY(`id`)
);
