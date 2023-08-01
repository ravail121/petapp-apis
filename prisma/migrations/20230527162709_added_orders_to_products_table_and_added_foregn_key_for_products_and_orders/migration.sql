/*
  Warnings:

  - You are about to drop the column `orderDetails` on the `Orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Orders` DROP COLUMN `orderDetails`;

-- CreateTable
CREATE TABLE `Orders_To_Products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prodcutId` INTEGER NOT NULL,
    `orderId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Orders_To_Products` ADD CONSTRAINT `Orders_To_Products_prodcutId_fkey` FOREIGN KEY (`prodcutId`) REFERENCES `Products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders_To_Products` ADD CONSTRAINT `Orders_To_Products_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
