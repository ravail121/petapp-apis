/*
  Warnings:

  - Added the required column `productName` to the `Orders_To_Products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Orders_To_Products` DROP FOREIGN KEY `Orders_To_Products_productId_fkey`;

-- AlterTable
ALTER TABLE `Orders_To_Products` ADD COLUMN `productName` VARCHAR(191) NOT NULL;
