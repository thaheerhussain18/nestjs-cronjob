-- DropIndex
DROP INDEX `kwartheek_name_key` ON `kwartheek`;

-- AlterTable
ALTER TABLE `kwartheek` MODIFY `name` VARCHAR(191) NULL;
