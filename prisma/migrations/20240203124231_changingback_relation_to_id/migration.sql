/*
  Warnings:

  - You are about to drop the column `username` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `authorName` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Share` table. All the data in the column will be lost.
  - You are about to drop the `Followers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Share` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_username_fkey";

-- DropForeignKey
ALTER TABLE "Followers" DROP CONSTRAINT "Followers_followerUsername_fkey";

-- DropForeignKey
ALTER TABLE "Followers" DROP CONSTRAINT "Followers_username_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_username_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorName_fkey";

-- DropForeignKey
ALTER TABLE "Share" DROP CONSTRAINT "Share_username_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "username",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "username",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "authorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "authorName",
ADD COLUMN     "authorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Share" DROP COLUMN "username",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Followers";

-- CreateTable
CREATE TABLE "Follower" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "followerId" INTEGER NOT NULL,

    CONSTRAINT "Follower_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
