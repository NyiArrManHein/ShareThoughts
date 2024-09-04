import prisma from "@/db";
import { CommentModel } from "@/lib/models";

export async function getComment(postId: number) {
  let message: string = "Failed to fetch comments";
  const comments = await prisma.comment.findMany({
    where: { postId: postId },
    include: {
      user: true,
      commentLikes: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  console.log(comments);
  return { comments, message };
}

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
    include: {
      user: true,
      commentLikes: {
        include: {
          user: true,
        },
      },
    },
  });

  return { insertedComment, message };
}

interface UpdateCommentResponse {
  isEdited: boolean;
  updatedComment?: CommentModel;
  message: string;
}

export async function UpdateCommentById(
  commentId: number,
  userId: number,
  commentContent: string
): Promise<UpdateCommentResponse> {
  let isEdited = false;
  let message =
    "Failed to update the comment. Comment does not exist or unauthorized access.";
  let updatedComment: CommentModel | undefined = undefined;

  const comment = await prisma.comment.findFirst({
    where: { id: commentId, userId: userId },
  });
  if (comment) {
    updatedComment = (await prisma.comment.update({
      where: { id: commentId },
      data: {
        content: commentContent,
      },
      include: {
        user: true,
        commentLikes: {
          include: {
            user: true,
          },
        },

        // Add other relations you want to include
      },
    })) as unknown as CommentModel; // Type assertion
    isEdited = true;
    message = `Updated comment with id: ${comment.id} successfully.`;
  }

  return { isEdited, updatedComment, message };
}

export async function deleteCommentById(commentId: number, userId: number) {
  let isDeleted: boolean = false;
  let message: string =
    "Failed to delete the post. Post does not exist or unauthorized access.";
  const comment = await prisma.comment.findFirst({ where: { id: commentId } });
  if (comment && comment.userId === userId) {
    const deleteComment = await prisma.comment.delete({
      where: { id: commentId, userId: userId },
    });
    isDeleted = true;
    message = deleteComment
      ? `Deleted comment with id: ${comment.id} successfully.`
      : "Failed to delete the comment.";
  }
  return { isDeleted, message };
}
