/*
  Warnings:

  - You are about to drop the column `customer_contact` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `customer_phone` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Customer` DROP COLUMN `customer_contact`,
    ADD COLUMN `customer_phone` VARCHAR(191) NOT NULL;
