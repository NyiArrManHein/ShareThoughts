import { Results } from "@/lib/models";
import { insertCommentByPostId } from "@/lib/query/comment/query";
import { getComment } from "@/lib/query/post/query";
import { createResponse } from "@/lib/session";
import { isAuth } from "@/lib/utils";
import { Comment } from "@prisma/client";
import { NextRequest } from "next/server";

/**
 * Add Comment
 * @param request
 */
export async function POST(request: NextRequest) {
  let message: string = Results.REQUIRED_LOGIN;
  let comment: Comment | undefined = undefined;
  const response = new Response();
  const { isLoggedIn, currentUser } = await isAuth(request, response);
  if (isLoggedIn) {
    // Receive data from the client
    const { postId, commentContent } = await request.json();
    // Query ...
    const { insertedComment, message: msg } = await insertCommentByPostId(
      postId,
      commentContent,
      currentUser?.id!
    );
    message = msg;
    comment = insertedComment;
  }

  return createResponse(
    response,
    JSON.stringify({ comment: comment, message: message }),
    {
      status: 200,
    }
  );
}

export async function GET(request: NextRequest) {
  let message: string = Results.REQUIRED_LOGIN;
  let comments: Comment[] | undefined = undefined;
  const response = new Response();
  // Receive data from the client
  const postId = request.nextUrl.searchParams.get("postId");
  // Query ...
  const { comments: cmts, message: msg } = await getComment(Number(postId));
  message = msg;
  comments = cmts;

  return createResponse(
    response,
    JSON.stringify({ comments: comments, message: message }),
    {
      status: 200,
    }
  );
}
