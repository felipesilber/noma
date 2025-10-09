/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `List` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "FavoritePlace" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "placeId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoritePlace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FavoritePlace_userId_idx" ON "FavoritePlace"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoritePlace_userId_placeId_key" ON "FavoritePlace"("userId", "placeId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoritePlace_userId_order_key" ON "FavoritePlace"("userId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "List_userId_name_key" ON "List"("userId", "name");

-- AddForeignKey
ALTER TABLE "FavoritePlace" ADD CONSTRAINT "FavoritePlace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritePlace" ADD CONSTRAINT "FavoritePlace_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
