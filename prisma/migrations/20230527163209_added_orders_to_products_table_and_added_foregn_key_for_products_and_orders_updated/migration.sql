/*
  Warnings:

  - You are about to drop the column `prodcutId` on the `Orders_To_Products` table. All the data in the column will be lost.
  - Added the required column `productId` to the `Orders_To_Products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Orders_To_Products` DROP FOREIGN KEY `Orders_To_Products_prodcutId_fkey`;

-- AlterTable
ALTER TABLE `Orders_To_Products` DROP COLUMN `prodcutId`,
    ADD COLUMN `productId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Orders_To_Products` ADD CONSTRAINT `Orders_To_Products_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
