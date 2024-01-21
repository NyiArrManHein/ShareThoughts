// getCookie

import { Results } from "@/lib/models";
import { createResponse } from "@/lib/session";
import { isAuth } from "@/lib/utils";
import { NextRequest } from "next/server";

// {user: User, isLoggedIn: boolean, message: Results}
// Req: {}
export async function GET(request: NextRequest) {
  let message: string = Results.SUCCESS;
  const response = new Response();

  const { isLoggedIn, currentUser } = await isAuth(request, response);
  return createResponse(
    response,
    JSON.stringify({
      user: currentUser,
      isLoggedIn: isLoggedIn,
      message: message,
    }),
    { status: 200 }
  );
}
