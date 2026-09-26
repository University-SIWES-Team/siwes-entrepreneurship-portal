/*
  Warnings:

  - A unique constraint covering the columns `[applicationId,type]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('SIWES_REGISTRATION', 'VOCATIONAL_TRAINING', 'EXAMINATION');

-- DropIndex
DROP INDEX "Payment_applicationId_key";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "type" "PaymentType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_applicationId_type_key" ON "Payment"("applicationId", "type");
