/*
  Warnings:

  - You are about to drop the column `email` on the `Trainer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Trainer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Trainer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex

DELETE FROM "TrainingAssignment";
DELETE FROM "Trainer";
DROP INDEX "Trainer_email_key";

-- AlterTable
ALTER TABLE "Trainer" DROP COLUMN "email",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Trainer_userId_key" ON "Trainer"("userId");

-- AddForeignKey
ALTER TABLE "Trainer" ADD CONSTRAINT "Trainer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
