import { NextRequest } from "next/server";
import { Results, User } from "@/lib/models";
import { createResponse, getSession } from "@/lib/session";
import prisma from "@/db";
import { insertUser } from "@/lib/query/user/query";

export async function POST(request: NextRequest) {
  let message: string = Results.REQUIRED_LOGOUT;
  let registeredUser: User | undefined = undefined;
  let status = 403;
  // Create response
  const response = new Response();
  // Create session
  const session = await getSession(request, response);
  const { user: currentUser } = session;

  if (currentUser === undefined) {
    status = 200;
    const { firstName, lastName, username, email, password } =
      await request.json();
    const { user, msg } = await insertUser(
      firstName,
      lastName,
      email,
      username,
      password,
      request.headers.get("host")!
    );
    registeredUser = user;
    message = msg;
  }
  return createResponse(
    response,
    JSON.stringify({
      user: registeredUser,
      message: message,
    }),
    { status: status }
  );
}

insertUser()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
