/*
  Warnings:

  - You are about to drop the `Hashtag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostHashtag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PostHashtag" DROP CONSTRAINT "PostHashtag_hashtagId_fkey";

-- DropForeignKey
ALTER TABLE "PostHashtag" DROP CONSTRAINT "PostHashtag_postId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "hashtags" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "Hashtag";

-- DropTable
DROP TABLE "PostHashtag";
