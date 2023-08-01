-- DropForeignKey
ALTER TABLE `Orders_To_Products` DROP FOREIGN KEY `Orders_To_Products_productId_fkey`;

-- AddForeignKey
ALTER TABLE `Orders_To_Products` ADD CONSTRAINT `Orders_To_Products_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
