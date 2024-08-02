-- Your SQL goes here
-- Your SQL goes here
CREATE TABLE `notes` (
    `id` VARCHAR(80) NOT NULL PRIMARY KEY,
    `content` TEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);