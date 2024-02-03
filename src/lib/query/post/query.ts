import prisma from "@/db";
import { PostType } from "@/lib/models";

export async function getPostForNewsFeed() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      likes: true,
      comments: true,
      shares: true,
    },
  });

  return posts;
}

export async function insertPostByUsername(
  authorId: number,
  postType: PostType,
  title: string,
  content: string
) {
  const insertedPost = await prisma.post.create({
    data: {
      title: title,
      content: content,
      authorId: authorId,
    },
    include: {
      author: true,
      likes: true,
      comments: true,
      shares: true,
    },
  });
  return insertedPost;
}
