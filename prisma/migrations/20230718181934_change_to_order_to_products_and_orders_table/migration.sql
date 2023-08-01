-- AlterTable
ALTER TABLE `Orders` ADD COLUMN `subTotal` VARCHAR(191) NOT NULL DEFAULT '0';

-- AlterTable
ALTER TABLE `Orders_To_Products` ADD COLUMN `productStock` VARCHAR(191) NULL;
