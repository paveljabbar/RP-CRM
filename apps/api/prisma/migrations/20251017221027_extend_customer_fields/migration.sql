/*
  Warnings:

  - You are about to drop the column `email` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Customer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ahvNumber]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phone",
ADD COLUMN     "advisor" TEXT,
ADD COLUMN     "ahvNumber" TEXT,
ADD COLUMN     "birthDate" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "foreignPermit" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "livingSituation" TEXT,
ADD COLUMN     "maritalStatus" TEXT,
ADD COLUMN     "mobile" TEXT,
ADD COLUMN     "mobileCode" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "noContact" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "privateEmailPart1" TEXT,
ADD COLUMN     "privateEmailPart2" TEXT,
ADD COLUMN     "recommendation" TEXT,
ADD COLUMN     "relationToRecommender" TEXT,
ADD COLUMN     "salutation" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "workEmailPart1" TEXT,
ADD COLUMN     "workEmailPart2" TEXT,
ADD COLUMN     "workPhone" TEXT,
ADD COLUMN     "workPhoneCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_ahvNumber_key" ON "Customer"("ahvNumber");
