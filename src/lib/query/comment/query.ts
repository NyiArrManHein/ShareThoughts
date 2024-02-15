import prisma from "@/db";

export async function insertCommentByPostId(
  postId: number,
  commentContent: string,
  userId: number
) {
  let message = "Failed to insert comment into the database.";
  const insertedComment = await prisma.comment.create({
    data: {
      content: commentContent,
      userId: userId,
      postId: postId,
    },
  });

  return { insertedComment, message };
}
