-- DropForeignKey
ALTER TABLE `activity` DROP FOREIGN KEY `Activity_employeeId_fkey`;

-- DropIndex
DROP INDEX `Activity_employeeId_fkey` ON `activity`;

-- AlterTable
ALTER TABLE `activity` MODIFY `employeeId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
