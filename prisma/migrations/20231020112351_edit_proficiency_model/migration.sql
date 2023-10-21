/*
  Warnings:

  - You are about to drop the column `slug` on the `List` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `List` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Proficiency" DROP CONSTRAINT "Proficiency_moveId_fkey";

-- DropForeignKey
ALTER TABLE "Proficiency" DROP CONSTRAINT "Proficiency_userId_fkey";

-- DropIndex
DROP INDEX "List_slug_key";

-- AlterTable
ALTER TABLE "List" DROP COLUMN "slug",
DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Proficiency" ALTER COLUMN "moveId" DROP NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Proficiency" ADD CONSTRAINT "Proficiency_moveId_fkey" FOREIGN KEY ("moveId") REFERENCES "Move"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proficiency" ADD CONSTRAINT "Proficiency_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
