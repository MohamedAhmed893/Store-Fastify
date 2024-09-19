/*
  Warnings:

  - You are about to drop the column `parent_Id` on the `categories` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `categories` DROP FOREIGN KEY `categories_parent_Id_fkey`;

-- AlterTable
ALTER TABLE `categories` DROP COLUMN `parent_Id`,
    ADD COLUMN `parentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
