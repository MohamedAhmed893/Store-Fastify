-- DropForeignKey
ALTER TABLE `categories` DROP FOREIGN KEY `categories_parent_Id_fkey`;

-- AlterTable
ALTER TABLE `categories` MODIFY `parent_Id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_parent_Id_fkey` FOREIGN KEY (`parent_Id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
