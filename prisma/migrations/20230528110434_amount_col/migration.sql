/*
  Warnings:

  - Added the required column `amount` to the `Orders_To_Products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Orders_To_Products` ADD COLUMN `amount` INTEGER NOT NULL;
