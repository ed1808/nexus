-- Your SQL goes here
CREATE TABLE `events` (
    `id` VARCHAR(80) NOT NULL PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL,
    `description` TEXT,
    `start_datetime` TIMESTAMP NOT NULL,
    `end_datetime` TIMESTAMP NOT NULL,
    `finished` TINYINT DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);