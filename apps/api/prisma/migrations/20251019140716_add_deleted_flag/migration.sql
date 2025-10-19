/*
  Warnings:

  - The `zip` column on the `Customer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "zip",
ADD COLUMN     "zip" INTEGER;
