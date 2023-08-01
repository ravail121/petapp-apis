-- AlterTable
ALTER TABLE `Orders` ADD COLUMN `emailSent` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `Customer_Queries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `from` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `readStatus` BOOLEAN NOT NULL,
    `replyStatus` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
