import { NextRequest } from "next/server";
import { createResponse } from "@/lib/session";
import { isAuth } from "@/lib/utils";
import { Results } from "@/lib/models";
import {
  fetchCommentReaction,
  insertIntoCommentReact,
} from "@/lib/query/react/query";

export async function GET(request: NextRequest) {
  const response = new Response();
  const { isLoggedIn, currentUser } = await isAuth(request, response);
  // Receive data from the client
  const commentId = request.nextUrl.searchParams.get("commentId");
  const { react, message } = await fetchCommentReaction(
    currentUser?.id!,
    Number(commentId)
  );
  const status = react ? 200 : 404;

  return createResponse(response, JSON.stringify({ react, message }), {
    status,
  });
}

export async function POST(request: NextRequest) {
  let react = undefined;
  let message: string = Results.REQUIRED_LOGIN;
  const response = new Response();
  const { isLoggedIn, currentUser } = await isAuth(request, response);
  if (isLoggedIn) {
    const { commentId, reactionType } = await request.json();
    const { react: _react, message: _message } = await insertIntoCommentReact(
      currentUser?.id!,
      commentId,
      reactionType
    );
    react = _react;
    message = _message;
  }
  return createResponse(
    response,
    JSON.stringify({ react: react, message: message }),
    {
      status: 200,
    }
  );
}
