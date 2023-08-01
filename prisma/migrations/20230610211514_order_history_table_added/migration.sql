-- CreateTable
CREATE TABLE `Order_History` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `prevStatus` VARCHAR(191) NOT NULL,
    `newStatus` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order_History` ADD CONSTRAINT `Order_History_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order_History` ADD CONSTRAINT `Order_History_prevStatus_fkey` FOREIGN KEY (`prevStatus`) REFERENCES `Order_Statuses`(`value`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order_History` ADD CONSTRAINT `Order_History_newStatus_fkey` FOREIGN KEY (`newStatus`) REFERENCES `Order_Statuses`(`value`) ON DELETE RESTRICT ON UPDATE CASCADE;
