/*
  Warnings:

  - You are about to drop the column `postId` on the `CommentLike` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommentLike" DROP CONSTRAINT "CommentLike_postId_fkey";

-- AlterTable
ALTER TABLE "CommentLike" DROP COLUMN "postId";
