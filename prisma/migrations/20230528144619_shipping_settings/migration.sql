-- CreateTable
CREATE TABLE `Shipping_Settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tax` INTEGER NOT NULL,
    `shippingFee` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
