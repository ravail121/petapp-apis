-- AlterTable
ALTER TABLE `Categories` ADD COLUMN `frontImageName` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `Shipping_Settings` ADD COLUMN `currency` VARCHAR(191) NOT NULL DEFAULT 'Dollar',
    ADD COLUMN `currencySign` VARCHAR(191) NOT NULL DEFAULT '$';

-- CreateTable
CREATE TABLE `Orders_To_ShippingDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `shippingAddress` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Orders_To_ShippingDetails` ADD CONSTRAINT `Orders_To_ShippingDetails_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
