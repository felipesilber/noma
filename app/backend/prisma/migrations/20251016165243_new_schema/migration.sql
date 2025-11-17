/*
  Warnings:

  - You are about to drop the column `colorHex` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `emoji` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `textColorHex` on the `Category` table. All the data in the column will be lost.
  - The primary key for the `FavoritePlace` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `FavoritePlace` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `FavoritePlace` table. All the data in the column will be lost.
  - The primary key for the `Follow` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Follow` table. All the data in the column will be lost.
  - The primary key for the `ListItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ListItem` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `ListItem` table. All the data in the column will be lost.
  - You are about to drop the column `priceLevel` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the column `priceRange` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Review` table. All the data in the column will be lost.
  - The primary key for the `SavedPlace` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SavedPlace` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `PlaceOpeningHours` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `latitude` on table `Place` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `Place` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('REVIEWED', 'SAVED', 'CHECKED_IN', 'CREATED_LIST');

-- DropForeignKey
ALTER TABLE "FavoritePlace" DROP CONSTRAINT "FavoritePlace_placeId_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_followedId_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_followerId_fkey";

-- DropForeignKey
ALTER TABLE "ListItem" DROP CONSTRAINT "ListItem_placeId_fkey";

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_placeId_fkey";

-- DropForeignKey
ALTER TABLE "PlaceOpeningHours" DROP CONSTRAINT "PlaceOpeningHours_placeId_fkey";

-- DropForeignKey
ALTER TABLE "SavedPlace" DROP CONSTRAINT "SavedPlace_placeId_fkey";

-- DropForeignKey
ALTER TABLE "SavedPlace" DROP CONSTRAINT "SavedPlace_userId_fkey";

-- DropIndex
DROP INDEX "FavoritePlace_userId_idx";

-- DropIndex
DROP INDEX "FavoritePlace_userId_order_key";

-- DropIndex
DROP INDEX "FavoritePlace_userId_placeId_key";

-- DropIndex
DROP INDEX "Follow_followerId_followedId_key";

-- DropIndex
DROP INDEX "List_userId_idx";

-- DropIndex
DROP INDEX "ListItem_listId_idx";

-- DropIndex
DROP INDEX "ListItem_listId_placeId_key";

-- DropIndex
DROP INDEX "SavedPlace_userId_placeId_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "colorHex",
DROP COLUMN "emoji",
DROP COLUMN "textColorHex",
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "FavoritePlace" DROP CONSTRAINT "FavoritePlace_pkey",
DROP COLUMN "id",
DROP COLUMN "order",
ADD CONSTRAINT "FavoritePlace_pkey" PRIMARY KEY ("userId", "placeId");

-- AlterTable
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Follow_pkey" PRIMARY KEY ("followerId", "followedId");

-- AlterTable
ALTER TABLE "List" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "ListItem" DROP CONSTRAINT "ListItem_pkey",
DROP COLUMN "id",
DROP COLUMN "order",
ADD CONSTRAINT "ListItem_pkey" PRIMARY KEY ("listId", "placeId");

-- AlterTable
ALTER TABLE "Place" DROP COLUMN "priceLevel",
DROP COLUMN "priceRange",
ADD COLUMN     "priceInfo" TEXT,
ALTER COLUMN "latitude" SET NOT NULL,
ALTER COLUMN "longitude" SET NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "price",
ADD COLUMN     "numberOfPeople" INTEGER,
ADD COLUMN     "pricePaid" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "SavedPlace" DROP CONSTRAINT "SavedPlace_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "SavedPlace_pkey" PRIMARY KEY ("userId", "placeId");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "level",
ADD COLUMN     "nomaCurrentXp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nomaLevel" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "nomaNextLevelXp" INTEGER NOT NULL DEFAULT 100,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "username" SET NOT NULL;

-- DropTable
DROP TABLE "PlaceOpeningHours";

-- CreateTable
CREATE TABLE "OpeningHourRule" (
    "id" SERIAL NOT NULL,
    "dayOfWeek" "Weekday" NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "placeId" INTEGER NOT NULL,

    CONSTRAINT "OpeningHourRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "type" "ActivityType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "placeId" INTEGER,
    "reviewId" INTEGER,
    "listId" INTEGER,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "placeId" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Activity_reviewId_key" ON "Activity"("reviewId");

-- AddForeignKey
ALTER TABLE "OpeningHourRule" ADD CONSTRAINT "OpeningHourRule_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPlace" ADD CONSTRAINT "SavedPlace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPlace" ADD CONSTRAINT "SavedPlace_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followedId_fkey" FOREIGN KEY ("followedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListItem" ADD CONSTRAINT "ListItem_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritePlace" ADD CONSTRAINT "FavoritePlace_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
