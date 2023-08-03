/*
  Warnings:

  - You are about to drop the column `email` on the `Payment_Intents` table. All the data in the column will be lost.
  - You are about to drop the column `paymentIntent` on the `Payment_Intents` table. All the data in the column will be lost.
  - Added the required column `orderId` to the `Payment_Intents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderNo` to the `Payment_Intents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentId` to the `Payment_Intents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Payment_Intents` DROP COLUMN `email`,
    DROP COLUMN `paymentIntent`,
    ADD COLUMN `orderId` INTEGER NOT NULL,
    ADD COLUMN `orderNo` VARCHAR(191) NOT NULL,
    ADD COLUMN `paymentId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Payment_Intents` ADD CONSTRAINT `Payment_Intents_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Orders`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
