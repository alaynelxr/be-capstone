-- CreateTable
CREATE TABLE "Alias" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "Alias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AliasToMove" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AliasToMove_AB_unique" ON "_AliasToMove"("A", "B");

-- CreateIndex
CREATE INDEX "_AliasToMove_B_index" ON "_AliasToMove"("B");

-- AddForeignKey
ALTER TABLE "_AliasToMove" ADD CONSTRAINT "_AliasToMove_A_fkey" FOREIGN KEY ("A") REFERENCES "Alias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AliasToMove" ADD CONSTRAINT "_AliasToMove_B_fkey" FOREIGN KEY ("B") REFERENCES "Move"("id") ON DELETE CASCADE ON UPDATE CASCADE;
