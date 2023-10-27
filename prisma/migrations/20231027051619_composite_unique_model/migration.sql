/*
  Warnings:

  - A unique constraint covering the columns `[moveId,userUid]` on the table `Proficiency` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Proficiency_moveId_userUid_key" ON "Proficiency"("moveId", "userUid");
