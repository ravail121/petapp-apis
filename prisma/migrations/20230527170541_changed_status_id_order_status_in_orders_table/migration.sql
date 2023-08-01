/*
  Warnings:

  - You are about to drop the column `statusId` on the `Orders` table. All the data in the column will be lost.
  - Added the required column `orderStatus` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Orders` DROP FOREIGN KEY `Orders_statusId_fkey`;

-- AlterTable
ALTER TABLE `Orders` DROP COLUMN `statusId`,
    ADD COLUMN `orderStatus` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_orderStatus_fkey` FOREIGN KEY (`orderStatus`) REFERENCES `Order_Statuses`(`value`) ON DELETE RESTRICT ON UPDATE CASCADE;
