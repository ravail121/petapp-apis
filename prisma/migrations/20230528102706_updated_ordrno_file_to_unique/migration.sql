/*
  Warnings:

  - A unique constraint covering the columns `[orderNo]` on the table `Orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Orders_orderNo_key` ON `Orders`(`orderNo`);
