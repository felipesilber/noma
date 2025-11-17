/*
  Warnings:

  - You are about to drop the column `order` on the `FavoritePlace` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FavoritePlace" DROP COLUMN "order";

-- AlterTable
ALTER TABLE "ListItem" ADD COLUMN     "order" INTEGER;
