/*
  Warnings:

  - You are about to drop the column `tax` on the `Orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Orders` DROP COLUMN `tax`,
    ADD COLUMN `totalTax` VARCHAR(191) NOT NULL DEFAULT '0';
