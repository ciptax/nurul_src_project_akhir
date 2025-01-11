/*
  Warnings:

  - Added the required column `harga_Awal` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `harga_Awal` INTEGER NOT NULL;
