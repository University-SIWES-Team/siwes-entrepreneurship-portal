-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('MANUAL', 'ONLINE');

-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'PENDING_REVIEW';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "evidenceMimeType" TEXT,
ADD COLUMN     "evidenceName" TEXT,
ADD COLUMN     "evidencePath" TEXT,
ADD COLUMN     "evidenceSize" INTEGER,
ADD COLUMN     "manualReference" TEXT,
ADD COLUMN     "method" "PaymentMethod" NOT NULL DEFAULT 'MANUAL',
ADD COLUMN     "paymentDate" TIMESTAMP(3),
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "submittedAt" TIMESTAMP(3);
