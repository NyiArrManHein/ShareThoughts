-- CreateEnum
CREATE TYPE "Reactions" AS ENUM ('LIKE', 'LOVE', 'HAHA', 'SAD');

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "reaction" "Reactions" NOT NULL DEFAULT 'LIKE';
