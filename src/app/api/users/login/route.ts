import { NextRequest } from "next/server";
import { Results } from "@/lib/models";
import { createResponse, getSession } from "@/lib/session";
import prisma from "@/db";
import { getUserByEmail, insertSessionIdByEmail } from "@/lib/query/user/query";
import { HashPassword } from "@/lib/utils";

// {user: User, message: Results}
// Request { email, password }
export async function POST(request: NextRequest) {
  const hashPassword = new HashPassword();
  let message = Results.REQUIRED_LOGOUT;
  // Create response
  const response = new Response();
  // Create session
  const session = await getSession(request, response);
  let { user: currentUser } = session;

  if (currentUser === undefined) {
    // Get login data
    const { email, password } = await request.json();
    const user = await getUserByEmail(email);
    if (user && hashPassword.decrypt(user.password) === password) {
      const { sessionId } = await insertSessionIdByEmail(user.email);
      if (sessionId) {
        session.user = {
          id: user.id,
          firstName: user.firstName!,
          lastName: user.lastName!,
          username: user.username,
          joinedAt: user.joinedAt,
          email: user.email,
          gender: user.gender,
          role: user.role,
          bod: user.bod!,
          bio: user.bio!,
          verified: user.verified,
          sessionId: sessionId,
        };
        await session.save();
        currentUser = session.user;
        message = Results.SUCCESS;
      } else {
        message = Results.FAIL;
      }
    } else {
      message = Results.FAIL;
    }
    return createResponse(
      response,
      JSON.stringify({ user: currentUser, message: message }),
      { status: 200 }
    );
  }
  return createResponse(response, JSON.stringify({ message: message }), {
    status: 403,
  });
}

getUserByEmail()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
