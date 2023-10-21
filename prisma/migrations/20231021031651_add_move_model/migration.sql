-- AlterTable
ALTER TABLE "Move" ADD COLUMN     "creatorId" TEXT;

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
