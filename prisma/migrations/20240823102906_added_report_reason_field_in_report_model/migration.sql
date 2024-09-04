/*
  Warnings:

  - Added the required column `reportReason` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('HATE', 'ADULT', 'MISLEADING', 'OTHER');

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "reportReason" "ReportReason" NOT NULL;
