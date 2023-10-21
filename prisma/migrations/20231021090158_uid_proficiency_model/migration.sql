/*
  Warnings:

  - You are about to drop the column `userId` on the `Proficiency` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Proficiency" DROP CONSTRAINT "Proficiency_userId_fkey";

-- AlterTable
ALTER TABLE "Proficiency" DROP COLUMN "userId",
ADD COLUMN     "userUid" TEXT;

-- AddForeignKey
ALTER TABLE "Proficiency" ADD CONSTRAINT "Proficiency_userUid_fkey" FOREIGN KEY ("userUid") REFERENCES "User"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
