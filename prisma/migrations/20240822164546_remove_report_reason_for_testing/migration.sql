/*
  Warnings:

  - You are about to drop the column `ReportReason` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "ReportReason";

-- DropEnum
DROP TYPE "ReportReason";
