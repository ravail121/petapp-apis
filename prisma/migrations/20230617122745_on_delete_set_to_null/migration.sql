-- DropIndex
DROP INDEX `Orders_To_Products_productId_fkey` ON `Orders_To_Products`;

-- AlterTable
ALTER TABLE `Orders_To_Products` MODIFY `productId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Orders_To_Products` ADD CONSTRAINT `Orders_To_Products_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
