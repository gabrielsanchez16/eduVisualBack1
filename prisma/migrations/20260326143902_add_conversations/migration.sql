/*
  Warnings:

  - You are about to drop the column `content` on the `conversation` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `conversation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `conversation` DROP COLUMN `content`,
    DROP COLUMN `role`,
    ADD COLUMN `title` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `conversationId` INTEGER NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `Conversation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
