-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Move" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "desc" TEXT,
    "img" TEXT,
    "difficultyId" TEXT NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Move_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "List" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Difficulty" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,

    CONSTRAINT "Difficulty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToMove" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ListToMove" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "List_slug_key" ON "List"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToMove_AB_unique" ON "_CategoryToMove"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToMove_B_index" ON "_CategoryToMove"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ListToMove_AB_unique" ON "_ListToMove"("A", "B");

-- CreateIndex
CREATE INDEX "_ListToMove_B_index" ON "_ListToMove"("B");

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_difficultyId_fkey" FOREIGN KEY ("difficultyId") REFERENCES "Difficulty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToMove" ADD CONSTRAINT "_CategoryToMove_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToMove" ADD CONSTRAINT "_CategoryToMove_B_fkey" FOREIGN KEY ("B") REFERENCES "Move"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListToMove" ADD CONSTRAINT "_ListToMove_A_fkey" FOREIGN KEY ("A") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListToMove" ADD CONSTRAINT "_ListToMove_B_fkey" FOREIGN KEY ("B") REFERENCES "Move"("id") ON DELETE CASCADE ON UPDATE CASCADE;
