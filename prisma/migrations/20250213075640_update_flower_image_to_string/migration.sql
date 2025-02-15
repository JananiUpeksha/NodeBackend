/*
  Warnings:

  - Made the column `flower_image` on table `Flower` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Flower` MODIFY `flower_image` LONGTEXT NOT NULL;
