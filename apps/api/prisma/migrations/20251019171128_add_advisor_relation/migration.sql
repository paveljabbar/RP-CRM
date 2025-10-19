/*
  Warnings:

  - You are about to drop the column `advisor` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "advisor",
ADD COLUMN     "advisorId" INTEGER;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
