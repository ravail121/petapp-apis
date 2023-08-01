-- AlterTable
ALTER TABLE `Customer_Queries` MODIFY `readStatus` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `replyStatus` BOOLEAN NOT NULL DEFAULT false;
