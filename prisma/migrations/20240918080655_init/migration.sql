/*
  Warnings:

  - Added the required column `parent_Id` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `categories` ADD COLUMN `parent_Id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_parent_Id_fkey` FOREIGN KEY (`parent_Id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
