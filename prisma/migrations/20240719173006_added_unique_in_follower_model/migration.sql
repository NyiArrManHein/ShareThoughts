/*
  Warnings:

  - A unique constraint covering the columns `[authorId,followerId]` on the table `Follower` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Follower_authorId_followerId_key" ON "Follower"("authorId", "followerId");
