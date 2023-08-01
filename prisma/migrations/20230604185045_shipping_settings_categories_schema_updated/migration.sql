/*
  Warnings:

  - You are about to alter the column `tax` on the `Shipping_Settings` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `Shipping_Settings` MODIFY `tax` DOUBLE NOT NULL;
