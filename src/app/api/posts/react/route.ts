import { NextRequest } from "next/server";
import { createResponse } from "@/lib/session";
import { isAuth } from "@/lib/utils";
import { Results } from "@/lib/models";
import { insertIntoReact } from "@/lib/query/react/query";

export async function POST(request: NextRequest) {
  let react = undefined;
  let message: string = Results.REQUIRED_LOGIN;
  const response = new Response();
  const { isLoggedIn, currentUser } = await isAuth(request, response);
  if (isLoggedIn) {
    const { postId, reactionType } = await request.json();
    const { react: _react, message: _message } = await insertIntoReact(
      currentUser?.id!,
      postId,
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
