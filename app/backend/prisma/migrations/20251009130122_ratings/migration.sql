/*
  Warnings:

  - You are about to drop the column `rating` on the `Review` table. All the data in the column will be lost.
  - Added the required column `environmentRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `generalRating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceRating` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "rating",
ADD COLUMN     "environmentRating" INTEGER NOT NULL,
ADD COLUMN     "foodRating" INTEGER NOT NULL,
ADD COLUMN     "generalRating" INTEGER NOT NULL,
ADD COLUMN     "serviceRating" INTEGER NOT NULL;
