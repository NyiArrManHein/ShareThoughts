import prisma from "@/db";
import { Reactions } from "@prisma/client";

export async function insertIntoReact(
  userId: number,
  postId: number,
  reactionType: Reactions
) {
  let react = undefined;
  let message = "";
  const reaction = await prisma.like.findFirst({
    where: {
      userId: userId,
      postId: postId,
    },
    include: {
      user: true,
    },
  });
  if (reaction) {
    if (reaction.reaction === reactionType) {
      react = await prisma.like.delete({
        where: { id: reaction.id },
        include: { user: true },
      });
      message = "Deleted reaction.";
    } else {
      react = await prisma.like.update({
        where: {
          id: reaction.id,
        },
        data: {
          reaction: reactionType,
        },
        include: { user: true },
      });
      message = "Updated reaction.";
    }
  } else {
    react = await prisma.like.create({
      data: {
        reaction: reactionType,
        userId: userId,
        postId,
      },
      include: { user: true },
    });
    message = "Created the reaction.";
  }
  return { react, message };
}

export async function fetchCommentReaction(userId: number, commentId: number) {
  try {
    const react = await prisma.commentLike.findFirst({
      where: {
        userId: userId,
        commentId: commentId,
      },
      include: {
        user: true,
      },
    });
    return {
      // react: react?.reaction,
      react,
      message: react ? "Reaction found" : "No reaction found",
    };
  } catch (error) {
    throw error;
  }
}

export async function insertIntoCommentReact(
  userId: number,
  commentId: number,
  reactionType: Reactions
) {
  let react = undefined;
  let message = "";
  const reaction = await prisma.commentLike.findFirst({
    where: {
      userId: userId,
      commentId: commentId,
    },
    include: {
      user: true,
    },
  });
  if (reaction) {
    if (reaction.reaction === reactionType) {
      react = await prisma.commentLike.delete({
        where: { id: reaction.id },
        include: { user: true },
      });
      message = "Deleted reaction.";
    } else {
      react = await prisma.commentLike.update({
        where: {
          id: reaction.id,
        },
        data: {
          reaction: reactionType,
        },
        include: {
          user: true,
        },
      });
      message = "Updated reaction.";
    }
  } else {
    react = await prisma.commentLike.create({
      data: {
        reaction: reactionType,
        userId: userId,
        commentId,
      },
      include: {
        user: true,
      },
    });
    message = "Created the reaction.";
  }
  return { react, message };
}
