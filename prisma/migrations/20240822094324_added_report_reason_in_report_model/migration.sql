-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('HATE', 'ADULT', 'MISLEADING', 'OTHER');

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "ReportReason" "ReportReason" NOT NULL DEFAULT 'OTHER';
