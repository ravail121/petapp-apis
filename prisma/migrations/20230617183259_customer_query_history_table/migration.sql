-- CreateTable
CREATE TABLE `Customer_Queries_History` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `queryId` INTEGER NOT NULL,
    `adminMessage` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Customer_Queries_History` ADD CONSTRAINT `Customer_Queries_History_queryId_fkey` FOREIGN KEY (`queryId`) REFERENCES `Customer_Queries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
