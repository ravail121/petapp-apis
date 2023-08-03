-- DropForeignKey
ALTER TABLE `Payment_Intents` DROP FOREIGN KEY `Payment_Intents_orderId_fkey`;

-- AddForeignKey
ALTER TABLE `Payment_Intents` ADD CONSTRAINT `Payment_Intents_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Orders`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
