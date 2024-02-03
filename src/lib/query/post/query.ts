import prisma from "@/db";
import { Post, PostType } from "@/lib/models";

export async function getPostForNewsFeed() {
  const posts = await prisma.post.findMany();
  return posts;
}

export async function insertPostByUsername(
  authorName: string,
  postType: PostType,
  title: string,
  content: string
) {
  const insertedPost = await prisma.post.create({
    data: {
      title: title,
      content: content,
      authorName: authorName,
    },
  });
  return insertedPost;
}
