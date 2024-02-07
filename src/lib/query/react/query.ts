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
  });
  if (reaction) {
    if (reaction.reaction === reactionType) {
      react = await prisma.like.delete({ where: { id: reaction.id } });
      message = "Deleted reaction.";
    } else {
      react = await prisma.like.update({
        where: {
          id: reaction.id,
        },
        data: {
          reaction: reactionType,
        },
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
    });
    message = "Created the reaction.";
  }
  return { react, message };
}
