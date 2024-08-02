-- Your SQL goes here
CREATE TABLE `tasks` (
    `id` VARCHAR(80) NOT NULL PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL,
    `description` TEXT,
    `priority` VARCHAR(6),
    `status` VARCHAR(10),
    `position` INTEGER,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP,
    `list_id` VARCHAR(80) NOT NULL,
    FOREIGN KEY (`list_id`) REFERENCES `lists`(`id`) ON DELETE CASCADE
);