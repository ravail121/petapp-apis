/*
  Warnings:

  - You are about to alter the column `amount` on the `Orders_To_Products` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `Orders_To_Products` MODIFY `amount` DOUBLE NOT NULL;
